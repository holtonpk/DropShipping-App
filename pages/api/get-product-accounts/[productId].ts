import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/context/user-auth";
import {
  query,
  doc,
  getDocs,
  getDoc,
  collection,
  where,
} from "firebase/firestore";
import { storage } from "@/config/data-storage";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const id = req.query.productId as string;

  const q = query(collection(db, storage.accounts), where("product", "==", id));
  const docs = await getDocs(q);

  const formattedData = docs.docs.map(async (_doc) => {
    const record = _doc.data();
    let topPostsData: any = undefined;

    if (record?.topPosts) {
      const topPosts = record?.topPosts.map(async (post: any) => {
        const postRef = doc(db, storage.posts, post);
        const postData = await getDoc(postRef);
        return {
          ...postData.data(),
          author: {
            avatar: record.avatar,
            id: record.id,
            secUid: record.secUid,
            uniqueId: record.uniqueId,
            nickname: record.userInfo?.user?.nickname,
          },
        };
      });
      topPostsData = await Promise.all(topPosts);
    }
    return {
      id: record?.id,
      topPosts: topPostsData,
      avatar: record?.avatar,
      uniqueId: record?.uniqueId,
      nickname: record?.userInfo?.user?.nickname,
      accountStats: record?.accountStats,
    };
  });

  const data = await Promise.all(formattedData);

  res.status(200).json(data);
}
