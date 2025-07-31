import * as coretest from "@alloy-js/core/testing";
import { describe, expect, it } from "vitest";
import * as php from "../src/index.js";
import { findFile, testRender } from "./utils.js";

describe("PHP Interface", () => {
  it("should render a basic interface", () => {
    const result = testRender(
      <php.Namespace name="App\Contracts">
        <php.SourceFile path="UserInterface.php">
          <php.Interface name="UserInterface">
            <php.Method
              name="getName"
              visibility="public"
              returnType="string"
              abstract
            />
          </php.Interface>
        </php.SourceFile>
      </php.Namespace>,
    );

    const file = findFile(result, "UserInterface.php");
    expect(file).toBeDefined();
    expect(file!.contents).toBe(coretest.d`
<?php

namespace App\\Contracts;

interface UserInterface
{
  public abstract function getName(): string;
}
    `);
  });

  it("should render interface with extends", () => {
    const result = testRender(
      <php.Namespace name="App\Contracts">
        <php.SourceFile path="AdminInterface.php">
          <php.Interface
            name="AdminInterface"
            extends={["UserInterface", "ManagerInterface"]}
          >
            <php.Method
              name="adminAction"
              visibility="public"
              returnType="void"
              abstract
            />
          </php.Interface>
        </php.SourceFile>
      </php.Namespace>,
    );

    const file = findFile(result, "AdminInterface.php");
    expect(file).toBeDefined();
    expect(file!.contents).toBe(coretest.d`
<?php

namespace App\\Contracts;

interface AdminInterface extends UserInterface, ManagerInterface
{
  public abstract function adminAction(): void;
}
    `);
  });
});
