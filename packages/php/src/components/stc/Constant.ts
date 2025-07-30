import { createStringTemplateComponent } from "@alloy-js/core/stc";
import { Constant as ConstantComponent, ConstantProps } from "../Constant.js";

/**
 * String template version of PHP Constant component
 */
export const Constant = createStringTemplateComponent(ConstantComponent) as (
  props: ConstantProps,
) => any;
