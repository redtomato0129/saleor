import Image from "next/image";
import React from "react";
import { ProductMediaFragment } from "@/saleor/api";

interface ImageExpandProps {
  image?: ProductMediaFragment;
  onRemoveExpand: () => void;
}
export const ImageExpand = ({ image, onRemoveExpand }: ImageExpandProps) => {
  return (
    <>
      {image && (
        <div
          className={
            "min-h-screen absolute max-w-7xl grid grid-cols-1 mx-auto px-8 md:h-full w-full bg-gray-100"
          }
        >
          <div
            className="absolute grid h-6 justify-end w-full z-40 px-2 lg:px-8 mx-auto"
            onClick={() => onRemoveExpand()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <div className="w-full h-4/5 max-h-6xl absolute">
            <Image src={image.url} layout="fill" objectFit="scale-down"></Image>
          </div>
        </div>
      )}
    </>
  );
};
