import Image from "next/image";
import React from "react";

import {
  CheckoutLineDetailsFragment,
  useRemoveProductFromCheckoutMutation,
} from "@/saleor/api";

export interface CheckoutProductListProps {
  lines: CheckoutLineDetailsFragment[];
  token: string;
}

export const CheckoutProductList = ({
  lines,
  token,
}: CheckoutProductListProps) => {
  const [removeProductFromCheckout] = useRemoveProductFromCheckoutMutation();

  return (
    <ul
      role="list"
      className="flex-auto overflow-y-auto divide-y divide-gray-200 px-4 md:pr-4 md:pl-0"
    >
      {lines.map((line) => {
        if (!line) {
          return <></>;
        }
        return (
          <li key={line.id} className="flex py-4 space-x-4">
            <div className="border bg-white w-32 h-32 object-center object-cover rounded-md relative">
              <Image
                src={line.variant.product.thumbnail?.url || ""}
                alt={line.variant.product.thumbnail?.alt || ""}
                layout="fill"
              />
            </div>

            <div className="flex flex-col justify-between space-y-4">
              <div className="text-sm font-medium space-y-1">
                <h3 className="text-gray-900">{line.variant.product.name}</h3>
                <p className="text-gray-500">{line.variant.name}</p>
                <p className="text-gray-900">
                  {line.totalPrice?.gross.localizedAmount}
                </p>
              </div>
              <div className="flex space-x-4">
                <button
                  type="button"
                  className="text-sm font-medium text-blue-600 hover:text-blue-500"
                  onClick={() =>
                    removeProductFromCheckout({
                      variables: {
                        checkoutToken: token,
                        lineId: line.id,
                      },
                    })
                  }
                >
                  Remove
                </button>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
};
