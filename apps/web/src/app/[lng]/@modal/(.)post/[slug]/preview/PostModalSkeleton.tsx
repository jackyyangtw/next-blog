"use client";

import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import Skeleton from "@mui/material/Skeleton";
import { Close as CloseIcon } from "@mui/icons-material";

export default function PostModalSkeleton() {
  const router = useRouter();

  const handleClose = () => {
    router.back();
  };

  return (
    <Dialog
      open
      onClose={handleClose}
      fullWidth
      maxWidth="lg"
      scroll="paper"
      aria-label="Loading post preview"
    >
      <DialogContent sx={{ p: { xs: 2.5, md: 4 } }}>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 4 }}>
          <IconButton aria-label="close post modal" onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            maxWidth: 1200,
            mx: "auto",
            width: "100%",
          }}
        >
          <Skeleton variant="text" width="70%" height={48} />
          <Skeleton variant="text" width="40%" height={24} />
          <Skeleton variant="rectangular" width="100%" height={320} />
          <Skeleton variant="text" width="100%" />
          <Skeleton variant="text" width="100%" />
          <Skeleton variant="text" width="85%" />
        </Box>
      </DialogContent>
    </Dialog>
  );
}
