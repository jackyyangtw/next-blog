import { alpha, type SxProps, type Theme } from "@mui/material/styles";
import { tableClasses } from "@mui/material/Table";
import { tableBodyClasses } from "@mui/material/TableBody";
import { tableCellClasses } from "@mui/material/TableCell";
import { tableHeadClasses } from "@mui/material/TableHead";
import { tableRowClasses } from "@mui/material/TableRow";

export const richTextTableContainerSx: SxProps<Theme> = (theme) => ({
  my: 4,
  overflowX: "auto",
  border: "1px solid",
  borderRadius: "8px",
  borderColor: alpha(theme.palette.grey[900], 0.14),
  backgroundColor: "hsl(220, 35%, 97%)",
  boxShadow: `0 18px 48px ${alpha(theme.palette.grey[900], 0.08)}`,
  [`& .${tableClasses.root}`]: {
    minWidth: 560,
  },
  [`& .${tableCellClasses.root}`]: {
    borderColor: alpha(theme.palette.grey[900], 0.1),
    whiteSpace: "pre-line",
  },
  [`& .${tableHeadClasses.root} .${tableCellClasses.root}`]: {
    backgroundColor: "rgba(226, 232, 240, 0.72)",
    fontWeight: 700,
  },
  [`& .${tableBodyClasses.root} .${tableRowClasses.root}:nth-of-type(odd) .${tableCellClasses.root}`]:
    {
      backgroundColor: "rgba(255, 255, 255, 0.5)",
    },
  [`& .${tableBodyClasses.root} .${tableRowClasses.root}:nth-of-type(even) .${tableCellClasses.root}`]:
    {
      backgroundColor: "rgba(241, 245, 249, 0.46)",
    },
  [`& .${tableBodyClasses.root} .${tableRowClasses.root}:hover .${tableCellClasses.root}`]:
    {
      backgroundColor: "rgba(226, 232, 240, 0.62)",
    },
  ...theme.applyStyles("dark", {
    borderColor: alpha(theme.palette.common.white, 0.1),
    backgroundColor: "hsl(222, 22%, 11%)",
    boxShadow: `0 18px 48px ${alpha(theme.palette.common.black, 0.26)}`,
    [`& .${tableCellClasses.root}`]: {
      borderColor: alpha(theme.palette.common.white, 0.08),
    },
    [`& .${tableHeadClasses.root} .${tableCellClasses.root}`]: {
      backgroundColor: "rgba(30, 41, 59, 0.72)",
    },
    [`& .${tableBodyClasses.root} .${tableRowClasses.root}:nth-of-type(odd) .${tableCellClasses.root}`]:
      {
        backgroundColor: "rgba(15, 23, 42, 0.4)",
      },
    [`& .${tableBodyClasses.root} .${tableRowClasses.root}:nth-of-type(even) .${tableCellClasses.root}`]:
      {
        backgroundColor: "rgba(30, 41, 59, 0.36)",
      },
    [`& .${tableBodyClasses.root} .${tableRowClasses.root}:hover .${tableCellClasses.root}`]:
      {
        backgroundColor: "rgba(51, 65, 85, 0.48)",
      },
  }),
});
