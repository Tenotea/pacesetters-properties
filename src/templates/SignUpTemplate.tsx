import { useForm } from "../utils/hooks/useForm.hook";
import { z } from "zod";
import { AppRouterPaths } from "../router/app.router";
import AuthLayout from "../layouts/AuthLayout";
import { Link, useNavigate } from "react-router-dom";
import { IMG_CompanyLogo } from "../assets/images";
import { TextInput } from "../components/inputs/text-input/TextInput";
import SelectInput from "../components/inputs/select-input/SelectInput";
import { ListItem } from "../utils/types/index.types";
import authService from "../http/auth.service";
import { enqueueSnackbar } from "notistack";
import SessionManager, {
  SessionManagerKeys,
} from "../utils/config/sessionManager.config";

function useSignUpTemplate() {
  const navigate = useNavigate();

  const signInForm = useForm({
    initialFormData: {
      email: "",
      password: "",
      user_type: "",
      first_name: "",
      last_name: "",
      phone: "",
    },
    validationSchema: z.object({
      first_name: z.string().min(3, "Enter a valid first name"),
      last_name: z.string().min(3, "Enter a valid last name"),
      user_type: z.string().min(3, "Select an account type"),
      email: z.string().email("Enter a valid email address"),
      password: z.string().min(6, "Enter a valid password"),
      phone: z.string().min(10, "Enter a valid phone number"),
    }),
    async onSubmit(formData) {
      const { data, error } = await authService.CreateUserAccount(formData);

      enqueueSnackbar({
        message: data?.message || error?.message.toString(),
        variant: data ? "success" : "error",
      });

      if (data) {
        navigate(AppRouterPaths.ACCOUNT.INDEX);
        SessionManager.Store({
          key: SessionManagerKeys.ACCESS_TOKEN,
          value: data.data.tokens.accessToken,
        });
      }
    },
  });

  const accountOptions: ListItem[] = [
    {
      id: "TENANT",
      name: "A resident",
    },
    {
      id: "ADMIN",
      name: "A facility manager",
    },
    {
      id: "ARTISAN",
      name: "An artisan",
    },
  ];

  return { signInForm, accountOptions };
}

export default function SignUpTemplate() {
  const h = useSignUpTemplate();
  return (
    <AuthLayout>
      <section className="p-10">
        <img src={IMG_CompanyLogo} className="h-10" />
        <header className="mt-24">
          <h1 className="text-4xl font-bold">Get onboard!</h1>
          <p className="text-stone-400 mt-2 text-sm">
            Empower your team and take full control of your facilities. Begin
            your journey with the future of facility management
          </p>
        </header>

        <form className="grid gap-5 mt-16" onSubmit={h.signInForm.handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <TextInput
              label="First name"
              name={h.signInForm.fieldNames.first_name}
              onChange={h.signInForm.handleChange}
              value={h.signInForm.formData.first_name}
              placeholder="Joshua"
              validation={h.signInForm.validationSchema?.first_name}
              validationTrigger={h.signInForm.validationError}
            />
            <TextInput
              label="Last name"
              name={h.signInForm.fieldNames.last_name}
              onChange={h.signInForm.handleChange}
              value={h.signInForm.formData.last_name}
              placeholder="Adeleke"
              validation={h.signInForm.validationSchema?.last_name}
              validationTrigger={h.signInForm.validationError}
            />
          </div>

          <SelectInput
            label="I am creating an account as"
            name={h.signInForm.fieldNames.user_type}
            onChange={h.signInForm.handleChange}
            value={h.signInForm.formData.user_type}
            placeholder="Click to select an option"
            options={h.accountOptions}
            validation={h.signInForm.validationSchema?.user_type}
            validationTrigger={h.signInForm.validationError}
          />

          <TextInput
            label="Email address"
            type="email"
            name={h.signInForm.fieldNames.email}
            onChange={h.signInForm.handleChange}
            value={h.signInForm.formData.email}
            placeholder="username@website.com"
            validation={h.signInForm.validationSchema?.email}
            validationTrigger={h.signInForm.validationError}
          />

          <TextInput
            label="Phone number"
            type="number"
            name={h.signInForm.fieldNames.phone}
            onChange={h.signInForm.handleChange}
            value={h.signInForm.formData.phone}
            iconLeft={
              <span className="font-semibold pl-2 text-black">+234</span>
            }
            placeholder=""
            validation={h.signInForm.validationSchema?.phone}
            validationTrigger={h.signInForm.validationError}
          />

          <TextInput
            label="Password"
            type="password"
            name={h.signInForm.fieldNames.password}
            onChange={h.signInForm.handleChange}
            value={h.signInForm.formData.password}
            placeholder="* * * * * *"
            validation={h.signInForm.validationSchema?.password}
            validationTrigger={h.signInForm.validationError}
          />

          <button className="py-3 w-full block bg-black text-white rounded-lg text-sm font-medium">
            Continue to dashboard
          </button>
        </form>

        <div className="text-gray-500 border-gray-200 rounded-lg border py-3 text-center mt-5 text-sm">
          Already have an account?{" "}
          <Link
            to={AppRouterPaths.SIGN_IN}
            className="underline font-medium text-black"
          >
            Continue to dashboard
          </Link>
        </div>
      </section>
    </AuthLayout>
  );
}
