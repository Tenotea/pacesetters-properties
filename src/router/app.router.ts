import { RouteObject, createBrowserRouter, redirect } from "react-router-dom";
import SignInTemplate from "../templates/SignInTemplate";
import SignUpTemplate from "../templates/SignUpTemplate";
import AccountFacilities from "../templates/AccountFacilities";
import AccountFacilityResidents from "../templates/AccountFacilityResidents";
import AccountFacilityRequests from "../templates/AccountFacilityRequests";
import AccountFacility from "../templates/AccountFacility";
import AccountServiceRequest from "../templates/AccountServiceRequest";

const AppRouterPaths = {
  HOME: "/",
  SIGN_IN: "/sign-in",
  SIGN_UP: "/create-account",
  ACCOUNT: {
    INDEX: "/account",
    FACILITIES(facilityId?: string) {
      return {
        INDEX: "/account/facilities",
        VIEW: `/account/facilities/${facilityId}`,
        SERVICE_REQUESTS: `/account/facilities/${facilityId}/requests`,
        RESIDENTS: `/account/facilities/${facilityId}/residents`,
      };
    },
    RESIDENTS: "/account/residents",
    SERVICE_REQUESTS: "/account/service-requests",
    ARTISANS: "/account/artisans",
  },
};

const HomeRoute: RouteObject = {
  path: AppRouterPaths.HOME,
  async loader() {
    return redirect(AppRouterPaths.SIGN_IN);
  },
};

const AppRouter = createBrowserRouter([
  HomeRoute,
  {
    path: AppRouterPaths.SIGN_UP,
    Component: SignUpTemplate,
  },
  {
    path: AppRouterPaths.SIGN_IN,
    Component: SignInTemplate,
  },
  {
    path: AppRouterPaths.ACCOUNT.INDEX,
    loader() {
      return redirect(AppRouterPaths.ACCOUNT.FACILITIES().INDEX);
    },
  },
  {
    path: AppRouterPaths.ACCOUNT.FACILITIES().INDEX,
    Component: AccountFacilities,
  },
  {
    path: AppRouterPaths.ACCOUNT.FACILITIES(":facilityId").VIEW,
    Component: AccountFacility,
    children: [
      {
        path: AppRouterPaths.ACCOUNT.FACILITIES(":facilityId").RESIDENTS,
        Component: AccountFacilityResidents,
      },
      {
        path: AppRouterPaths.ACCOUNT.FACILITIES(":facilityId").SERVICE_REQUESTS,
        Component: AccountFacilityRequests,
      },
    ],
  },
  {
    path: AppRouterPaths.ACCOUNT.SERVICE_REQUESTS,
    Component: AccountServiceRequest,
  },
]);

export { AppRouterPaths, AppRouter };
