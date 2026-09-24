"use client";

import { useFormStatus } from "react-dom";
import Button from "@mui/material/Button";
import type { SxProps, Theme } from "@mui/material/styles";

const submitFeedbackButtonSx: SxProps<Theme> = {
  "&.Mui-disabled": {
    color: "common.black",
  },
};

export default function SubmitFeedbackButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      disabled={pending}
      sx={submitFeedbackButtonSx}
      type="submit"
      variant="contained"
    >
      {pending ? "送出中…" : "送出補充"}
    </Button>
  );
}
