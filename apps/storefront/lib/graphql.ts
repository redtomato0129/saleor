import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { createSaleorClient } from "@saleor/sdk";
import { createFetch } from "@saleor/sdk";
import { typePolicies } from "./typePolicies";
import { API_URI, DEFAULT_CHANNEL } from "./const";

const httpLink = createHttpLink({
  uri: API_URI,
  fetch: createFetch(),
});

const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache({ typePolicies }),
  ssrMode: !process.browser,
});

export const saleorClient = createSaleorClient({
  apiUrl: API_URI,
  channel: DEFAULT_CHANNEL,
});

export default apolloClient;
