import * as coretest from "@alloy-js/core/testing";
import { describe, expect, it } from "vitest";
import * as php from "../src/index.js";
import { findFile, testRender } from "./utils.js";

describe("PHP Function", () => {
  it("should render a basic global function", () => {
    const result = testRender(
      <php.Namespace name="App\Helpers">
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
        </php.SourceFile>
      </php.Namespace>,
    );

    const file = findFile(result, "helpers.php");
    expect(file).toBeDefined();
    expect(file!.contents).toBe(coretest.d`
<?php

namespace App\\Helpers;

function formatCurrency(float $amount, string $currency = "USD"): string
{
  return $currency . ' ' . number_format($amount, 2);
}
    `);
  });

  it("should render function without return type", () => {
    const result = testRender(
      <php.Namespace name="App\Utilities">
        <php.SourceFile path="utilities.php">
          <php.Function
            name="debugLog"
            parameters={[{ name: "message", type: "string" }]}
          >
            // Method Body
          </php.Function>
        </php.SourceFile>
      </php.Namespace>,
    );

    const file = findFile(result, "utilities.php");
    expect(file).toBeDefined();
    expect(file!.contents).toBe(coretest.d`
<?php

namespace App\\Utilities;

function debugLog(string $message)
{
  // Method Body
}
    `);
  });
});
