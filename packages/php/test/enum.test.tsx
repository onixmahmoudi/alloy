import * as coretest from "@alloy-js/core/testing";
import { describe, expect, it } from "vitest";
import * as php from "../src/index.js";
import { findFile, testRender } from "./utils.js";

describe("PHP Enum", () => {
  it("should render a basic enum", () => {
    const result = testRender(
      <php.Namespace name="App\Enums">
        <php.SourceFile path="Status.php">
          <php.Enum
            name="Status"
            cases={[
              { name: "PENDING" },
              { name: "APPROVED" },
              { name: "REJECTED" },
            ]}
          />
        </php.SourceFile>
      </php.Namespace>,
    );

    const file = findFile(result, "Status.php");
    expect(file).toBeDefined();
    expect(file!.contents).toBe(coretest.d`
<?php

namespace App\\Enums;

enum Status
{
  case PENDING;
  case APPROVED;
  case REJECTED;
}
    `);
  });

  it("should render backed enum with string values", () => {
    const result = testRender(
      <php.Namespace name="App\Enums">
        <php.SourceFile path="Priority.php">
          <php.Enum
            name="Priority"
            backingType="string"
            cases={[
              { name: "LOW", value: '"low"' },
              { name: "MEDIUM", value: '"medium"' },
              { name: "HIGH", value: '"high"' },
            ]}
          >
            <php.Method name="getColor" visibility="public" returnType="string">
              // Method Body
            </php.Method>
          </php.Enum>
        </php.SourceFile>
      </php.Namespace>,
    );

    const file = findFile(result, "Priority.php");
    expect(file).toBeDefined();
    expect(file!.contents).toBe(coretest.d`
<?php

namespace App\\Enums;

enum Priority: string
{
  case LOW = "low";
  case MEDIUM = "medium";
  case HIGH = "high";

  public function getColor(): string
  {
    // Method Body
  }

}
    `);
  });
});
