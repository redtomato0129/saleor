import React, { useState } from "react";
import { useIntl } from "react-intl";

import { SavedAddressSelectionList } from "@/components";
import { notNullable } from "@/lib/util";
import {
  CheckoutDetailsFragment,
  CountryCode,
  useCheckoutShippingAddressUpdateMutation,
} from "@/saleor/api";

import { Button } from "../Button";
import { useRegions } from "../RegionsProvider";
import { messages } from "../translations";
import { AddressDisplay } from "./AddressDisplay";
import { AddressForm, AddressFormData } from "./AddressForm";
import { useUser } from "@/lib/useUser";

export interface ShippingAddressSectionProps {
  active: boolean;
  checkout: CheckoutDetailsFragment;
}

export function ShippingAddressSection({ active, checkout }: ShippingAddressSectionProps) {
  const t = useIntl();
  const { query } = useRegions();

  const { authenticated } = useUser();
  const [editing, setEditing] = useState(!checkout.shippingAddress);
  const [shippingAddressUpdateMutation] = useCheckoutShippingAddressUpdateMutation({});

  const { billingAddress } = checkout;

  const onSameAsBilling = async () => {
    if (!billingAddress) {
      return;
    }
    const { data } = await shippingAddressUpdateMutation({
      variables: {
        address: {
          firstName: billingAddress.firstName || "",
          lastName: billingAddress.lastName || "",
          phone: billingAddress.phone || "",
          country: (billingAddress.country.code as CountryCode) || "PL",
          streetAddress1: billingAddress.streetAddress1 || "",
          city: billingAddress.city || "",
          postalCode: billingAddress.postalCode || "",
        },
        token: checkout.token,
        locale: query.locale,
      },
    });
    if (data?.checkoutShippingAddressUpdate?.errors.length) {
      // todo: add error handling
      return;
    }
    // Successfully updated the shipping address
    setEditing(false);
  };
  const updateMutation = async (formData: AddressFormData) => {
    const { data } = await shippingAddressUpdateMutation({
      variables: {
        address: {
          ...formData,
        },
        token: checkout.token,
        locale: query.locale,
      },
    });
    setEditing(false);
    return data?.checkoutShippingAddressUpdate?.errors.filter(notNullable) || [];
  };

  return (
    <>
      <div className="mt-4 mb-4">
        <h2
          className={active ? "checkout-section-header-active" : "checkout-section-header-disabled"}
        >
          {t.formatMessage(messages.shippingAddressCardHeader)}
        </h2>
      </div>
      {active &&
        (editing ? (
          <>
            {authenticated && (
              <SavedAddressSelectionList
                updateAddressMutation={(address: AddressFormData) => updateMutation(address)}
              />
            )}
            <div className="col-span-full pb-4">
              <button type="button" className="btn-checkout-section" onClick={onSameAsBilling}>
                {t.formatMessage(messages.sameAsBillingButton)}
              </button>
            </div>
            <AddressForm
              existingAddressData={checkout.shippingAddress || undefined}
              toggleEdit={() => setEditing(false)}
              updateAddressMutation={updateMutation}
            />
          </>
        ) : (
          <section className="flex justify-between items-center mb-4">
            {!!checkout.shippingAddress && <AddressDisplay address={checkout.shippingAddress} />}
            <Button onClick={() => setEditing(true)}>
              {t.formatMessage(messages.changeButton)}
            </Button>
          </section>
        ))}
    </>
  );
}

export default ShippingAddressSection;
