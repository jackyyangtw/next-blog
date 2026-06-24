import UserPageClient from "./_components/Client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { Locale } from "@/i18n/types";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "User",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function UserPage({
  params,
}: {
  params: Promise<{ lng: Locale }>;
}) {
  const { lng } = await params;
  const session = await getServerSession(authOptions);
  const isAuthenticated = session?.user?.email;
  if (!isAuthenticated) {
    return redirect(`/${lng}/auth`);
  }
  return <UserPageClient />;
}
