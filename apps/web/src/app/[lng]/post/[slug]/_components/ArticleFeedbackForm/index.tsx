"use client";

import { useActionState, useCallback, useState, type ChangeEvent } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import {
  submitArticleFeedbackAction,
  type SubmitArticleFeedbackState,
} from "@/features/article-feedback/actions/submitArticleFeedbackAction";
import FeedbackChoiceButtons from "./FeedbackChoiceButtons";
import FeedbackFollowUpForm from "./FeedbackFollowUpForm";
import { feedbackPanelSx } from "./styles";

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
  const handleMessageChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => setMessage(event.target.value),
    [],
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

          <Box aria-busy={isPending} component="form" action={dispatchAction}>
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

            <FeedbackChoiceButtons />
          </Box>

          {state.error && !isPending ? (
            <Alert severity="error">{state.error}</Alert>
          ) : null}
        </Stack>
      )}
    </Paper>
  );
}
