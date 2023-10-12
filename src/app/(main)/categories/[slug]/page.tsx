import { notFound } from "next/navigation";
import { type Metadata } from "next";
import { ProductListByCategoryDocument } from "@/gql/graphql";
import { execute } from "@/lib/graphql";
import { ProductsList } from "@/ui/components/ProductsList";

export const generateMetadata = async ({ params }: { params: { slug: string } }): Promise<Metadata> => {
	const { category } = await execute(ProductListByCategoryDocument, {
		variables: { slug: params.slug },
	});

	return {
		title: `${category?.seoTitle || category?.name || "Category"} · Saleor Storefront example`,
		description: category?.seoDescription || category?.description || category?.seoTitle || category?.name,
	};
};

export default async function Page({ params }: { params: { slug: string } }) {
	const { category } = await execute(ProductListByCategoryDocument, {
		variables: { slug: params.slug },
	});

	if (!category || !category.products) {
		notFound();
	}

	const { name, products } = category;

	return (
		<div>
			<div className="border-b bg-gray-100/50">
				<div className="mx-auto max-w-7xl p-8">
					<h1 className="text-xl font-semibold">{name}</h1>
				</div>
			</div>
			<section className="sm:py-18 mx-auto max-w-2xl px-8 py-12 sm:px-6 lg:max-w-7xl">
				<h2 className="sr-only">Products in category {category.name}</h2>
				<ProductsList products={products.edges.map((e) => e.node)} />
			</section>
		</div>
	);
}
