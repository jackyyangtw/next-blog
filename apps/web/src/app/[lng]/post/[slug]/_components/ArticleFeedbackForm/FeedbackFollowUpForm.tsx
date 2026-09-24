"use client";

import {
  useActionState,
  useCallback,
  useOptimistic,
  type ChangeEvent,
} from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import {
  submitArticleFeedbackFollowUpAction,
  type SubmitArticleFeedbackFollowUpState,
} from "@/features/article-feedback/actions/submitArticleFeedbackFollowUpAction";
import SubmitFeedbackButton from "./SubmitFeedbackButton";
import { feedbackMessageInputProps, feedbackTextFieldSx } from "./styles";

interface FeedbackFollowUpFormProps {
  followUpToken: string;
  message: string;
  onMessageChange: (event: ChangeEvent<HTMLInputElement>) => void;
  submissionId: string;
}

const initialState: SubmitArticleFeedbackFollowUpState = {};

export default function FeedbackFollowUpForm({
  followUpToken,
  message,
  onMessageChange,
  submissionId,
}: FeedbackFollowUpFormProps) {
  const [state, dispatchAction] = useActionState(
    submitArticleFeedbackFollowUpAction,
    initialState,
  );
  const [optimisticSuccess, setOptimisticSuccess] = useOptimistic(
    state.success ?? false,
  );
  const submitFollowUp = useCallback(
    async (formData: FormData) => {
      setOptimisticSuccess(true);
      return dispatchAction(formData);
    },
    [dispatchAction, setOptimisticSuccess],
  );

  if (optimisticSuccess) {
    return (
      <Alert severity="success" role="status">
        {state.success ? "補充意見已送出，謝謝！" : "正在送出補充意見…"}
      </Alert>
    );
  }

  return (
    <Box component="form" action={submitFollowUp}>
      <input name="submissionId" type="hidden" value={submissionId} />
      <input name="followUpToken" type="hidden" value={followUpToken} />
      <input
        aria-hidden="true"
        autoComplete="off"
        hidden
        name="website"
        tabIndex={-1}
        type="text"
      />

      <Stack alignItems="flex-start" spacing={2}>
        <Typography color="text.secondary">想補充什麼嗎？（選填）</Typography>
        <TextField
          fullWidth
          label="補充意見"
          maxRows={8}
          minRows={3}
          name="message"
          onChange={onMessageChange}
          required
          slotProps={feedbackMessageInputProps}
          sx={feedbackTextFieldSx}
          value={message}
          multiline
        />
        {state.error ? <Alert severity="error">{state.error}</Alert> : null}
        <SubmitFeedbackButton />
      </Stack>
    </Box>
  );
}
