import { useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { AppRouterPaths } from "../router/app.router";
import { NavLink, Outlet, useParams } from "react-router-dom";
import ModalLayout from "../layouts/modal-layout/ModalLayout";
import { useForm } from "../utils/hooks/useForm.hook";
import SelectInput from "../components/inputs/select-input/SelectInput";
import useSWR from "swr";
import adminService from "../http/admin.service";
import { SWRFetcher } from "../utils/helpers/http.helpers";
import { z } from "zod";
import { enqueueSnackbar } from "notistack";

export default function AccountFacility() {
  const { facilityId } = useParams();
  const [isActionInviteResident, setIsActionInviteResident] = useState(false);

  const residentForm = useForm({
    initialFormData: {
      email: "",
      role: "",
    },
    validationSchema: z.object({
      email: z.string().email("Enter a valid email"),
      role: z.string(),
    }),
    async onSubmit(formData, reset) {
      const { data, error } = await adminService.AddUserToFacility({
        role: formData.role,
        email: formData.email,
        facilityId,
      });

      enqueueSnackbar({
        message: data?.message || error?.message,
        variant: data ? "success" : "error",
      });

      if (data) {
        setIsActionInviteResident(false);
        reset();
      }
    },
  });

  const platformUsers = useSWR(
    residentForm.formData.email
      ? "adminService.FindUsers" + residentForm.formData.email
      : undefined,
    SWRFetcher(() =>
      adminService.FindUsers({ query: residentForm.formData.email })
    )
  );

  return (
    <DashboardLayout
      crumbs={[
        { id: "#", name: "Account" },
        { id: AppRouterPaths.ACCOUNT.FACILITIES().INDEX, name: "Facilities" },
        {
          id: AppRouterPaths.ACCOUNT.FACILITIES(facilityId).VIEW,
          name: facilityId?.toUpperCase() || "Facility ID",
        },
      ]}
    >
      <section className="p-5 flex items-center justify-between">
        <h1 className="text-2xl font-medium">Manage Facility</h1>

        <div className="flex gap-2">
          <NavLink
            to={AppRouterPaths.ACCOUNT.FACILITIES(facilityId).RESIDENTS}
            className={
              "text-xs py-2 block px-3 rounded-lg bg-gray-100 font-semibold"
            }
          >
            Residents
          </NavLink>
          <NavLink
            to={AppRouterPaths.ACCOUNT.FACILITIES(facilityId).SERVICE_REQUESTS}
            className={`text-xs py-2 block px-3 rounded-lg bg-gray-100 font-semibold`}
          >
            Service Requests
          </NavLink>
          <button
            className={`text-xs py-2 block px-3 rounded-lg font-semibold bg-black text-white`}
            onClick={() => setIsActionInviteResident(true)}
          >
            Invite resident
          </button>
        </div>
      </section>

      <Outlet />

      {isActionInviteResident && (
        <ModalLayout
          onClose={() => setIsActionInviteResident(false)}
          description="Add a resident to your facility"
          title="Invite a resident"
        >
          <form onSubmit={residentForm.handleSubmit} className="grid gap-4">
            <SelectInput
              label="Resident Email"
              name={residentForm.fieldNames.email}
              onChange={residentForm.handleChange}
              value={residentForm.formData.email}
              validation={residentForm.validationSchema?.email}
              validationTrigger={residentForm.validationError}
              comboBox
              options={platformUsers.data?.data.map((user: any) => ({
                id: user.email,
                name: `${user.first_name} ${user.last_name} <${user.email}>`,
              }))}
            />

            <SelectInput
              label="Add resident as"
              name={residentForm.fieldNames.role}
              onChange={residentForm.handleChange}
              value={residentForm.formData.role}
              validation={residentForm.validationSchema?.role}
              validationTrigger={residentForm.validationError}
              options={[
                { id: "tenant", name: "A Tenant" },
                { id: "landlord", name: "A Facility Manager" },
                { id: "visitor", name: "A visitor" },
              ]}
            />

            <button className="text-sm bg-black text-white font-bold py-2.5 rounded-xl block mt-2">
              Add this resident
            </button>
          </form>
        </ModalLayout>
      )}
    </DashboardLayout>
  );
}
