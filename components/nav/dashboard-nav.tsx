"use client";
import Link from "next/link";
import React, { useEffect, useState, useRef } from "react";
import { dashboardNavigation } from "@/config/dashboard";
import { SideNavRoute, SubRoute as SubRouteType } from "@/types";
import { useSelectedLayoutSegment } from "next/navigation";
import { Icons } from "@/components/icons";
import { AccountInfo } from "@/components/account-preview";
import { useAuth } from "@/context/user-auth";
import { marketingConfig } from "@/config/marketing";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Feedback from "@/components/modals/feedback-modal";
import { siteConfig } from "@/config/site";

import Image from "next/image";
const DashboardNav = () => {
  const segment = useSelectedLayoutSegment();
  const [collapseNav, setCollapseNav] = useState(false);

  const handleScroll = () => {
    const position = window.pageYOffset;
    if (position > 79) {
      setCollapseNav(true);
    } else {
      setCollapseNav(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="md:block hidden">
      <div className="w-screen h-20  justify-between px-6 z-40 relative flex">
        <Link href="/" className=" items-center space-x-2 flex w-fit">
          <span className="text-2xl p-2 text-primary font-bold  flex items-center ">
            <div className="h-8 w-8 relative">
              <Image src="/image/circleLogo.png" alt="logo" fill />
            </div>
            <span className="ml-1 text-transparent bg-clip-text bg-gradient-to-r from-[#F66896] to-[#7640DF]">
              {siteConfig.name}
            </span>
          </span>
        </Link>
        <div className="w-fit flex gap-4 items-center relative">
          <Feedback />
          {marketingConfig.mainNav?.length ? (
            <nav className="hidden gap-6 md:flex">
              {marketingConfig.mainNav?.map((item, index) => (
                <Link
                  key={index}
                  href={item.disabled ? "#" : item.href}
                  className={cn(
                    "flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm",
                    item.href.startsWith(`/${segment}`)
                      ? "text-foreground"
                      : "text-foreground/60",
                    item.disabled && "cursor-not-allowed opacity-80"
                  )}
                >
                  {item.title}
                </Link>
              ))}
            </nav>
          ) : null}
          <AccountInfo />
        </div>
      </div>
      <span className={` h-12  w-screen ${collapseNav ? "block" : "hidden"}`} />

      <nav
        className={` px-4  w-screen z-[35]  h-12 bg-background  flex items-center  left-0 
      ${
        collapseNav
          ? "fixed top-0  z-[45] shadow-sm dark:border-b"
          : "relative border-b"
      }
      `}
      >
        <div
          id="row"
          className={`h-fit  flex items-center  transition-all justify-end duration-[800ms] 
          ${collapseNav ? "w-[590px]" : "w-[555px]"}
          `}
        >
          {collapseNav ? (
            <Link href="/" className=" items-center space-x-2 flex fade-in2">
              <div className="h-8 w-8 relative">
                <Image src="/image/circleLogo.png" alt="logo" fill />
              </div>
            </Link>
          ) : null}

          <NavigationMenuBar />
        </div>
      </nav>
    </div>
  );
};

export default DashboardNav;

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

export function NavigationMenuBar() {
  const { currentUser } = useAuth()!;

  return (
    <NavigationMenu>
      <NavigationMenuList>
        {dashboardNavigation.routes.map((route, indx) => (
          <NavigationMenuItem
            key={indx}
            className={`${
              route?.disabled && "cursor-not-allowed  pointer-events-none"
            }`}
          >
            {route.subPages ? (
              <>
                <NavigationMenuTrigger>
                  {route.title}
                  {route?.disabled && (
                    <div className="border p-1 opacity-100  rounded-md ml-2 text-[8px] leading-[8px] text-theme-blue border-theme-blue">
                      Coming soon
                    </div>
                  )}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px]  lg:w-[600px] lg:grid-cols-[.75fr_1fr]  ">
                    {route.subPages.map((subPage) => (
                      <SubRoute
                        key={subPage.title}
                        item={subPage}
                        currentUser={currentUser}
                      />
                    ))}
                  </ul>
                </NavigationMenuContent>
              </>
            ) : (
              <MainRoute route={route} currentUser={currentUser} />
            )}
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const MainRoute = ({
  route,
  currentUser,
}: {
  route: SideNavRoute;
  currentUser: any;
}) => {
  const href =
    typeof route.links === "string"
      ? route.links
      : route.links.find(
          (link) => link.requiredSubscription === currentUser?.userPlan
        )?.href;

  return (
    <Link href={href || "/#"} legacyBehavior passHref>
      <NavigationMenuLink className={navigationMenuTriggerStyle()}>
        {route.title}
        {route?.disabled && (
          <div className="border p-1 opacity-100  rounded-md ml-2 text-[8px] leading-[8px] text-theme-blue border-theme-blue">
            Coming soon
          </div>
        )}
      </NavigationMenuLink>
    </Link>
  );
};

const SubRoute = ({
  item,
  currentUser,
}: {
  item: SubRouteType;
  currentUser: any;
}) => {
  const Icon = Icons[item.icon];

  if (!Icon) {
    return null;
  }

  console.log("currentUser?.userPlan", currentUser);

  const href =
    typeof item.links === "string"
      ? item.links
      : item.links.find(
          (link) => link.requiredSubscription === currentUser?.userPlan.tier
        )?.href;

  console.log("href", href, item.links);

  return (
    <>
      {item?.featured ? (
        <NavigationMenuLink asChild>
          <a
            href={href}
            className={`row-span-3 bg-muted/20 flex h-full text-primary gap- w-full select-none flex-col justify-end rounded-md  hover:bg-muted {bgGradient} p-6 no-underline outline-none focus:shadow-md`}
          >
            <div className="bg-blue-500/30 bg-opacity-30 text-theme-blue aspect-square h-10 w-10 rounded-md flex items-center justify-center">
              <Icon className="h-6 w-6 " />
            </div>
            <div className=" text-lg font-medium text-primary ">
              {item.title}
            </div>
            <p className="text-sm leading-tight  text-primary">
              {item.description}
            </p>
          </a>
        </NavigationMenuLink>
      ) : (
        <NavigationMenuLink asChild>
          <a
            href={href}
            className={`grid grid-cols-[40px_1fr]  gap-2  items-start hover:bg-muted p-2 rounded-md relative
            ${item.disabled && "cursor-not-allowed  pointer-events-none"}
            `}
          >
            <div className="bg-blue-500/30 bg-opacity-30 text-theme-blue aspect-square h-10 w-10 rounded-md flex items-center justify-center">
              <Icon className="h-6 w-6 " />
            </div>
            <div className="grid items-start text-left gap-1">
              <div className="text-sm font-medium text-primary leading-none  flex items-center gap-2 ">
                {item.title}
                {item.disabled && (
                  <div className="border p-1 opacity-100 w-fit  rounded-md text-[8px] leading-[8px] text-theme-blue border-theme-blue">
                    Coming soon
                  </div>
                )}
              </div>
              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                {item.description}
              </p>
            </div>
          </a>
        </NavigationMenuLink>
      )}
    </>
  );
};
