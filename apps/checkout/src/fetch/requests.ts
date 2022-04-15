import { FetchResponse } from "@/hooks/useFetch";
import { envVars } from "@/lib/utils";
import { AppConfig } from "@/providers/AppConfigProvider/types";

export const getPaymentProviders = () =>
  fetch(`${envVars.configAppUrl}/active-payment-providers/channel-1`);

export interface PayResult {
  checkoutUrl: string;
}

export const pay = ({
  checkoutId,
  totalAmount,
  provider,
}: {
  checkoutId: string;
  totalAmount: number;
  provider: string;
}): FetchResponse<PayResult> =>
  fetch(`${envVars.apiUrl}/pay`, {
    method: "POST",
    body: JSON.stringify({
      provider,
      checkoutId,
      totalAmount,
    }),
  });

export const getAppConfig = (): FetchResponse<AppConfig> =>
  fetch(`${envVars.configAppUrl}/customization-settings`);
