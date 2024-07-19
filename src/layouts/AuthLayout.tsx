import { ReactNode } from "react";

export default function AuthLayout(props: { children: ReactNode }) {
  return (
    <main className="min-h-screen flex">
      <div className="w-full max-w-[600px]">{props.children}</div>

      <img
        src={
          "https://images.unsplash.com/photo-1720697022909-a7eead3d9eed?q=80&w=3687&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        }
        alt=""
        className="h-screen w-full object-cover sticky top-0"
      />
    </main>
  );
}
