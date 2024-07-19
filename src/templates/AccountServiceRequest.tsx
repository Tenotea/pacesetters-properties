import { Icon } from "@iconify/react/dist/iconify.js";
import DashboardLayout from "../layouts/DashboardLayout";
import { AppRouterPaths } from "../router/app.router";
import { useState } from "react";
import ModalLayout from "../layouts/modal-layout/ModalLayout";
import { useForm } from "../utils/hooks/useForm.hook";
import { z } from "zod";
import { TextInput } from "../components/inputs/text-input/TextInput";
import adminService from "../http/admin.service";
import { enqueueSnackbar } from "notistack";
import useSWR, { mutate } from "swr";
import { SWRFetcher } from "../utils/helpers/http.helpers";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import TextAreaInput from "../components/inputs/text-area-input/TextAreaInput";
import SelectInput from "../components/inputs/select-input/SelectInput";

export default function AccountServiceRequest() {
  const facilities = useSWR(
    "adminService.GetFacilities",
    SWRFetcher(() => adminService.GetFacilities())
  );

  const [isActionAddFacility, setIsActionAddFacility] = useState(false);

  const serviceRequestForm = useForm({
    initialFormData: {
      title: "",
      description: "",
      service_type: "",
      facilityId: "",
    },

    validationSchema: z.object({
      title: z.string().min(3, "Enter a valid subject line"),
      description: z.string(),
      service_type: z.string().min(3, "Please select a service type"),
      facilityId: z.string().min(2, "Please select a facility"),
    }),

    async onSubmit(formData, reset) {
      const { data, error } = await adminService.CreateFacility(formData);

      enqueueSnackbar({
        message: data?.message || error?.message.toString(),
        variant: data ? "success" : "error",
      });

      if (data) {
        setIsActionAddFacility(false);
        reset();
        mutate("adminService.GetFacilities");
      }
    },
  });

  return (
    <DashboardLayout
      crumbs={[
        { id: "#", name: "Account" },
        {
          id: AppRouterPaths.ACCOUNT.SERVICE_REQUESTS,
          name: "Service Requests",
        },
      ]}
    >
      <section className="p-5 flex items-center justify-between">
        <h1 className="text-2xl font-medium">My Service Requests</h1>
        <button
          className="flex items-center gap-2 text-sm bg-black text-white font-medium px-5 py-2 rounded-lg"
          onClick={() => setIsActionAddFacility(true)}
        >
          <Icon icon={"eos-icons:service-instance"} width={20} />
          Request a service
        </button>
      </section>

      <section>
        <ul>
          {facilities.data?.data.map(({ facility }: any, i: number) => (
            <Link
              to={
                AppRouterPaths.ACCOUNT.FACILITIES(facility.address.id).RESIDENTS
              }
            >
              <li
                key={facility.id}
                className="grid grid-cols-12 px-8 items-center py-4 border-b border-stone-100 hover:bg-stone-50 cursor-pointer"
              >
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

      {(!facilities.data?.data || facilities.data.data.length === 0) && (
        <div className="bg-stone-50 min-h-[300px] flex mx-auto mt-3">
          <p className="m-auto text-gray-500">No service requests made.</p>
        </div>
      )}

      {isActionAddFacility && (
        <ModalLayout
          title="Service request"
          description="Be clear and concise with your request to allow for speedy resolution"
          onClose={() => setIsActionAddFacility(false)}
        >
          <form
            onSubmit={serviceRequestForm.handleSubmit}
            className="grid gap-4"
          >
            <TextInput
              label="Subject"
              placeholder="What do you need help with?"
              name={serviceRequestForm.fieldNames.title}
              onChange={serviceRequestForm.handleChange}
              value={serviceRequestForm.formData.title}
              validation={serviceRequestForm.validationSchema?.title}
              validationTrigger={serviceRequestForm.validationError}
            />
            <div className="grid grid-cols-2 gap-4">
              <SelectInput
                label="Facility"
                placeholder="Click to select a facility"
                name={serviceRequestForm.fieldNames.facilityId}
                onChange={serviceRequestForm.handleChange}
                value={serviceRequestForm.formData.facilityId}
                validation={serviceRequestForm.validationSchema?.facilityId}
                validationTrigger={serviceRequestForm.validationError}
              />
              <SelectInput
                label="Service type"
                placeholder="Click to select an option"
                name={serviceRequestForm.fieldNames.service_type}
                onChange={serviceRequestForm.handleChange}
                value={serviceRequestForm.formData.service_type}
                validation={serviceRequestForm.validationSchema?.service_type}
                validationTrigger={serviceRequestForm.validationError}
              />
            </div>
            <TextAreaInput
              label="Description"
              placeholder="Provide more details about this issue"
              name={serviceRequestForm.fieldNames.description}
              onChange={serviceRequestForm.handleChange}
              value={serviceRequestForm.formData.description}
              validation={serviceRequestForm.validationSchema?.description}
              validationTrigger={serviceRequestForm.validationError}
            />

            <button className="text-sm bg-black text-white font-bold py-2.5 rounded-xl block mt-2">
              Submit your service request
            </button>
          </form>
        </ModalLayout>
      )}
    </DashboardLayout>
  );
}
