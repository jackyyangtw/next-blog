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
      label: t("/post"),
      href: "/post",
    },
    {
      label: t("/studio"),
      href: "/studio",
      target: "_blank",
      rel: "noopener noreferrer",
      role: "admin",
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



export const getIsActive = (pathname: string, link: NavLink) => {
  return link.href === "/" ? pathname === "/" : pathname.includes(link.href);
};

