import { PaymentProviderSettingsValues } from "@/saleor-app-checkout/types/api";
import { FetchResponse } from "../hooks/useFetch";

export interface PaymentProviderSettingsResult {
  data: PaymentProviderSettingsValues<"unencrypted">;
}

export const requestGetPaymentProviderSettings = ({
  saleorApiUrl,
  token,
}: {
  saleorApiUrl: string;
  token: string;
}): FetchResponse<PaymentProviderSettingsResult> =>
  fetch(
    `/api/payment-provider-settings/` + `?` + new URLSearchParams({ saleorApiUrl }).toString(),
    {
      method: "GET",
      headers: {
        "authorization-bearer": token,
        "saleor-api-url": saleorApiUrl,
      },
    }
  );

export const requestSetPaymentProviderSettings = ({
  saleorApiUrl,
  token,
  ...data
}: PaymentProviderSettingsValues<"unencrypted"> & {
  saleorApiUrl: string;
  token: string;
}): FetchResponse<PaymentProviderSettingsResult> =>
  fetch(
    `/api/set-payment-provider-settings/` + `?` + new URLSearchParams({ saleorApiUrl }).toString(),
    {
      method: "POST",
      headers: {
        "authorization-bearer": token,
        "saleor-api-url": saleorApiUrl,
      },
      body: JSON.stringify(data),
    }
  );
