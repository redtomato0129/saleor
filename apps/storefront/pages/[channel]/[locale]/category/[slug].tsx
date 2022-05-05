import { ApolloQueryResult } from "@apollo/client";
import { GetStaticPaths, GetStaticPropsContext, InferGetStaticPropsType } from "next";
import Custom404 from "pages/404";
import React, { ReactElement } from "react";

import { Layout, PageHero, ProductCollection } from "@/components";
import { CategoryPageSeo } from "@/components/seo/CategoryPageSeo";
import apolloClient from "@/lib/graphql";
import { contextToRegionQuery } from "@/lib/regions";
import {
  CategoryBySlugDocument,
  CategoryBySlugQuery,
  CategoryBySlugQueryVariables,
} from "@/saleor/api";

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const categorySlug = context.params?.slug?.toString()!;
  const response: ApolloQueryResult<CategoryBySlugQuery> = await apolloClient.query<
    CategoryBySlugQuery,
    CategoryBySlugQueryVariables
  >({
    query: CategoryBySlugDocument,
    variables: {
      slug: categorySlug,
      locale: contextToRegionQuery(context).locale,
    },
  });
  return {
    props: {
      category: response.data.category,
    },
  };
};

function CategoryPage({ category }: InferGetStaticPropsType<typeof getStaticProps>) {
  if (!category) {
    return <Custom404 />;
  }
  return (
    <>
      <CategoryPageSeo category={category} />
      <header className="mb-4 pt-4">
        <div className="container px-8">
          <PageHero entity={category} />
        </div>
      </header>
      <main>
        <div className="container px-8">
          <ProductCollection filter={{ categories: [category?.id] }} />
        </div>
      </main>
    </>
  );
}

export default CategoryPage;

export const getStaticPaths: GetStaticPaths = () => ({
  paths: [],
  fallback: "blocking",
});

CategoryPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
