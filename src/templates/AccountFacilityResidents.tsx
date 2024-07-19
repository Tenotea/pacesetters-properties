import { AppRouterPaths } from "../router/app.router";
import adminService from "../http/admin.service";
import useSWR from "swr";
import { SWRFetcher } from "../utils/helpers/http.helpers";
import dayjs from "dayjs";
import { Link, useParams } from "react-router-dom";

export default function AccountFacilityResidents() {
  const { facilityId } = useParams();
  const residents = useSWR(
    "adminService.GetResidentsByFacility",
    SWRFetcher(() => adminService.GetResidentsByFacility({ facilityId }))
  );

  return (
    <section>
      {(!residents.data?.data ||
        residents.data?.data.service_requests?.length === 0) && (
        <div className="bg-stone-50 min-h-[300px] flex mx-auto mt-3">
          <p className="m-auto text-gray-500">No residents to show.</p>
        </div>
      )}

      <ul>
        {residents.data?.data?.map(({ facility }: any, i: number) => (
          <Link
            key={facility.id}
            to={AppRouterPaths.ACCOUNT.FACILITIES(facility.id).RESIDENTS}
          >
            <li className="grid grid-cols-12 px-8 items-center py-4 border-b border-stone-100 hover:bg-stone-50 cursor-pointer">
              <h4 className="flex items-center gap-8 col-span-6">
                <span className="text-sm"> #{i + 1}</span>
                <span className="text-sm">
                  {facility.address.apartment_number}{" "}
                  {facility.address.street_name}
                </span>
              </h4>

              <span className="text-xs text-stone-500 flex-shrink-0 col-span-4">
                {facility.address.city},{facility.address.state}
              </span>

              <div className="flex items-center gap-10 flex-shrink-0 col-span-2 justify-end w-full">
                <span className="text-xs text-stone-500 flex-shrink-0">
                  {dayjs(facility.address.created_at).fromNow()}
                </span>
              </div>
            </li>
          </Link>
        ))}
      </ul>
    </section>
  );
}
