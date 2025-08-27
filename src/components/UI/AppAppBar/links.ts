interface NavLink {
  label: string;
  href: string;
  target?: string;
  rel?: string;
  auth?: boolean;
}

export const links: NavLink[] = [
  {
    label: "後台",
    href: "/studio",
    target: "_blank",
    rel: "noopener noreferrer",
  },
  {
    label: "文章",
    href: "/post",
  },
];

export const getIsActive = (pathname: string, link: NavLink) => {
  return link.href === "/" ? pathname === "/" : pathname.includes(link.href);
};
