import { ReactNode } from "react";

export type ModalLayoutProps = {
  children: ReactNode;
  title: string;
  description: ReactNode;
  onClose: VoidFunction;
};
