"use client";

import {
  useActionState,
  useCallback,
  useEffect,
  useState,
  type ChangeEvent,
} from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Fade from "@mui/material/Fade";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Paper from "@mui/material/Paper";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import type { SxProps, Theme } from "@mui/material/styles";
import { useFormStatus } from "react-dom";

import {
  submitArticleFeedbackAction,
  type SubmitArticleFeedbackState,
} from "@/features/article-feedback/actions/submitArticleFeedbackAction";

interface ArticleFeedbackFormProps {
  locale: string;
  postId: string;
}

type FeedbackType = "helpful" | "notHelpful" | "suggestion";

const initialState: SubmitArticleFeedbackState = {};

const feedbackTextFieldSx: SxProps<Theme> = {
  "& .MuiInputLabel-root": {
    bgcolor: "background.paper",
    px: 0.5,
  },
  "& .MuiOutlinedInput-root": {
    border: "1px solid",
    borderColor: "divider",
    "&.Mui-focused": {
      borderColor: "primary.main",
      outline: "none",
    },
    "&.MuiInputBase-multiline": {
      height: "auto",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      border: "none",
    },
  },
};

const submitFeedbackButtonSx: SxProps<Theme> = {
  "&.Mui-disabled": {
    color: "common.black",
  },
};

function SubmitFeedbackButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      disabled={pending}
      sx={submitFeedbackButtonSx}
      type="submit"
      variant="contained"
    >
      {pending ? "送出中…" : "送出回饋"}
    </Button>
  );
}

export default function ArticleFeedbackForm({
  locale,
  postId,
}: ArticleFeedbackFormProps) {
  const [feedbackType, setFeedbackType] = useState<FeedbackType>("helpful");
  const [successNoticeVersion, setSuccessNoticeVersion] = useState(0);
  const submitFeedback = useCallback(
    async (previousState: SubmitArticleFeedbackState, formData: FormData) => {
      const nextState = await submitArticleFeedbackAction(
        previousState,
        formData,
      );

      setSuccessNoticeVersion((version) =>
        nextState.success ? version + 1 : 0,
      );

      return nextState;
    },
    [],
  );
  const [state, formAction] = useActionState(submitFeedback, initialState);
  const isSuggestion = feedbackType === "suggestion";
  const isSuccessNoticeVisible = successNoticeVersion > 0;
  const handleFeedbackTypeChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setFeedbackType(event.target.value as FeedbackType);
    },
    [],
  );

  useEffect(() => {
    if (!isSuccessNoticeVisible) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setSuccessNoticeVersion(0);
    }, 3000);

    return () => window.clearTimeout(timeoutId);
  }, [successNoticeVersion, isSuccessNoticeVisible]);

  return (
    <Paper
      component="section"
      elevation={0}
      sx={{ border: 1, borderColor: "divider", p: { xs: 2, sm: 3 } }}
    >
      <Stack spacing={2.5}>
        <Box>
          <Typography component="h2" variant="h5">
            這篇文章對你有幫助嗎？
          </Typography>
          <Typography color="text.secondary" variant="body2">
            你的意見會幫助我們持續改善內容。
          </Typography>
        </Box>

        <Box component="form" action={formAction} key={state.submissionId}>
          <input name="postId" type="hidden" value={postId} />
          <input name="locale" type="hidden" value={locale} />
          <input
            aria-hidden="true"
            autoComplete="off"
            hidden
            name="website"
            tabIndex={-1}
            type="text"
          />

          <Stack spacing={2}>
            <FormControl required>
              <FormLabel>你的看法</FormLabel>
              <RadioGroup
                name="feedbackType"
                row
                value={feedbackType}
                onChange={handleFeedbackTypeChange}
              >
                <FormControlLabel
                  control={<Radio />}
                  label="有幫助"
                  value="helpful"
                />
                <FormControlLabel
                  control={<Radio />}
                  label="沒有幫助"
                  value="notHelpful"
                />
                <FormControlLabel
                  control={<Radio />}
                  label="提供建議"
                  value="suggestion"
                />
              </RadioGroup>
            </FormControl>

            <TextField
              fullWidth
              label="想告訴我們什麼？"
              maxRows={8}
              minRows={4}
              name="message"
              required={isSuggestion}
              slotProps={{ htmlInput: { maxLength: 2000 } }}
              sx={feedbackTextFieldSx}
              multiline
            />

            {state.error ? <Alert severity="error">{state.error}</Alert> : null}
            <Fade in={isSuccessNoticeVisible} timeout={250} unmountOnExit>
              <Alert severity="success">謝謝你的回饋！</Alert>
            </Fade>

            <Box>
              <SubmitFeedbackButton />
            </Box>
          </Stack>
        </Box>
      </Stack>
    </Paper>
  );
}
