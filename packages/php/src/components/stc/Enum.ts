import { createStringTemplateComponent } from "@alloy-js/core/stc";
import { Enum as EnumComponent, EnumProps } from "../Enum.js";

/**
 * String template version of PHP Enum component
 */
export const Enum = createStringTemplateComponent(EnumComponent) as (
  props: EnumProps,
) => any;
