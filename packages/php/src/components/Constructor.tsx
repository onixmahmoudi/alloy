import { Block, Show } from "@alloy-js/core";
import { Declaration, DeclarationProps } from "./Declaration.js";
import { Parameters, ParametersProps } from "./Parameters.js";

export interface ConstructorProps extends DeclarationProps, ParametersProps {
  visibility?: "public" | "private" | "protected";
  final?: boolean;
  promoted?: boolean; // PHP 8.0+ constructor property promotion
}

/**
 * Represents a PHP class constructor
 */
export function Constructor(props: ConstructorProps) {
  const name = "__construct";

  return (
    <Declaration {...props} name={name}>
      <Show when={props.visibility}>{props.visibility} </Show>
      <Show when={props.final}>final </Show>
      function {name}
      <Parameters {...props} />
      <Block>{props.children}</Block>
    </Declaration>
  );
}
