import type { SxProps, Theme } from "@mui/material/styles";
import { semanticTokens } from "@jacky-dev/design-tokens";

export const feedbackPanelSx: SxProps<Theme> = {
  border: 1,
  borderColor: "divider",
  p: { xs: 2, sm: 3 },
};

export const feedbackChoiceSx: SxProps<Theme> = {
  borderColor: "divider",
  color: "text.primary",
  minHeight: 44,
  px: 2,
  bgcolor: "action.hover",
  "&:hover": {
    borderColor: "primary.main",
    bgcolor: "action.selected",
  },
  "&[data-selected='true'].Mui-disabled": {
    borderColor: "primary.main",
    bgcolor: "action.selected",
    color: "text.primary",
  },
};

export const feedbackMessageInputProps = {
  htmlInput: { maxLength: 2000 },
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
