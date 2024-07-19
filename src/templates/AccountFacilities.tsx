import { Icon } from "@iconify/react/dist/iconify.js";
import DashboardLayout from "../layouts/DashboardLayout";
import { AppRouterPaths } from "../router/app.router";
import { useMemo, useState } from "react";
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
import userService from "../http/user.service";
import { IsRole } from "../utils/helpers/role.helpers";
import TextAreaInput from "../components/inputs/text-area-input/TextAreaInput";
import SelectInput from "../components/inputs/select-input/SelectInput";

export default function AccountFacilities() {
  const [isActionAddFacility, setIsActionAddFacility] = useState(false);
  const [isActionRequestService, setIsActionRequestService] = useState(false);
  const userResponse = useSWR(
    "userService.GetUserBySession",
    SWRFetcher(() => userService.GetUserBySession())
  );
  const user = useMemo(() => userResponse.data?.data, [userResponse.data]);
  const facilities = useSWR(
    user
      ? IsRole.notAdmin(user.user_type)
        ? "userService.GetUserFacilities"
        : "adminService.GetFacilities"
      : undefined,
    SWRFetcher(() =>
      IsRole.notAdmin(user?.user_type)
        ? userService.GetUserFacilities()
        : adminService.GetFacilities()
    )
  );
  const serviceRequests = useSWR(
    user && IsRole.notAdmin(user.user_type)
      ? "userService.GetServiceRequests"
      : undefined,
    SWRFetcher(() => userService.GetServiceRequests())
  );

  const facilityForm = useForm({
    initialFormData: {
      apartment_number: "",
      street_name: "",
      city: "",
      state: "",
      postal_code: "",
      country: "",
    },

    validationSchema: z.object({
      apartment_number: z.string(),
      street_name: z.string().min(3, "Enter a valid address"),
      city: z.string().min(3, "Enter a valid city"),
      country: z.string().min(2, "Enter a valid country"),
      postal_code: z.string().min(5, "Enter a valid postal code"),
      state: z.string().min(2, "Enter valid state"),
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

  const serviceRequestForm = useForm({
    initialFormData: {
      title: "",
      description: "",
      service_type: "",
    },

    validationSchema: z.object({
      title: z.string().min(3, "Enter a valid subject line"),
      description: z.string(),
      service_type: z.string().min(3, "Please select a service type"),
    }),

    async onSubmit(formData, reset) {
      const { data, error } = await userService.CreateServiceRequest({
        ...formData,
        facilityId: facilities.data?.data.id,
      });

      enqueueSnackbar({
        message: data?.message || error?.message.toString(),
        variant: data ? "success" : "error",
      });

      if (data) {
        setIsActionRequestService(false);
        reset();
        mutate("userService.GetServiceRequests");
      }
    },
  });

  return (
    <DashboardLayout
      crumbs={[
        { id: "#", name: "Account" },
        { id: AppRouterPaths.ACCOUNT.FACILITIES().INDEX, name: "Facilities" },
      ]}
    >
      {!IsRole.notAdmin(user?.user_type) ? (
        <section className="p-5 flex items-center justify-between">
          <h1 className="text-2xl font-medium"> My Facilities</h1>

          <button
            className="flex items-center gap-2 text-sm bg-black text-white font-medium px-5 py-2 rounded-lg"
            onClick={() => setIsActionAddFacility(true)}
          >
            <Icon icon={"lucide:house-plus"} />
            Add a facility
          </button>
        </section>
      ) : (
        <section className="p-5 border-b border-stone-100">
          <div className="justify-between flex items-center">
            <h1 className="text-2xl font-medium"> My Facility</h1>
            <p className="text-sm text-stone-400">
              {" "}
              Joined{" "}
              {dayjs(facilities.data?.data.address?.created_at).fromNow()}
            </p>
          </div>

          <div className="flex items-end justify-between gap-5">
            <div>
              <p className="mt-5 text-lg font-medium text-stone-600">
                {facilities.data?.data.address.apartment_number}{" "}
                {facilities.data?.data.address.street_name}
              </p>
              <p className="text-sm text-stone-500 mt-1">
                {facilities.data?.data.address.city}
                {", "}
                {facilities.data?.data.address.state}
                {". "}
                {facilities.data?.data.address.postal_code}
              </p>
            </div>
            <button
              className="flex items-center gap-2 text-sm bg-black text-white font-medium px-5 py-2 rounded-lg"
              onClick={() => setIsActionRequestService(true)}
            >
              <Icon icon={"eos-icons:service-instance"} width={20} />
              Request a service
            </button>
          </div>
        </section>
      )}

      {!IsRole.notAdmin(user?.user_type) && (
        <section>
          <ul>
            {facilities.data?.data.map(({ facility }: any, i: number) => (
              <Link
                to={
                  IsRole.notAdmin(user?.user_type)
                    ? "#"
                    : AppRouterPaths.ACCOUNT.FACILITIES(facility.id).RESIDENTS
                }
                key={facility.id}
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
      )}

      {IsRole.notAdmin(user?.user_type) && (
        <section>
          <div className="bg-stone-100 uppercase font-medium text-xs px-5 text-stone-500 py-1">
            my service requests
          </div>
          <ul>
            {serviceRequests.data?.data.map(
              (serviceRequest: any, i: number) => (
                <Link
                  to={
                    IsRole.notAdmin(user?.user_type)
                      ? "#"
                      : AppRouterPaths.ACCOUNT.FACILITIES(serviceRequest.id)
                          .RESIDENTS
                  }
                  key={serviceRequest.id}
                >
                  <li className="grid grid-cols-12 px-8 items-center py-4 border-b border-stone-100 hover:bg-stone-50 cursor-pointer">
                    <h4 className="flex items-center gap-8 col-span-6">
                      <span className="text-sm"> #{i + 1}</span>
                      <span className="text-sm">{serviceRequest.title}</span>
                    </h4>

                    <span className="text-xs text-stone-500 flex-shrink-0 col-span-4">
                      {serviceRequest.state}
                    </span>

                    <div className="flex items-center gap-10 flex-shrink-0 col-span-2 justify-end w-full">
                      <span className="text-xs text-stone-500 flex-shrink-0">
                        {dayjs(serviceRequest.created_at).fromNow()}
                      </span>
                    </div>
                  </li>
                </Link>
              )
            )}
          </ul>
        </section>
      )}

      {(!facilities.data?.data || facilities.data.data.length === 0) && (
        <div className="bg-stone-50 min-h-[300px] flex mx-auto mt-3">
          <p className="m-auto text-gray-500">No facilities yet.</p>
        </div>
      )}

      {isActionAddFacility && (
        <ModalLayout
          title="Add a facility"
          description="Enter facility data to begin managing it"
          onClose={() => setIsActionAddFacility(false)}
        >
          <form onSubmit={facilityForm.handleSubmit} className="grid gap-4">
            <TextInput
              label="Address line 1"
              placeholder="Enter primary address"
              name={facilityForm.fieldNames.street_name}
              onChange={facilityForm.handleChange}
              value={facilityForm.formData.street_name}
              validation={facilityForm.validationSchema?.street_name}
              validationTrigger={facilityForm.validationError}
            />
            <TextInput
              label="Address line 2"
              placeholder="e.g Apartment, block"
              name={facilityForm.fieldNames.apartment_number}
              onChange={facilityForm.handleChange}
              value={facilityForm.formData.apartment_number}
              validation={facilityForm.validationSchema?.apartment_number}
              validationTrigger={facilityForm.validationError}
            />
            <div className="grid grid-cols-2 gap-4">
              <TextInput
                label="City"
                placeholder="Enter city"
                name={facilityForm.fieldNames.city}
                onChange={facilityForm.handleChange}
                value={facilityForm.formData.city}
                validation={facilityForm.validationSchema?.city}
                validationTrigger={facilityForm.validationError}
              />
              <TextInput
                label="State"
                placeholder="Enter state"
                name={facilityForm.fieldNames.state}
                onChange={facilityForm.handleChange}
                value={facilityForm.formData.state}
                validation={facilityForm.validationSchema?.state}
                validationTrigger={facilityForm.validationError}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <TextInput
                label="Country"
                placeholder="Enter country"
                name={facilityForm.fieldNames.country}
                onChange={facilityForm.handleChange}
                value={facilityForm.formData.country}
                validation={facilityForm.validationSchema?.country}
                validationTrigger={facilityForm.validationError}
              />
              <TextInput
                label="Zip Code"
                placeholder="111111"
                name={facilityForm.fieldNames.postal_code}
                onChange={facilityForm.handleChange}
                value={facilityForm.formData.postal_code}
                validation={facilityForm.validationSchema?.postal_code}
                validationTrigger={facilityForm.validationError}
              />
            </div>

            <button className="text-sm bg-black text-white font-bold py-2.5 rounded-xl block mt-2">
              Create facility
            </button>
          </form>
        </ModalLayout>
      )}

      {isActionRequestService && (
        <ModalLayout
          title="Service request"
          description="Be clear and concise with your request to allow for speedy resolution"
          onClose={() => setIsActionRequestService(false)}
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
            {/* <div className="grid grid-cols-2 gap-4">
              <SelectInput
                label="Facility"
                placeholder="Click to select a facility"
                name={serviceRequestForm.fieldNames.facilityId}
                onChange={serviceRequestForm.handleChange}
                value={serviceRequestForm.formData.facilityId}
                validation={serviceRequestForm.validationSchema?.facilityId}
                validationTrigger={serviceRequestForm.validationError}
              />
            </div> */}
            <SelectInput
              label="Service type"
              placeholder="Click to select an option"
              name={serviceRequestForm.fieldNames.service_type}
              onChange={serviceRequestForm.handleChange}
              value={serviceRequestForm.formData.service_type}
              validation={serviceRequestForm.validationSchema?.service_type}
              validationTrigger={serviceRequestForm.validationError}
              options={[{ id: "PLUMBING", name: "Plumbing" }]}
            />
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
