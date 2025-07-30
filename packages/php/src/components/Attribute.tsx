import { Children, Show } from "@alloy-js/core";

export interface AttributeArgument {
  name?: string; // Named argument
  value: Children;
}

export interface AttributeProps {
  name: string;
  arguments?: AttributeArgument[];
  target?: "class" | "method" | "property" | "parameter" | "function"; // Attribute target
}

/**
 * Represents a PHP 8.0+ attribute
 */
export function Attribute(props: AttributeProps) {
  return (
    <>
      #[{props.name}
      <Show when={props.arguments && props.arguments.length > 0}>
        (
        {props.arguments!.map((arg, index) => (
          <>
            {index > 0 && ", "}
            <Show when={arg.name}>{arg.name}: </Show>
            {arg.value}
          </>
        ))}
        )
      </Show>
      ]
      <hbr />
    </>
  );
}

export interface AttributeListProps {
  attributes: AttributeProps[];
}

/**
 * Renders multiple PHP attributes
 */
export function AttributeList(props: AttributeListProps) {
  return (
    <>
      {props.attributes.map((attr, index) => (
        <Attribute key={index} {...attr} />
      ))}
    </>
  );
}
