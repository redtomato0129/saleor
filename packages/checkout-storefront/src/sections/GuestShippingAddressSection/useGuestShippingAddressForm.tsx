import { useAddressFormUrlChange } from "@/checkout-storefront/components/AddressForm/useAddressFormUrlChange";
import { useCheckoutShippingAddressUpdateMutation } from "@/checkout-storefront/graphql";
import { useFormSubmit } from "@/checkout-storefront/hooks/useFormSubmit";
import { omit } from "lodash-es";
import {
  getAddressFormDataFromAddress,
  getAddressInputData,
  getAddressValidationRulesVariables,
} from "@/checkout-storefront/components/AddressForm/utils";
import { useCheckoutFormValidationTrigger } from "@/checkout-storefront/hooks/useCheckoutFormValidationTrigger";
import { useCheckout } from "@/checkout-storefront/hooks/useCheckout";
import {
  AutoSaveAddressFormData,
  useAutoSaveAddressForm,
} from "@/checkout-storefront/hooks/useAutoSaveAddressForm";
import { useMemo } from "react";
import { useSetCheckoutFormValidationState } from "@/checkout-storefront/hooks/useSetCheckoutFormValidationState";

export const useGuestShippingAddressForm = () => {
  const {
    checkout: { shippingAddress },
  } = useCheckout();

  const [, checkoutShippingAddressUpdate] = useCheckoutShippingAddressUpdateMutation();
  const { setCheckoutFormValidationState } = useSetCheckoutFormValidationState("shippingAddress");

  const onSubmit = useFormSubmit<AutoSaveAddressFormData, typeof checkoutShippingAddressUpdate>(
    useMemo(
      () => ({
        scope: "checkoutShippingUpdate",
        onSubmit: checkoutShippingAddressUpdate,
        parse: ({ languageCode, checkoutId, ...rest }) => ({
          languageCode,
          checkoutId,
          shippingAddress: getAddressInputData(omit(rest, "channel")),
          validationRules: getAddressValidationRulesVariables({ autoSave: true }),
        }),
        onSuccess: ({ data, formHelpers }) => {
          void setCheckoutFormValidationState({
            ...formHelpers,
            values: getAddressFormDataFromAddress(data.checkout?.shippingAddress),
          });
        },
      }),
      [checkoutShippingAddressUpdate, setCheckoutFormValidationState]
    )
  );

  const form = useAutoSaveAddressForm({
    onSubmit,
    initialValues: getAddressFormDataFromAddress(shippingAddress),
    scope: "checkoutShippingUpdate",
  });

  useAddressFormUrlChange(form);

  useCheckoutFormValidationTrigger({
    form,
    scope: "shippingAddress",
  });

  return form;
};
