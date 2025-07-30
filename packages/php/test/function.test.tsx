import { render } from "@alloy-js/core";
import { describe, expect, it } from "vitest";
import * as php from "../src/index.js";

describe("PHP Function", () => {
  it("should render a basic global function", () => {
    const result = render(
      <php.SourceFile path="helpers.php">
        <php.Function
          name="formatCurrency"
          parameters={[
            { name: "amount", type: "float" },
            { name: "currency", type: "string", defaultValue: '"USD"' },
          ]}
          returnType="string"
        >
          return $currency . ' ' . number_format($amount, 2);
        </php.Function>
      </php.SourceFile>,
      { namePolicy: php.createPhpNamePolicy() },
    );

    expect(result.contents).toMatchInlineSnapshot(`
      "<?php

      function format_currency(float $amount, string $currency = "USD"): string
      {
          return $currency . ' ' . number_format($amount, 2);
      }
      "
    `);
  });

  it("should render function without return type", () => {
    const result = render(
      <php.SourceFile path="utilities.php">
        <php.Function
          name="debugLog"
          parameters={[{ name: "message", type: "string" }]}
        >
          if (defined('DEBUG') && DEBUG) {"{"}
          error_log($message);
          {"}"}
        </php.Function>
      </php.SourceFile>,
      { namePolicy: php.createPhpNamePolicy() },
    );

    expect(result.contents).toMatchInlineSnapshot(`
      "<?php

      function debug_log(string $message)
      {
          if (defined('DEBUG') && DEBUG) {
              error_log($message);
          }
      }
      "
    `);
  });
});
