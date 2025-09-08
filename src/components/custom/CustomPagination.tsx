import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Pagination from "@mui/material/Pagination";

// ------------- i18n -------------
import { useClientTranslation } from "@/i18n/client";

interface CustomPaginationProps {
  limit: number;
  setParams: (params: { limit: number; page: number }) => void;
  totalPages: number;
  page: number;
  setPage: (page: number) => void;
}

export default function CustomPagination({
  limit,
  setParams,
  totalPages,
  page,
  setPage,
}: CustomPaginationProps) {
  const { t } = useClientTranslation("component");
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        mb: 2,
      }}
    >
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel id="limit-select-label">{t("CustomPagination.select_label")}</InputLabel>
        <Select
          labelId="limit-select-label"
          id="limit-select"
          value={limit}
          label={t("CustomPagination.select_label")}
          onChange={(e) => {
            setParams({ limit: Number(e.target.value), page: 1 });
          }}
        >
          <MenuItem value={5}>5</MenuItem>
          <MenuItem value={10}>10</MenuItem>
        </Select>
      </FormControl>
      <Pagination
        count={totalPages}
        page={page}
        onChange={(_, value) => setPage(value)}
        color="primary"
        shape="rounded"
        showFirstButton
        showLastButton
      />
    </Box>
  );
}
