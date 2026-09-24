"use client";

import { useActionState, useCallback, useState, type ChangeEvent } from "react";
import ThumbDownRoundedIcon from "@mui/icons-material/ThumbDownRounded";
import ThumbUpRoundedIcon from "@mui/icons-material/ThumbUpRounded";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import {
  submitArticleFeedbackAction,
  type SubmitArticleFeedbackState,
} from "@/features/article-feedback/actions/submitArticleFeedbackAction";
import FeedbackFollowUpForm from "./FeedbackFollowUpForm";
import { feedbackChoiceSx, feedbackPanelSx } from "./styles";

interface ArticleFeedbackFormProps {
  locale: string;
  postId: string;
}

const initialState: SubmitArticleFeedbackState = {};

export default function ArticleFeedbackForm({
  locale,
  postId,
}: ArticleFeedbackFormProps) {
  const [message, setMessage] = useState("");
  const [state, dispatchAction, isPending] = useActionState(
    submitArticleFeedbackAction,
    initialState,
  );
  const [selectedVote, setSelectedVote] = useState<
    "helpful" | "notHelpful" | null
  >(null);
  const handleMessageChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => setMessage(event.target.value),
    [],
  );

  const submitVote = useCallback(
    async (formData: FormData) => {
      const feedbackType = formData.get("feedbackType");
      if (feedbackType === "helpful" || feedbackType === "notHelpful") {
        setSelectedVote(feedbackType);
      }
      return dispatchAction(formData);
    },
    [dispatchAction],
  );

  return (
    <Paper component="section" elevation={0} sx={feedbackPanelSx}>
      {state.success ? (
        <Stack spacing={2}>
          <Typography
            aria-live="polite"
            component="h2"
            variant="h6"
            fontWeight={700}
          >
            感謝回饋！
          </Typography>
          {state.followUpToken && state.submissionId ? (
            <FeedbackFollowUpForm
              followUpToken={state.followUpToken}
              message={message}
              onMessageChange={handleMessageChange}
              submissionId={state.submissionId}
            />
          ) : null}
        </Stack>
      ) : (
        <Stack spacing={2}>
          <Typography component="h2" variant="h6" fontWeight={700}>
            這篇文章有幫助嗎？
          </Typography>

          <Box aria-busy={isPending} component="form" action={submitVote}>
            <input name="postId" type="hidden" value={postId} />
            <input name="locale" type="hidden" value={locale} />
            <input name="message" type="hidden" value="" />
            <input
              aria-hidden="true"
              autoComplete="off"
              hidden
              name="website"
              tabIndex={-1}
              type="text"
            />

            <Stack direction="row" flexWrap="wrap" gap={1.5}>
              <Button
                data-selected={isPending && selectedVote === "helpful"}
                disabled={isPending}
                name="feedbackType"
                startIcon={<ThumbUpRoundedIcon aria-hidden="true" />}
                sx={feedbackChoiceSx}
                type="submit"
                value="helpful"
                variant="outlined"
              >
                有幫助
              </Button>
              <Button
                data-selected={isPending && selectedVote === "notHelpful"}
                disabled={isPending}
                name="feedbackType"
                startIcon={<ThumbDownRoundedIcon aria-hidden="true" />}
                sx={feedbackChoiceSx}
                type="submit"
                value="notHelpful"
                variant="outlined"
              >
                沒幫助
              </Button>
            </Stack>
          </Box>

          {state.error && !isPending ? (
            <Alert severity="error">{state.error}</Alert>
          ) : null}
        </Stack>
      )}
    </Paper>
  );
}
