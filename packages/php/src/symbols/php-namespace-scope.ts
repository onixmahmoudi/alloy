import { OutputScope } from "@alloy-js/core";

/**
 * Represents a PHP namespace scope for symbol management
 */
export class PhpNamespaceScope extends OutputScope {
  readonly namespaceName: string;

  constructor(namespaceName: string) {
    super();
    this.namespaceName = namespaceName;
  }

  /**
   * Gets the full qualified namespace name
   */
  get qualifiedName(): string {
    return this.namespaceName;
  }

  /**
   * Gets namespace parts as array
   */
  get parts(): string[] {
    return this.namespaceName.split("\\");
  }
}
