import { gql, GraphQLClient } from "graphql-request";

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
  const data = await graphQLClient.request(query, {
    isbn: isbn_13,
  });

  return data;
}
