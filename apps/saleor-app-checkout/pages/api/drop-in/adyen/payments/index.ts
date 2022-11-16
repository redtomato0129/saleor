import * as Sentry from "@sentry/nextjs";
import { getSaleorApiUrlFromRequest } from "@/saleor-app-checkout/backend/auth";
import { createOrderFromBodyOrId } from "@/saleor-app-checkout/backend/payments/createOrderFromBody";
import { createAdyenCheckoutPayment } from "@/saleor-app-checkout/backend/payments/providers/adyen";
import { allowCors, getBaseUrl } from "@/saleor-app-checkout/backend/utils";
import { createParseAndValidateBody } from "@/saleor-app-checkout/utils";
import { unpackPromise, unpackThrowable } from "@/saleor-app-checkout/utils/unpackErrors";
import { PostAdyenDropInPaymentsResponse, postDropInAdyenPaymentsBody } from "checkout-common";
import { NextApiHandler } from "next";

const parseAndValidateBody = createParseAndValidateBody(postDropInAdyenPaymentsBody);

const DropInAdyenPaymentsHandler: NextApiHandler<
  PostAdyenDropInPaymentsResponse | { message: string }
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

  const [orderCrationError, order] = await unpackPromise(
    createOrderFromBodyOrId(saleorApiUrl, body)
  );

  if (orderCrationError) {
    console.error(orderCrationError);
    Sentry.captureException(orderCrationError);
    return res.status(500).json({ message: `Error creating order for ${body.provider}` });
  }

  try {
    const appUrl = getBaseUrl(req);
    const createPaymentData = {
      order,
      redirectUrl: body.redirectUrl,
      method: body.method,
      appUrl,
      adyenStateData: body.adyenStateData,
    };

    const { payment } = await createAdyenCheckoutPayment({ saleorApiUrl, ...createPaymentData });

    return res.status(200).json({ payment, orderId: order.id });
  } catch (err) {
    console.error(err);
    Sentry.captureException(err);

    return res.status(500).json({ message: body.provider, orderId: order.id });
  }
};

export default allowCors(DropInAdyenPaymentsHandler);
