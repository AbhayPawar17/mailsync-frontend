"use client";
import { Suspense } from "react";
import RedirectComponent from "@/components/redirect/page";

export default function Redirect() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RedirectComponent />
    </Suspense>
  );
}