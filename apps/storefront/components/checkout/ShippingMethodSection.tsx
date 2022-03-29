import { RadioGroup } from "@headlessui/react";
import React, { useState } from "react";
import { useIntl } from "react-intl";

import { notNullable } from "@/lib/util";
import {
  CheckoutDetailsFragment,
  ShippingMethod,
  useCheckoutShippingMethodUpdateMutation,
} from "@/saleor/api";

import { Button } from "../Button";
import { useRegions } from "../RegionsProvider";
import { messages } from "../translations";
import { ShippingMethodDisplay } from "./ShippingMethodDisplay";
import { ShippingMethodOption } from "./ShippingMethodOption";

export interface ShippingMethodSectionProps {
  checkout: CheckoutDetailsFragment;
  active: boolean;
}

export function ShippingMethodSection({ checkout, active }: ShippingMethodSectionProps) {
  const t = useIntl();
  const { query } = useRegions();

  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState(checkout.shippingMethod);
  const [editing, setEditing] = useState(!checkout.shippingMethod);

  const [checkoutShippingMethodUpdate] = useCheckoutShippingMethodUpdateMutation({});

  const handleChange = async (method: ShippingMethod) => {
    const { data } = await checkoutShippingMethodUpdate({
      variables: {
        token: checkout.token,
        shippingMethodId: method.id,
        locale: query.locale,
      },
    });
    if (data?.checkoutShippingMethodUpdate?.errors.length) {
      // todo: handle errors
      console.error(data?.checkoutShippingMethodUpdate?.errors);
      return;
    }
    setSelectedDeliveryMethod(method);
    setEditing(false);
  };

  const availableShippingMethods = checkout.availableShippingMethods.filter(notNullable) || [];

  return (
    <>
      <div className="mt-4 mb-4">
        <h2
          className={active ? "checkout-section-header-active" : "checkout-section-header-disabled"}
        >
          {t.formatMessage(messages.shippingMethodCardHeader)}
        </h2>
      </div>
      {active &&
        (editing ? (
          <RadioGroup value={selectedDeliveryMethod} onChange={handleChange} className="py-8">
            <div className="mt-4 grid grid-cols-2 gap-2">
              {availableShippingMethods.map((method) => {
                // todo: Investigate why filter did not excluded non existing methods
                if (!method) {
                  return null;
                }
                return <ShippingMethodOption method={method} key={method.id} />;
              })}
            </div>
          </RadioGroup>
        ) : (
          <section className="flex justify-between items-center mb-4">
            {!!checkout.shippingMethod && (
              <ShippingMethodDisplay method={checkout.shippingMethod} />
            )}
            <div className="flex justify-between items-center">
              <Button onClick={() => setEditing(true)}>
                {t.formatMessage(messages.changeButton)}
              </Button>
            </div>
          </section>
        ))}
    </>
  );
}

export default ShippingMethodSection;
