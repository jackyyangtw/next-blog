// react-joyride
import { TooltipRenderProps } from "react-joyride";

// ------------------ mui ----------------
import { useTheme } from "@mui/material";
import {
  Box,
  Button,
  IconButton,
  Paper,
  Typography,
  LinearProgress,
  Fade,
} from "@mui/material";
import {
  Close as CloseIcon,
  ChevronRight as ChevronRightIcon,
  ChevronLeft as ChevronLeftIcon,
  Check as CheckIcon,
} from "@mui/icons-material";

// ------------------ animations ----------------
import { FADE_IN_ANIMATION_DURATION } from "./Animations";

export default function Tooltip({
  index,
  step,
  backProps,
  closeProps,
  primaryProps,
  skipProps,
  isLastStep,
  size,
  tooltipProps,
}: TooltipRenderProps) {
  const theme = useTheme();

  return (
    <Fade in={true} timeout={FADE_IN_ANIMATION_DURATION}>
      <Paper
        {...tooltipProps}
        elevation={8}
        sx={{
          maxWidth: 400,
          p: 3,
          borderRadius: 3,
          position: "relative",
          bgcolor: "background.paper",
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box
          sx={{
            mb: 1.5,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="overline"
            sx={{
              fontWeight: 800,
              color: "primary.dark",
              letterSpacing: 1.2,
            }}
          >
            教學指引 {index + 1} / {size}
          </Typography>
          <IconButton
            size="small"
            {...closeProps}
            sx={{
              color: "text.secondary",
              "&:hover": { bgcolor: "action.hover" },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <Box sx={{ mb: 2.5 }}>
          {typeof step.content === "string" ? (
            <Typography
              variant="body1"
              sx={{ color: "text.primary", lineHeight: 1.6 }}
            >
              {step.content}
            </Typography>
          ) : (
            step.content
          )}
        </Box>

        {size > 1 && (
          <LinearProgress
            variant="determinate"
            value={((index + 1) / size) * 100}
            sx={(theme) => ({
              mb: 3,
              borderRadius: 1,
              height: 6,
              bgcolor: "action.disabledBackground",
              "& .MuiLinearProgress-bar": {
                borderRadius: 1,
                bgcolor: theme.palette.primary.dark,
              },
            })}
          />
        )}

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Button
            size="small"
            {...skipProps}
            sx={{
              color: "text.secondary",
              fontWeight: 600,
              textTransform: "none",
            }}
          >
            略過
          </Button>
          <Box sx={{ display: "flex", gap: 1.5 }}>
            {index > 0 && (
              <Button
                size="small"
                variant="outlined"
                startIcon={<ChevronLeftIcon />}
                {...backProps}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                上一步
              </Button>
            )}
            <Button
              size="small"
              variant="contained"
              endIcon={isLastStep ? <CheckIcon /> : <ChevronRightIcon />}
              {...primaryProps}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                px: 3,
                boxShadow: theme.shadows[4],
                "&:hover": {
                  boxShadow: theme.shadows[8],
                },
              }}
            >
              {isLastStep ? "完成" : "下一步"}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Fade>
  );
}
