import * as coretest from "@alloy-js/core/testing";
import { describe, expect, it } from "vitest";
import * as php from "../src/index.js";
import { findFile, testRender } from "./utils.js";

describe("PHP Attribute", () => {
  it("should render class with attributes", () => {
    const result = testRender(
      <php.Namespace name="App\Models">
        <php.SourceFile path="User.php">
          <php.AttributeList
            attributes={[
              { name: "Entity", arguments: [{ value: '"users"' }] },
              {
                name: "Table",
                arguments: [{ name: "name", value: '"app_users"' }],
              },
            ]}
          />
          <php.Class name="User">
            <php.AttributeList
              attributes={[
                {
                  name: "Column",
                  arguments: [{ name: "type", value: '"string"' }],
                },
              ]}
            />
            <php.Property name="name" type="string" visibility="private" />

            <php.AttributeList
              attributes={[
                { name: "Route", arguments: [{ value: '"/users/{id}"' }] },
                { name: "Cache", arguments: [{ name: "ttl", value: "3600" }] },
              ]}
            />
            <php.Method name="getId" visibility="public" returnType="int">
              {`return $this->id;`}
            </php.Method>
          </php.Class>
        </php.SourceFile>
      </php.Namespace>,
    );
    const file = findFile(result, "User.php");
    expect(file).toBeDefined();

    expect(file!.contents).toBe(coretest.d`
<?php

namespace App\\Models;

#[Entity("users")]
#[Table(name: "app_users")]
class User
{
  #[Column(type: "string")]
  private string $name;
  #[Route("/users/{id}")]
  #[Cache(ttl: 3600)]
  public function getId(): int
  {
    return $this->id;
  }

}
    `);
  });
});
