import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/context/Auth";
import { doc, getDoc } from "firebase/firestore";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const recordId = req.query.recordId as string;

  const document = await getDoc(doc(db, "tiktokAccounts", recordId));
  const record = document.data();

  let productData = undefined;
  let topPostsData = undefined;

  if (record?.product) {
    const productRef = doc(db, "tiktokProducts", record?.product);
    const productInfo = await getDoc(productRef);
    if (productInfo.data()) productData = productInfo.data() as any;
  }

  if (record?.topPosts) {
    const topPosts = record?.topPosts.map(async (post: any) => {
      const postRef = doc(db, "tiktokPosts", post);
      const postData = await getDoc(postRef);
      return postData.data();
    });
    topPostsData = await Promise.all(topPosts);
  }
  const data = {
    recordId: record?.id,
    id: record?.userInfo.user?.id,
    uniqueId: record?.uniqueId,
    nickname: record?.userInfo.user?.nickname,
    accountStats: record?.accountStats,
    stats: {
      heartCount: record?.userInfo.stats.heartCount,
      followerCount: record?.userInfo.stats.followerCount,
      followingCount: record?.userInfo.stats.followingCount,
      videoCount: record?.userInfo.stats.videoCount,
    },
    avatar: record?.avatar,
    secUid: record?.userInfo.user.secUid,
    bio: record?.userInfo.user.signature,
    bioLink: record?.userInfo.user.bioLink?.link
      ? record?.userInfo.user.bioLink.link
      : null,
    posts: record?.posts,
    topPosts: topPostsData,
    product: productData,
  };

  res.status(200).json(data);
}
