import { Reference as CoreReference, RefOf } from "@alloy-js/core";
import { PhpOutputSymbol } from "../symbols/index.js";

/**
 * PHP-specific reference component that handles FQN resolution
 */
export function Reference(ref: RefOf<PhpOutputSymbol>) {
  return <CoreReference ref={ref} />;
}
