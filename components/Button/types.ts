import { HTMLInputTypeAttribute } from "react";

export enum ButtonType {
  PRIMARY = "primary",
  SOFT = "soft",
}

export interface IInputProps {
  id: string;
  type: HTMLInputTypeAttribute;
  accept: string;
}
