"use client";
import * as React from "react";

// --------------------- MUI--------------------
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
// import Checkbox from "@mui/material/Checkbox";
// import FormControlLabel from "@mui/material/FormControlLabel";
// import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";

// --------------------- Icons--------------------
import GoogleIcon from "@mui/icons-material/Google";

// --------------------- Styles--------------------
import { SignInContainer } from "./_styles/SigninContainer";
import { Card } from "./_styles/Card";

// --------------------- NextAuth--------------------
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

// --------------------- i18n--------------------
import { useClientTranslation } from "@/i18n/client";

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
