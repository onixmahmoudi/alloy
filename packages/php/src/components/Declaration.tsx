import {
  Children,
  Declaration as CoreDeclaration,
  DeclarationProps as CoreDeclarationProps,
} from "@alloy-js/core";

export interface DeclarationProps extends CoreDeclarationProps {
  name: string;
  children?: Children;
}

/**
 * Base declaration component for PHP language elements
 */
export function Declaration(props: DeclarationProps) {
  return <CoreDeclaration {...props}>{props.children}</CoreDeclaration>;
}
