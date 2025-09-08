import { useClientTranslation } from "@/i18n/client";

interface NavLink {
  label: string;
  href: string;
  target?: string;
  rel?: string;
  auth?: boolean;
  role?: string;
}

export const useNavLinks = () => {
  const { t } = useClientTranslation("nav-links");
  const links: NavLink[] = [
    {
      label: t("/studio"),
      href: "/studio",
      target: "_blank",
      rel: "noopener noreferrer",
      role: "admin",
    },
    {
      label: t("/post"),
      href: "/post",
    },
  ];
  const getVisibleLinks = (isAdmin: boolean, isAuthenticated: boolean) => {
    return links.filter((link) => {
      if (link.role === "admin") {
        return isAdmin;
      }
      return !link.auth || isAuthenticated;
    });
  };
  return {
    links,
    getVisibleLinks,
  };
};

// export const links: NavLink[] = [
//   {
//     label: "後台",
//     href: "/studio",
//     target: "_blank",
//     rel: "noopener noreferrer",
//     role: "admin",
//   },
//   {
//     label: "文章",
//     href: "/post",
//   },
// ];

export const getIsActive = (pathname: string, link: NavLink) => {
  return link.href === "/" ? pathname === "/" : pathname.includes(link.href);
};

// export const getVisibleLinks = (isAdmin: boolean, isAuthenticated: boolean) => {
//   return links.filter((link) => {
//     if (link.role === "admin") {
//       return isAdmin;
//     }
//     return !link.auth || isAuthenticated;
//   });
// };
