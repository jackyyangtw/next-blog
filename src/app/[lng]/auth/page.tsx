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
import { Locale } from "@/i18n/types";

// --------------------- next/navigation--------------------
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function SignIn({
  params,
}: {
  params: Promise<{ lng: Locale }>;
}) {
  const { lng } = await params;
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
