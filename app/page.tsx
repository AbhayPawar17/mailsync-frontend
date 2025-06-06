"use client"

import { usePathname } from "next/navigation"
import AIEmailLandingPage from "./landing-page/page"
import TaskManagementApp from "./dashboard/page"

export default function App() {

    const pathname = usePathname();

  return (
    <>
    {pathname === "/" && (
      <AIEmailLandingPage/> )}

    {pathname === "/dashboard" && ( 
      <TaskManagementApp/>)}
    </>
  )
}
