import adminService from "../http/admin.service";
import useSWR from "swr";
import { SWRFetcher } from "../utils/helpers/http.helpers";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import DropDownController from "../components/controllers/drop-down-controller/DropDownController";

export default function AccountFacilityRequests() {
  const { facilityId } = useParams();

  const serviceRequests = useSWR(
    facilityId ? "adminService.GetServiceRequestByFacility" : undefined,
    SWRFetcher(() => adminService.GetServiceRequestByFacility({ facilityId }))
  );

  return (
    <section>
      {(!serviceRequests.data?.data ||
        serviceRequests.data?.data.service_requests.length === 0) && (
        <div className="bg-stone-50 min-h-[300px] flex mx-auto mt-3">
          <p className="m-auto text-gray-500">No service requests yet.</p>
        </div>
      )}

      <ul>
        {serviceRequests.data?.data.service_requests.map(
          (serviceRequest: any, i: number) => (
            <li
              className="grid grid-cols-12 px-8 items-center py-4 border-b border-stone-100 hover:bg-stone-50 cursor-pointer"
              key={serviceRequest.id}
            >
              <h4 className="flex items-center gap-8 col-span-5">
                <span className="text-sm"> #{i + 1}</span>
                <span className="text-sm">{serviceRequest.title}</span>
              </h4>

              <span className="text-xs text-stone-500 flex-shrink-0 col-span-2">
                {serviceRequest.user.first_name} {serviceRequest.user.last_name}
              </span>
              <span className="text-xs text-stone-500 flex-shrink-0 col-span-2 text-center">
                {serviceRequest.state}
              </span>

              <div className="flex items-center gap-10 flex-shrink-0 col-span-2 justify-end w-full">
                <span className="text-xs text-stone-500 flex-shrink-0">
                  {dayjs(serviceRequest.created_at).fromNow()}
                </span>
              </div>

              <div className="ml-auto">
                <DropDownController
                  options={[
                    { id: "artisan", name: "Assign an artisan" },
                    { id: "resident", name: "View resident" },
                    { id: "vartisan", name: "View artisan" },
                  ]}
                  right={0}
                >
                  <span className="text-xs font-medium bg-stone-100 px-4 py-2 rounded-lg">
                    Options
                  </span>
                </DropDownController>
              </div>
            </li>
          )
        )}
      </ul>
    </section>
  );
}
