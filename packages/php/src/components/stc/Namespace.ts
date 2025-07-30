import { createStringTemplateComponent } from "@alloy-js/core/stc";
import {
  Namespace as NamespaceComponent,
  NamespaceProps,
} from "../Namespace.js";

/**
 * String template version of PHP Namespace component
 */
export const Namespace = createStringTemplateComponent(NamespaceComponent) as (
  props: NamespaceProps,
) => any;
