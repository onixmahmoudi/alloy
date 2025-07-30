import { createStringTemplateComponent } from "@alloy-js/core/stc";
import { Class as ClassComponent, ClassProps } from "../Class.js";

/**
 * String template version of PHP Class component
 */
export const Class = createStringTemplateComponent(ClassComponent) as (
  props: ClassProps,
) => any;
