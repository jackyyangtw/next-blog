"use client";

import {
  useActionState,
  useCallback,
  useOptimistic,
  useState,
  type ChangeEvent,
} from "react";
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
  const [state, dispatchAction] = useActionState(
    submitArticleFeedbackAction,
    initialState,
  );
  const [optimisticSuccess, setOptimisticSuccess] = useOptimistic(
    state.success ?? false,
  );
  const handleMessageChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => setMessage(event.target.value),
    [],
  );

  const submitVote = useCallback(
    async (formData: FormData) => {
      setOptimisticSuccess(true);
      return dispatchAction(formData);
    },
    [dispatchAction, setOptimisticSuccess],
  );

  return (
    <Paper component="section" elevation={0} sx={feedbackPanelSx}>
      {optimisticSuccess ? (
        <Stack spacing={2}>
          <Typography
            aria-live="polite"
            component="h2"
            variant="h6"
            fontWeight={700}
          >
            感謝回饋！
          </Typography>
          <FeedbackFollowUpForm
            followUpToken={state.followUpToken}
            message={message}
            onMessageChange={handleMessageChange}
            submissionId={state.submissionId}
          />
        </Stack>
      ) : (
        <Stack spacing={2}>
          <Typography component="h2" variant="h6" fontWeight={700}>
            這篇文章有幫助嗎？
          </Typography>

          <Box component="form" action={submitVote}>
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
                disabled={optimisticSuccess}
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
                disabled={optimisticSuccess}
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

          {state.error ? <Alert severity="error">{state.error}</Alert> : null}
        </Stack>
      )}
    </Paper>
  );
}
