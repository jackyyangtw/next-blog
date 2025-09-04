"use client";
import * as React from "react";

// --------------------- MUI--------------------
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

// --------------------- Icons--------------------
import GoogleIcon from "@mui/icons-material/Google";

// --------------------- Styles--------------------
import { SignInContainer } from "./_styles/SigninContainer";
import { Card } from "./_styles/Card";

// --------------------- NextAuth--------------------
import { signIn } from "next-auth/react";

export default function SignIn() {
  return (
    <SignInContainer direction="column" justifyContent="space-between">
      <Card variant="outlined">
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => signIn("google", { callbackUrl: "/user" })}
            startIcon={<GoogleIcon />}
          >
            使用 Google 登入
          </Button>
        </Box>
      </Card>
    </SignInContainer>
  );
}
