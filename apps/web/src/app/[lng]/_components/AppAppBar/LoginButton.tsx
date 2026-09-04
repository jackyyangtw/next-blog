import { Avatar, Button } from "@mui/material";
import NextLink from "next/link";
import { useSession } from "next-auth/react";
import type { Locale } from "@/i18n/types";

export default function LoginButton({
  lng,
  loginLabel,
}: {
  lng: Locale;
  loginLabel: string;
}) {
  const { status, data: session } = useSession();
  const isAuthenticated = status === "authenticated";
  return (
    <>
      {!isAuthenticated && (
        <NextLink href={`/${lng}/auth`}>
          <Button
            color="primary"
            variant="text"
            size="small"
            data-tour="auth-entry"
          >
            {loginLabel}
          </Button>
        </NextLink>
      )}
      {isAuthenticated && (
        <Button
          href={`/${lng}/user`}
          component={NextLink}
          sx={{ minWidth: "unset", p: 0, borderRadius: "100%" }}
          data-tour="auth-entry"
        >
          <Avatar src={session?.user?.image || ""} />
        </Button>
      )}
    </>
  );
}
