import React, { useEffect } from "react";
import Image from "next/image";
import { Icons } from "@/components/icons";
import { formatNumber } from "@/lib/utils";
import VideoPlayer from "./video-player";
import { PostType, AccountDataType } from "@/types";
import { siteConfig } from "@/config/site";
import Skeleton from "@/components/ui/skeleton";

interface PostViewProps {
  preFetchedVideo?: PostType;
  postId: string;
  accountData: AccountDataType;
}

const PostView = ({ postId, accountData, preFetchedVideo }: PostViewProps) => {
  const [showPlayer, setShowPlayer] = React.useState(false);
  const [video, setVideo] = React.useState<PostType | undefined>(
    preFetchedVideo
  );

  React.useEffect(() => {
    if (video) return;
    const getVideo = async () => {
      const res = await fetch(`${siteConfig.url}/api/post/${postId}`);
      const data = await res.json();
      setVideo(data);
    };
    getVideo();
  }, [postId, video]);

  return (
    <>
      {video ? (
        <div className="w-full aspect-[9/16]  border rounded-md relative overflow-hidden">
          <Image
            src={video.cover}
            alt="video cover"
            fill
            priority
            quality={50}
            sizes="500px" // sizes="(max-width: 768px) 100vw,
            //   (max-width: 1200px) 50vw,
            //   33vw"
            className="z-[4]"
          />

          <VideoPlayer
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[5] rounded-full h-fit w-fit aspect-square p-2 bg-background/70 hover:bg-background blurBack border-none "
            video={video}
            accountData={accountData}
            showPlayer={showPlayer}
            setShowPlayer={setShowPlayer}
          >
            <Icons.posts className="w-3 h-3 text-primary ml-[1px] fill-primary" />
          </VideoPlayer>

          <div className="bg-background/70 rounded-sm absolute bottom-1 p-1 md:bottom-1 left-1 md:left-1 z-[7] flex items-center text-[8px] md:text-[12px] gap-[2px] md:gap-1 text-primary ">
            <Icons.showPassword className="text-2xl h-2 w-2  md:h-4 md:w-4" />
            {formatNumber(video.postData?.playCount || 0)}
          </div>
        </div>
      ) : (
        <Skeleton className="w-full aspect-[9/16]" />
      )}
    </>
  );
};

export default PostView;
