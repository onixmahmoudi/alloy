import { createStringTemplateComponent } from "@alloy-js/core/stc";
import { Trait as TraitComponent, TraitProps } from "../Trait.js";

/**
 * String template version of PHP Trait component
 */
export const Trait = createStringTemplateComponent(TraitComponent) as (
  props: TraitProps,
) => any;
