import { adyenProviderSettingIDs } from "checkout-common";
import { getPrivateSettings } from "@/saleor-app-checkout/backend/configuration/settings";
import { PrivateSettingsValues } from "@/saleor-app-checkout/types";
import { Types } from "@adyen/api-library";
import type { Handler, Middleware, Request } from "retes";
import { Response } from "retes/response";
import { verifyBasicAuth } from "./utils";
import { validateHmac } from "./validator";
import { unpackPromise } from "@/saleor-app-checkout/utils/unpackErrors";
import { MissingPaymentProviderSettingsError } from "../../errors";

export type AdyenRequestContext = Required<
  PrivateSettingsValues<"unencrypted">[keyof PrivateSettingsValues<"unencrypted">]["adyen"]
>;

export type AdyenRequestParams = Types.notification.Notification & { saleorApiUrl: string };

export const withAdyenWebhookCredentials =
  (handler: Handler) => async (request: Request<AdyenRequestParams>) => {
    const [error, settings] = await unpackPromise(
      getPrivateSettings({
        saleorApiUrl: request.params.saleorApiUrl,
        obfuscateEncryptedData: false,
      })
    );

    if (error) {
      console.error("Cannot fetch Adyen API configuration", error);
      return Response.InternalServerError("Cannot fetch Adyen API configuration");
    }

    const {
      paymentProviders: { adyen },
    } = settings;

    const missingKeys = adyenProviderSettingIDs.filter((key) => !adyen[key]);
    if (missingKeys.length > 0) {
      const error = new MissingPaymentProviderSettingsError("adyen", missingKeys);
      console.error(error);
      return Response.InternalServerError({ error: error.message });
    }

    return handler({
      ...request,
      context: {
        ...request.context,
        ...adyen,
      } as AdyenRequestContext,
    });
  };

const isAdyenNotificationShape = (params: { [key: string]: any }): params is AdyenRequestParams => {
  return typeof params?.live === "string" && Array.isArray(params?.notificationItems);
};

export const isAdyenNotification: Middleware = (handler) => (request) => {
  if (isAdyenNotificationShape(request.params)) {
    return handler(request);
  }

  console.warn("Invalid notification made to Adyen webhook handler", request);
  return Response.BadRequest();
};

export const isAdyenWebhookAuthenticated: Middleware = (handler) => (request) => {
  const { username, password } = request.context as AdyenRequestContext;

  if (typeof request.headers.authorization !== "string") {
    return Response.Unauthorized();
  }

  if (!verifyBasicAuth(username, password, request.headers.authorization)) {
    console.warn("Unauthenticated request to Adyen webhook handler", request);
    return Response.Unauthorized();
  }

  return handler(request);
};

export const isAdyenWebhookHmacValid: Middleware = (handler) => async (request) => {
  const { hmac } = request.context as AdyenRequestContext;
  const params = request.params as AdyenRequestParams;

  // https://docs.adyen.com/development-resources/webhooks/understand-notifications#notification-structure
  // notificationItem will always contain a single item for HTTP POST
  const notificationRequestItem = params?.notificationItems?.[0]?.NotificationRequestItem;

  if (!notificationRequestItem) {
    console.error("Invalid call from adyen - no NotificationRequestItem");
    return Response.BadRequest("NotificationRequestItem is not present in the request");
  }

  // first validate the origin
  const [validationError, isValid] = await unpackPromise(
    validateHmac(notificationRequestItem, hmac)
  );

  if (!isValid || validationError) {
    console.error("Invalid hmac in Adyen webhook request", validationError || request);
    return Response.Unauthorized();
  }

  return handler(request);
};
