---
title: "Using git hooks to format your code"
slug: "using-git-hooks-to-format-your-code"
type: Post
draft: true
publishedAt: "2026-06-30"
summary: ""
image: ""
aliases:
  - "Using git hooks to format your code"
---

# Using git hooks to format your code

Using pre-commit hooks to format checked in code is a common way to keep a codebase consistently styled while allowing developers to configure their local editors however they like.
Lots of projects do it that way and it seems like a straightforward solution to the problem.

At least that's what I thought before I was tasked with fixing the pre-commit script we use at work.
This writeup is a collection of insights I gained from that process. I'm publishing it because it turned out to be a more interesting problem than I initially thought, not because I am some kind of expert in this area.

## The naive way

Originally, the pre-commit hook we used looked like this:

```bash
CHG=$(git diff --name-only --diff-filter=d --cached | grep -E ".*\.(ts|js|json|json5)$" | tr [:space:] " ")

if [ "x$CHG" = "x" ]; then
   echo "no js/ts/json files to format"
   exit 0
fi

# run prettier fix on the changed files
npx prettier -w  $CHG > /dev/null
# re-add the fixed files
git add $CHG > /dev/null
```

It's relatively straightforward, but if you aren't used to writing/reading bash it can still be a bit hard to read, so here's the important bits:

1. We define a variable, by running the commands inside `$(...)` and storing its output in `CHG`.
2. `git diff --name-only --diff-filter=d --cached` lists the staged files
	- `--cached`: compares `HEAD` to the index (i.e. just the staged changes)
	- `--name-only`: gives us only the paths
	- `--diff-filter=d`: exclude deleted files
3. `grep -E ".*\.(ts|js|json|json5)$"` keeps only files with the specified endings
4. `tr [:space:] " "`: converts whitespace into spaces, turning newline-separated filenames into one space-separated string

So all we're doing here is asking git for the staged changes and parsing that in a way we can stuff into prettier for formatting later on.

After formatting we're re-adding the fixed files to git, which will then go on to commit them.


That's easy enough, but unfortunately there's a flaw here: It doesn't work for partially staged files.
Consider this example base file:

```js
  const selected={a:1}
  // filler 1
  // filler 2
  // filler 3
  const debug={b:2}
```

You edit two separate hunks:

```js
  const selected={a:1,c:3}
  // filler 1
  // filler 2
  // filler 3
  const debug={b:2,d:4}
```


Then you run `git add -p` and stage only the first hunk:

```js
  // git index:
  
  // before the hook
  const selected={a:1,c:3}
  const debug={b:2}

  // after the hook
  const selected = { a: 1, c: 3 };
  const debug = { b: 2, d: 4 };
```


You end up with changes in your commit that you didn't intend to commit yet.


## Just stash unstaged changes

One approach to solving this problem is to temporarily make your worktree look like your git index, for example by using git stash:

```bash
[...]

# stash everything that's not staged so that we can check only part of the file in
git stash --keep-index --quiet
# run prettier fix on the changed files
npx prettier -w  $CHG > /dev/null
# re-add the fixed files
git add $CHG > /dev/null
#restore the unstaged changes
git stash pop --quiet
```


`git stash --keep-index` stashes away all the unstaged changes, so if our worktree contains staged and unstaged hunks, it will stash only the unstaged hunks matching our worktree to our git index.

Running prettier and git add will now still work on all the files fully, but this is no longer a problem because we've removed any changes that aren't supposed to end up committed.

At the end we pop the stash, returning the unstaged changes back to the worktree.

Unfortunately, whether this works or not depends entirely on `git stash pop` being able to cleanly apply the changes back.

Consider this example:

```js
// start with this
const value={a:1}

// change it to this and stage it:
// your git index will contain this state
const value={a:1,c:3}

// then change it to this (unstaged)
const value={a:1,b:2}
```

The pre-commit hook will stash all unstaged changes, so your worktree becomes the staged version:

```js
const value={a:1,c:3}
```

Prettier formats it, git adds it to the index and then tries to pop the unstaged changes back on top.
Git cannot do this cleanly and complains:

```sh
Auto-merging file.js
CONFLICT (content): Merge conflict in file.js
The stash entry is kept in case you need it again.
```

Your worktree file ends up looking like this:

```js
  <<<<<<< Updated upstream
  const value = { a: 1, c: 3 };
  =======
  const value={a:1,b:2}
  >>>>>>> Stashed changes
```

The problem is that the stashed unstaged work overlaps with lines that Prettier changed and stash pop can't reconcile those changes.


## Maybe we can patch it?

Instead of using `git stash`, we could try using `git patch` instead:

```sh
  git diff --patch --output .git/unstaged.patch -- $CHG
  git restore --worktree -- $CHG
  npx prettier -w $CHG > /dev/null
  git add $CHG > /dev/null
  git apply .git/unstaged.patch
```