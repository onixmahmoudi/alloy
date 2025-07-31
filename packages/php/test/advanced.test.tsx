import { describe, expect, it } from "vitest";
import * as php from "../src/index.js";
import { findFile, testRender } from "./utils.js";

describe("PHP Advanced Features", () => {
  it("should render modern PHP application with all features", () => {
    const result = testRender(
      <php.ProjectDirectory
        name="modern-php-app"
        composerConfig={{
          name: "example/modern-app",
          description: "Modern PHP 8.1+ application",
          autoload: {
            "psr-4": {
              "App\\": "src/",
            },
          },
          require: {
            php: "^8.1",
          },
        }}
      >
        {/* Enum with backed values and methods */}
        <php.SourceFile path="Enums/UserStatus.php">
          <php.Namespace name="App\Enums">
            <php.Enum
              name="UserStatus"
              backingType="string"
              cases={[
                { name: "ACTIVE", value: '"active"' },
                { name: "INACTIVE", value: '"inactive"' },
                { name: "SUSPENDED", value: '"suspended"' },
              ]}
            >
              <php.Method
                name="getLabel"
                visibility="public"
                returnType="string"
              >
                {`return match($this) {`}
                {`self::ACTIVE => 'Active User',`}
                {`self::INACTIVE => 'Inactive User',`}
                {`self::SUSPENDED => 'Suspended User',`}
                {`};`}
              </php.Method>
            </php.Enum>
          </php.Namespace>
        </php.SourceFile>

        {/* Trait with modern features */}
        <php.Namespace name="App\Traits">
          <php.SourceFile path="Traits/Timestampable.php">
            <php.Trait name="Timestampable">
              <php.Property
                name="createdAt"
                type="DateTime"
                visibility="private"
                readonly
              />
              <php.Property
                name="updatedAt"
                type="DateTime"
                visibility="private"
              />

              <php.Method name="touch" visibility="public" returnType="void">
                {`$this->updatedAt = new DateTime();`}
              </php.Method>
            </php.Trait>
          </php.SourceFile>
        </php.Namespace>

        {/* Advanced class with attributes, constructor promotion, and readonly */}
        <php.SourceFile path="Models/User.php">
          <php.Namespace name="App\Models">
            <php.AttributeList
              attributes={[
                { name: "Entity" },
                {
                  name: "Table",
                  arguments: [{ name: "name", value: '"users"' }],
                },
              ]}
            />
            <php.Class name="User" final>
              <php.Constructor
                visibility="public"
                parameters={[
                  { name: "id", type: "int" },
                  { name: "name", type: "string" },
                  { name: "email", type: "string" },
                  { name: "status", type: "UserStatus" },
                ]}
                promoted
              />

              <php.Method
                name="activate"
                visibility="public"
                returnType="void"
                parameters={[]}
              >
                {`$this->status = UserStatus::ACTIVE;`}
              </php.Method>

              <php.AttributeList
                attributes={[
                  {
                    name: "Cache",
                    arguments: [{ name: "ttl", value: "3600" }],
                  },
                ]}
              />
              <php.Method
                name="getDisplayName"
                visibility="public"
                returnType="string"
              >
                {`return $this->name . " (" . $this->status->getLabel() . ")";`}
              </php.Method>
            </php.Class>
          </php.Namespace>
        </php.SourceFile>

        {/* Interface with modern return types */}
        <php.SourceFile path="Contracts/UserRepositoryInterface.php">
          <php.Namespace name="App\Contracts">
            <php.Interface name="UserRepositoryInterface">
              <php.Method
                name="findByStatus"
                visibility="public"
                abstract
                returnType="array"
                parameters={[{ name: "status", type: "UserStatus" }]}
              />

              <php.Method
                name="findById"
                visibility="public"
                abstract
                returnType="?User"
                parameters={[{ name: "id", type: "int" }]}
              />
            </php.Interface>
          </php.Namespace>
        </php.SourceFile>

        {/* Global constants and functions */}
        <php.SourceFile path="constants.php">
          <php.Constant name="APP_VERSION" value='"1.0.0"' type="string" />
          <php.Constant name="MAX_USERS" value="1000" type="int" />

          <php.Function name="getCurrentVersion" returnType="string">
            {`return APP_VERSION;`}
          </php.Function>
        </php.SourceFile>
      </php.ProjectDirectory>,
    );

    // Verify project structure
    const src = findFile(result, "modern-php-app/src");
    expect(src).toBeDefined();
    expect(src!.contents.length).toBeGreaterThan(5);

    // Check composer.json
    const composerFile = findFile(result, "modern-php-app/composer.json");
    expect(composerFile).toBeDefined();
    expect(composerFile!.contents).toContain('"php": "^8.1"');

    // Check enum file
    const enumFile = findFile(
      result,
      "modern-php-app/src/Enums/UserStatus.php",
    );
    expect(enumFile).toBeDefined();
    expect(enumFile!.contents).toContain("enum UserStatus: string");
    expect(enumFile!.contents).toContain('case ACTIVE = "active"');

    // Check trait file
    const traitFile = findFile(
      result,
      "modern-php-app/src/Traits/Timestampable.php",
    );
    expect(traitFile).toBeDefined();
    expect(traitFile!.contents).toContain("trait Timestampable");
    expect(traitFile!.contents).toContain(
      "private readonly DateTime $createdAt",
    );

    // Check class with attributes
    const userFile = findFile(result, "modern-php-app/src/Models/User.php");
    expect(userFile).toBeDefined();
    expect(userFile!.contents).toContain("#[Entity]");
    expect(userFile!.contents).toContain('#[Table(name: "users")]');
    expect(userFile!.contents).toContain("final class User");

    // Check interface
    const interfaceFile = findFile(
      result,
      "modern-php-app/src/Contracts/UserRepositoryInterface.php",
    );
    expect(interfaceFile).toBeDefined();
    expect(interfaceFile!.contents).toContain(
      "interface UserRepositoryInterface",
    );

    // Check constants and functions
    const constantsFile = findFile(result, "modern-php-app/src/constants.php");
    expect(constantsFile).toBeDefined();
    expect(constantsFile!.contents).toContain('const APP_VERSION = "1.0.0"');
    expect(constantsFile!.contents).toContain("function getCurrentVersion()");
  });
});
