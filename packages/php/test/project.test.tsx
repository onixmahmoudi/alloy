import { render } from "@alloy-js/core";
import { describe, expect, it } from "vitest";
import * as php from "../src/index.js";

describe("PHP Project", () => {
  it("should render a basic project with composer.json", () => {
    const result = render(
      <php.ProjectDirectory 
        name="my-php-project"
        composerConfig={{
          name: "vendor/my-package",
          description: "A sample PHP package",
          version: "1.0.0",
          autoload: {
            "psr-4": {
              "Vendor\\MyPackage\\": "src/"
            }
          }
        }}
      >
        <php.SourceFile path="User.php">
          <php.Namespace name="Vendor\MyPackage">
            <php.Class name="User">
              <php.Property name="name" type="string" visibility="private" />
              <php.Method name="getName" visibility="public" returnType="string">
                return $this->name;
              </php.Method>
            </php.Class>
          </php.Namespace>
        </php.SourceFile>
      </php.ProjectDirectory>,
      { namePolicy: php.createPhpNamePolicy() }
    );

    // Check that composer.json was generated
    const composerFile = result.find(f => f.path === "my-php-project/composer.json");
    expect(composerFile).toBeDefined();
    
    const composerContent = JSON.parse(composerFile!.contents);
    expect(composerContent.name).toBe("vendor/my-package");
    expect(composerContent.description).toBe("A sample PHP package");
    expect(composerContent.autoload["psr-4"]).toEqual({
      "Vendor\\MyPackage\\": "src/"
    });

    // Check that the PHP file was generated
    const userFile = result.find(f => f.path === "my-php-project/src/User.php");
    expect(userFile).toBeDefined();
    expect(userFile!.contents).toMatchInlineSnapshot(`
      "<?php

      namespace Vendor\\MyPackage;

      class User
      {
          private string $name;

          public function getName(): string
          {
              return $this->name;
          }
      }
      "
    `);
  });
}); 