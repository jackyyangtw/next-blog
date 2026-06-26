import Box from "@mui/material/Box";
import MuiTable from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import { renderInlineCodeFallback } from "./RichTextInlineCode";
import { richTextTableContainerSx } from "./RichTextTable.styles";
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
    <TableContainer component={Box} sx={richTextTableContainerSx}>
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
                <TableCell key={cell._key} component="th" scope="col">
                  {renderInlineCodeFallback(cell.text)}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
        )}

        <TableBody>
          {visibleBodyRows.map((row) => (
            <TableRow key={row._key}>
              {row.cells?.map((cell) => (
                <TableCell key={cell._key}>
                  {renderInlineCodeFallback(cell.text)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </MuiTable>
    </TableContainer>
  );
}
