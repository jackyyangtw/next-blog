import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { signOut } from "next-auth/react";
import Stack from "@mui/material/Stack";

interface UserCardProps {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export function UserCard({ name, email, image }: UserCardProps) {
  return (
    <Card sx={{ maxWidth: 360, mx: "auto", mt: 4, p: 2 }}>
      <Stack
        direction="column"
        alignItems="center"
        justifyContent="center"
        spacing={2}
      >
        <Avatar
          src={image ?? undefined}
          sx={{ width: 80, height: 80, mb: 2 }}
        />
        <Typography variant="h6" component="div" gutterBottom>
          {name ?? "未提供名稱"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {email ?? "未提供信箱"}
        </Typography>
        <Button variant="contained" color="primary" onClick={() => signOut()}>
          登出
        </Button>
      </Stack>
    </Card>
  );
}
