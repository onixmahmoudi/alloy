import {
  Children,
  ComponentContext,
  createContext,
  Scope,
  useContext,
} from "@alloy-js/core";
import { PhpNamespaceScope } from "../symbols/index.js";

export interface NamespaceContext {
  scope: PhpNamespaceScope;
  // Full namespace name, e.g App\Models\User
  qualifiedName: string;
}

export const NamespaceContext: ComponentContext<NamespaceContext> =
  createContext();

export interface NamespaceProps {
  name: string;
  children?: Children;
}

/**
 * Represents a PHP namespace declaration
 */
export function Namespace(props: NamespaceProps) {
  const scope = new PhpNamespaceScope(props.name);

  const namespaceCtx: NamespaceContext = {
    scope,
    qualifiedName: props.name,
  };

  return (
    <NamespaceContext.Provider value={namespaceCtx}>
      <Scope value={scope}>{props.children}</Scope>
    </NamespaceContext.Provider>
  );
}

/**
 * Hook to get the current namespace context
 */
export function useNamespace(): NamespaceContext | undefined {
  return useContext(NamespaceContext);
}
