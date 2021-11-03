import { XIcon } from "@heroicons/react/outline";
import React from "react";

import { getYouTubeIDFromURL } from "@/lib/util";
import { ProductMediaFragment } from "@/saleor/api";

interface VideoExpandProps {
  video?: ProductMediaFragment;
  onRemoveExpand: () => void;
}

export const VideoExpand = ({ video, onRemoveExpand }: VideoExpandProps) => {
  if (!video) {
    return null;
  }

  return (
    <div
      className={
        "min-h-screen absolute grid grid-cols-1 mx-auto px-8 md:h-full w-full bg-gray-100"
      }
    >
      <div
        className="absolute grid h-6 justify-end w-full z-40 p-8 lg:px-8 mx-auto"
        onClick={() => onRemoveExpand()}
      >
        <XIcon className="w-6 h-6" />
      </div>
      <div className="w-full h-full absolute md:mt-10 flex justify-center items-center">
        <iframe
          src={
            "https://www.youtube.com/embed/" +
            getYouTubeIDFromURL(video.url) +
            "?autoplay=1"
          }
          className="w-full h-4/5 md:w-4/5"
          allow="autoplay"
          allowFullScreen
        />
      </div>
    </div>
  );
};
