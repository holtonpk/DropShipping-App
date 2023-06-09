// "use client";
// import * as React from "react";
// import Link from "next/link";
// import { useSelectedLayoutSegment } from "next/navigation";
// import { MainNavItem } from "@/types";
// import { siteConfig } from "@/config/site";
// import { cn } from "@/lib/utils";
// import MobileNav from "@/components/nav/mobile-main-nav";
// import { Icons } from "@/components/icons";
// import Image from "next/image";

// interface MainNavProps {
//   items?: MainNavItem[];
//   children?: React.ReactNode;
// }

// export function MainNav({ items, children }: MainNavProps) {
//   const segment = useSelectedLayoutSegment();
//   const [showMobileMenu, setShowMobileMenu] = React.useState<boolean>(false);

//   return (
//     <div className="flex justify-between md:justify-start w-full items-center sticky  md:gap-10 ">
//       <Link href="/" className=" items-center space-x-2 flex w-fit">
//         <span className="text-2xl p-2 text-primary font-bold  flex items-center ">
//           <div className="h-8 w-8 relative">
//             <Image
//               src="/image/circleLogo.png"
//               alt="logo"
//               fill
//               objectFit="contain"
//             />
//           </div>
//           <span className="ml-1 text-transparent bg-clip-text bg-gradient-to-r from-[#F66896] to-[#7640DF]">
//             {siteConfig.name}
//           </span>
//         </span>
//       </Link>
// {items?.length ? (
//   <nav className="hidden gap-6 md:flex">
//     {items?.map((item, index) => (
//       <Link
//         key={index}
//         href={item.disabled ? "#" : item.href}
//         className={cn(
//           "flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm",
//           item.href.startsWith(`/${segment}`)
//             ? "text-foreground"
//             : "text-foreground/60",
//           item.disabled && "cursor-not-allowed opacity-80"
//         )}
//       >
//         {item.title}
//       </Link>
//     ))}
//   </nav>
// ) : null}

//       {/* <button
//         className="flex items-center space-x-2 md:hidden"
//         onClick={() => setShowMobileMenu(!showMobileMenu)}
//       >
//         {showMobileMenu ? <Icons.close /> : <Icons.menu />}
//         <span className="font-bold"></span>
//       </button> */}
//       {/* {showMobileMenu && items && <MobileNav />} */}
//       <MobileNav />
//     </div>
//   );
// }

"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams, useSelectedLayoutSegment } from "next/navigation";
import useScroll from "@/lib/hooks/use-scroll";
import clsx from "clsx";
import { siteConfig } from "@/config/site";
import { LinkButton } from "@/components/ui/link";
import { marketingConfig } from "@/config/marketing";
import { cn } from "@/lib/utils";

const navItems = ["pricing", "changelog"];

const transparentHeaderSegments = new Set(["metatags", "pricing"]);

export default function Nav() {
  const { domain = "dub.sh" } = useParams() as { domain: string };

  const scrolled = useScroll(20);
  const segment = useSelectedLayoutSegment();

  return (
    <div
      className={clsx(`sticky inset-x-0 top-0 z-30 w-full transition-all`, {
        "border-b-border border-b bg-background/75 backdrop-blur-lg": scrolled,
        "border-b-border border-b bg-background":
          segment && !transparentHeaderSegments.has(segment),
      })}
    >
      <div className="mx-auto w-full max-w-screen-xl px-2.5 md:px-20">
        <div className="flex h-20 items-center justify-between w-full">
          <div className="flex justify-between md:justify-start w-full items-center sticky  md:gap-10 ">
            <Link
              href={
                domain === "dub.sh"
                  ? "/"
                  : `https://dub.sh?utm_source=${domain}&utm_medium=referral&utm_campaign=custom-domain`
              }
            >
              <span className="text-2xl p-2 text-primary font-bold  flex items-center ">
                <div className="h-8 w-8 relative">
                  {" "}
                  <Image
                    src="/image/circleLogo.png"
                    alt="logo"
                    fill
                    objectFit="contain"
                  />
                </div>
                <span className="ml-1 text-transparent bg-clip-text bg-gradient-to-r from-[#F66896] to-[#7640DF]">
                  {siteConfig.name}
                </span>
              </span>
            </Link>

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
          </div>

          <div className="hidden items-center space-x-6 sm:flex">
            <LinkButton
              href="/login"
              variant="outline"
              size="sm"
              className="px-4 mr-2 whitespace-nowrap"
            >
              Login
            </LinkButton>
            <LinkButton
              href="/onboarding/register"
              variant="default"
              size="sm"
              className="px-4 whitespace-nowrap"
            >
              Sign up
            </LinkButton>
          </div>
        </div>
      </div>
    </div>
  );
}
