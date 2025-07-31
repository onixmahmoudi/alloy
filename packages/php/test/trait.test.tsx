import * as coretest from "@alloy-js/core/testing";
import { describe, expect, it } from "vitest";
import * as php from "../src/index.js";
import { findFile, testRender } from "./utils.jsx";

describe("PHP Trait", () => {
  it("should render a basic trait", () => {
    const result = testRender(
      <php.Namespace name="App\Traits">
        <php.SourceFile path="Loggable.php">
          <php.Trait name="Loggable">
            <php.Method
              name="log"
              visibility="public"
              parameters={[{ name: "message", type: "string" }]}
            >
              error_log($message);
            </php.Method>
          </php.Trait>
        </php.SourceFile>
      </php.Namespace>,
    );

    const file = findFile(result, "Loggable.php");
    expect(file).toBeDefined();
    expect(file!.contents).toBe(coretest.d`
<?php

namespace App\\Traits;

trait Loggable
{
  public function log(string $message)
  {
    error_log($message);
  }

}
    `);
  });

  it("should render trait with used traits", () => {
    const result = testRender(
      <php.Namespace name="App\Traits">
        <php.SourceFile path="ComplexTrait.php">
          <php.Trait
            name="ComplexTrait"
            uses={["LoggableTrait", "CacheableTrait"]}
          >
            <php.Method name="complexMethod" visibility="public">
              // Complex logic
            </php.Method>
          </php.Trait>
        </php.SourceFile>
      </php.Namespace>,
    );

    const file = findFile(result, "ComplexTrait.php");
    expect(file).toBeDefined();
    expect(file!.contents).toBe(coretest.d`
<?php

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
    `);
  });
});
