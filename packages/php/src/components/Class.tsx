import { Block, Children, Scope, Show } from "@alloy-js/core";
import { usePhpNamePolicy } from "../name-policy.js";
import { Declaration, DeclarationProps } from "./Declaration.js";
import { Name } from "./Name.js";

export interface ClassProps extends DeclarationProps {
  abstract?: boolean;
  final?: boolean;
  extends?: Children;
  implements?: Children[];
}

/**
 * Represents a PHP class declaration
 */
export function Class(props: ClassProps) {
  const name = usePhpNamePolicy().getName(props.name, "class");

  return (
    <Declaration {...props} name={name} nameKind="class">
      <Show when={props.abstract}>abstract </Show>
      <Show when={props.final}>final </Show>
      class <Name>{name}</Name>
      <Show when={props.extends}> extends {props.extends}</Show>
      <Show when={props.implements && props.implements.length > 0}>
        {" "}
        implements {props.implements!.join(", ")}
      </Show>
      <Block>
        <Scope name={name} kind="class">
          {props.children}
        </Scope>
      </Block>
    </Declaration>
  );
}
