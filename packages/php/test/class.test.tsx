import * as coretest from "@alloy-js/core/testing";
import { describe, expect, it } from "vitest";
import * as php from "../src/index.js";
import { findFile, testRender } from "./utils.js";

describe("PHP Class", () => {
  it("should render a basic class", () => {
    const result = testRender(
      <php.Namespace name="App\Models">
        <php.SourceFile path="User.php">
          <php.Class name="User">
            <php.Property name="name" type="string" visibility="private" />
          </php.Class>
        </php.SourceFile>
      </php.Namespace>,
    );

    const file = findFile(result, "User.php");
    expect(file).toBeDefined();
    expect(file!.contents).toBe(coretest.d`
<?php

namespace App\\Models;

class User
{
  private string $name;

}
    `);
  });

  it("should render class with extends and implements", () => {
    const result = testRender(
      <php.Namespace name="App\Models">
        <php.SourceFile path="Manager.php">
          <php.Class
            name="Manager"
            extends="User"
            implements={["ManagerInterface", "AdminInterface"]}
          >
            <php.Method name="manage" visibility="public" returnType="void">
              // Management logic
            </php.Method>
          </php.Class>
        </php.SourceFile>
      </php.Namespace>,
    );

    const file = findFile(result, "Manager.php");
    expect(file).toBeDefined();
    expect(file!.contents).toBe(coretest.d`
<?php

namespace App\\Models;

class Manager extends User implements ManagerInterface, AdminInterface
{
  public function manage(): void
  {
    // Management logic
  }

}
    `);
  });

  it("should render abstract class", () => {
    const result = testRender(
      <php.Namespace name="App\Models">
        <php.SourceFile path="AbstractUser.php">
          <php.Class name="AbstractUser" abstract>
            <php.Method
              name="getName"
              visibility="public"
              abstract
              returnType="string"
            />
          </php.Class>
        </php.SourceFile>
      </php.Namespace>,
    );

    const file = findFile(result, "AbstractUser.php");
    expect(file).toBeDefined();
    expect(file!.contents).toBe(coretest.d`
      <?php

namespace App\\Models;

abstract class AbstractUser
{
  public abstract function getName(): string;
}
    `);
  });

  it("should render final class", () => {
    const result = testRender(
      <php.Namespace name="App\Models">
        <php.SourceFile path="FinalUser.php">
          <php.Class name="FinalUser" final>
            <php.Property name="id" type="int" visibility="private" readonly />
          </php.Class>
        </php.SourceFile>
      </php.Namespace>,
    );

    const file = findFile(result, "FinalUser.php");
    expect(file).toBeDefined();
    expect(file!.contents).toBe(coretest.d`
<?php

namespace App\\Models;

final class FinalUser
{
  private readonly int $id;

}
    `);
  });
});
