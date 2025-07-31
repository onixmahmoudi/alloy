import { Children, Show } from "@alloy-js/core";
import { usePhpNamePolicy } from "../name-policy.js";
import { Declaration, DeclarationProps } from "./Declaration.js";
import { Name } from "./Name.js";

export type VariableProps = DeclarationProps & {
  type?: string;
  defaultValue?: Children;
  global?: boolean;
  static?: boolean;
};

/**
 * Represents a PHP variable declaration
 */
export function Variable(props: VariableProps) {
  const name = usePhpNamePolicy().getName(props.name, "variable");

  return (
    <Declaration {...props} name={name}>
      <Show when={!!props.global}>global </Show>
      <Show when={!!props.static}>static </Show>
      <Show when={!!props.type}>{props.type} </Show>$<Name>{name}</Name>
      <Show when={!!props.defaultValue}> = {props.defaultValue}</Show>;
      <hbr />
    </Declaration>
  );
}
