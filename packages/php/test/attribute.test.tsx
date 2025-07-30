import { render } from "@alloy-js/core";
import { describe, expect, it } from "vitest";
import * as php from "../src/index.js";

describe("PHP Attribute", () => {
  it("should render class with attributes", () => {
    const result = render(
      <php.SourceFile path="User.php">
        <php.Namespace name="App\Models">
          <php.AttributeList 
            attributes={[
              { name: "Entity", arguments: [{ value: '"users"' }] },
              { name: "Table", arguments: [{ name: "name", value: '"app_users"' }] }
            ]} 
          />
          <php.Class name="User">
            <php.AttributeList 
              attributes={[
                { name: "Column", arguments: [{ name: "type", value: '"string"' }] }
              ]} 
            />
            <php.Property name="name" type="string" visibility="private" />
            
            <php.AttributeList 
              attributes={[
                { name: "Route", arguments: [{ value: '"/users/{id}"' }] },
                { name: "Cache", arguments: [{ name: "ttl", value: "3600" }] }
              ]} 
            />
            <php.Method name="getId" visibility="public" returnType="int">
              return $this->id;
            </php.Method>
          </php.Class>
        </php.Namespace>
      </php.SourceFile>,
      { namePolicy: php.createPhpNamePolicy() }
    );

    expect(result.contents).toMatchInlineSnapshot(`
      "<?php

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
      "
    `);
  });
}); 