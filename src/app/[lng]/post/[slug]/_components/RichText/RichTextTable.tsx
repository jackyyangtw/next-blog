import Box from "@mui/material/Box";
import MuiTable from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import { RichTextTableValue } from "./types";

interface RichTextTableProps {
  value: RichTextTableValue;
}

export function RichTextTable({ value }: RichTextTableProps) {
  const rows = value.rows?.filter((row) => row.cells?.length) ?? [];

  if (!rows.length) {
    return null;
  }

  const hasHeaderRow = value.hasHeaderRow !== false;
  const [headerRow, ...bodyRows] = rows;
  const visibleBodyRows = hasHeaderRow ? bodyRows : rows;

  return (
    <TableContainer
      component={Box}
      sx={(theme) => ({
        my: 4,
        overflowX: "auto",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 1,
        "& table": {
          minWidth: 560,
        },
        ...theme.applyStyles("dark", {
          borderColor: "rgba(255,255,255,0.14)",
        }),
      })}
    >
      <MuiTable size="small" aria-label={value.caption || "Content table"}>
        {value.caption && (
          <caption
            style={{
              captionSide: "bottom",
              padding: "12px 16px",
              textAlign: "left",
            }}
          >
            {value.caption}
          </caption>
        )}
        {hasHeaderRow && (
          <TableHead>
            <TableRow>
              {headerRow.cells?.map((cell) => (
                <TableCell
                  key={cell._key}
                  component="th"
                  scope="col"
                  sx={{
                    fontWeight: 700,
                    bgcolor: "action.hover",
                    whiteSpace: "pre-line",
                  }}
                >
                  {cell.text}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
        )}
        <TableBody>
          {visibleBodyRows.map((row) => (
            <TableRow key={row._key}>
              {row.cells?.map((cell) => (
                <TableCell key={cell._key} sx={{ whiteSpace: "pre-line" }}>
                  {cell.text}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </MuiTable>
    </TableContainer>
  );
}
