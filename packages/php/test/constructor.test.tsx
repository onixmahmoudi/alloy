import { Output } from "@alloy-js/core";
import * as coretest from "@alloy-js/core/testing";
import { describe, expect, it } from "vitest";
import * as php from "../src/index.js";
import { findFile, testRender } from "./utils.js";

describe("PHP Constructor", () => {
  it("should render a basic constructor", () => {
    const result = testRender(
      <Output>
        <php.Namespace name="App\Models">
          <php.SourceFile path="User.php">
            <php.Class name="User">
              <php.Constructor
                visibility="public"
                parameters={[
                  { name: "name", type: "string" },
                  { name: "email", type: "string" },
                ]}
              >
                // Method Body
              </php.Constructor>
            </php.Class>
          </php.SourceFile>
        </php.Namespace>
      </Output>,
    );

    const file = findFile(result, "User.php");
    expect(file).toBeDefined();
    expect(file!.contents).toBe(coretest.d`
<?php

namespace App\\Models;

class User
{
  public function __construct(string $name, string $email)
  {
    // Method Body
  }
}
    `);
  });

  it("should render private constructor", () => {
    const result = testRender(
      <Output>
        <php.Namespace name="App\Patterns">
          <php.SourceFile path="Singleton.php">
            <php.Class name="Singleton">
              <php.Constructor visibility="private" />
            </php.Class>
          </php.SourceFile>
        </php.Namespace>
      </Output>,
    );

    const file = findFile(result, "Singleton.php");
    expect(file).toBeDefined();
    expect(file!.contents).toBe(coretest.d`
<?php

namespace App\\Patterns;

class Singleton
{
  private function __construct() {}
}
    `);
  });
});
