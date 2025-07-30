import { Children, Show } from "@alloy-js/core";
import { usePhpNamePolicy } from "../name-policy.js";
import { Declaration, DeclarationProps } from "./Declaration.js";
import { Name } from "./Name.js";

export interface PropertyProps extends DeclarationProps {
  visibility?: "public" | "private" | "protected";
  static?: boolean;
  readonly?: boolean;
  type?: string;
  defaultValue?: Children;
}

/**
 * Represents a PHP class property
 */
export function Property(props: PropertyProps) {
  const name = usePhpNamePolicy().getName(props.name, "property");

  return (
    <Declaration {...props} name={name} nameKind="property">
      <Show when={props.visibility}>{props.visibility} </Show>
      <Show when={props.static}>static </Show>
      <Show when={props.readonly}>readonly </Show>
      <Show when={props.type}>{props.type} </Show>$<Name>{name}</Name>
      <Show when={props.defaultValue}> = {props.defaultValue}</Show>;
      <hbr />
    </Declaration>
  );
}
