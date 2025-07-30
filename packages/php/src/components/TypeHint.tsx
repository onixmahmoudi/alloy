export interface TypeHintProps {
  types: string[];
  nullable?: boolean;
  union?: boolean; // PHP 8.0+ union types (string|int)
  intersection?: boolean; // PHP 8.1+ intersection types (A&B)
}

/**
 * Represents modern PHP type hints including union and intersection types
 */
export function TypeHint(props: TypeHintProps) {
  const {
    types,
    nullable = false,
    union = false,
    intersection = false,
  } = props;

  if (types.length === 0) {
    return null;
  }

  const separator =
    intersection ? "&"
    : union ? "|"
    : "";
  const typeString = types.join(separator);

  return (
    <>
      {nullable && "?"}
      {typeString}
    </>
  );
}

/**
 * Helper function to create union type hints
 */
export function UnionType(types: string[], nullable = false): TypeHintProps {
  return {
    types,
    nullable,
    union: true,
  };
}

/**
 * Helper function to create intersection type hints
 */
export function IntersectionType(
  types: string[],
  nullable = false,
): TypeHintProps {
  return {
    types,
    nullable,
    intersection: true,
  };
}

/**
 * Helper function to create nullable type hints
 */
export function NullableType(type: string): TypeHintProps {
  return {
    types: [type],
    nullable: true,
  };
}
