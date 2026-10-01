import { rem } from "../homeStyles";
import { primitiveTokens } from "@jacky-dev/design-tokens";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Image from "next/image";

export default function AuthorProfile({ exploring }: { exploring: string }) {
  return (
    <Box
      component="aside"
      aria-label="Jacky Yang"
      sx={{
        minWidth: 0,
        p: {
          xs: rem(primitiveTokens.space.md),
          sm: rem(primitiveTokens.space.lg),
        },
        bgcolor: "action.hover",
        borderRadius: rem(primitiveTokens.radius.sm),
        display: "grid",
        gridTemplateColumns: {
          xs: "64px minmax(0, 1fr)",
          sm: "minmax(0, 1fr)",
        },
        alignItems: "center",
        gap: rem(primitiveTokens.space.md),
        textAlign: { xs: "left", sm: "center" },
      }}
    >
      <Box
        sx={{
          justifySelf: "center",
          width: { xs: 64, sm: 96, md: 128, lg: 160 },
          height: { xs: 64, sm: 96, md: 128, lg: 160 },
          position: "relative",
          borderRadius: rem(primitiveTokens.radius.full),
          overflow: "clip",
        }}
      >
        <Image
          src="/images/avatar.png"
          alt="Jacky Yang"
          fill
          loading="eager"
          sizes="(max-width: 599px) 64px, (max-width: 899px) 96px, (max-width: 1199px) 128px, 160px"
          style={{ objectFit: "cover" }}
        />
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography
          component="p"
          sx={{
            fontSize: rem(primitiveTokens.typography.small),
            fontWeight: 600,
          }}
        >
          Jacky Yang
        </Typography>
        <Typography
          component="p"
          sx={{
            fontSize: rem(primitiveTokens.typography.small),
            color: "text.secondary",
            lineHeight: 1.7,
          }}
        >
          Frontend Engineer
        </Typography>
        <Typography
          component="p"
          sx={{
            fontFamily: primitiveTokens.fontFamily.monospace.join(", "),
            fontSize: rem(primitiveTokens.typography.caption),
            color: "text.secondary",
            mt: rem(primitiveTokens.space.md),
            mb: rem(primitiveTokens.space.xs),
          }}
        >
          {exploring}
        </Typography>
        <Typography
          component="p"
          sx={{
            fontSize: rem(primitiveTokens.typography.caption),
            color: "text.secondary",
            lineHeight: 1.7,
          }}
        >
          Next.js · React · Web&nbsp;Architecture
        </Typography>
      </Box>
    </Box>
  );
}
