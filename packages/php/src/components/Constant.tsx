import { Children, Show } from "@alloy-js/core";
import { usePhpNamePolicy } from "../name-policy.js";
import { Declaration, DeclarationProps } from "./Declaration.js";
import { Name } from "./Name.js";

export type ConstantProps = DeclarationProps & {
  value: Children;
  type?: string;
  visibility?: "public" | "private" | "protected"; // For class constants
  final?: boolean; // PHP 8.1+ final constants
};

/**
 * Represents a PHP constant declaration (global or class)
 */
export function Constant(props: ConstantProps) {
  const name = usePhpNamePolicy().getName(props.name, "constant");

  return (
    <Declaration {...props} name={name}>
      <Show when={!!props.visibility}>{props.visibility} </Show>
      <Show when={!!props.final}>final </Show>
      <Show when={!!props.type}>{props.type} </Show>
      const <Name>{name}</Name> = {props.value};
      <hbr />
    </Declaration>
  );
}
