import type { BlockStyleProps } from "sanity";

export function QuoteStyle(props: BlockStyleProps) {
  return (
    <blockquote
      style={{
        borderLeft: "3px solid var(--card-border-color)",
        margin: 0,
        paddingLeft: "0.75rem",
      }}
    >
      {props.children}
    </blockquote>
  );
}
