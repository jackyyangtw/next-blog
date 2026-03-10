import { Avatar, Button } from "@mui/material";
import NextLink from "next/link";
import { useSession } from "next-auth/react";

export default function LoginButton() {
  const { status, data: session } = useSession();
  const isAuthenticated = status === "authenticated";
  return (
    <>
      {!isAuthenticated && (
        <NextLink href="/auth">
          <Button
            color="primary"
            variant="text"
            size="small"
            data-tour="auth-entry"
          >
            登入
          </Button>
        </NextLink>
      )}
      {isAuthenticated && (
        <Button
          href="/user"
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
