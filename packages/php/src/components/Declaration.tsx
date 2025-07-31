import {
  Declaration as CoreDeclaration,
  DeclarationProps as CoreDeclarationProps,
} from "@alloy-js/core";

export type DeclarationProps = CoreDeclarationProps & {
  name: string;
};

/**
 * Base declaration component for PHP language elements
 */
export function Declaration(props: DeclarationProps) {
  return <CoreDeclaration {...props}>{props.children}</CoreDeclaration>;
}
