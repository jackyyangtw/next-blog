import { useColorScheme } from "@mui/material";
export const useCurrentMode = () => {
  const { mode, systemMode } = useColorScheme();
  return mode === "system" ? systemMode : mode;
};
