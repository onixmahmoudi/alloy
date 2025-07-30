import { render } from "@alloy-js/core";
import { describe, expect, it } from "vitest";
import * as php from "../src/index.js";

describe("Phase 7: Advanced Import System", () => {
  it("should manage imports with smart references", () => {
    const result = render(
      <php.ImportManager
        currentNamespace="App\\Services"
        groupingStrategy="by-vendor"
        autoResolveConflicts={true}
        removeUnused={true}
      >
        <php.SourceFile path="UserService.php">
          <php.Namespace name="App\\Services">
            <php.Class name="UserService">
              <php.Method
                name="createUser"
                visibility="public"
                parameters={[
                  { name: "data", type: "array" }
                ]}
                returnType="User"
              >
                // Using smart references - these would automatically add imports
                return new User($data);
              </php.Method>
            </php.Class>
          </php.Namespace>
        </php.SourceFile>
      </php.ImportManager>,
      { namePolicy: php.createPhpNamePolicy() }
    );

    expect(result.contents).toContain("<?php");
    expect(result.contents).toContain("namespace App\\Services;");
    expect(result.contents).toContain("class UserService");
    expect(result.contents).toContain("public function createUser(array $data): User");
  });

  it("should generate optimized use statements", () => {
    const result = render(
      <php.SourceFile path="Example.php">
        <php.Namespace name="App\\Example">
          <php.OptimizedUseStatements
            title="External Dependencies"
            addBlankLines={true}
          />
          <php.Class name="Example">
            <php.Method name="test" visibility="public" />
          </php.Class>
        </php.Namespace>
      </php.SourceFile>,
      { namePolicy: php.createPhpNamePolicy() }
    );

    expect(result.contents).toContain("namespace App\\Example;");
    expect(result.contents).toContain("class Example");
  });

  it("should handle grouped use statements", () => {
    const result = render(
      <php.SourceFile path="GroupedExample.php">
        <php.Namespace name="App\\Example">
          <php.GroupedUseStatements
            groupByVendor={true}
            groupByType={true}
            customGroups={[
              {
                title: "Core Framework",
                pattern: /^App\\Core\\/,
                priority: 0
              }
            ]}
          />
          <php.Class name="GroupedExample" />
        </php.Namespace>
      </php.SourceFile>,
      { namePolicy: php.createPhpNamePolicy() }
    );

    expect(result.contents).toContain("namespace App\\Example;");
    expect(result.contents).toContain("class GroupedExample");
  });

  it("should handle bulk use statements", () => {
    const result = render(
      <php.SourceFile path="BulkExample.php">
        <php.Namespace name="App\\Example">
          <php.BulkUseStatement
            baseNamespace="Symfony\\Component\\HttpFoundation"
            classes={[
              { name: "Request" },
              { name: "Response" },
              { name: "JsonResponse", alias: "Json" }
            ]}
            useGroupedSyntax={true}
          />
          <php.Class name="BulkExample" />
        </php.Namespace>
      </php.SourceFile>,
      { namePolicy: php.createPhpNamePolicy() }
    );

    expect(result.contents).toContain("use Symfony\\Component\\HttpFoundation\\{Request, Response, JsonResponse as Json};");
  });
});

describe("Phase 8: Framework Integrations", () => {
  it("should generate Laravel Eloquent model", () => {
    const result = render(
      <php.SourceFile path="User.php">
        <php.Namespace name="App\\Models">
          <php.Laravel.LaravelModel
            name="User"
            table="users"
            fillable={["name", "email", "password"]}
            hidden={["password", "remember_token"]}
            casts={{
              "email_verified_at": "datetime",
              "created_at": "datetime",
              "updated_at": "datetime"
            }}
            relationships={[
              {
                name: "posts",
                type: "hasMany",
                relatedModel: "Post"
              },
              {
                name: "profile",
                type: "hasOne",
                relatedModel: "Profile"
              }
            ]}
            scopes={[
              {
                name: "active",
                parameters: [],
                body: "return $query->where('active', true);"
              }
            ]}
            accessors={[
              {
                attribute: "fullName",
                returnType: "string",
                body: "return $this->first_name . ' ' . $this->last_name;"
              }
            ]}
          />
        </php.Namespace>
      </php.SourceFile>,
      { namePolicy: php.createPhpNamePolicy() }
    );

    expect(result.contents).toContain("class User extends Model");
    expect(result.contents).toContain('protected $fillable = ["name", "email", "password"];');
    expect(result.contents).toContain('protected $hidden = ["password", "remember_token"];');
    expect(result.contents).toContain("public function posts()");
    expect(result.contents).toContain("return $this->hasMany(Post::class);");
    expect(result.contents).toContain("public function scopeActive");
    expect(result.contents).toContain("public function getFullNameAttribute");
  });

  it("should generate Laravel controller", () => {
    const result = render(
      <php.SourceFile path="UserController.php">
        <php.Namespace name="App\\Http\\Controllers">
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
                body: "return response()->json(User::where('name', 'like', '%' . $request->search . '%')->get());"
              }
            ]}
          />
        </php.Namespace>
      </php.SourceFile>,
      { namePolicy: php.createPhpNamePolicy() }
    );

    expect(result.contents).toContain("class UserController extends ApiController");
    expect(result.contents).toContain("public function index()");
    expect(result.contents).toContain("public function store(Request $request)");
    expect(result.contents).toContain("public function show(User $user)");
    expect(result.contents).toContain("public function update(Request $request, User $user)");
    expect(result.contents).toContain("public function destroy(User $user)");
    expect(result.contents).toContain("public function search(Request $request): JsonResponse");
  });

  it("should generate Symfony entity", () => {
    const result = render(
      <php.SourceFile path="Product.php">
        <php.Namespace name="App\\Entity">
          <php.Symfony.SymfonyEntity
            name="Product"
            table="products"
            repositoryClass="App\\Repository\\ProductRepository"
            fields={[
              {
                name: "name",
                type: "string",
                length: 255,
                nullable: false
              },
              {
                name: "description",
                type: "text",
                nullable: true
              },
              {
                name: "price",
                type: "decimal",
                precision: 10,
                scale: 2,
                nullable: false
              },
              {
                name: "createdAt",
                type: "datetime",
                nullable: false
              }
            ]}
            relationships={[
              {
                name: "category",
                type: "ManyToOne",
                targetEntity: "Category",
                joinColumn: { name: "category_id" }
              },
              {
                name: "orders",
                type: "ManyToMany",
                targetEntity: "Order",
                mappedBy: "products"
              }
            ]}
            lifecycleCallbacks={[
              {
                event: "PrePersist",
                method: "setCreatedAtValue"
              }
            ]}
          />
        </php.Namespace>
      </php.SourceFile>,
      { namePolicy: php.createPhpNamePolicy() }
    );

    expect(result.contents).toContain('#[Entity(repositoryClass: App\\Repository\\ProductRepository::class)]');
    expect(result.contents).toContain('#[Table(name: "products")]');
    expect(result.contents).toContain("class Product");
    expect(result.contents).toContain('#[Column(type: "string", length: 255)]');
    expect(result.contents).toContain("private string $name;");
    expect(result.contents).toContain('#[ManyToOne(targetEntity: Category::class)]');
    expect(result.contents).toContain('#[JoinColumn(name: "category_id")]');
    expect(result.contents).toContain("public function getName(): ?string");
    expect(result.contents).toContain("public function setName(?string $value): self");
    expect(result.contents).toContain('#[PrePersist]');
    expect(result.contents).toContain("public function setCreatedAtValue(): void");
  });
});

describe("Phase 8: Quality Tools", () => {
  it("should generate PHP CodeSniffer configuration", () => {
    const result = render(
      <php.Quality.PhpCodeSnifferConfig
        standards={["PSR-12", "PSR-4"]}
        excludeRules={["Generic.Files.LineLength"]}
        customConfig={{
          "show_progress": true,
          "colors": true
        }}
      />,
      { namePolicy: php.createPhpNamePolicy() }
    );

    expect(result.contents).toContain('<?xml version="1.0"?>');
    expect(result.contents).toContain('<rule ref="PSR-12"/>');
    expect(result.contents).toContain('<rule ref="PSR-4"/>');
    expect(result.contents).toContain('<rule ref="Generic.Files.LineLength"><exclude/></rule>');
    expect(result.contents).toContain('<file>src/</file>');
    expect(result.contents).toContain('<file>tests/</file>');
  });

  it("should generate PHPStan configuration", () => {
    const result = render(
      <php.Quality.PhpStanConfig
        level={8}
        paths={["src", "tests"]}
        excludePaths={["src/deprecated"]}
        bootstrapFiles={["tests/bootstrap.php"]}
        customRules={["Phpstan\\Rules\\DeadCode\\UnusedPrivateMethodRule"]}
        memoryLimit="2G"
      />,
      { namePolicy: php.createPhpNamePolicy() }
    );

    expect(result.contents).toContain("parameters:");
    expect(result.contents).toContain("level: 8");
    expect(result.contents).toContain("paths:");
    expect(result.contents).toContain("- src");
    expect(result.contents).toContain("- tests");
    expect(result.contents).toContain("excludePaths:");
    expect(result.contents).toContain("- src/deprecated");
    expect(result.contents).toContain("memoryLimitFile: 2G");
    expect(result.contents).toContain("rules:");
    expect(result.contents).toContain("- Phpstan\\Rules\\DeadCode\\UnusedPrivateMethodRule");
  });

  it("should generate PHP CS Fixer configuration", () => {
    const result = render(
      <php.Quality.PhpCsFixerConfig
        preset="@PSR12"
        rules={{
          "array_syntax": { "syntax": "short" },
          "ordered_imports": { "sort_algorithm": "alpha" }
        }}
        riskLevel="risky"
        finder={{
          directories: ["src", "tests"],
          exclude: ["vendor", "var"],
          notPath: ["tests/fixtures"],
          name: ["*.php"]
        }}
      />,
      { namePolicy: php.createPhpNamePolicy() }
    );

    expect(result.contents).toContain("<?php");
    expect(result.contents).toContain("PhpCsFixer\\Finder::create()");
    expect(result.contents).toContain("->in(['src', 'tests'])");
    expect(result.contents).toContain("->exclude(['vendor', 'var'])");
    expect(result.contents).toContain("->notPath(['tests/fixtures'])");
    expect(result.contents).toContain("'@PSR12' => true");
    expect(result.contents).toContain("'array_syntax' => {\"syntax\":\"short\"}");
    expect(result.contents).toContain("->setRiskyAllowed(true)");
  });

  it("should generate complete quality tools setup", () => {
    const result = render(
      <php.Quality.QualityToolsSetup
        phpcs={true}
        phpstan={true}
        phpCsFixer={true}
        psalm={true}
        phpmd={true}
        rector={true}
        addComposerScripts={true}
      />,
      { namePolicy: php.createPhpNamePolicy() }
    );

    // Should generate multiple configuration files
    expect(result.length).toBeGreaterThan(5);

    // Check for specific files
    const phpcsFile = result.find(f => f.path === "phpcs.xml");
    const phpstanFile = result.find(f => f.path === "phpstan.neon");
    const psalmFile = result.find(f => f.path === "psalm.xml");
    const workflowFile = result.find(f => f.path === ".github/workflows/quality.yml");

    expect(phpcsFile).toBeDefined();
    expect(phpstanFile).toBeDefined();
    expect(psalmFile).toBeDefined();
    expect(workflowFile).toBeDefined();

    expect(workflowFile!.contents).toContain("name: Quality Checks");
    expect(workflowFile!.contents).toContain("- name: Run PHP CodeSniffer");
    expect(workflowFile!.contents).toContain("- name: Run PHPStan");
    expect(workflowFile!.contents).toContain("- name: Run Psalm");
  });
});

describe("Phase 8: Code Templates", () => {
  it("should generate Singleton pattern", () => {
    const result = render(
      <php.SourceFile path="DatabaseManager.php">
        <php.Namespace name="App\\Core">
          <php.Templates.SingletonPattern
            name="DatabaseManager"
            privateConstructor={true}
            additionalMethods={
              <php.Method
                name="getConnection"
                visibility="public"
                returnType="PDO"
              >
                return $this->connection;
              </php.Method>
            }
          />
        </php.Namespace>
      </php.SourceFile>,
      { namePolicy: php.createPhpNamePolicy() }
    );

    expect(result.contents).toContain("class DatabaseManager");
    expect(result.contents).toContain("private static ?DatabaseManager $instance = null;");
    expect(result.contents).toContain("private function __construct()");
    expect(result.contents).toContain("private function __clone(): void");
    expect(result.contents).toContain("public static function getInstance(): DatabaseManager");
    expect(result.contents).toContain("if (self::$instance === null)");
    expect(result.contents).toContain("public function getConnection(): PDO");
  });

  it("should generate Factory pattern", () => {
    const result = render(
      <php.SourceFile path="PaymentFactory.php">
        <php.Namespace name="App\\Payment">
          <php.Templates.FactoryPattern
            name="PaymentFactory"
            productType="PaymentProcessorInterface"
            products={[
              { name: "Stripe", key: "stripe", className: "StripeProcessor" },
              { name: "PayPal", key: "paypal", className: "PayPalProcessor" },
              { name: "Square", key: "square", className: "SquareProcessor" }
            ]}
          />
        </php.Namespace>
      </php.SourceFile>,
      { namePolicy: php.createPhpNamePolicy() }
    );

    expect(result.contents).toContain("class PaymentFactory");
    expect(result.contents).toContain("public static function create(string $type): PaymentProcessorInterface");
    expect(result.contents).toContain("case 'stripe':");
    expect(result.contents).toContain("return new StripeProcessor();");
    expect(result.contents).toContain("case 'paypal':");
    expect(result.contents).toContain("return new PayPalProcessor();");
    expect(result.contents).toContain("public static function getSupportedTypes(): array");
    expect(result.contents).toContain("return ['stripe', 'paypal', 'square'];");
  });

  it("should generate Repository pattern", () => {
    const result = render(
      <php.SourceFile path="UserRepository.php">
        <php.Namespace name="App\\Repository">
          <php.Templates.RepositoryPattern
            entityName="User"
            repositoryName="UserRepository"
            includeInterface={true}
            customMethods={[
              {
                name: "findByEmail",
                parameters: [{ name: "email", type: "string" }],
                returnType: "?User",
                body: "// TODO: Implement findByEmail"
              },
              {
                name: "findActiveUsers",
                returnType: "array",
                body: "// TODO: Implement findActiveUsers"
              }
            ]}
          />
        </php.Namespace>
      </php.SourceFile>,
      { namePolicy: php.createPhpNamePolicy() }
    );

    // Should generate both interface and implementation
    expect(result.contents).toContain("interface UserRepositoryInterface");
    expect(result.contents).toContain("class UserRepository implements UserRepositoryInterface");
    expect(result.contents).toContain("public function findById(int $id): ?User");
    expect(result.contents).toContain("public function findAll(): array");
    expect(result.contents).toContain("public function save(User $entity): void");
    expect(result.contents).toContain("public function delete(User $entity): void");
    expect(result.contents).toContain("public function findByEmail(string $email): ?User");
    expect(result.contents).toContain("public function findActiveUsers(): array");
    expect(result.contents).toContain("private \\PDO $connection;");
    expect(result.contents).toContain("public function __construct(\\PDO $connection)");
  });

  it("should generate Value Object pattern", () => {
    const result = render(
      <php.SourceFile path="Email.php">
        <php.Namespace name="App\\ValueObject">
          <php.Templates.ValueObjectPattern
            name="Email"
            properties={[
              {
                name: "address",
                type: "string",
                validation: "if (!filter_var($value, FILTER_VALIDATE_EMAIL)) { throw new \\InvalidArgumentException('Invalid email address'); }"
              }
            ]}
            includeValidation={true}
          />
        </php.Namespace>
      </php.SourceFile>,
      { namePolicy: php.createPhpNamePolicy() }
    );

    expect(result.contents).toContain("final class Email");
    expect(result.contents).toContain("private readonly string $address;");
    expect(result.contents).toContain("public function __construct(string $address)");
    expect(result.contents).toContain("private function validateAddress(string $value): void");
    expect(result.contents).toContain("filter_var($value, FILTER_VALIDATE_EMAIL)");
    expect(result.contents).toContain("public function getAddress(): string");
    expect(result.contents).toContain("public function equals(Email $other): bool");
    expect(result.contents).toContain("public function __toString(): string");
  });
}); 