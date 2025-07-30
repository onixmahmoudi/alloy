import { createStringTemplateComponent } from "@alloy-js/core/stc";
import { Function as FunctionComponent, FunctionProps } from "../Function.js";

/**
 * String template version of PHP Function component
 */
export const Function = createStringTemplateComponent(FunctionComponent) as (
  props: FunctionProps,
) => any;
