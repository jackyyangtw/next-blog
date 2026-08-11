"use client";

import type { MouseEvent } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Box from "@mui/material/Box";

import type { PostTableOfContentsSection } from "../postTableOfContents";
import { POST_SCROLL_OFFSET } from "../postScrollOffset";
import PostScrollSpyLink from "./PostScrollSpyLink";

const SCROLL_SPY_TOP = POST_SCROLL_OFFSET;
const ACTIVE_HEADING_OFFSET = SCROLL_SPY_TOP + 24;

interface PostScrollSpyProps {
  sections: PostTableOfContentsSection[];
}

function getHeadingIds(sections: PostTableOfContentsSection[]) {
  return sections.flatMap((section) => [
    section.id,
    ...section.children.map((child) => child.id),
  ]);
}

export default function PostScrollSpy({ sections }: PostScrollSpyProps) {
  const scrollSpyRef = useRef<HTMLElement | null>(null);
  const headingIds = useMemo(() => getHeadingIds(sections), [sections]);
  const [activeId, setActiveId] = useState(headingIds[0] ?? "");
  const currentActiveId = headingIds.includes(activeId)
    ? activeId
    : (headingIds[0] ?? "");

  const handleHeadingClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>, id: string) => {
      event.preventDefault();

      const heading = document.getElementById(id);
      if (!heading) {
        return;
      }

      setActiveId(id);
      window.history.pushState(null, "", `#${id}`);
      window.scrollTo({
        top: Math.max(
          0,
          window.scrollY +
            heading.getBoundingClientRect().top -
            POST_SCROLL_OFFSET,
        ),
        behavior: "smooth",
      });
    },
    [],
  );

  useEffect(() => {
    if (headingIds.length === 0) {
      return;
    }

    let animationFrameId: number | null = null;

    const updateActiveHeading = () => {
      const nextActiveId = headingIds.reduce((lastPassedId, id) => {
        const heading = document.getElementById(id);
        return heading &&
          heading.getBoundingClientRect().top <= ACTIVE_HEADING_OFFSET
          ? id
          : lastPassedId;
      }, headingIds[0]);

      setActiveId((previousActiveId) =>
        previousActiveId === nextActiveId ? previousActiveId : nextActiveId,
      );
    };

    const scheduleActiveHeadingUpdate = () => {
      if (animationFrameId !== null) {
        return;
      }

      animationFrameId = window.requestAnimationFrame(() => {
        animationFrameId = null;
        updateActiveHeading();
      });
    };

    updateActiveHeading();
    window.addEventListener("scroll", scheduleActiveHeadingUpdate, {
      passive: true,
    });
    window.addEventListener("resize", scheduleActiveHeadingUpdate);

    return () => {
      if (animationFrameId !== null) {
        window.cancelAnimationFrame(animationFrameId);
      }

      window.removeEventListener("scroll", scheduleActiveHeadingUpdate);
      window.removeEventListener("resize", scheduleActiveHeadingUpdate);
    };
  }, [headingIds]);
  useEffect(() => {
    const scrollSpy = scrollSpyRef.current;
    const activeItem = scrollSpy?.querySelector<HTMLElement>(
      '[data-scroll-spy-active="true"]',
    );

    if (!scrollSpy || !activeItem) {
      return;
    }

    const gap = 12;
    const activeTop = activeItem.offsetTop;
    const activeBottom = activeTop + activeItem.offsetHeight;
    const visibleTop = scrollSpy.scrollTop;
    const visibleBottom = visibleTop + scrollSpy.clientHeight;

    if (activeTop < visibleTop + gap) {
      scrollSpy.scrollTo({
        top: Math.max(0, activeTop - gap),
        behavior: "smooth",
      });
      return;
    }

    if (activeBottom > visibleBottom - gap) {
      scrollSpy.scrollTo({
        top: activeBottom - scrollSpy.clientHeight + gap,
        behavior: "smooth",
      });
    }
  }, [currentActiveId]);

  if (sections.length === 0) {
    return null;
  }

  return (
    <Box
      component="nav"
      ref={scrollSpyRef}
      aria-label="Post table of contents"
      sx={{
        display: { xs: "none", lg: "block" },
        width: 240,
        flexShrink: 0,
        position: "sticky",
        top: SCROLL_SPY_TOP,
        maxHeight: `calc(100vh - ${SCROLL_SPY_TOP + 32}px)`,
        overflowY: "auto",
        scrollbarGutter: "stable",
        borderLeft: "1px solid",
        borderColor: "divider",
        pl: 3,
        pr: 1,
      }}
    >
      <Box component="ol" sx={{ m: 0, p: 0, listStyle: "none" }}>
        {sections.map((section) => (
          <Box component="li" key={section.id} sx={{ mb: 1.5 }}>
            <PostScrollSpyLink
              id={section.id}
              isActive={currentActiveId === section.id}
              level="section"
              onClick={handleHeadingClick}
            >
              {section.text}
            </PostScrollSpyLink>

            {section.children.length > 0 && (
              <Box
                component="ol"
                sx={{ mt: 0.75, ml: 2, p: 0, listStyle: "none" }}
              >
                {section.children.map((child) => (
                  <Box component="li" key={child.id} sx={{ mb: 0.75 }}>
                    <PostScrollSpyLink
                      id={child.id}
                      isActive={currentActiveId === child.id}
                      level="child"
                      onClick={handleHeadingClick}
                    >
                      {child.text}
                    </PostScrollSpyLink>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
