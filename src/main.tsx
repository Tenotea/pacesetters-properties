import React from "react";
import ReactDOM from "react-dom/client";
import "./assets/styles/index.css";
import { RouterProvider } from "react-router-dom";
import { AppRouter } from "./router/app.router.ts";
import { SnackbarProvider } from "notistack";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SnackbarProvider
      dense
      anchorOrigin={{ horizontal: "right", vertical: "top" }}
    >
      <RouterProvider router={AppRouter} />
    </SnackbarProvider>
  </React.StrictMode>
);
