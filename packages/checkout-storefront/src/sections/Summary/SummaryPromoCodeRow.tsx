import { IconButton } from "@/checkout-storefront/components/IconButton";
import React from "react";
import { SummaryMoneyRow, SummaryMoneyRowProps } from "./SummaryMoneyRow";
import { RemoveIcon } from "@/checkout-storefront/icons";
import { useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";
import { getSvgSrc } from "@/checkout-storefront/lib/svgSrc";
import { useCheckoutRemovePromoCodeMutation } from "@/checkout-storefront/graphql";
import { useCheckout } from "@/checkout-storefront/hooks/useCheckout";
import { localeToLanguageCode } from "@/checkout-storefront/lib/utils/locale";
import { summaryLabels } from "./messages";
import { imageAltMessages } from "@/checkout-storefront/lib/commonMessages";
import { useLocale } from "@/checkout-storefront/hooks/useLocale";
import { isOrderConfirmationPage } from "@/checkout-storefront/lib/utils/url";

interface SummaryPromoCodeRowProps extends SummaryMoneyRowProps {
  promoCode?: string;
  promoCodeId?: string;
  editable: boolean;
}

export const SummaryPromoCodeRow: React.FC<SummaryPromoCodeRowProps> = ({
  promoCode,
  promoCodeId,
  editable,
  ...rest
}) => {
  const { checkout } = useCheckout({ pause: isOrderConfirmationPage() });
  const formatMessage = useFormattedMessages();
  const { locale } = useLocale();
  const [, checkoutRemovePromoCode] = useCheckoutRemovePromoCodeMutation();

  const onDelete = () => {
    const variables = promoCode ? { promoCode: promoCode } : { promoCodeId: promoCodeId as string };

    void checkoutRemovePromoCode({
      languageCode: localeToLanguageCode(locale),
      checkoutId: checkout.id,
      ...variables,
    });
  };

  return (
    <SummaryMoneyRow {...rest}>
      {editable && (
        <IconButton
          color="secondary"
          onClick={onDelete}
          ariaLabel={formatMessage(summaryLabels.removeDiscount)}
          variant="bare"
          icon={
            <img src={getSvgSrc(RemoveIcon)} alt={formatMessage(imageAltMessages.removeIcon)} />
          }
        />
      )}
    </SummaryMoneyRow>
  );
};
