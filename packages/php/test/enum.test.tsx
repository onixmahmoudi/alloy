import { render } from "@alloy-js/core";
import { describe, expect, it } from "vitest";
import * as php from "../src/index.js";

describe("PHP Enum", () => {
  it("should render a basic enum", () => {
    const result = render(
      <php.SourceFile path="Status.php">
        <php.Namespace name="App\Enums">
          <php.Enum 
            name="Status"
            cases={[
              { name: "PENDING" },
              { name: "APPROVED" },
              { name: "REJECTED" }
            ]}
          />
        </php.Namespace>
      </php.SourceFile>,
      { namePolicy: php.createPhpNamePolicy() }
    );

    expect(result.contents).toMatchInlineSnapshot(`
      "<?php

      namespace App\\Enums;

      enum Status
      {
          case PENDING;
          case APPROVED;
          case REJECTED;
      }
      "
    `);
  });

  it("should render backed enum with string values", () => {
    const result = render(
      <php.SourceFile path="Priority.php">
        <php.Namespace name="App\Enums">
          <php.Enum 
            name="Priority"
            backingType="string"
            cases={[
              { name: "LOW", value: '"low"' },
              { name: "MEDIUM", value: '"medium"' },
              { name: "HIGH", value: '"high"' }
            ]}
          >
            <php.Method name="getColor" visibility="public" returnType="string">
              return match($this) {"{"}
                  self::LOW => 'green',
                  self::MEDIUM => 'yellow', 
                  self::HIGH => 'red',
              {"}"};
            </php.Method>
          </php.Enum>
        </php.Namespace>
      </php.SourceFile>,
      { namePolicy: php.createPhpNamePolicy() }
    );

    expect(result.contents).toMatchInlineSnapshot(`
      "<?php

      namespace App\\Enums;

      enum Priority: string
      {
          case LOW = "low";
          case MEDIUM = "medium";
          case HIGH = "high";

          public function getColor(): string
          {
              return match($this) {
                  self::LOW => 'green',
                  self::MEDIUM => 'yellow', 
                  self::HIGH => 'red',
              };
          }
      }
      "
    `);
  });
}); 