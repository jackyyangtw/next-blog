import { Avatar, Button } from "@mui/material";
import NextLink from "next/link";
import { useSession } from "next-auth/react";
import type { Locale } from "@/i18n/types";

// 登入入口不對讀者公開，只在已登入時顯示頭像（登入請直接前往 /[lng]/auth）
export default function LoginButton({ lng }: { lng: Locale }) {
  const { status, data: session } = useSession();
  if (status !== "authenticated") return null;
  return (
    <Button
      href={`/${lng}/user`}
      component={NextLink}
      sx={{ minWidth: "unset", p: 0, borderRadius: "100%" }}
      data-tour="auth-entry"
    >
      <Avatar src={session?.user?.image || ""} />
    </Button>
  );
}
