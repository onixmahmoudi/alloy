import { createStringTemplateComponent } from "@alloy-js/core/stc";
import { Variable as VariableComponent, VariableProps } from "../Variable.js";

/**
 * String template version of PHP Variable component
 */
export const Variable = createStringTemplateComponent(VariableComponent) as (
  props: VariableProps,
) => any;
