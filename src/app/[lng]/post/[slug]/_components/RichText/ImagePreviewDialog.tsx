import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

import { urlFor } from "@/sanity/lib/image";

import { RichTextImageValue } from "./types";

interface ImagePreviewDialogProps {
  image: RichTextImageValue | null;
  open: boolean;
  onClose: () => void;
}

export function ImagePreviewDialog({
  image,
  open,
  onClose,
}: ImagePreviewDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xl"
      slotProps={{
        backdrop: {
          sx: {
            backdropFilter: "blur(8px)",
            backgroundColor: "rgba(0,0,0,0.7)",
          },
        },
        paper: {
          sx: {
            bgcolor: "#1E1E1E",
            borderRadius: 4,
            overflow: "hidden",
            position: "relative",
            boxShadow: "0 24px 48px rgba(0,0,0,0.5)",
          },
        },
      }}
    >
      {image && (
        <>
          <IconButton
            onClick={onClose}
            sx={{
              position: "absolute",
              right: 12,
              top: 12,
              color: "white",
              bgcolor: "rgba(0,0,0,0.3)",
              "&:hover": { bgcolor: "rgba(0,0,0,0.5)" },
              zIndex: 1,
            }}
          >
            <CloseIcon />
          </IconButton>

          <DialogContent
            sx={{ p: 0, display: "flex", flexDirection: "column" }}
          >
            <Box
              component="img"
              src={urlFor(image).width(1600).url()}
              alt={image.alt || ""}
              sx={{
                width: "100%",
                height: "auto",
                maxHeight: "85vh",
                objectFit: "contain",
                display: "block",
              }}
            />
            {(image.caption || image.alt) && (
              <Box sx={{ p: 2, textAlign: "center", color: "grey.400" }}>
                <Typography variant="body2">
                  {image.caption || image.alt}
                </Typography>
              </Box>
            )}
          </DialogContent>
        </>
      )}
    </Dialog>
  );
}
