import UserPageClient from "./_components/Client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import CircularProgress from "@mui/material/CircularProgress";
import { Suspense } from "react";
import type { Locale } from "@/i18n/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "User",
  robots: {
    index: false,
    follow: false,
  },
};

export default function UserPage({
  params,
}: {
  params: Promise<{ lng: Locale }>;
}) {
  return (
    <Suspense fallback={<CircularProgress aria-label="Loading" />}>
      <UserPageContent params={params} />
    </Suspense>
  );
}

async function UserPageContent({
  params,
}: {
  params: Promise<{ lng: Locale }>;
}) {
  const { lng } = await params;
  await connection();
  const session = await getServerSession(authOptions);
  const isAuthenticated = session?.user?.email;
  if (!isAuthenticated) {
    return redirect(`/${lng}/auth`);
  }
  return <UserPageClient />;
}
