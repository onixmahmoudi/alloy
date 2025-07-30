import { createNamePolicy, NamePolicy, useNamePolicy } from "@alloy-js/core";
import { camelCase, constantCase, pascalCase, snakeCase } from "change-case";

// PHP language elements for naming policy
export type PhpElements =
  | "class"
  | "interface"
  | "trait"
  | "enum"
  | "method"
  | "property"
  | "constant"
  | "variable"
  | "function"
  | "namespace"
  | "parameter";

// PHP reserved words that need to be avoided
const PHP_RESERVED_WORDS = new Set([
  "abstract",
  "and",
  "array",
  "as",
  "break",
  "callable",
  "case",
  "catch",
  "class",
  "clone",
  "const",
  "continue",
  "declare",
  "default",
  "die",
  "do",
  "echo",
  "else",
  "elseif",
  "empty",
  "enddeclare",
  "endfor",
  "endforeach",
  "endif",
  "endswitch",
  "endwhile",
  "eval",
  "exit",
  "extends",
  "final",
  "finally",
  "fn",
  "for",
  "foreach",
  "function",
  "global",
  "goto",
  "if",
  "implements",
  "include",
  "include_once",
  "instanceof",
  "insteadof",
  "interface",
  "isset",
  "list",
  "match",
  "namespace",
  "new",
  "or",
  "print",
  "private",
  "protected",
  "public",
  "readonly",
  "require",
  "require_once",
  "return",
  "static",
  "switch",
  "throw",
  "trait",
  "try",
  "unset",
  "use",
  "var",
  "while",
  "xor",
  "yield",
  "from",
]);

/**
 * Ensures a valid PHP identifier by avoiding reserved words
 */
function ensureNonReservedName(name: string): string {
  if (PHP_RESERVED_WORDS.has(name.toLowerCase())) {
    return `${name}_`;
  }
  return name;
}

/**
 * Creates a PHP naming policy following PSR standards
 */
export function createPhpNamePolicy(): NamePolicy<PhpElements> {
  return createNamePolicy((name, element) => {
    let transformedName: string;

    switch (element) {
      case "class":
      case "interface":
      case "trait":
      case "enum":
        // PSR-1: Class names MUST be declared in StudlyCaps (PascalCase)
        transformedName = pascalCase(name);
        break;

      case "namespace":
        // PSR-4: Namespace names follow PascalCase
        transformedName = pascalCase(name);
        break;

      case "constant":
        // PSR-1: Class constants MUST be declared in UPPER_CASE
        transformedName = constantCase(name);
        break;

      case "function":
        // Global functions typically use snake_case in PHP
        transformedName = snakeCase(name);
        break;

      case "method":
      case "property":
      case "variable":
      case "parameter":
      default:
        // PSR-1: Method and property names MUST be declared in camelCase
        transformedName = camelCase(name);
        break;
    }

    return ensureNonReservedName(transformedName);
  });
}

/**
 * Gets the active PHP naming policy from context
 */
export function usePhpNamePolicy(): NamePolicy<PhpElements> {
  return useNamePolicy();
}
