"use client";
import { Button } from "@mui/material";
import { signIn } from "next-auth/react";
import { useClientTranslation } from "@/i18n/client";
import { Google as GoogleIcon } from "@mui/icons-material";
import { useSession } from "next-auth/react";

export default function LoginButton() {
  const { t, lng } = useClientTranslation("auth-page");
  const { status } = useSession();
  const isLoading = status === "loading";
  return (
    <Button
      fullWidth
      variant="outlined"
      onClick={() => signIn("google", { callbackUrl: `/${lng}/user` })}
      startIcon={<GoogleIcon />}
      disabled={isLoading}
    >
      {t("login_with_google")}
    </Button>
  );
}
