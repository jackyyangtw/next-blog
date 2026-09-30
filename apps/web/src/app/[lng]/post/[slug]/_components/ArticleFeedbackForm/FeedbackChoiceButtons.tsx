"use client";

import ThumbDownRoundedIcon from "@mui/icons-material/ThumbDownRounded";
import ThumbUpRoundedIcon from "@mui/icons-material/ThumbUpRounded";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { useFormStatus } from "react-dom";

import { feedbackChoiceSx } from "./styles";

export default function FeedbackChoiceButtons() {
  const { data, pending } = useFormStatus();
  const selectedVote = data?.get("feedbackType");
  const isHelpfulPending = pending && selectedVote === "helpful";
  const isNotHelpfulPending = pending && selectedVote === "notHelpful";

  return (
    <Stack direction="row" flexWrap="wrap" gap={1.5}>
      <Button
        data-selected={isHelpfulPending}
        disabled={pending}
        loading={isHelpfulPending}
        loadingPosition="start"
        name="feedbackType"
        startIcon={<ThumbUpRoundedIcon aria-hidden="true" />}
        sx={feedbackChoiceSx}
        type="submit"
        value="helpful"
        variant="outlined"
      >
        {isHelpfulPending ? "送出中…" : "有幫助"}
      </Button>
      <Button
        data-selected={isNotHelpfulPending}
        disabled={pending}
        loading={isNotHelpfulPending}
        loadingPosition="start"
        name="feedbackType"
        startIcon={<ThumbDownRoundedIcon aria-hidden="true" />}
        sx={feedbackChoiceSx}
        type="submit"
        value="notHelpful"
        variant="outlined"
      >
        {isNotHelpfulPending ? "送出中…" : "沒幫助"}
      </Button>
    </Stack>
  );
}
