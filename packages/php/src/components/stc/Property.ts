import { createStringTemplateComponent } from "@alloy-js/core/stc";
import { Property as PropertyComponent, PropertyProps } from "../Property.js";

/**
 * String template version of PHP Property component
 */
export const Property = createStringTemplateComponent(PropertyComponent) as (
  props: PropertyProps,
) => any;
