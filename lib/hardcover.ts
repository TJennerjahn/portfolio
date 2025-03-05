import { gql, GraphQLClient } from "graphql-request";

export type BookData = {
  title: String;
  imageUrl: String;
  description: String;
  pageCount: String;
  isbn_13: String;
};

const endpoint = "https://api.hardcover.app/v1/graphql";

const graphQLClient = new GraphQLClient(endpoint, {
  headers: {
    authorization: `Bearer ${process.env.HARDCOVER_BEARER_TOKEN}`,
  },
});

export default async function getBookByISBN(isbn_13: String) {
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
        cached_image
        cached_tags
        image {
          url
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
      return null;
    }

    const edition = data.editions[0];

    // Create and return a BookData object
    const bookData: BookData = {
      title: edition.title || "",
      imageUrl: edition.image?.url || edition.cached_image || "",
      description: edition.description || "",
      pageCount: edition.pages ? String(edition.pages) : "",
      isbn_13: edition.isbn_13 || String(isbn_13),
    };

    return bookData;
  } catch (error) {
    console.error("Error fetching book data:", error);
    return null;
  }
}
