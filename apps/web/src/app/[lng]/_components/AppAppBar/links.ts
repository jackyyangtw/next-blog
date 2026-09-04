import type { Locale } from "@/i18n/types";

export interface NavLink {
  label: string;
  href: string;
  target?: string;
  rel?: string;
  auth?: boolean;
  role?: string;
}

export function getNavLinks(
  lng: Locale,
  labels: { posts: string; studio: string },
) {
  return [
    {
      label: labels.posts,
      href: `/${lng}/post`,
    },
    {
      label: labels.studio,
      href: `/studio`,
      target: "_blank",
      rel: "noopener noreferrer",
      role: "admin",
    },
  ] satisfies NavLink[];
}

export function getVisibleLinks(
  links: NavLink[],
  isAdmin: boolean,
  isAuthenticated: boolean,
) {
  return links.filter((link) => {
    if (link.role === "admin") return isAdmin;
    return !link.auth || isAuthenticated;
  });
}

export const getIsActive = (pathname: string, link: NavLink) => {
  return link.href === "/" ? pathname === "/" : pathname.includes(link.href);
};
