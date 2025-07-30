import { createStringTemplateComponent } from "@alloy-js/core/stc";
import { Method as MethodComponent, MethodProps } from "../Method.js";

/**
 * String template version of PHP Method component
 */
export const Method = createStringTemplateComponent(MethodComponent) as (
  props: MethodProps,
) => any;
