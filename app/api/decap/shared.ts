export const DECAP_GITHUB_REPO =
  process.env.DECAP_GITHUB_REPO ?? "TJennerjahn/portfolio";
export const DECAP_GITHUB_BRANCH =
  process.env.DECAP_GITHUB_BRANCH ?? "main";

export const DECAP_MEDIA_FOLDER = "public/blog-images";
export const DECAP_PUBLIC_FOLDER = "/blog-images";
const DECAP_STATE_COOKIE = "decap_oauth_state";

export function isDecapAuthConfigured() {
  return Boolean(
    process.env.DECAP_GITHUB_CLIENT_ID && process.env.DECAP_GITHUB_CLIENT_SECRET,
  );
}

export function getDecapStateCookieName() {
  return DECAP_STATE_COOKIE;
}

export function getGitHubScope() {
  return process.env.DECAP_GITHUB_REPO_PRIVATE === "1"
    ? "repo,user"
    : "public_repo,user";
}

