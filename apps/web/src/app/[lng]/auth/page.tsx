// --------------------- MUI--------------------
import Box from "@mui/material/Box";

// --------------------- Styles--------------------
import { SignInContainer } from "./_styles/SigninContainer";
import { Card } from "./_styles/Card";

// --------------------- Components--------------------
import LoginButton from "./_styles/LoginButton";

// --------------------- NextAuth--------------------
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";

// --------------------- i18n--------------------
import type { Locale } from "@/i18n/types";

// --------------------- next/navigation--------------------
import { redirect } from "next/navigation";
import { connection } from "next/server";
import CircularProgress from "@mui/material/CircularProgress";
import { Suspense } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SignIn({
  params,
}: {
  params: Promise<{ lng: Locale }>;
}) {
  return (
    <Suspense fallback={<CircularProgress aria-label="Loading" />}>
      <SignInContent params={params} />
    </Suspense>
  );
}

async function SignInContent({ params }: { params: Promise<{ lng: Locale }> }) {
  const { lng } = await params;
  await connection();
  const session = await getServerSession(authOptions);
  const isAuthenticated = session?.user?.email;
  if (isAuthenticated) {
    return redirect(`/${lng}/user`);
  }
  return (
    <SignInContainer direction="column" justifyContent="space-between">
      <Card variant="outlined">
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <LoginButton />
        </Box>
      </Card>
    </SignInContainer>
  );
}
