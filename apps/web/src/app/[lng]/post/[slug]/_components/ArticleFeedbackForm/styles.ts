import type { SxProps, Theme } from "@mui/material/styles";
import { semanticTokens } from "@jacky-dev/design-tokens";

export const feedbackFormLabelSx: SxProps<Theme> = {
  "&.Mui-focused": { color: semanticTokens.light.primary },
  ".dark &.Mui-focused": { color: "primary.main" },
};

export const feedbackRadioSx: SxProps<Theme> = {
  "&.Mui-checked": { color: semanticTokens.light.primary },
  ".dark &.Mui-checked": { color: "primary.main" },
};

export const feedbackTextFieldSx: SxProps<Theme> = {
  "& .MuiInputLabel-root": {
    bgcolor: "background.paper",
    px: 0.5,
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: semanticTokens.light.primary,
  },
  ".dark & .MuiInputLabel-root.Mui-focused": {
    color: "primary.main",
  },
  "& .MuiOutlinedInput-root": {
    border: "1px solid",
    borderColor: "divider",
    "&.Mui-focused": {
      borderColor: semanticTokens.light.primary,
      outline: "none",
    },
    "&.MuiInputBase-multiline": {
      height: "auto",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      border: "none",
    },
  },
  ".dark & .MuiOutlinedInput-root.Mui-focused": {
    borderColor: "primary.main",
  },
};
