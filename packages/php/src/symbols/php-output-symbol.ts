import { OutputSymbol, OutputSymbolOptions } from "@alloy-js/core";

export interface PhpOutputSymbolOptions extends OutputSymbolOptions {
  namespace?: string;
}

/**
 * Represents a symbol from a PHP file (class, interface, function, etc.)
 */
export class PhpOutputSymbol extends OutputSymbol {
  namespace?: string;

  constructor(name: string, options?: PhpOutputSymbolOptions) {
    super(name, options);
    this.namespace = options?.namespace;
  }

  /**
   * Gets the fully qualified name including namespace
   */
  get fullyQualifiedName(): string {
    if (this.namespace) {
      return `${this.namespace}\\${this.name}`;
    }
    return this.name;
  }

  /**
   * Gets the namespace path as an array of parts
   */
  get namespaceParts(): string[] {
    return this.namespace ? this.namespace.split("\\") : [];
  }
}
