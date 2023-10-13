"use client";

import { clsx } from "clsx";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect } from "react";

export const createPathname = (pathname: string, params: URLSearchParams) => {
	const paramsString = params.toString();
	const queryString = `${paramsString.length ? "?" : ""}${paramsString}`;

	return `${pathname}${queryString}`;
};

export function VariantSelector(props: {
	variants: { id: string; name: string; quantityAvailable?: number | null }[];
}) {
	const { variants } = props;

	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const selectVariant = useCallback(
		(variantID: string, replace = false) => {
			const params = new URLSearchParams(searchParams);
			params.set("variant", variantID);

			const variantPathname = createPathname(pathname, params);
			if (replace) {
				router.replace(variantPathname, { scroll: false });
			} else {
				router.push(variantPathname, { scroll: false });
			}
		},
		[pathname, router, searchParams],
	);

	useEffect(() => {
		if (variants.length === 1 && variants[0].quantityAvailable) {
			selectVariant(variants[0].id, true);
		}
	}, [selectVariant, variants]);

	return (
		<fieldset className="my-4" role="radiogroup" data-testid="VariantSelector">
			<legend className="sr-only">Variants</legend>
			<div className="flex flex-wrap gap-3">
				{variants.length > 1 &&
					variants.map((variant) => {
						return (
							<button
								key={variant.id}
								type="button"
								onClick={() => {
									if (variant.quantityAvailable) {
										selectVariant(variant.id);
									}
								}}
								className={clsx(
									searchParams.get("variant") === variant.id
										? "border-transparent bg-neutral-900 text-white hover:bg-neutral-800"
										: "border-neutral-200 bg-white text-neutral-900 hover:bg-neutral-100",
									"relative flex min-w-[8ch] items-center justify-center overflow-hidden text-ellipsis whitespace-nowrap rounded border p-3 text-center text-sm font-semibold focus-within:outline focus-within:outline-2 aria-disabled:cursor-not-allowed aria-disabled:bg-neutral-100 aria-disabled:opacity-50",
								)}
								role="radio"
								aria-checked={searchParams.get("variant") === variant.id}
								aria-disabled={!variant.quantityAvailable}
							>
								{variant.name}
							</button>
						);
					})}
			</div>
		</fieldset>
	);
}
