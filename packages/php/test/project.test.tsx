import * as coretest from "@alloy-js/core/testing";
import { describe, expect, it } from "vitest";
import * as php from "../src/index.js";
import { findFile, testRender } from "./utils.js";

describe("PHP Project", () => {
  it("should render a basic project with composer.json", () => {
    const result = testRender(
      <php.ProjectDirectory
        name="my-php-project"
        composerConfig={{
          name: "vendor/my-package",
          description: "A sample PHP package",
          version: "1.0.0",
          autoload: {
            "psr-4": {
              "Vendor\\MyPackage\\": "src/",
            },
          },
        }}
      >
        <php.Namespace name="Vendor\MyPackage">
          <php.SourceFile path="User.php">
            <php.Class name="User">
              <php.Property name="name" type="string" visibility="private" />
              <php.Method
                name="getName"
                visibility="public"
                returnType="string"
              >
                {`return $this->name;`}
              </php.Method>
            </php.Class>
          </php.SourceFile>
        </php.Namespace>
      </php.ProjectDirectory>,
    );

    // Check that composer.json was generated
    const composerFile = findFile(result, "my-php-project/composer.json");
    expect(composerFile).toBeDefined();

    const composerContent = JSON.parse(composerFile!.contents);
    expect(composerContent.name).toBe("vendor/my-package");
    expect(composerContent.description).toBe("A sample PHP package");
    expect(composerContent.autoload["psr-4"]).toEqual({
      "Vendor\\MyPackage\\": "src/",
    });

    // Check that the PHP file was generated
    const userFile = findFile(result, "my-php-project/src/User.php");
    expect(userFile).toBeDefined();
    expect(userFile!.contents).toBe(coretest.d`
<?php

namespace Vendor\\MyPackage;

class User
{
  private string $name;
  public function getName(): string
  {
    return $this->name;
  }

}
    `);
  });
});
