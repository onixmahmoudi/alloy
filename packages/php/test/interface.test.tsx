import { render } from "@alloy-js/core";
import { describe, expect, it } from "vitest";
import * as php from "../src/index.js";

describe("PHP Interface", () => {
  it("should render a basic interface", () => {
    const result = render(
      <php.SourceFile path="UserInterface.php">
        <php.Namespace name="App\Contracts">
          <php.Interface name="UserInterface">
            <php.Method
              name="getName"
              visibility="public"
              returnType="string"
              abstract
            />
          </php.Interface>
        </php.Namespace>
      </php.SourceFile>,
      { namePolicy: php.createPhpNamePolicy() },
    );

    expect(result.contents).toMatchInlineSnapshot(`
      "<?php

      namespace App\\Contracts;

      interface UserInterface
      {
          public abstract function getName(): string;
      }
      "
    `);
  });

  it("should render interface with extends", () => {
    const result = render(
      <php.SourceFile path="AdminInterface.php">
        <php.Namespace name="App\Contracts">
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
        </php.Namespace>
      </php.SourceFile>,
      { namePolicy: php.createPhpNamePolicy() },
    );

    expect(result.contents).toMatchInlineSnapshot(`
      "<?php

      namespace App\\Contracts;

      interface AdminInterface extends UserInterface, ManagerInterface
      {
          public abstract function adminAction(): void;
      }
      "
    `);
  });
});
