import { ElementType, ComponentProps } from "react";

export interface MenuItem {
  link: string;
  label: string;
  icon: ElementType<ComponentProps<'svg'>>;
  active?: boolean;
}
