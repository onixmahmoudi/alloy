import { Block, Children, Scope, Show } from "@alloy-js/core";
import { usePhpNamePolicy } from "../name-policy.js";
import { Declaration, DeclarationProps } from "./Declaration.js";
import { Name } from "./Name.js";

export interface InterfaceProps extends DeclarationProps {
  extends?: Children[];
}

/**
 * Represents a PHP interface declaration
 */
export function Interface(props: InterfaceProps) {
  const name = usePhpNamePolicy().getName(props.name, "interface");

  return (
    <Declaration {...props} name={name} nameKind="interface">
      interface <Name>{name}</Name>
      <Show when={props.extends && props.extends.length > 0}>
        {" "}
        extends {props.extends!.join(", ")}
      </Show>
      <Block>
        <Scope name={name} kind="interface">
          {props.children}
        </Scope>
      </Block>
    </Declaration>
  );
}
