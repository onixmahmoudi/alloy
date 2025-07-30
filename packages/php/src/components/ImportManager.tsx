import {
  Children,
  ComponentContext,
  createContext,
  reactive,
  useContext,
} from "@alloy-js/core";
import { PhpOutputSymbol } from "../symbols/index.js";

export interface ImportRecord {
  symbol: PhpOutputSymbol;
  alias?: string;
  used: boolean;
  importPath: string;
}

export interface ImportManagerContext {
  /** Add a symbol for import, returns the name to use in code */
  addImport(symbol: PhpOutputSymbol, preferredAlias?: string): string;
  /** Get all import records */
  getImports(): ImportRecord[];
  /** Get optimized import statements */
  getOptimizedImports(): ImportRecord[];
  /** Check if a symbol is already imported */
  isImported(symbol: PhpOutputSymbol): boolean;
  /** Mark an import as used */
  markUsed(symbolName: string): void;
  /** Resolve naming conflicts automatically */
  resolveConflicts(): void;
}

export const ImportManagerContext: ComponentContext<ImportManagerContext> =
  createContext();

export interface ImportManagerProps {
  /** Current namespace context */
  currentNamespace?: string;
  /** Import grouping strategy */
  groupingStrategy?: "alphabetical" | "by-vendor" | "by-type" | "by-length";
  /** Auto-resolve conflicts */
  autoResolveConflicts?: boolean;
  /** Remove unused imports */
  removeUnused?: boolean;
  /** Children components */
  children?: Children;
}

/**
 * Advanced import manager with conflict resolution and optimization
 */
export function ImportManager(props: ImportManagerProps) {
  const {
    currentNamespace,
    groupingStrategy = "alphabetical",
    autoResolveConflicts = true,
    removeUnused = true,
    children,
  } = props;

  // Reactive collections
  const imports = reactive<Map<string, ImportRecord>>(new Map());
  const aliases = reactive<Map<string, string>>(new Map()); // alias -> original name
  const conflicts = reactive<Set<string>>(new Set());

  // Add a symbol for import
  function addImport(symbol: PhpOutputSymbol, preferredAlias?: string): string {
    const symbolKey = symbol.fullyQualifiedName;

    // Skip if in same namespace
    if (symbol.namespace === currentNamespace) {
      return symbol.name;
    }

    // Check if already imported
    if (imports.has(symbolKey)) {
      const existing = imports.get(symbolKey)!;
      existing.used = true;
      return existing.alias || symbol.name;
    }

    // Determine alias
    let alias = preferredAlias || symbol.name;
    let finalAlias = alias;
    let counter = 1;

    // Handle conflicts
    while (aliases.has(finalAlias) && aliases.get(finalAlias) !== symbolKey) {
      finalAlias = `${alias}${counter}`;
      counter++;
      conflicts.add(alias);
    }

    // Create import record
    const importRecord: ImportRecord = {
      symbol,
      alias: finalAlias !== symbol.name ? finalAlias : undefined,
      used: true,
      importPath: symbol.fullyQualifiedName,
    };

    imports.set(symbolKey, importRecord);
    aliases.set(finalAlias, symbolKey);

    return finalAlias;
  }

  // Get all imports
  function getImports(): ImportRecord[] {
    return Array.from(imports.values());
  }

  // Get optimized imports (grouped and sorted)
  function getOptimizedImports(): ImportRecord[] {
    let importList = Array.from(imports.values());

    // Remove unused if configured
    if (removeUnused) {
      importList = importList.filter((imp) => imp.used);
    }

    // Group and sort based on strategy
    switch (groupingStrategy) {
      case "alphabetical":
        return importList.sort((a, b) =>
          a.importPath.localeCompare(b.importPath),
        );

      case "by-vendor":
        return importList.sort((a, b) => {
          const vendorA = a.importPath.split("\\")[0];
          const vendorB = b.importPath.split("\\")[0];
          if (vendorA !== vendorB) {
            return vendorA.localeCompare(vendorB);
          }
          return a.importPath.localeCompare(b.importPath);
        });

      case "by-type":
        return importList.sort((a, b) => {
          // Prioritize: Interfaces, Abstract classes, Classes, Traits, etc.
          const getTypeOrder = (path: string) => {
            if (
              path.includes("\\Contracts\\") ||
              path.includes("\\Interfaces\\")
            )
              return 0;
            if (path.includes("\\Abstract")) return 1;
            if (path.includes("\\Traits\\")) return 3;
            if (path.includes("\\Enums\\")) return 4;
            return 2; // Regular classes
          };

          const orderA = getTypeOrder(a.importPath);
          const orderB = getTypeOrder(b.importPath);

          if (orderA !== orderB) {
            return orderA - orderB;
          }
          return a.importPath.localeCompare(b.importPath);
        });

      case "by-length":
        return importList.sort((a, b) => {
          if (a.importPath.length !== b.importPath.length) {
            return a.importPath.length - b.importPath.length;
          }
          return a.importPath.localeCompare(b.importPath);
        });

      default:
        return importList;
    }
  }

  // Check if symbol is imported
  function isImported(symbol: PhpOutputSymbol): boolean {
    return imports.has(symbol.fullyQualifiedName);
  }

  // Mark import as used
  function markUsed(symbolName: string): void {
    for (const importRecord of imports.values()) {
      const useName = importRecord.alias || importRecord.symbol.name;
      if (useName === symbolName) {
        importRecord.used = true;
        break;
      }
    }
  }

  // Resolve naming conflicts
  function resolveConflicts(): void {
    if (!autoResolveConflicts) return;

    const nameCount = new Map<string, number>();
    const conflictedImports: ImportRecord[] = [];

    // Count name occurrences
    for (const importRecord of imports.values()) {
      const name = importRecord.symbol.name;
      nameCount.set(name, (nameCount.get(name) || 0) + 1);

      if (nameCount.get(name)! > 1) {
        conflictedImports.push(importRecord);
      }
    }

    // Resolve conflicts by adding namespace prefixes
    for (const importRecord of conflictedImports) {
      const symbol = importRecord.symbol;
      const namespaceParts = symbol.namespaceParts;

      // Use last namespace part as prefix
      if (namespaceParts.length > 0) {
        const prefix = namespaceParts[namespaceParts.length - 1];
        importRecord.alias = `${prefix}${symbol.name}`;
      }
    }
  }

  const context: ImportManagerContext = {
    addImport,
    getImports,
    getOptimizedImports,
    isImported,
    markUsed,
    resolveConflicts,
  };

  return (
    <ImportManagerContext.Provider value={context}>
      {children}
    </ImportManagerContext.Provider>
  );
}

/**
 * Hook to access the import manager context
 */
export function useImportManager(): ImportManagerContext {
  const context = useContext(ImportManagerContext);
  if (!context) {
    throw new Error("useImportManager must be used within an ImportManager");
  }
  return context;
}
