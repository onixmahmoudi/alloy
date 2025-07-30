import { Block, Children, Scope, Show } from "@alloy-js/core";
import { usePhpNamePolicy } from "../name-policy.js";
import { Declaration, DeclarationProps } from "./Declaration.js";
import { Name } from "./Name.js";

export interface EnumCase {
  name: string;
  value?: Children; // For backed enums
}

export interface EnumProps extends DeclarationProps {
  backingType?: "string" | "int"; // PHP 8.1+ backed enums
  implements?: Children[];
  cases: EnumCase[];
}

/**
 * Represents a PHP 8.1+ enum declaration
 */
export function Enum(props: EnumProps) {
  const name = usePhpNamePolicy().getName(props.name, "enum");

  return (
    <Declaration {...props} name={name}>
      enum <Name>{name}</Name>
      <Show when={props.backingType}>: {props.backingType}</Show>
      <Show when={props.implements && props.implements.length > 0}>
        {" "}
        implements {props.implements!.join(", ")}
      </Show>
      <Block>
        {props.cases.map((enumCase, index) => (
          <>
            case {usePhpNamePolicy().getName(enumCase.name, "enum-member")}
            <Show when={enumCase.value}> = {enumCase.value}</Show>;
            <hbr />
          </>
        ))}
        <Show when={props.cases.length > 0 && props.children}>
          <hbr />
        </Show>
        <Scope name={name} kind="enum">
          {props.children}
        </Scope>
      </Block>
    </Declaration>
  );
}
