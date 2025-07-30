import {
  ComponentContext,
  SourceFile as CoreSourceFile,
  createContext,
  OutputSymbol,
  reactive,
  Scope,
  Show,
} from "@alloy-js/core";
import { Children } from "@alloy-js/core/jsx-runtime";
import { PhpOutputSymbol } from "../symbols/index.js";
import { useNamespace } from "./Namespace.js";
import { Reference } from "./Reference.js";
import { UseStatements, UseSymbol } from "./UseStatement.js";

export interface SourceFileContext {
  addUse(symbol: OutputSymbol): string;
}

export const SourceFileContext: ComponentContext<SourceFileContext> =
  createContext();

export interface SourceFileProps {
  path: string;
  children?: Children;
}

/**
 * Represents a PHP source file with proper PHP syntax
 */
export function SourceFile(props: SourceFileProps) {
  const namespaceCtx = useNamespace();

  // Collection of use statements
  const useRecords: UseSymbol[] = reactive([]);
  // Map a symbol to imported name, keep track of already imported symbols
  const importedSymbols = new Map<OutputSymbol, string>();

  // Add use statement to file if not already imported, returns name of imported symbol
  function addUse(symbol: PhpOutputSymbol): string {
    if (importedSymbols.has(symbol)) {
      return importedSymbols.get(symbol)!;
    }

    // Only need to import if not in same namespace
    if (symbol.namespace !== namespaceCtx?.qualifiedName) {
      useRecords.push({
        fullyQualifiedName: symbol.fullyQualifiedName,
        alias: symbol.name,
      });
    }
    importedSymbols.set(symbol, symbol.name);

    return symbol.name;
  }

  const sfContext: SourceFileContext = {
    addUse,
  };

  return (
    <CoreSourceFile path={props.path} filetype="php" reference={Reference}>
      {"<?php"}
      <hbr />
      <hbr />
      <Show when={namespaceCtx}>
        namespace {namespaceCtx?.qualifiedName};
        <hbr />
        <hbr />
      </Show>
      <Show when={useRecords.length > 0}>
        <UseStatements uses={useRecords} />
        <hbr />
      </Show>
      <SourceFileContext.Provider value={sfContext}>
        <Scope name={props.path} kind="source-file">
          {props.children}
        </Scope>
      </SourceFileContext.Provider>
    </CoreSourceFile>
  );
}
