// ------------- MUI -------------
import Card from "@mui/material/Card";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";

// ------------- Components -------------
import LangSwitcher from "@/components/lang/LangSwitcher";

// ------------- Hooks -------------
import { useLogout } from "@/hooks/auth/useLogout";

// ------------- i18n -------------
import { useClientTranslation } from "@/i18n/client";


interface UserCardProps {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export default function UserCard({ name, email, image }: UserCardProps) {
  const logout = useLogout();
  const { t } = useClientTranslation("auth");
  return (
    <Card
      sx={{
        maxWidth: 380,
        mx: "auto",
        p: { xs: 2, sm: 3 },
        boxShadow: 6,
        bgcolor: "background.paper",
      }}
    >
      <Stack spacing={3} alignItems="center">
        {/* 頭像與基本資料 */}
        <Box display="flex" flexDirection="column" alignItems="center">
          <Avatar
            src={image ?? undefined}
            sx={{ width: 88, height: 88, mb: 1.5, boxShadow: 2 }}
          />
          <Typography
            variant="h6"
            component="div"
            sx={{ fontWeight: 600 }}
            gutterBottom
          >
            {name ?? "未提供名稱"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {email ?? "未提供信箱"}
          </Typography>
        </Box>
        <Divider flexItem sx={{ width: "100%" }} />
        {/* 語言切換與登出按鈕 */}
        <Stack direction="row" spacing={2} width="100%" justifyContent="center">
          <LangSwitcher />
          <Button
            variant="contained"
            color="primary"
            onClick={logout}
            sx={{ minWidth: 96, fontWeight: 500 }}
          >
            {t("logout")}
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
}
