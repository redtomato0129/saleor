import { ApolloQueryResult } from "@apollo/client";
import { PlayIcon } from "@heroicons/react/outline";
import { useAuthState } from "@saleor/sdk";
import clsx from "clsx";
import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import Custom404 from "pages/404";
import React, { ReactElement, useState } from "react";
import { useLocalStorage } from "react-use";

import { Layout, RichText, VariantSelector } from "@/components";
import { ImageExpand } from "@/components/ImageExpand";
import { ProductPageSeo } from "@/components/seo/ProductPageSeo";
import { VideoExpand } from "@/components/VideoExpand";
import { CHECKOUT_TOKEN } from "@/lib/const";
import apolloClient from "@/lib/graphql";
import { getYouTubeIDFromURL, notNullable } from "@/lib/util";
import {
  CheckoutError,
  ProductBySlugDocument,
  ProductBySlugQuery,
  ProductDetailsFragment,
  ProductMediaFragment,
  ProductPathsDocument,
  ProductPathsQuery,
  useCheckoutAddProductLineMutation,
  useCheckoutByTokenQuery,
  useCreateCheckoutMutation,
} from "@/saleor/api";

const ProductPage = ({
  productSSG,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const router = useRouter();
  const [checkoutToken, setCheckoutToken] = useLocalStorage(CHECKOUT_TOKEN);
  const [createCheckout] = useCreateCheckoutMutation();
  const { user } = useAuthState();

  const { data: checkoutData } = useCheckoutByTokenQuery({
    variables: { checkoutToken },
    skip: !checkoutToken || !process.browser,
  });
  const [addProductToCheckout] = useCheckoutAddProductLineMutation();
  const [loadingAddToCheckout, setLoadingAddToCheckout] = useState(false);
  const [addToCartError, setAddToCartError] = useState("");
  const [expandedImage, setExpandedImage] = useState<
    ProductMediaFragment | undefined
  >(undefined);
  const [videoToPlay, setVideoToPlay] = useState<
    ProductMediaFragment | undefined
  >(undefined);

  const product = productSSG?.data?.product;
  if (!product?.id) {
    return <Custom404 />;
  }
  const price = product?.pricing?.priceRange?.start?.gross.localizedAmount;

  const getSelectedVariantID = (
    queryVariant: string | undefined,
    product: ProductDetailsFragment
  ) => {
    if (queryVariant) return queryVariant;
    else if (product?.variants?.length === 1) {
      process.browser
        ? router.replace({
            pathname: "/products/[slug]",
            query: { variant: product.variants![0]!.id!, slug: product.slug },
          })
        : undefined;
      return product.variants![0]!.id!;
    }
    return "";
  };

  // We have to check if code is run on the browser
  // before we can use the router
  const queryVariant = process.browser
    ? router.query.variant?.toString()
    : undefined;

  const selectedVariantID = getSelectedVariantID(queryVariant, product);

  let selectedVariant = product?.variants?.find(
    (v) => v?.id === selectedVariantID
  );

  const onAddToCart = async () => {
    // Clear previous error messages
    setAddToCartError("");

    // Block add to checkout button
    setLoadingAddToCheckout(true);
    const errors: CheckoutError[] = [];

    if (!!checkoutData?.checkout) {
      // If checkout is already existing, add products
      const { data: addToCartData } = await addProductToCheckout({
        variables: {
          checkoutToken: checkoutToken,
          variantId: selectedVariantID,
        },
      });
      addToCartData?.checkoutLinesAdd?.errors.forEach((e) => {
        if (!!e) {
          errors.push(e);
        }
      });
    } else {
      // Theres no checkout, we have to create one
      const { data: createCheckoutData } = await createCheckout({
        variables: {
          email: user?.email || "anonymous@example.com",
          lines: [
            {
              quantity: 1,
              variantId: selectedVariantID,
            },
          ],
        },
      });
      createCheckoutData?.checkoutCreate?.errors.forEach((e) => {
        if (!!e) {
          errors.push(e);
        }
      });
      if (createCheckoutData?.checkoutCreate?.checkout?.token) {
        setCheckoutToken(createCheckoutData?.checkoutCreate?.checkout?.token);
      }
    }
    // Enable button
    setLoadingAddToCheckout(false);

    if (errors.length === 0) {
      // Product successfully added, redirect to cart page
      router.push("/cart");
      return;
    }

    // Display error message
    const errorMessages =
      errors.map((e) => {
        return e.message || "";
      }) || [];
    setAddToCartError(errorMessages.join("\n"));
  };

  /**
   * If a variant has been selected by the user and this variant has media, return only those items.
   * Otherwise, all product media are returned.
   * @param   {ProductDetailsFragment} product  The product object
   * @param   {ProductVariant} selectedVariant   The selected variant object
   * @return  {ProductMediaFragment[]}   The media object that will be displayed to the user
   */

  const getGalleryMedia = (
    product: ProductDetailsFragment,
    selectedVariant: any
  ) => {
    if (
      queryVariant &&
      selectedVariant?.id === queryVariant &&
      selectedVariant.media?.length !== 0
    )
      return selectedVariant.media.filter(notNullable);
    return product?.media?.filter(notNullable) || [];
  };

  const media = getGalleryMedia(product, selectedVariant);

  /**
   * When a variant is selected, the variant attributes are shown together with the attributes of the product. Otherwise, onyl the product
   * attributes are shown
   * @param   {ProductDetailsFragment} product  The product object
   * @param   {ProductVariant} selectedVariant   The selected variant object
   * @return  The attributes that will be shown to the user for the chosen product
   */

  const getProductAttributes = (
    product: ProductDetailsFragment,
    selectedVariant: any
  ) => {
    if (selectedVariant)
      return product.attributes.concat(selectedVariant.attributes);
    return product.attributes;
  };

  const attributes = getProductAttributes(product, selectedVariant);

  const productImage = product?.media![0];

  const isAddToCartButtonDisabled =
    !selectedVariant ||
    selectedVariant?.quantityAvailable === 0 ||
    loadingAddToCheckout;

  return (
    <>
      <ProductPageSeo product={product} />
      <main
        className={clsx(
          "grid grid-cols-1 gap-4 max-h-full overflow-auto md:overflow-hidden max-w-7xl mx-auto pt-8 px-8",
          product.media && product.media.length > 1 && "md:grid-cols-3",
          product.media && product.media.length === 1 && "md:grid-cols-2",
          expandedImage && "hidden",
          videoToPlay && "hidden"
        )}
      >
        <div
          className={clsx(
            "mt-1 mb-2 w-full max-h-screen overflow-scroll grid grid-cols-1 md:h-full h-96",
            product.media &&
              product.media.length > 1 &&
              "md:grid-cols-2 md:col-span-2"
          )}
          style={{
            scrollSnapType: "both mandatory",
          }}
        >
          {media?.map((media: ProductMediaFragment) => {
            return (
              <div
                key={media.url}
                className={"aspect-w-1 aspect-h-1"}
                style={{
                  scrollSnapAlign: "start",
                }}
              >
                {media.type === "IMAGE" && (
                  <Image
                    onClick={() => setExpandedImage(media)}
                    src={media.url}
                    alt={media.alt}
                    layout="fill"
                    objectFit="cover"
                  />
                )}
                {media.type === "VIDEO" && (
                  <div
                    onClick={() => {
                      setVideoToPlay(media);
                    }}
                  >
                    <Image
                      src={
                        "https://img.youtube.com/vi/" +
                        getYouTubeIDFromURL(media.url) +
                        "/maxresdefault.jpg"
                      }
                      alt={media.alt}
                      layout="fill"
                      objectFit="cover"
                    />
                    <div
                      className={
                        "transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110 absolute w-full h-full flex justify-center items-center bg-transparent"
                      }
                    >
                      <PlayIcon className="h-12 w-12" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="space-y-8 mt-10 md:mt-0">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-800">
              {product?.name}
            </h1>
            <Link href={`/category/${product?.category?.slug}`} passHref>
              <p className="text-lg mt-2 font-medium text-gray-600 cursor-pointer">
                {product?.category?.name}
              </p>
            </Link>
          </div>

          <VariantSelector
            product={product}
            selectedVariantID={selectedVariantID}
          />

          <button
            onClick={onAddToCart}
            type="submit"
            disabled={isAddToCartButtonDisabled}
            className={clsx(
              "max-w-xs w-full bg-blue-500 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-white hover:bg-blue-600 focus:outline-none",
              isAddToCartButtonDisabled && "bg-gray-400 hover:bg-gray-400"
            )}
          >
            {loadingAddToCheckout ? "Adding..." : "Add to cart"}
          </button>

          {!selectedVariant && (
            <p className="text-lg- text-yellow-600">Please choose a variant</p>
          )}

          {selectedVariant?.quantityAvailable === 0 && (
            <p className="text-lg- text-yellow-600">Sold out!</p>
          )}

          {!!addToCartError && <p>{addToCartError}</p>}

          {product?.description && (
            <div className="text-base text-gray-700 space-y-6">
              <RichText jsonStringData={product.description} />
            </div>
          )}

          {attributes.length > 0 && (
            <div>
              <p className="text-lg mt-2 font-medium text-gray-500">
                Attributes
              </p>
              <div>
                {attributes.map((attribute) => (
                  <div
                    key={attribute.attribute.name}
                    className="grid grid-cols-2"
                  >
                    <div>
                      <p>{attribute.attribute.name}</p>
                    </div>
                    <div>
                      {attribute.values.map((value, index) => (
                        <p key={index}>
                          {value?.name}
                          {attribute.values.length !== index + 1 && (
                            <div>{" | "}</div>
                          )}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {expandedImage && (
        <div className="absolute min-h-screen min-w-screen h-full w-full top-0 bottom-0 left-0 right-0 z-40">
          <ImageExpand
            image={expandedImage}
            onRemoveExpand={() => setExpandedImage(undefined)}
          />
        </div>
      )}

      {videoToPlay && (
        <div className="absolute min-h-screen min-w-screen top-0 bottom-0 left-0 right-0 z-40">
          <VideoExpand
            video={videoToPlay}
            onRemoveExpand={() => setVideoToPlay(undefined)}
          />
        </div>
      )}
    </>
  );
};

export default ProductPage;

export async function getStaticPaths() {
  const result: ApolloQueryResult<ProductPathsQuery | undefined> =
    await apolloClient.query({
      query: ProductPathsDocument,
      variables: {},
    });
  const paths =
    result.data?.products?.edges.map(({ node }) => ({
      params: { slug: node.slug },
    })) || [];

  return {
    paths,
    fallback: "blocking",
  };
}

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const productSlug = context.params?.slug?.toString();
  const data: ApolloQueryResult<ProductBySlugQuery | undefined> =
    await apolloClient.query({
      query: ProductBySlugDocument,
      variables: {
        slug: productSlug,
      },
    });
  return {
    props: {
      productSSG: data,
    },
    revalidate: 60, // value in seconds, how often ISR will trigger on the server
  };
};

ProductPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
