"use client";

import { usePathname } from "next/navigation";
import AIEmailLandingPage from "./landing-page/page";
import SyncMail from "./sync-mail/page";
import Dashboard from "./dashboard/page";

export default function App() {
  const pathname = usePathname();

  return (
    <>
      {pathname === "/" && <AIEmailLandingPage />}
      {pathname === "/sync-mail" && <SyncMail />}
      {pathname === "/dashboard" && <Dashboard />}
    </>
  );
}
