import { useForm } from "../utils/hooks/useForm.hook";
import { z } from "zod";
import { AppRouterPaths } from "../router/app.router";
import AuthLayout from "../layouts/AuthLayout";
import { Link, useNavigate } from "react-router-dom";
import { TextInput } from "../components/inputs/text-input/TextInput";
import { IMG_CompanyLogo } from "../assets/images";
import authService from "../http/auth.service";
import { enqueueSnackbar } from "notistack";
import SessionManager, {
  SessionManagerKeys,
} from "../utils/config/sessionManager.config";

function useSignInTemplate() {
  const navigate = useNavigate();

  const signInForm = useForm({
    initialFormData: {
      email: "",
      password: "",
    },
    validationSchema: z.object({
      email: z.string().email("Enter a valid email address"),
      password: z.string().min(6, "Enter a valid password"),
    }),
    async onSubmit(formData) {
      const { data, error } = await authService.CreateUserSession(formData);

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

  return { signInForm };
}

export default function SignInTemplate() {
  const h = useSignInTemplate();
  return (
    <AuthLayout>
      <section className="p-10">
        <img src={IMG_CompanyLogo} className="h-10" />
        <header className="mt-24">
          <h1 className="text-4xl font-bold">Welcome back!</h1>
          <p className="text-stone-400 mt-2 text-sm">
            Empower your team and take full control of your facilities. Begin
            your journey with the future of facility management
          </p>
        </header>

        <form className="grid gap-5 mt-16" onSubmit={h.signInForm.handleSubmit}>
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
          Don't have an account?{" "}
          <Link
            to={AppRouterPaths.SIGN_UP}
            className="underline font-medium text-black"
          >
            {" "}
            Sign up here
          </Link>
        </div>
      </section>
    </AuthLayout>
  );
}
