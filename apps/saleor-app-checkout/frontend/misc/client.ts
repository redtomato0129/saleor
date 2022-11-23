import { authExchange } from "@urql/exchange-auth";
import { multipartFetchExchange } from "@urql/exchange-multipart-fetch";
import { createClient, makeOperation, cacheExchange, dedupExchange, Operation } from "urql";

interface AuthState {
  token: string;
}

const addAuthToOperation = ({
  authState,
  operation,
}: {
  authState?: AuthState | null;
  operation: Operation<any, any>;
}) => {
  if (!authState?.token) {
    return operation;
  }

  const fetchOptions =
    typeof operation.context.fetchOptions === "function"
      ? operation.context.fetchOptions()
      : operation.context.fetchOptions || {};

  return makeOperation(operation.kind, operation, {
    ...operation.context,
    fetchOptions: {
      ...fetchOptions,
      headers: {
        ...fetchOptions.headers,
        Authorization: `Bearer ${authState.token}`,
      },
    },
  });
};

const willAuthError = ({ authState }: { authState?: AuthState | null }) => !authState?.token;

export const createGraphqlClient = (apiUrl: string, token: string | undefined) => {
  console.info(`Using API_URL: ${apiUrl}`);
  return createClient({
    exchanges: [
      dedupExchange,
      cacheExchange,
      authExchange({
        getAuth: async () => (token ? { token } : null),
        willAuthError,
        addAuthToOperation,
      }),
      multipartFetchExchange,
    ],
    url: apiUrl,
  });
};
