import { Children } from "@alloy-js/core";
import { PhpOutputSymbol } from "../symbols/index.js";
import { ImportManager, useImportManager } from "./ImportManager.js";
import { useNamespace } from "./Namespace.js";
import { SourceFile } from "./SourceFile.jsx";

export interface SmartReferenceProps {
  /** Symbol to reference */
  symbol: PhpOutputSymbol;
  /** Preferred alias if there are conflicts */
  preferredAlias?: string;
  /** Whether to mark this reference as used */
  markAsUsed?: boolean;
  /** Custom display name override */
  displayName?: string;
}

/**
 * Smart reference that automatically handles imports and naming conflicts
 */
export function SmartReference(props: SmartReferenceProps) {
  const { symbol, preferredAlias, markAsUsed = true, displayName } = props;
  const importManager = useImportManager();
  const namespace = useNamespace();

  // Determine the name to use
  let referenceName: string;

  if (displayName) {
    // Use custom display name
    referenceName = displayName;
  } else if (symbol.namespace === namespace?.qualifiedName) {
    // Same namespace, use simple name
    referenceName = symbol.name;
  } else {
    // Different namespace, add to imports and get the alias
    referenceName = importManager.addImport(symbol, preferredAlias);
  }

  // Mark as used if requested
  if (markAsUsed) {
    importManager.markUsed(referenceName);
  }

  return <>{referenceName}</>;
}

export interface TypeReferenceProps {
  /** Type symbol to reference */
  type: PhpOutputSymbol;
  /** Whether the type is nullable */
  nullable?: boolean;
  /** Array depth (0 = not array, 1 = array, 2 = array of arrays) */
  arrayDepth?: number;
}

/**
 * Smart type reference with nullable and array support
 */
export function TypeReference(props: TypeReferenceProps) {
  const { type, nullable = false, arrayDepth = 0 } = props;

  let typeString = "";

  // Add nullable indicator
  if (nullable) {
    typeString += "?";
  }

  // Add the type name
  typeString += <SmartReference symbol={type} />;

  // Add array brackets
  if (arrayDepth > 0) {
    typeString += "[]".repeat(arrayDepth);
  }

  return <>{typeString}</>;
}

export interface FullyQualifiedReferenceProps {
  /** Symbol to reference with full namespace */
  symbol: PhpOutputSymbol;
  /** Whether to escape backslashes for strings */
  escapeBackslashes?: boolean;
}

/**
 * Always uses fully qualified name (for documentation, strings, etc.)
 */
export function FullyQualifiedReference(props: FullyQualifiedReferenceProps) {
  const { symbol, escapeBackslashes = false } = props;

  let fqn = symbol.fullyQualifiedName;

  if (escapeBackslashes) {
    fqn = fqn.replace(/\\/g, "\\\\");
  }

  return <>{fqn}</>;
}

export interface ImportOptimizedSourceFileProps {
  /** File path */
  path: string;
  /** Current namespace */
  namespace?: string;
  /** Import grouping strategy */
  groupingStrategy?: "alphabetical" | "by-vendor" | "by-type" | "by-length";
  /** Children components */
  children?: Children;
}

/**
 * Source file with automatic import optimization
 */
export function ImportOptimizedSourceFile(
  props: ImportOptimizedSourceFileProps,
) {
  const { path, namespace, groupingStrategy, children } = props;

  return (
    <ImportManager
      currentNamespace={namespace}
      groupingStrategy={groupingStrategy}
      autoResolveConflicts={true}
      removeUnused={true}
    >
      <SourceFile path={path}>{children}</SourceFile>
    </ImportManager>
  );
}
