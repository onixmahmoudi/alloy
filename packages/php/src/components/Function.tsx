import { Block } from "@alloy-js/core";
import { usePhpNamePolicy } from "../name-policy.js";
import { Declaration, DeclarationProps } from "./Declaration.js";
import { Name } from "./Name.js";
import { Parameters, ParametersProps } from "./Parameters.js";

export interface FunctionProps extends DeclarationProps, ParametersProps {
  returnType?: string;
}

/**
 * Represents a PHP global function declaration
 */
export function Function(props: FunctionProps) {
  const name = usePhpNamePolicy().getName(props.name, "function");

  return (
    <Declaration {...props} name={name}>
      function <Name>{name}</Name>
      <Parameters {...props} />
      {props.returnType && `: ${props.returnType}`}
      <Block>{props.children}</Block>
    </Declaration>
  );
}
