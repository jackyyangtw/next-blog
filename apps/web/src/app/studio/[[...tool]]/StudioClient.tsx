"use client";

import dynamic from "next/dynamic";

import ReactQueryProvider from "@/Providers/react-query";
import config from "../../../../sanity.config";

const NextStudio = dynamic(
  () => import("next-sanity/studio").then((mod) => mod.NextStudio),
  { ssr: false },
);

export function StudioClient() {
  return (
    <ReactQueryProvider>
      <NextStudio config={config} />
    </ReactQueryProvider>
  );
}
