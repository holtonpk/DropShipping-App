import { AuthProvider } from "@/context/Auth";
import { siteConfig } from "@/config/site";
interface AuthLayoutProps {
  children: React.ReactElement;
}
import Link from "next/link";
import Background from "@/components/background";

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <AuthProvider>
      <Link
        href="/"
        className=" items-center space-x-2 flex w-fit absolute top-4 left-4 "
      >
        <span className="text-base p-2 text-primary font-bold inline-block ">
          <span className=" text-primary">{siteConfig.name}</span>
          .io
        </span>
      </Link>

      {children}
      <Background />
    </AuthProvider>
  );
}
