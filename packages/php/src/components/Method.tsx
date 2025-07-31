import { Block, Show } from "@alloy-js/core";
import { usePhpNamePolicy } from "../name-policy.js";
import { Declaration, DeclarationProps } from "./Declaration.js";
import { Name } from "./Name.js";
import { Parameters, ParametersProps } from "./Parameters.js";

export type MethodProps = DeclarationProps &
  ParametersProps & {
    visibility?: "public" | "private" | "protected";
    static?: boolean;
    abstract?: boolean;
    final?: boolean;
    returnType?: string;
  };

/**
 * Represents a PHP method declaration
 */
export function Method(props: MethodProps) {
  const name = usePhpNamePolicy().getName(props.name, "method");

  return (
    <Declaration {...props} name={name}>
      <Show when={!!props.visibility}>{props.visibility} </Show>
      <Show when={props.static}>static </Show>
      <Show when={props.abstract}>abstract </Show>
      <Show when={props.final}>final </Show>
      function <Name>{name}</Name>
      <Parameters {...props} />
      <Show when={!!props.returnType}>: {props.returnType}</Show>
      <Show when={!props.abstract}>
        <Block newline>{props.children}</Block>
        <br />
      </Show>
      <Show when={props.abstract}>;</Show>
    </Declaration>
  );
}
