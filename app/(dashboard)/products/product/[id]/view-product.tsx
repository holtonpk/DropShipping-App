"use client";
import Link from "next/link";
import React from "react";
import { ProductType, AccountDataType } from "@/types";
import Image from "next/image";
import { Icons } from "@/components/icons";
import { UpdateCollectionButton } from "@/components/buttons/update-collection-button";
import PostView from "@/components/post-view";
interface ViewProductProps {
  data: ProductType;
}

const ViewProduct = ({ data }: ViewProductProps) => {
  return (
    <div className="grid md:grid-cols-[30%_1fr] gap-4 p-4 container">
      <h1 className="md:hidden text-2xl font-bold capitalize">{data.title}</h1>

      <ProductImage images={data.supplierInfo.supplierImages} />
      <section className=" rounded-md">
        <h1 className="text-2xl font-bold capitalize md:block hidden ">
          {data.title}
        </h1>
        <div className="grid grid-cols-3 border rounded-md p-2 mt-4">
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-[12px] sm:text-base text-muted-foreground w-fit whitespace-nowrap">
              Popularity Rank
            </h1>
            <div className="font-bold text-primary text-[12px] sm:text-lg">
              #1
            </div>
          </div>
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-[12px] sm:text-base text-muted-foreground w-fit">
              Supplier
            </h1>

            <Icons.aliExpress className="text-2xl w-16 sm:w-20 h-[16px]" />
          </div>
          <div className="flex flex-col items-center justify-center ">
            <h1 className="text-[12px] sm:text-base text-muted-foreground w-fit">
              Supplier Price
            </h1>
            <h1 className="text-[12px] sm:text-lg  text-primary font-bold ">
              {"$" + data.supplierInfo.supplierPrice.min + "/ unit"}
            </h1>
          </div>
        </div>
        <AccountInfo accounts={data.accountsData} />
      </section>
    </div>
  );
};

export default ViewProduct;

interface ProductImageProps {
  images: string[];
}

const ProductImage = ({ images }: ProductImageProps) => {
  const [mainImage, setMainImage] = React.useState(images[0]);

  return (
    <div className=" grid md:grid-cols-1 grid-cols-[60%_1fr] sm:gap-4 gap-2 rounded-md h-fit ">
      <div className="aspect-square full relative rounded-md shadow bg-muted">
        <Image
          src={mainImage}
          alt="product image"
          fill
          className="rounded-md"
        />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4  w-full  rounded-md ">
        {images.map((image, index) => (
          <button
            onClick={() => setMainImage(image)}
            key={index}
            className={`${
              mainImage == image
                ? "border-2 border-primary box-border"
                : "hover:opacity-60"
            } w-full aspect-square relative rounded-md overflow-hidden shadow bg-muted`}
          >
            <Image src={image} alt="product image" fill />
          </button>
        ))}
      </div>
    </div>
  );
};

interface AccountInfoProps {
  accounts: AccountDataType[];
}

const AccountInfo = ({ accounts }: AccountInfoProps) => {
  console.log("accounts", accounts);
  const topPosts = accounts.flatMap((account) => account.topPosts || []);

  console.log("topPosts", topPosts);
  topPosts.sort(
    (a: any, b: any) => b.postData.playCount - a.postData.playCount
  );

  const sortedAccounts = accounts.sort(
    (a: any, b: any) =>
      b.accountStats[0].followerCount - a.accountStats[0].followerCount
  );

  return (
    <div className="grid  gap-4">
      <div className="flex flex-col ">
        <h1 className="text-xl mt-4">{`Active Sellers (${accounts.length})`}</h1>
        <div className="h-fit max-h-[300px] overflow-scroll border rounded-md">
          <div className="grid divide-y divide-border  h-fit   ">
            {sortedAccounts.map((account, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2 cursor-pointer group hover:bg-muted"
              >
                <Link
                  href={`accounts/account/${account.id}`}
                  className="w-[80%] grid grid-cols-[40px_1fr] gap-2"
                >
                  <div className="aspect-square w-10 h-10 bg-muted rounded-md relative overflow-hidden">
                    <Image src={account.avatar} alt="product image" fill />
                  </div>
                  <div className="flex flex-col max-w-full overflow-hidden">
                    <h1 className="text-base font-bold whitespace-nowrap overflow-hidden text-ellipsis  text-primary">
                      {account.nickname}
                    </h1>
                    <div className="text-[12px] text-gray-500  text-muted-foreground overflow-hidden text-ellipsis">
                      {"@" + account.uniqueId}
                    </div>
                  </div>
                </Link>
                <UpdateCollectionButton
                  account={account}
                  variant="outline"
                  size="sm"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <h1 className="text-xl">Top Videos</h1>
        <div className="grid md:grid-cols-6 grid-cols-3 gap-4 w-full">
          {accounts &&
            topPosts.slice(0, 6).map((item: any, i: number) => {
              return (
                <PostView
                  key={i}
                  cover={item?.cover}
                  playCount={item.postData.playCount}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
};
