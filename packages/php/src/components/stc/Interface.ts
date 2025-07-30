import { createStringTemplateComponent } from "@alloy-js/core/stc";
import {
  Interface as InterfaceComponent,
  InterfaceProps,
} from "../Interface.js";

/**
 * String template version of PHP Interface component
 */
export const Interface = createStringTemplateComponent(InterfaceComponent) as (
  props: InterfaceProps,
) => any;
