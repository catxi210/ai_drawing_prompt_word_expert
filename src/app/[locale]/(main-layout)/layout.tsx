import React from "react";
import SignInForm from "@/components/forms/auth";
import AppLogo from "@/components/global/app-logo";
import { Lock } from "lucide-react";
import AppFooter from "@/components/global/app-footer";
import HomeHeader from "@/components/home/header";
const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen flex-col">
      <HomeHeader className="mb-4 mt-6 h-12" />
      <main className="flex min-h-0 flex-1 flex-col">{children}</main>
      <AppFooter className="h-14" />
    </div>
  );
};

export default layout;
