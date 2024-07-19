import { ReactNode } from "react";

export type PartialRequired<T, K extends keyof T> = T & {
  [P in K]-?: T[P];
};

export type ArrayElement<ArrType> =
  ArrType extends readonly (infer ElementType)[] ? ElementType : never;

export type InputChangePayload = {
  field: string;
  value: string;
};

export type ListItem = {
  id: string;
  name: string;
  description?: string;
  icon?: ReactNode;
  // eslint-disable-next-line @typescript-eslint/ban-types
  action?: Function;
  image?: string;
  component?(): ReactNode;
};
