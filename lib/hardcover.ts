import { gql, GraphQLClient } from "graphql-request";

export type BookData = {
  title: string;
  imageUrl: string;
  description: string;
  pageCount: string;
  isbn_13: string;
  authors: string[];
};

export const EMPTY_BOOK_DATA: BookData = {
  title: "",
  imageUrl: "",
  description: "",
  pageCount: "",
  isbn_13: "",
  authors: [],
};

const endpoint = "https://api.hardcover.app/v1/graphql";

export default async function getBookByISBN(isbn_13: string) {
  const token = process.env.HARDCOVER_BEARER_TOKEN;

  if (!token) {
    return {
      ...EMPTY_BOOK_DATA,
      isbn_13: String(isbn_13),
    };
  }

  const graphQLClient = new GraphQLClient(endpoint, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  const query = gql`
    query Book($isbn: String!) {
      editions(
        where: { isbn_13: { _eq: $isbn } }
        limit: 1
        order_by: { users_count: desc }
      ) {
        id
        title
        description
        edition_format
        pages
        release_date
        isbn_10
        isbn_13
        publisher {
          name
        }
        cached_tags
        image {
          url
        }
        contributions {
          author {
            name
          }
        }
      }
    }
  `;
  try {
    const data: any = await graphQLClient.request(query, {
      isbn: isbn_13,
    });

    // Check if we have any editions in the response
    if (!data.editions || data.editions.length === 0) {
      return {
        ...EMPTY_BOOK_DATA,
        isbn_13: String(isbn_13),
      };
    }

    const edition = data.editions[0];
    // Extract author names from contributions
    const authors = edition.contributions
      ? edition.contributions
        .filter(
          (contribution: any) =>
            contribution.author && contribution.author.name,
        )
        .map((contribution: any) => contribution.author.name as string)
      : [];

    // Create and return a BookData object
    const bookData: BookData = {
      title: String(edition.title || ""),
      imageUrl: String(edition.image?.url || ""),
      description: String(edition.description || ""),
      pageCount: edition.pages ? String(edition.pages) : "",
      isbn_13: String(edition.isbn_13 || isbn_13),
      authors: authors,
    };

    return bookData;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`Unable to fetch Hardcover data for ISBN ${isbn_13}`, error);
    }
    return {
      ...EMPTY_BOOK_DATA,
      isbn_13: String(isbn_13),
    };
  }
}
