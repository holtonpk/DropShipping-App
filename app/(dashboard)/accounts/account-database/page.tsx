import React from "react";
import Navbar from "@/components/nav/side-nav";
import AccountDatabase from "./account-database";
import { PageHeader } from "@/components/header";
import { siteConfig } from "@/config/site";
async function getData() {
  const url = `${siteConfig.url}/api/accountDatabase`;
  const response = await fetch(url, {
    cache: "no-cache",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch data ${url}`);
  }
  return response.json();
}

export default async function AccountDataBase() {
  const data = await getData();

  return (
    <>
      <PageHeader
        heading="Account Database"
        // text={
        //   "Browse our collection of over 500 active sellers and 1000+ accounts."
        // }
      />
      <div className="w-full border-t">
        <div className="w-full md:container  pt-6  flex flex-col min-h-screen items-center  ">
          <AccountDatabase originalData={data} />
        </div>
      </div>
    </>
  );
}
