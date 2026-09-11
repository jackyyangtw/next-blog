"use client";

import { CodeBlockCopyButton } from "./CodeBlockCopyButton";
import styles from "./CodeBlock.module.css";

interface CodeBlockViewProps {
  code: string;
  highlightedHtml?: string;
  language?: string;
}

export function CodeBlockView({
  code,
  highlightedHtml,
  language,
}: CodeBlockViewProps) {
  return (
    <figure className={styles.root}>
      <figcaption className={styles.toolbar}>
        {language && <span className={styles.language}>{language}</span>}
        <CodeBlockCopyButton code={code} />
      </figcaption>
      {highlightedHtml ? (
        <div
          className={styles.highlightedCode}
          dangerouslySetInnerHTML={{ __html: highlightedHtml }}
        />
      ) : (
        <pre className={styles.plainCode} tabIndex={0}>
          <code>
            {code.split("\n").map((line, index) => (
              <span className={styles.plainLine} key={index}>
                {line || " "}
              </span>
            ))}
          </code>
        </pre>
      )}
    </figure>
  );
}
