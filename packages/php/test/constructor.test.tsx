import { render } from "@alloy-js/core";
import { describe, expect, it } from "vitest";
import * as php from "../src/index.js";

describe("PHP Constructor", () => {
  it("should render a basic constructor", () => {
    const result = render(
      <php.SourceFile path="User.php">
        <php.Namespace name="App\Models">
          <php.Class name="User">
            <php.Constructor
              visibility="public"
              parameters={[
                { name: "name", type: "string" },
                { name: "email", type: "string" }
              ]}
            >
              $this->name = $name;
              $this->email = $email;
            </php.Constructor>
          </php.Class>
        </php.Namespace>
      </php.SourceFile>,
      { namePolicy: php.createPhpNamePolicy() }
    );

    expect(result.contents).toMatchInlineSnapshot(`
      "<?php

      namespace App\\Models;

      class User
      {
          public function __construct(string $name, string $email)
          {
              $this->name = $name;
              $this->email = $email;
          }
      }
      "
    `);
  });

  it("should render private constructor", () => {
    const result = render(
      <php.SourceFile path="Singleton.php">
        <php.Namespace name="App\Patterns">
          <php.Class name="Singleton">
            <php.Constructor visibility="private" />
          </php.Class>
        </php.Namespace>
      </php.SourceFile>,
      { namePolicy: php.createPhpNamePolicy() }
    );

    expect(result.contents).toMatchInlineSnapshot(`
      "<?php

      namespace App\\Patterns;

      class Singleton
      {
          private function __construct()
          {
          }
      }
      "
    `);
  });
}); 