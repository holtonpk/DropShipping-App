import React, { useEffect, useState } from "react";
import { ProductType } from "@/types";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { db } from "@/context/Auth";
import Link from "next/link";
import {
  collection,
  getDoc,
  limit,
  doc,
  updateDoc,
  deleteField,
  deleteDoc,
  getDocs,
  onSnapshot,
  query,
} from "firebase/firestore";
import { siteConfig } from "@/config/site";
import { LinkButton } from "@/components/ui/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import exp from "constants";

const ProductManage = () => {
  const [products, setProducts] = React.useState<ProductType[]>([]);
  const [expanded, setExpanded] = React.useState<ProductType>();
  const [updateIsLoading, setUpdateIsLoading] = React.useState<boolean>(false);
  useEffect(() => {
    const collectionRef = collection(db, "tiktokProducts");
    const q = query(collectionRef);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newProducts = snapshot.docs.map((doc) =>
        doc.data()
      ) as ProductType[];
      setProducts(newProducts);
    });

    // Cleanup function that will be called when the component unmounts
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (expanded) {
      products.forEach((product) => {
        if (product.id === expanded.id) {
          setExpanded(product);
        }
      });
    }
  }, [products, expanded]);

  const BATCH_SIZE = 10; // Adjust batch size based on your rate limits and performance considerations

  const Update = async () => {
    setUpdateIsLoading(true);
    const collectionRef = collection(db, "tiktokProducts");

    for (let i = 0; i < products.length; i += BATCH_SIZE) {
      const batch = products.slice(i, i + BATCH_SIZE);
      await Promise.all(
        batch.map(async (product, index) => {
          console.log(i + index, "/", products.length);
          const docRef = doc(collectionRef, product.id);
          const docSnap = await getDoc(docRef);
          const docData = docSnap.data();
          if (!docData || docData.supplierInfo || !docData?.supplierId) return;
          const supplierId = docData.supplierId;
          try {
            const productInfoRes = await fetch(
              `${siteConfig.url}/api/scrape/aliexpress/${supplierId}`
            );
            if (!productInfoRes.ok) {
              console.log(
                `Failed to fetch info for product with ID ${supplierId}`
              );
              return;
            }
            const productInfo = await productInfoRes.json();
            const productInfoData = {
              supplierImages: productInfo.images,
              supplierTitle: productInfo.title,
              supplierPrice: productInfo.salePrice,
              supplierDescription: productInfo.description,
            };
            await updateDoc(docRef, {
              supplierInfo: productInfoData,
            });
          } catch (error) {
            console.error(
              `Error processing product with ID ${supplierId}: ${error}`
            );
          }
        })
      );
    }
    setUpdateIsLoading(false);
  };

  const [goodProducts, setGoodProducts] = useState<ProductType[]>([]);
  const [badProducts, setBadProducts] = useState<ProductType[]>([]);

  useEffect(() => {
    const good = products.filter((product) => product.supplierInfo);
    const bad = products.filter((product) => !product.supplierInfo);

    setGoodProducts(good);
    setBadProducts(bad);
  }, [products]);

  return (
    <>
      {products.length > 0 ? (
        <>
          <Button onClick={Update} className="w-fit">
            {updateIsLoading ? (
              <Icons.spinner className="animate-spin" />
            ) : null}
            Update
          </Button>
          <div
            className={`grid gap-4 ${
              expanded && badProducts.length > 0
                ? "grid-cols-[30%_30%_1fr]"
                : expanded
                ? "grid-cols-[60%_1fr]"
                : badProducts.length > 0
                ? "grid-cols-[50%_50%]"
                : null
            }`}
          >
            <div className="grid gap-2 ">
              <div className="grid max-h-[80vh] overflow-scroll divide-y divide-border border border-destructive rounded-md max-w-full ">
                <div className="h-fit p-2 flex z-10 text-lg sticky top-0 w-full bg-muted">
                  {badProducts.length}
                </div>
                {badProducts.map((product, i) => (
                  <div
                    onClick={() => setExpanded(product)}
                    key={i}
                    className="flex p-4 gap-4 items-center w-full cursor-pointer"
                  >
                    <div className="h-10 w-10 rounded-md relative overflow-hidden">
                      <Image src={product.image} alt="no image" fill />
                    </div>
                    <h1>{product.title}</h1>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-2 ">
              <div className="grid max-h-[80vh] overflow-scroll divide-y divide-border border border-green-500 rounded-md max-w-full ">
                <div className="h-fit p-2 flex z-10 text-lg sticky top-0 w-full bg-muted">
                  {goodProducts.length}
                </div>
                {goodProducts.map((product, i) => (
                  <div
                    onClick={() => setExpanded(product)}
                    key={i}
                    className="flex p-4 gap-4 items-center w-full cursor-pointer"
                  >
                    <div className="h-10 w-10 rounded-md relative overflow-hidden">
                      <Image src={product.image} alt="no image" fill />
                    </div>
                    <h1>{product.title}</h1>
                  </div>
                ))}
              </div>
            </div>
            {expanded && (
              <div
                className={`${
                  expanded?.supplierInfo
                    ? "border-green-500"
                    : "border-destructive"
                } h-full w-full border rounded-md flex flex-col p-4  items-center relative`}
              >
                <Expanded item={expanded} />
              </div>
            )}
          </div>
        </>
      ) : (
        <>loading...</>
      )}
    </>
  );
};

export default ProductManage;

const ScrapeAli = async (supplierId: string, recordId: string) => {
  try {
    const productInfoRes = await fetch(
      `${siteConfig.url}/api/scrape/aliexpress/${supplierId}`
    );

    if (!productInfoRes.ok) {
      console.error(
        `Failed to fetch info for product with ID ${supplierId}: received ${productInfoRes.status}`
      );
      return;
    }

    const productInfo = await productInfoRes.json();
    const productInfoData = {
      supplierImages: productInfo.images,
      supplierTitle: productInfo.title,
      supplierPrice: productInfo.salePrice,
    };

    const docRef = doc(collection(db, "tiktokProducts"), recordId);
    await updateDoc(docRef, {
      supplierInfo: productInfoData,
    });
  } catch (error: any) {
    console.error(
      `Failed to update product with ID ${supplierId}: ${error.message}`
    );
  }
};

interface ExpandedProps {
  item: ProductType;
}

const Expanded = ({ item }: ExpandedProps) => {
  const [scrapeLoading, setScrapeLoading] = useState(false);

  const scrape = async () => {
    setScrapeLoading(true);
    await ScrapeAli(item.supplierId, item.id);
    setScrapeLoading(false);
  };

  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const deleteProduct = async () => {
    const docRef = doc(collection(db, "tiktokProducts"), item.id);
    await deleteDoc(docRef);
  };

  return (
    <>
      <Button onClick={scrape} className="absolute top-4 right-4">
        {scrapeLoading ? <Icons.spinner className="animate-spin" /> : null}
        Scrape
      </Button>
      <Button
        onClick={deleteProduct}
        className="absolute bottom-4 right-4"
        variant={"destructive"}
      >
        Delete
      </Button>
      <LinkButton
        target="_blank"
        href={item.supplierUrl}
        className="absolute top-4 left-4"
      >
        Supplier
      </LinkButton>

      <div className="w-40 aspect-square relative overflow-hidden rounded-md">
        <Image
          src={item.image}
          alt="no image"
          fill
          sizes="(max-width: 768px) 100vw,"
        />
      </div>
      <div className="grid gap-3 w-full">
        <UpdateFieldInput item={item} field="title" />
        <UpdateFieldInput item={item} field="supplierUrl" />
        <UpdateFieldInput item={item} field="supplierId" />
        <UpdateFieldInput item={item} field="id" />
        h1
        {item.supplierInfo ? (
          <>
            <UpdateFieldInput
              item={item}
              field={"supplierInfo.supplierTitle" as any}
            />
            <UpdateFieldInput
              item={item}
              field={"supplierInfo.supplierPrice.min" as any}
            />

            <div className="grid grid-cols-4 gap-4">
              {item.supplierInfo.supplierImages.map((image, i) => (
                <div
                  key={i}
                  className="w-full aspect-square relative rounded-md overflow-hidden"
                >
                  <Image
                    src={image}
                    alt="no image"
                    fill
                    sizes="(max-width: 768px) 100vw,"
                  />
                </div>
              ))}
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this product?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteProduct}
              className="bg-red-600 focus:ring-red-600"
            >
              {isDeleteLoading ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Icons.trash className="mr-2 h-4 w-4" />
              )}
              <span>Delete</span>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

type UpdateFieldInputProps<T extends keyof ProductType> = {
  item: ProductType;
  field: T;
};

const UpdateFieldInput = <T extends keyof ProductType>({
  item,
  field,
}: UpdateFieldInputProps<T>) => {
  // Handles nested paths like 'address.city'
  const getNestedFieldValue = (object: any, path: string) =>
    path.split(".").reduce((o, k) => (o || {})[k], object);

  const [value, setValue] = useState<string>(
    getNestedFieldValue(item, field as unknown as string) || ""
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUpdated, setIsUpdated] = useState<boolean>(false);

  const updateField = async () => {
    setIsLoading(true);
    const collectionRef = collection(db, "tiktokProducts");
    const docRef = doc(collectionRef, item.id);
    await updateDoc(docRef, {
      [field]: value,
    });
    setIsLoading(false);
    setIsUpdated(true);
    setTimeout(() => setIsUpdated(false), 3000);
  };

  useEffect(() => {
    setValue(getNestedFieldValue(item, field as unknown as string));
  }, [item, field]); // Removed 'value' from dependencies

  return (
    <div className="grid gap-1 items-center w-full">
      <h1>{field}</h1>
      <div className="flex gap-2 w-full">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="border rounded-md p-2 w-full"
        />
        <Button onClick={updateField} className="w-fit">
          {isLoading ? (
            <Icons.spinner className="animate-spin" />
          ) : isUpdated ? (
            "Updated"
          ) : (
            "Update"
          )}
        </Button>
      </div>
    </div>
  );
};
