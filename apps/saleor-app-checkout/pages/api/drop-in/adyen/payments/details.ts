import * as Sentry from "@sentry/nextjs";
import { getOrderIdFromAdditionalData } from "@/saleor-app-checkout/backend/payments/providers/adyen/getOrderIdFromNotification";
import { getAdyenClient } from "@/saleor-app-checkout/backend/payments/providers/adyen/utils";
import { allowCors } from "@/saleor-app-checkout/backend/utils";
import { createParseAndValidateBody } from "@/saleor-app-checkout/utils";
import type { DetailsRequest as AdyenDetailsRequest } from "@adyen/api-library/lib/src/typings/checkout/detailsRequest";
import {
  PostAdyenDropInPaymentsDetailsResponse,
  postDropInAdyenPaymentsDetailsBody,
} from "checkout-common";
import { NextApiHandler } from "next";
import invariant from "ts-invariant";
import { getSaleorApiUrlFromRequest } from "@/saleor-app-checkout/backend/auth";
import { unpackThrowable } from "@/saleor-app-checkout/utils/unpackErrors";

const parseAndValidateBody = createParseAndValidateBody(postDropInAdyenPaymentsDetailsBody);

const DropInAdyenPaymentsDetailsHandler: NextApiHandler<
  PostAdyenDropInPaymentsDetailsResponse | { message: string }
> = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).send({ message: "Only POST requests allowed" });
    return;
  }

  const [error, body] = parseAndValidateBody(req.body);

  if (error) {
    console.error(error, req.body);
    res.status(400).send({ message: "Invalid JSON" });
    return;
  }

  const [saleorApiUrlError, saleorApiUrl] = unpackThrowable(() => getSaleorApiUrlFromRequest(req));

  if (saleorApiUrlError) {
    res.status(400).json({ message: saleorApiUrlError.message });
    return;
  }

  try {
    const { checkout } = await getAdyenClient(saleorApiUrl);
    const payment = await checkout.paymentsDetails(body.adyenStateData as AdyenDetailsRequest);
    const orderId = getOrderIdFromAdditionalData(payment.additionalData || {});
    invariant(orderId, "orderId should be set at this point. Please file a bug report.");

    return res.status(200).json({ payment, orderId });
  } catch (err) {
    console.error(err);
    Sentry.captureException(err);

    return res.status(500).json({ message: "adyen" });
  }
};

export default allowCors(DropInAdyenPaymentsDetailsHandler);
