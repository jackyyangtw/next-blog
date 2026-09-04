/**
 * This route is responsible for the built-in authoring environment using Sanity Studio.
 * All routes under your studio path is handled by this file using Next.js' catch-all routes:
 * https://nextjs.org/docs/routing/dynamic-routes#catch-all-routes
 *
 * You can learn more about the next-sanity package here:
 * https://github.com/sanity-io/next-sanity
 */

import { Suspense } from "react";
import { StudioClient } from "./StudioClient";

export { metadata, viewport } from "next-sanity/studio";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { connection } from "next/server";

// export const dynamic = 'force-static'

async function StudioContent() {
  // studio 是管理後台，必須等到 request 才能判斷 session/權限，避免 prerender 階段報錯
  await connection();
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin") {
    redirect("/");
  }
  return <StudioClient />;
}

export default function StudioPage() {
  return (
    <Suspense fallback={null}>
      <StudioContent />
    </Suspense>
  );
}
