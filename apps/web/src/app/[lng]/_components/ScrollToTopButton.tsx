"use client";

import KeyboardArrowUpRoundedIcon from "@mui/icons-material/KeyboardArrowUpRounded";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

function handleScrollToTop() {
  window.scrollTo({ behavior: "smooth", top: 0 });
}

export default function ScrollToTopButton() {
  return (
    <Tooltip title="滾動至上方">
      <IconButton
        aria-label="滾動至上方"
        color="primary"
        onClick={handleScrollToTop}
        sx={{
          bgcolor: "background.paper",
          border: 1,
          borderColor: "divider",
          bottom: { xs: 10, sm: 20 },
          boxShadow: 3,
          position: "fixed",
          right: { xs: 10, sm: 20 },
          zIndex: "speedDial",
        }}
      >
        <KeyboardArrowUpRoundedIcon />
      </IconButton>
    </Tooltip>
  );
}
