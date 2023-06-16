import { ReactElement } from "react";

export type ActionList = {
    id?: string;
    label: string;
    icon?: ReactElement;
};

export type SelectOptionType = {
  value: number | string;
  label: string | number;
};