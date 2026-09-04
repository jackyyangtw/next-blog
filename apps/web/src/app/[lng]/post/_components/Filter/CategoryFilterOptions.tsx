import { useEffect, useRef } from "react";
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";

import type { CategoryDoc } from "@/schema/type/category";

interface CategoryFilterOptionsProps {
  allLabel: string;
  categories: CategoryDoc[];
  emptyLabel: string;
  listLabel: string;
  selectedCategories: string[];
  onClear: () => void;
  onSelect: (slug: string) => void;
}

export default function CategoryFilterOptions({
  allLabel,
  categories,
  emptyLabel,
  listLabel,
  selectedCategories,
  onClear,
  onSelect,
}: CategoryFilterOptionsProps) {
  const listRef = useRef<HTMLUListElement>(null);
  const selectedItemRef = useRef<HTMLDivElement>(null);
  const selectedSlug = selectedCategories[0];

  useEffect(() => {
    const list = listRef.current;
    const selectedItem = selectedItemRef.current;

    if (!selectedSlug || !list || !selectedItem) {
      return;
    }

    list.scrollTo({
      top: Math.max(
        0,
        selectedItem.offsetTop -
          (list.clientHeight - selectedItem.clientHeight) / 2,
      ),
    });
  }, [categories.length, selectedSlug]);

  return (
    <List
      aria-label={listLabel}
      ref={listRef}
      sx={{
        flex: 1,
        minHeight: 0,
        minWidth: 0,
        mt: 1,
        overflowY: "auto",
        py: 0,
      }}
    >
      <ListItemButton
        selected={!selectedCategories.length}
        sx={{ borderRadius: 1 }}
        onClick={onClear}
      >
        <ListItemIcon
          sx={{
            color: !selectedCategories.length
              ? "primary.main"
              : "text.secondary",
            minWidth: 32,
          }}
        >
          <CategoryRoundedIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText
          primary={allLabel}
          sx={{ "& .MuiTypography-root": { fontWeight: 700 } }}
        />
      </ListItemButton>
      {categories.map((category) => {
        const selected = selectedCategories.includes(category.slug);

        return (
          <ListItemButton
            key={category.slug}
            ref={selected ? selectedItemRef : undefined}
            selected={selected}
            sx={{ borderRadius: 1 }}
            onClick={() => onSelect(category.slug)}
          >
            <ListItemText primary={category.title} />
          </ListItemButton>
        );
      })}
      {categories.length === 0 ? (
        <Typography
          color="text.secondary"
          sx={{ px: 2, py: 3 }}
          variant="body2"
        >
          {emptyLabel}
        </Typography>
      ) : null}
    </List>
  );
}
