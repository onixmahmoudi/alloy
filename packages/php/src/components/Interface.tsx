import { Block, Scope, Show } from "@alloy-js/core";
import { usePhpNamePolicy } from "../name-policy.js";
import { Declaration, DeclarationProps } from "./Declaration.js";
import { Name } from "./Name.js";

export type InterfaceProps = DeclarationProps & {
  extends?: string[];
};

/**
 * Represents a PHP interface declaration
 */
export function Interface(props: InterfaceProps) {
  const name = usePhpNamePolicy().getName(props.name, "interface");

  return (
    <Declaration {...props} name={name}>
      interface <Name>{name}</Name>
      <Show when={!!props.extends && props.extends.length > 0}>
        {" "}
        extends {props.extends!.join(", ")}
      </Show>
      <Block newline>
        <Scope name={name} kind="interface">
          {props.children}
        </Scope>
      </Block>
    </Declaration>
  );
}
