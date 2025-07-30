import { createStringTemplateComponent } from "@alloy-js/core/stc";
import {
  SourceFile as SourceFileComponent,
  SourceFileProps,
} from "../SourceFile.js";

/**
 * String template version of PHP SourceFile component
 */
export const SourceFile = createStringTemplateComponent(
  SourceFileComponent,
) as (props: SourceFileProps) => any;
