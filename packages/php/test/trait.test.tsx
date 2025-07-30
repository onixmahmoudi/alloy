import { render } from "@alloy-js/core";
import { describe, expect, it } from "vitest";
import * as php from "../src/index.js";

describe("PHP Trait", () => {
  it("should render a basic trait", () => {
    const result = render(
      <php.SourceFile path="Loggable.php">
        <php.Namespace name="App\Traits">
          <php.Trait name="Loggable">
            <php.Method
              name="log"
              visibility="public"
              parameters={[{ name: "message", type: "string" }]}
            >
              error_log($message);
            </php.Method>
          </php.Trait>
        </php.Namespace>
      </php.SourceFile>,
      { namePolicy: php.createPhpNamePolicy() },
    );

    expect(result.contents).toMatchInlineSnapshot(`
      "<?php

      namespace App\\Traits;

      trait Loggable
      {
          public function log(string $message)
          {
              error_log($message);
          }
      }
      "
    `);
  });

  it("should render trait with used traits", () => {
    const result = render(
      <php.SourceFile path="ComplexTrait.php">
        <php.Namespace name="App\Traits">
          <php.Trait
            name="ComplexTrait"
            uses={["LoggableTrait", "CacheableTrait"]}
          >
            <php.Method name="complexMethod" visibility="public">
              // Complex logic
            </php.Method>
          </php.Trait>
        </php.Namespace>
      </php.SourceFile>,
      { namePolicy: php.createPhpNamePolicy() },
    );

    expect(result.contents).toMatchInlineSnapshot(`
      "<?php

      namespace App\\Traits;

      trait ComplexTrait
      {
          use LoggableTrait;
          use CacheableTrait;

          public function complexMethod()
          {
              // Complex logic
          }
      }
      "
    `);
  });
});
