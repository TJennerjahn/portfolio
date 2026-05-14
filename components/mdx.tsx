import Link from 'next/link'
import NextImage from 'next/image'
import { MDXRemote } from 'next-mdx-remote/rsc'
import rehypeKatex from 'rehype-katex'
import remarkMath from 'remark-math'
import { highlight } from 'sugar-high'
import React from 'react'
import fs from 'node:fs'
import path from 'node:path'

const PUBLIC_DIR = path.join(process.cwd(), 'public')
const localImageDimensionsCache = new Map()
const responsiveImageSizes = '(min-width: 768px) 56rem, calc(100vw - 3rem)'

function Table({ data }) {
  let headers = data.headers.map((header, index) => (
    <th key={index}>{header}</th>
  ))
  let rows = data.rows.map((row, index) => (
    <tr key={index}>
      {row.map((cell, cellIndex) => (
        <td key={cellIndex}>{cell}</td>
      ))}
    </tr>
  ))

  return (
    <table>
      <thead>
        <tr>{headers}</tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  )
}

function CustomLink(props) {
  let href = props.href

  if (href.startsWith('/')) {
    return (
      <Link href={href} {...props}>
        {props.children}
      </Link>
    )
  }

  if (href.startsWith('#')) {
    return <a {...props} />
  }

  return <a target="_blank" rel="noopener noreferrer" {...props} />
}

function readJpegDimensions(buffer) {
  if (buffer[0] !== 0xff || buffer[1] !== 0xd8) {
    return undefined
  }

  let offset = 2

  while (offset < buffer.length) {
    while (buffer[offset] === 0xff) {
      offset += 1
    }

    const marker = buffer[offset]
    offset += 1

    if (marker === 0xd9 || marker === 0xda) {
      break
    }

    if (marker >= 0xd0 && marker <= 0xd7) {
      continue
    }

    if (offset + 2 > buffer.length) {
      break
    }

    const length = buffer.readUInt16BE(offset)
    if (length < 2 || offset + length > buffer.length) {
      break
    }

    const isStartOfFrame =
      (marker >= 0xc0 && marker <= 0xc3) ||
      (marker >= 0xc5 && marker <= 0xc7) ||
      (marker >= 0xc9 && marker <= 0xcb) ||
      (marker >= 0xcd && marker <= 0xcf)

    if (isStartOfFrame) {
      return {
        height: buffer.readUInt16BE(offset + 3),
        width: buffer.readUInt16BE(offset + 5),
      }
    }

    offset += length
  }

  return undefined
}

function readImageDimensions(filePath) {
  const buffer = fs.readFileSync(filePath)
  const extension = path.extname(filePath).toLowerCase()

  if (
    extension === '.png' &&
    buffer.length >= 24 &&
    buffer.subarray(0, 8).equals(
      Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    )
  ) {
    return {
      width: buffer.readUInt32BE(16),
      height: buffer.readUInt32BE(20),
    }
  }

  if (
    (extension === '.jpg' || extension === '.jpeg') &&
    buffer.length >= 4
  ) {
    return readJpegDimensions(buffer)
  }

  if (
    extension === '.gif' &&
    buffer.length >= 10 &&
    buffer.subarray(0, 3).toString('ascii') === 'GIF'
  ) {
    return {
      width: buffer.readUInt16LE(6),
      height: buffer.readUInt16LE(8),
    }
  }

  return undefined
}

function getLocalImageDimensions(src) {
  if (typeof src !== 'string' || !src.startsWith('/')) {
    return undefined
  }

  const publicPath = src.split(/[?#]/)[0]
  let decodedPath

  try {
    decodedPath = decodeURIComponent(publicPath)
  } catch {
    return undefined
  }

  const imagePath = path.join(PUBLIC_DIR, decodedPath.replace(/^\/+/, ''))
  const relativePath = path.relative(PUBLIC_DIR, imagePath)

  if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
    return undefined
  }

  if (localImageDimensionsCache.has(imagePath)) {
    return localImageDimensionsCache.get(imagePath)
  }

  let dimensions

  try {
    if (fs.existsSync(imagePath)) {
      dimensions = readImageDimensions(imagePath)
    }
  } catch {
    dimensions = undefined
  }

  localImageDimensionsCache.set(imagePath, dimensions)
  return dimensions
}

function RoundedImage(props) {
  const { alt, className, width, height, fill, sizes, src, style, ...rest } = props
  const mergedClassName = [
    'rounded-lg',
    !fill && 'max-w-full h-auto',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const parsedWidth =
    typeof width === 'string' ? Number.parseInt(width, 10) : width
  const parsedHeight =
    typeof height === 'string' ? Number.parseInt(height, 10) : height
  const hasProvidedDimensions =
    Number.isFinite(parsedWidth) &&
    parsedWidth > 0 &&
    Number.isFinite(parsedHeight) &&
    parsedHeight > 0
  const localDimensions = hasProvidedDimensions
    ? undefined
    : getLocalImageDimensions(src)
  const imageWidth = hasProvidedDimensions ? parsedWidth : localDimensions?.width
  const imageHeight = hasProvidedDimensions
    ? parsedHeight
    : localDimensions?.height
  const hasDimensions =
    Number.isFinite(imageWidth) &&
    imageWidth > 0 &&
    Number.isFinite(imageHeight) &&
    imageHeight > 0

  if (fill || hasDimensions) {
    return (
      <NextImage
        alt={alt || ''}
        className={mergedClassName}
        src={src}
        width={hasDimensions ? imageWidth : undefined}
        height={hasDimensions ? imageHeight : undefined}
        fill={fill}
        sizes={!fill ? sizes || responsiveImageSizes : sizes}
        style={!fill ? { height: 'auto', ...style } : style}
        {...rest}
      />
    )
  }

  return (
    <img
      alt={alt || ''}
      className={mergedClassName}
      src={src}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      style={style}
      {...rest}
    />
  )
}

function Code({ children, ...props }) {
  let codeHTML = highlight(children)
  return <code dangerouslySetInnerHTML={{ __html: codeHTML }} {...props} />
}

function slugify(str) {
  return str
    .toString()
    .toLowerCase()
    .trim() // Remove whitespace from both ends of a string
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w\-]+/g, '') // Remove all non-word characters except for -
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
}

function createHeading(level) {
  const Heading = ({ children }) => {
    let slug = slugify(children)
    return React.createElement(
      `h${level}`,
      { id: slug },
      [
        React.createElement('a', {
          href: `#${slug}`,
          key: `link-${slug}`,
          className: 'anchor',
        }),
      ],
      children
    )
  }

  Heading.displayName = `Heading${level}`

  return Heading
}

let components = {
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),
  Image: RoundedImage,
  img: RoundedImage,
  a: CustomLink,
  code: Code,
  Table,
}

export function CustomMDX(props) {
  const mdxOptions = props.options?.mdxOptions || {}

  return (
    <MDXRemote
      {...props}
      options={{
        ...props.options,
        mdxOptions: {
          ...mdxOptions,
          remarkPlugins: [...(mdxOptions.remarkPlugins || []), remarkMath],
          rehypePlugins: [...(mdxOptions.rehypePlugins || []), rehypeKatex],
        },
      }}
      components={{ ...components, ...(props.components || {}) }}
    />
  )
}
