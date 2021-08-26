import { gql } from "@apollo/client";

export const ProductPaths = gql`
  query ProductPaths($after: String) {
    products(first: 50, channel: "default-channel", after: $after) {
      edges {
        cursor
        node {
          id
          slug
        }
      }
    }
  }
`;

export const ProductBySlug = gql`
  query ProductBySlug($slug: String!) {
    product(slug: $slug, channel: "default-channel") {
      id
      name
      description
      category {
        name
      }
      variants {
        id
        name
      }
      pricing {
        priceRange {
          start {
            gross {
              amount
            }
          }
        }
      }
      media {
        url
      }
      thumbnail {
        url
      }
      category {
        name
      }
    }
  }
`;

export const CreateCheckout = gql`
  mutation CreateCheckout {
    checkoutCreate(
      input: {
        channel: "default-channel"
        email: "customer@example.com"
        lines: []
      }
    ) {
      checkout {
        id
        token
      }
      errors {
        field
        code
      }
    }
  }
`;

export const AddProductToCheckout = gql`
  mutation AddProductToCheckout($checkoutId: UUID!, $variantId: ID!) {
    checkoutLinesAdd(
      token: $checkoutId
      lines: [{ quantity: 1, variantId: $variantId }]
    ) {
      checkout {
        lines {
          id
          quantity
        }
        totalPrice {
          gross {
            currency
            amount
          }
        }
      }
      errors {
        message
      }
    }
  }
`;

export const RemoveProductFromCheckout = gql`
  mutation RemoveProductFromCheckout($checkoutId: UUID!, $lineId: ID!) {
    checkoutLineDelete(token: $checkoutId, lineId: $lineId) {
      checkout {
        lines {
          id
          variant {
            id
          }
          quantity
        }
      }
      errors {
        field
        message
      }
    }
  }
`;

export const CheckoutByID = /* GraphQL */`
  query CheckoutByID($checkoutId: UUID!) {
    checkout(token: $checkoutId) {
      lines {
        id
        variant {
          product {
            id
            name
            thumbnail {
              url
            }
          }
          pricing {
            price {
              gross {
                amount
              }
            }
          }
          name
        }
      }
      subtotalPrice {
        net {
          amount
        }
        tax {
          amount
        }
      }
      shippingPrice {
        gross {
          amount
        }
      }
      totalPrice {
        gross {
          amount
        }
      }
    }
  }
`;

export const ProductCollection = /* GraphQL */`
  query ProductCollection($before: String, $after: String) {
    products(
      first: 8
      channel: "default-channel"
      after: $after
      before: $before
    ) {
      edges {
        cursor
        node {
          id
          slug
          name
          thumbnail {
            url
          }
          category {
            name
          }
          variants {
            id
            name
          }
          pricing {
            priceRange {
              start {
                gross {
                  amount
                }
              }
              stop {
                gross {
                  amount
                }
              }
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;
