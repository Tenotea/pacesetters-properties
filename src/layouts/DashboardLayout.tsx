import { ReactNode } from "react";
import { AppRouterPaths } from "../router/app.router";
import { ListItem } from "../utils/types/index.types";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react/dist/iconify.js";
import useSWR from "swr";
import userService from "../http/user.service";
import { SWRFetcher } from "../utils/helpers/http.helpers";
import { IMG_CompanyLogo } from "../assets/images";

function useDashboardLayout() {
  const user = useSWR(
    "userService.GetUserBySession",
    SWRFetcher(() => userService.GetUserBySession())
  );
  const adminMenu: ListItem[] = [
    {
      id: AppRouterPaths.ACCOUNT.FACILITIES().INDEX,
      name: "My Facilities",
      icon: "maki:residential-community",
    },
    {
      id: AppRouterPaths.ACCOUNT.RESIDENTS,
      name: "Residents",
      icon: "iconoir:community",
    },
    {
      id: AppRouterPaths.ACCOUNT.ARTISANS,
      name: "Artisans",
      icon: "ic:sharp-engineering",
    },
  ];

  const tenantMenu: ListItem[] = [
    {
      id: AppRouterPaths.ACCOUNT.FACILITIES().INDEX,
      name: "My Facilities",
      icon: "maki:residential-community",
    },
    {
      id: AppRouterPaths.ACCOUNT.SERVICE_REQUESTS,
      name: "Service Requests",
      icon: "carbon:customer-service",
    },
  ];

  return {
    dashboardMenu: user.data?.data
      ? user.data.data.user_type === "ADMIN"
        ? adminMenu
        : user.data.data.user_type === "TENANT"
        ? tenantMenu
        : []
      : [],
    user,
  };
}

export default function DashboardLayout(props: {
  children: ReactNode;
  crumbs: ListItem[];
}) {
  const h = useDashboardLayout();
  return (
    <main className="flex items-start min-h-screen">
      {/* {!IsRole.notAdmin(h.user.data?.data.user_type) && (
        <DashboardMenuChunk options={h.dashboardMenu} />
      )} */}

      <section className="w-full">
        <header className="flex items-center justify-between px-6 py-2 border-b border-gray-100">
          <Link to={AppRouterPaths.HOME}>
            <img src={IMG_CompanyLogo} className="h-7" />
          </Link>
          <ul className="flex items-center gap-1.5 h-[50px]">
            {props.crumbs.map((crumb) => (
              <li className="group flex items-center gap-1.5" key={crumb.id}>
                <Link
                  to={crumb.id}
                  key={crumb.id}
                  className="text-sm hover:text-green-700 group-last:font-semibold"
                >
                  {crumb.name}
                </Link>
                <span>
                  <Icon
                    icon={"fluent:slash-forward-20-filled"}
                    className="group-last:hidden"
                  />
                </span>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2">
            <img
              src="https://avatars.githubusercontent.com/u/7088511?v=4"
              className="w-8 h-8 rounded-full object-cover border-2 border-black"
            />
            <div>
              <p className="text-sm font-semibold text-theme-blue">
                {h.user.data?.data.first_name}{" "}
                {h.user.data?.data.last_name?.[0]}.
              </p>
              <p className="text-xs text-theme-text -mt-0.5 capitalize">
                Role: {h.user.data?.data.user_type.toLowerCase()}
              </p>
            </div>
          </div>
        </header>
        {props.children}
      </section>
    </main>
  );
}
