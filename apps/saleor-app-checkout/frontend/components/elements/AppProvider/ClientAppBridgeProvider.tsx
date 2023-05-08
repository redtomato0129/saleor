import { createGraphqlClient } from "@/saleor-app-checkout/frontend/misc/client";
import createSafeContext from "@/saleor-app-checkout/frontend/misc/createSafeContext";
import { AppBridge, AppBridgeProvider } from "@saleor/app-sdk/app-bridge";
import { Provider as UrqlProvider } from "urql";
import { ReactNode, useMemo } from "react";
import { useSubscribeToIsAuthorized } from "./useSubscribeToIsAuthorized";
import invariant from "ts-invariant";

interface IAppContext {
  app: AppBridge;
  isAuthorized: boolean;
}

// appBridge instance needs to be created before the first render
// otherwise, we never get the "handshake" event or the token
const appBridge = typeof document === "undefined" ? null : new AppBridge();

const [useAppContext, AppContextProvider] = createSafeContext<IAppContext>();
export { useAppContext };

export const ClientAppBridgeProvider = ({ children }: { children: ReactNode }) => {
  const app = appBridge;
  invariant(app, "ClientAppBridgeProvider is not available on the server side");

  const isAuthorized = useSubscribeToIsAuthorized(app);

  const { token, saleorApiUrl } = app.getState();
  const client = useMemo(() => {
    return createGraphqlClient(saleorApiUrl, token);
  }, [saleorApiUrl, token]);

  const appContext = useMemo(() => ({ app, isAuthorized }), [app, isAuthorized]);

  return (
    <AppBridgeProvider appBridgeInstance={appBridge}>
      <UrqlProvider value={client}>
        <AppContextProvider value={appContext}>{children}</AppContextProvider>
      </UrqlProvider>
    </AppBridgeProvider>
  );
};
