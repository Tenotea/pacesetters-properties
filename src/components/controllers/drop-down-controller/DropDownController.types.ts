import { ReactNode } from "react";
import { ListItem } from "../../../utils/types/index.types";

export type DropDownControllerProps = {
  children: ReactNode;
  onSelect?: (payload: ListItem) => void;
  options?: ListItem[];
  width?: number;
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
  fit?: boolean;
};
