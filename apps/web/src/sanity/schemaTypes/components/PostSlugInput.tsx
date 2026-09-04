import type { SanityDocument, SlugInputProps } from "sanity";
import { useEditState, useFormValue } from "sanity";

const DEFAULT_POST_LOCALE = "zh-TW";
const POST_TYPE = "post";

type FormDocument = Pick<SanityDocument, "_id">;

function getPublishedId(documentId: string | undefined) {
  return documentId?.replace(/^drafts\./, "") ?? "";
}

function getPostUrl(slug: string) {
  return `/${DEFAULT_POST_LOCALE}/post/${encodeURIComponent(slug)}`;
}

export function PostSlugInput(props: SlugInputProps) {
  const document = useFormValue([]) as FormDocument | undefined;
  const slug = props.value?.current;
  const publishedId = getPublishedId(document?._id);
  const editState = useEditState(
    publishedId || "__missing_post_id__",
    POST_TYPE,
    "low",
  );
  const postUrl = slug ? getPostUrl(slug) : "";
  const shouldShowLink = Boolean(
    slug && editState.ready && editState.published,
  );

  return (
    <div>
      {props.renderDefault(props)}

      {shouldShowLink ? (
        <div style={{ marginTop: 12 }}>
          <a
            href={postUrl}
            rel="noreferrer"
            style={{
              alignItems: "center",
              border: "1px solid var(--card-border-color)",
              borderRadius: 6,
              color: "var(--card-link-color)",
              display: "inline-flex",
              fontSize: 13,
              fontWeight: 600,
              gap: 6,
              padding: "8px 10px",
              textDecoration: "none",
            }}
            target="_blank"
          >
            Open published article
          </a>
        </div>
      ) : null}
    </div>
  );
}
