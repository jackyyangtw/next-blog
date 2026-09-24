"use client";

import {
  startTransition,
  useActionState,
  useCallback,
  useEffect,
  useOptimistic,
  useRef,
  useState,
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
  followUpToken?: string;
  message: string;
  onMessageChange: (event: ChangeEvent<HTMLInputElement>) => void;
  submissionId?: string;
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
  const queuedFormData = useRef<FormData | null>(null);
  const [hasQueuedSubmission, setHasQueuedSubmission] = useState(false);
  const canSubmit = Boolean(submissionId && followUpToken);

  useEffect(() => {
    if (!submissionId || !followUpToken) return;

    const queued = queuedFormData.current;
    if (!queued) return;

    queuedFormData.current = null;
    queued.set("submissionId", submissionId);
    queued.set("followUpToken", followUpToken);
    startTransition(() => dispatchAction(queued));
  }, [dispatchAction, followUpToken, submissionId]);

  const submitFollowUp = useCallback(
    async (formData: FormData) => {
      if (!canSubmit) {
        queuedFormData.current = formData;
        setHasQueuedSubmission(true);
        return;
      }

      setHasQueuedSubmission(false);
      setOptimisticSuccess(true);
      return dispatchAction(formData);
    },
    [canSubmit, dispatchAction, setOptimisticSuccess],
  );

  if (optimisticSuccess || (hasQueuedSubmission && !state.error)) {
    return (
      <Alert severity="success" role="status">
        {state.success ? "補充意見已送出，謝謝！" : "正在送出補充意見…"}
      </Alert>
    );
  }

  return (
    <Box component="form" action={submitFollowUp}>
      <input name="submissionId" type="hidden" value={submissionId ?? ""} />
      <input name="followUpToken" type="hidden" value={followUpToken ?? ""} />
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
