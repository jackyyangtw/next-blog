import Box from "@mui/material/Box";

export function RichTextDivider() {
  return (
    <Box
      component="hr"
      aria-hidden="true"
      sx={(theme) => ({
        my: 5,
        border: 0,
        borderTop: "1px solid",
        borderColor: "divider",
        opacity: 0.9,
        ...theme.applyStyles("dark", {
          borderColor: "rgba(255,255,255,0.2)",
        }),
      })}
    />
  );
}
