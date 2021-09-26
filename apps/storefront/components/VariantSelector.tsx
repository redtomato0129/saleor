import { ProductDetailsFragment } from "@/saleor/api";
import clsx from "clsx";
import Link from "next/link";
import React from "react";

export interface VariantSelectorProps {
  product: ProductDetailsFragment;
  selectedVariantID?: string;
}

export const VariantSelector: React.VFC<VariantSelectorProps> = ({
  product,
  selectedVariantID,
}) => {
  const variants = product.variants;
  if (!variants || variants.length === 1) {
    return null;
  }
  return (
    <div className="grid grid-cols-8 gap-2">
      {variants.map((variant) => {
        const isSelected = variant?.id === selectedVariantID;
        return (
          <Link
            key={variant?.name}
            href={{
              pathname: "/products/[slug]",
              query: { variant: variant?.id, slug: product.slug },
            }}
            replace
            shallow
          >
            <a
              className={clsx(
                "flex justify-center border rounded-md p-3 font-semibold hover:border-blue-400 shadow-md",
                isSelected && "border-blue-300",
                !isSelected && "border-gray-300"
              )}
            >
              {variant?.name}
            </a>
          </Link>
        );
      })}
    </div>
  );
};

export default VariantSelector;
