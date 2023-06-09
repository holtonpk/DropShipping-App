import type { NextApiRequest, NextApiResponse } from "next";
import { TrendingPostType, Account } from "@/types";
import { db } from "@/context/user-auth";
import {
  doc,
  collection,
  getDocs,
  query,
  limit,
  getDoc,
  where,
  orderBy,
  startAfter,
} from "firebase/firestore";
import { storage } from "@/config/data-storage";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TrendingPostType[]>
) {
  // Select Trending Accounts

  const q = query(
    collection(db, storage.accounts),
    limit(10),
    where("topPosts", "!=", [])
  );
  const docData = await getDocs(q);

  const filteredData = docData.docs
    .map((doc) => doc.data())
    .filter(
      (doc) =>
        doc.topPosts[0] !== null && doc.product != null && doc.product !== null
    );

  const formattedData = filteredData.slice(0, 5).map(async (record) => {
    const topPost = record.topPosts[0];
    const topPostRecord = await getDoc(doc(db, storage.posts, topPost));
    const topPostData = topPostRecord.data();
    let productData: any = null;
    if (record.product) {
      const productRef = doc(db, storage.products, record.product);
      const productInfo = await getDoc(productRef);
      productData = productInfo.data();
    }

    return {
      ...topPostData,
      author: {
        avatar: record.avatar,
        id: record.id,
        secUid: record.secUid,
        nickname: record.userInfo?.user?.nickname,
        uniqueId: record.uniqueId,
      },
      product: productData,
    };
  });

  const data = await Promise.all(formattedData);

  res.status(200).json(data as TrendingPostType[]);
}
