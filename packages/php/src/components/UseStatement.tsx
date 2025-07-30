import { Children } from "@alloy-js/core/jsx-runtime";

export interface UseSymbol {
  fullyQualifiedName: string;
  alias?: string;
}

export interface UseStatementsProps {
  uses: UseSymbol[];
}

/**
 * Renders PHP use statements
 */
export function UseStatements(props: UseStatementsProps): Children {
  return (
    <>
      {props.uses.map((useSymbol) => (
        <UseStatement key={useSymbol.fullyQualifiedName} use={useSymbol} />
      ))}
    </>
  );
}

export interface UseStatementProps {
  use: UseSymbol;
}

/**
 * Renders a single PHP use statement
 */
export function UseStatement(props: UseStatementProps): Children {
  const { fullyQualifiedName, alias } = props.use;

  return (
    <>
      use {fullyQualifiedName}
      {alias && alias !== fullyQualifiedName.split("\\").pop() && (
        <> as {alias}</>
      )}
      ;
      <hbr />
    </>
  );
}
