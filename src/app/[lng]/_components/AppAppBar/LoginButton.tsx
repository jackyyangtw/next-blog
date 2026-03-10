import { Avatar, Button } from "@mui/material";
import NextLink from "next/link";
import { useSession } from "next-auth/react";
import { useClientTranslation } from "@/i18n/client";

export default function LoginButton() {
  const { lng } = useClientTranslation();
  const { status, data: session } = useSession();
  const isAuthenticated = status === "authenticated";
  const { t } = useClientTranslation("auth");
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
            {t("login")}
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
