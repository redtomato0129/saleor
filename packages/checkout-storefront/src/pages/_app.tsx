// We're using Next.js here just as a development tool because it's fast and reliable
// For the production, this package is built with `rollup`.
// https://github.com/saleor/saleor-checkout/pull/161
import Dynamic from "next/dynamic";
import urlJoin from "url-join";
import "../index.css";

const CheckoutStoreFront = Dynamic(
  async () => {
    const { Root } = await import("./Root");
    return Root;
  },
  {
    ssr: false,
    loading: () => null,
  }
);

const checkoutApiUrl = process.env["NEXT_PUBLIC_CHECKOUT_APP_URL"]
  ? urlJoin(process.env["NEXT_PUBLIC_CHECKOUT_APP_URL"], `api`)
  : "";
const checkoutAppUrl = process.env["NEXT_PUBLIC_CHECKOUT_APP_URL"];
const allowedSaleorApiRegex = process.env["NEXT_PUBLIC_ALLOWED_SALEOR_API_REGEX"];

export default function CheckoutSpa() {
  if (!checkoutApiUrl) {
    console.warn(`Missing NEXT_PUBLIC_CHECKOUT_APP_URL env variable`);
    return null;
  }
  if (!checkoutAppUrl) {
    console.warn(`Missing NEXT_PUBLIC_CHECKOUT_APP_URL env variable`);
    return null;
  }
  if (!allowedSaleorApiRegex) {
    console.warn(`Missing NEXT_PUBLIC_ALLOWED_SALEOR_API_REGEX  env variable`);
    return null;
  }

  return (
    <CheckoutStoreFront
      env={{ checkoutApiUrl, checkoutAppUrl }}
      saleorApiUrlRegex={new RegExp(allowedSaleorApiRegex)}
    />
  );
}
