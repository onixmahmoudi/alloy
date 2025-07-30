import { Children } from "@alloy-js/core/jsx-runtime";

export interface NameProps {
  children?: Children;
}

/**
 * Represents a name in PHP code
 */
export function Name(props: NameProps) {
  return <>{props.children}</>;
}
