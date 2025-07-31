import * as coretest from "@alloy-js/core/testing";
import { describe, expect, it } from "vitest";
import * as php from "../src/index.js";
import { findFile, testRender } from "./utils.jsx";

describe(" Advanced Import System", () => {
  it("should manage imports with smart references", () => {
    const result = testRender(
      <php.ImportManager
        currentNamespace="App\\Services"
        groupingStrategy="by-vendor"
        autoResolveConflicts={true}
        removeUnused={true}
      >
        <php.Namespace name="App\\Services">
          <php.SourceFile path="UserService.php">
            <php.Class name="UserService">
              <php.Method
                name="createUser"
                visibility="public"
                parameters={[{ name: "data", type: "array" }]}
                returnType="User"
              >
                // Using smart references - these would automatically add
                imports return new User($data);
              </php.Method>
            </php.Class>
          </php.SourceFile>
        </php.Namespace>
      </php.ImportManager>,
    );

    const file = findFile(result, "UserService.php");
    expect(file).toBeDefined();
    expect(file!.contents).toBe(coretest.d`
      <?php

namespace App\\Services;

class UserService
{
  public function createUser(array $data): User
  {
    // Using smart references - these would automatically add
    return new User($data);
  }
}
    `);
  });

  it("should generate optimized use statements", () => {
    const result = testRender(
      <php.ImportManager
        currentNamespace="App\\Example"
        groupingStrategy="by-vendor"
        autoResolveConflicts={true}
        removeUnused={true}
      >
        <php.Namespace name="App\\Example">
          <php.SourceFile path="Example.php">
            <php.OptimizedUseStatements
              title="External Dependencies"
              addBlankLines={true}
            />
            <php.Class name="Example">
              <php.Method name="test" visibility="public" />
            </php.Class>
          </php.SourceFile>
        </php.Namespace>
      </php.ImportManager>,
    );

    const file = findFile(result, "Example.php");
    expect(file).toBeDefined();
    expect(file!.contents).toBe(coretest.d`
      <?php

namespace App\\Example;

class Example
{
  public function test();
}
    `);
  });

  it("should handle grouped use statements", () => {
    const result = testRender(
      <php.Namespace name="App\\Example">
        <php.SourceFile path="GroupedExample.php">
          <php.GroupedUseStatements
            groupByVendor={true}
            groupByType={true}
            customGroups={[
              {
                title: "Core Framework",
                pattern: /^App\\Core\\/,
                priority: 0,
              },
            ]}
          />
          <php.Class name="GroupedExample" />
        </php.SourceFile>
      </php.Namespace>,
    );

    const file = findFile(result, "GroupedExample.php");
    expect(file).toBeDefined();
    expect(file!.contents).toBe(coretest.d`
      <?php

namespace App\\Example;

class GroupedExample
{
}
    `);
  });

  it("should handle bulk use statements", () => {
    const result = testRender(
      <php.Namespace name="App\\Example">
        <php.SourceFile path="BulkExample.php">
          <php.BulkUseStatement
            baseNamespace="Symfony\\Component\\HttpFoundation"
            classes={[
              { name: "Request" },
              { name: "Response" },
              { name: "JsonResponse", alias: "Json" },
            ]}
            useGroupedSyntax={true}
          />
          <php.Class name="BulkExample" />
        </php.SourceFile>
      </php.Namespace>,
    );

    const file = findFile(result, "BulkExample.php");
    expect(file).toBeDefined();
    expect(file!.contents).toBe(coretest.d`
      <?php

namespace App\\Example;

class BulkExample
{
}
    `);
  });
});

describe(" Framework Integrations", () => {
  it("should generate Laravel Eloquent model", () => {
    const result = testRender(
      <php.Namespace name="App\\Models">
        <php.SourceFile path="User.php">
          <php.Laravel.LaravelModel
            name="User"
            table="users"
            fillable={["name", "email", "password"]}
            hidden={["password", "remember_token"]}
            casts={{
              email_verified_at: "datetime",
              created_at: "datetime",
              updated_at: "datetime",
            }}
            relationships={[
              {
                name: "posts",
                type: "hasMany",
                relatedModel: "Post",
              },
              {
                name: "profile",
                type: "hasOne",
                relatedModel: "Profile",
              },
            ]}
            scopes={[
              {
                name: "active",
                parameters: [],
                body: "return $query->where('active', true);",
              },
            ]}
            accessors={[
              {
                attribute: "fullName",
                returnType: "string",
                body: "return $this->first_name . ' ' . $this->last_name;",
              },
            ]}
          />
        </php.SourceFile>
      </php.Namespace>,
    );

    const file = findFile(result, "UserController.php");
    expect(file).toBeDefined();
    expect(file!.contents).toBe(coretest.d`
      <?php

namespace App\\Http\\Controllers;

class UserController extends ApiController
{
  protected $casts = [
        "email_verified_at" => "datetime",
        "created_at" => "datetime",
        "updated_at" => "datetime",
      ];
    }
  }
}
    `);
    expect(result.contents).toContain("public function posts()");
    expect(result.contents).toContain("return $this->hasMany(Post::class);");
    expect(result.contents).toContain("public function scopeActive");
    expect(result.contents).toContain("public function getFullNameAttribute");
  });

  it("should generate Laravel controller", () => {
    const result = testRender(
      <php.Namespace name="App\\Http\\Controllers">
        <php.SourceFile path="UserController.php">
          <php.Laravel.LaravelController
            name="UserController"
            resource={true}
            api={true}
            model="User"
            actions={[
              {
                name: "search",
                method: "GET",
                parameters: [{ name: "request", type: "Request" }],
                returnType: "JsonResponse",
                body: "return response()->json(User::where('name', 'like', '%' . $request->search . '%')->get());",
              },
            ]}
          />
        </php.SourceFile>
      </php.Namespace>,
    );

    expect(result.contents).toContain(
      "class UserController extends ApiController",
    );
    expect(result.contents).toContain("public function index()");
    expect(result.contents).toContain(
      "public function store(Request $request)",
    );
    expect(result.contents).toContain("public function show(User $user)");
    expect(result.contents).toContain(
      "public function update(Request $request, User $user)",
    );
    expect(result.contents).toContain("public function destroy(User $user)");
    expect(result.contents).toContain(
      "public function search(Request $request): JsonResponse",
    );
  });

  it("should generate Symfony entity", () => {
    const result = testRender(
      <php.Namespace name="App\\Entity">
        <php.SourceFile path="Product.php">
          <php.Symfony.SymfonyEntity
            name="Product"
            table="products"
            repositoryClass="App\\Repository\\ProductRepository"
            fields={[
              {
                name: "name",
                type: "string",
                length: 255,
                nullable: false,
              },
              {
                name: "description",
                type: "text",
                nullable: true,
              },
              {
                name: "price",
                type: "decimal",
                precision: 10,
                scale: 2,
                nullable: false,
              },
              {
                name: "createdAt",
                type: "datetime",
                nullable: false,
              },
            ]}
            relationships={[
              {
                name: "category",
                type: "ManyToOne",
                targetEntity: "Category",
                joinColumn: { name: "category_id" },
              },
              {
                name: "orders",
                type: "ManyToMany",
                targetEntity: "Order",
                mappedBy: "products",
              },
            ]}
            lifecycleCallbacks={[
              {
                event: "PrePersist",
                method: "setCreatedAtValue",
              },
            ]}
          />
        </php.SourceFile>
      </php.Namespace>,
    );

    expect(result.contents).toContain(
      "#[Entity(repositoryClass: App\\Repository\\ProductRepository::class)]",
    );
    expect(result.contents).toContain('#[Table(name: "products")]');
    expect(result.contents).toContain("class Product");
    expect(result.contents).toContain('#[Column(type: "string", length: 255)]');
    expect(result.contents).toContain("private string $name;");
    expect(result.contents).toContain(
      "#[ManyToOne(targetEntity: Category::class)]",
    );
    expect(result.contents).toContain('#[JoinColumn(name: "category_id")]');
    expect(result.contents).toContain("public function getName(): ?string");
    expect(result.contents).toContain(
      "public function setName(?string $value): self",
    );
    expect(result.contents).toContain("#[PrePersist]");
    expect(result.contents).toContain(
      "public function setCreatedAtValue(): void",
    );
  });
});

describe(" Code Templates", () => {
  it("should generate Singleton pattern", () => {
    const result = testRender(
      <php.Namespace name="App\\Core">
        <php.SourceFile path="DatabaseManager.php">
          <php.Templates.SingletonPattern
            name="DatabaseManager"
            privateConstructor={true}
            additionalMethods={
              <php.Method
                name="getConnection"
                visibility="public"
                returnType="PDO"
              >
                {`return $this->connection;`}
              </php.Method>
            }
          />
        </php.SourceFile>
      </php.Namespace>,
    );

    expect(result.contents).toContain("class DatabaseManager");
    expect(result.contents).toContain(
      "private static ?DatabaseManager $instance = null;",
    );
    expect(result.contents).toContain("private function __construct()");
    expect(result.contents).toContain("private function __clone(): void");
    expect(result.contents).toContain(
      "public static function getInstance(): DatabaseManager",
    );
    expect(result.contents).toContain("if (self::$instance === null)");
    expect(result.contents).toContain("public function getConnection(): PDO");
  });

  it("should generate Factory pattern", () => {
    const result = testRender(
      <php.Namespace name="App\\Payment">
        <php.SourceFile path="PaymentFactory.php">
          <php.Templates.FactoryPattern
            name="PaymentFactory"
            productType="PaymentProcessorInterface"
            products={[
              { name: "Stripe", key: "stripe", className: "StripeProcessor" },
              { name: "PayPal", key: "paypal", className: "PayPalProcessor" },
              { name: "Square", key: "square", className: "SquareProcessor" },
            ]}
          />
        </php.SourceFile>
      </php.Namespace>,
    );

    expect(result.contents).toContain("class PaymentFactory");
    expect(result.contents).toContain(
      "public static function create(string $type): PaymentProcessorInterface",
    );
    expect(result.contents).toContain("case 'stripe':");
    expect(result.contents).toContain("return new StripeProcessor();");
    expect(result.contents).toContain("case 'paypal':");
    expect(result.contents).toContain("return new PayPalProcessor();");
    expect(result.contents).toContain(
      "public static function getSupportedTypes(): array",
    );
    expect(result.contents).toContain("return ['stripe', 'paypal', 'square'];");
  });

  it("should generate Repository pattern", () => {
    const result = testRender(
      <php.Namespace name="App\\Repository">
        <php.SourceFile path="UserRepository.php">
          <php.Templates.RepositoryPattern
            entityName="User"
            repositoryName="UserRepository"
            includeInterface={true}
            customMethods={[
              {
                name: "findByEmail",
                parameters: [{ name: "email", type: "string" }],
                returnType: "?User",
                body: "// TODO: Implement findByEmail",
              },
              {
                name: "findActiveUsers",
                returnType: "array",
                body: "// TODO: Implement findActiveUsers",
              },
            ]}
          />
        </php.SourceFile>
      </php.Namespace>,
    );

    // Should generate both interface and implementation
    expect(result.contents).toContain("interface UserRepositoryInterface");
    expect(result.contents).toContain(
      "class UserRepository implements UserRepositoryInterface",
    );
    expect(result.contents).toContain(
      "public function findById(int $id): ?User",
    );
    expect(result.contents).toContain("public function findAll(): array");
    expect(result.contents).toContain(
      "public function save(User $entity): void",
    );
    expect(result.contents).toContain(
      "public function delete(User $entity): void",
    );
    expect(result.contents).toContain(
      "public function findByEmail(string $email): ?User",
    );
    expect(result.contents).toContain(
      "public function findActiveUsers(): array",
    );
    expect(result.contents).toContain("private \\PDO $connection;");
    expect(result.contents).toContain(
      "public function __construct(\\PDO $connection)",
    );
  });

  it("should generate Value Object pattern", () => {
    const result = testRender(
      <php.Namespace name="App\\ValueObject">
        <php.SourceFile path="Email.php">
          <php.Templates.ValueObjectPattern
            name="Email"
            properties={[
              {
                name: "address",
                type: "string",
                validation:
                  "if (!filter_var($value, FILTER_VALIDATE_EMAIL)) { throw new \\InvalidArgumentException('Invalid email address'); }",
              },
            ]}
            includeValidation={true}
          />
        </php.SourceFile>
      </php.Namespace>,
    );

    expect(result.contents).toContain("final class Email");
    expect(result.contents).toContain("private readonly string $address;");
    expect(result.contents).toContain(
      "public function __construct(string $address)",
    );
    expect(result.contents).toContain(
      "private function validateAddress(string $value): void",
    );
    expect(result.contents).toContain(
      "filter_var($value, FILTER_VALIDATE_EMAIL)",
    );
    expect(result.contents).toContain("public function getAddress(): string");
    expect(result.contents).toContain(
      "public function equals(Email $other): bool",
    );
    expect(result.contents).toContain("public function __toString(): string");
  });
});
