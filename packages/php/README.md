# @alloy-js/php

PHP code generation support for the Alloy framework. Generate clean, PSR-compliant PHP code using JSX syntax.

## Installation

```bash
# From the Alloy monorepo root
pnpm install

# Build the PHP package
cd packages/php
pnpm build
```

## Features

- **PSR-Compliant Code Generation**: Follows PSR-1, PSR-4, and PSR-12 standards
- **Modern PHP Support**: PHP 8.0+ features including type hints, readonly properties, attributes, enums, and union types
- **Composer Integration**: Automatic `composer.json` generation with PSR-4 autoloading
- **Complete OOP Support**: Classes, interfaces, traits, methods, properties, constructors, and namespaces
- **Modern PHP Features**: Enums (PHP 8.1+), Attributes (PHP 8.0+), Union/Intersection types, Constructor promotion
- **Procedural Support**: Global functions, variables, and constants
- **Smart Import Management**: Automatic `use` statement generation and namespace resolution
- **String Template Support**: Alternative string-based API alongside JSX
- **Flexible Naming**: Configurable naming policies following PHP conventions

## Quick Start

```tsx
import * as ay from "@alloy-js/core";
import * as php from "@alloy-js/php";

const result = ay.render(
  <ay.Output namePolicy={php.createPhpNamePolicy()}>
    <php.ProjectDirectory
      name="my-app"
      composerConfig={{
        name: "vendor/my-app",
        description: "My PHP application",
        autoload: {
          "psr-4": {
            "App\\": "src/"
          }
        }
      }}
    >
      <php.SourceFile path="Models/User.php">
        <php.Namespace name="App\Models">
          <php.Class name="User">
            <php.Property
              name="name"
              type="string"
              visibility="private"
            />

            <php.Method
              name="getName"
              visibility="public"
              returnType="string"
            >
              return $this->name;
            </php.Method>
          </php.Class>
        </php.Namespace>
      </php.SourceFile>
    </php.ProjectDirectory>
  </ay.Output>
);

console.log(result);
```

This generates:

**composer.json**:

```json
{
  "name": "vendor/my-app",
  "description": "My PHP application",
  "version": "1.0.0",
  "type": "library",
  "autoload": {
    "psr-4": {
      "App\\": "src/"
    }
  },
  "require": {
    "php": "^8.0"
  }
}
```

**src/Models/User.php**:

```php
<?php

namespace App\Models;

class User
{
    private string $name;

    public function getName(): string
    {
        return $this->name;
    }
}
```

## Components

### Core Components

#### `SourceFile`

Represents a PHP source file with proper PHP opening tags and namespace handling.

```tsx
<php.SourceFile path="User.php">
  <php.Namespace name="App\Models">{/* PHP code here */}</php.Namespace>
</php.SourceFile>
```

#### `Namespace`

Defines a PHP namespace following PSR-4 conventions.

```tsx
<php.Namespace name="App\Models\User">
  {/* Classes, interfaces, etc. */}
</php.Namespace>
```

#### `Class`

Generates PHP class declarations with full OOP support.

```tsx
<php.Class
  name="User"
  extends="BaseModel"
  implements={["UserInterface", "JsonSerializable"]}
  abstract={false}
  final={false}
>
  {/* Properties and methods */}
</php.Class>
```

#### `Interface`

Creates PHP interface declarations.

```tsx
<php.Interface name="UserInterface" extends={["BaseInterface"]}>
  <php.Method name="getName" visibility="public" abstract returnType="string" />
</php.Interface>
```

#### `Method`

Defines class methods with full modifier support.

```tsx
<php.Method
  name="processData"
  visibility="public"
  static={false}
  abstract={false}
  final={false}
  returnType="array"
  parameters={[
    { name: "data", type: "array" },
    { name: "options", type: "array", defaultValue: "[]" },
  ]}
>
  // Method implementation return $processedData;
</php.Method>
```

#### `Property`

Creates class properties with type hints and visibility.

```tsx
<php.Property
  name="users"
  type="array"
  visibility="private"
  static={false}
  readonly={false}
  defaultValue="[]"
/>
```

### Project Structure

#### `ProjectDirectory`

Sets up a complete PHP project with Composer configuration.

```tsx
<php.ProjectDirectory
  name="my-library"
  composerConfig={{
    name: "vendor/my-library",
    description: "A PHP library",
    version: "2.1.0",
    type: "library",
    autoload: {
      "psr-4": {
        "Vendor\\MyLibrary\\": "src/",
        "Vendor\\MyLibrary\\Tests\\": "tests/",
      },
    },
    require: {
      php: "^8.1",
      "doctrine/orm": "^2.0",
    },
    "require-dev": {
      "phpunit/phpunit": "^10.0",
    },
  }}
  srcDir="src"
>
  {/* Source files */}
</php.ProjectDirectory>
```

## Advanced Examples

### Complete MVC Structure

```tsx
const mvcApp = ay.render(
  <ay.Output namePolicy={php.createPhpNamePolicy()}>
    <php.ProjectDirectory
      name="blog-app"
      composerConfig={{
        name: "example/blog-app",
        description: "A blog application",
        autoload: { "psr-4": { "App\\": "src/" } }
      }}
    >
      {/* Model */}
      <php.SourceFile path="Models/Post.php">
        <php.Namespace name="App\Models">
          <php.Class name="Post">
            <php.Property name="id" type="int" visibility="private" readonly />
            <php.Property name="title" type="string" visibility="private" />
            <php.Property name="content" type="string" visibility="private" />
            <php.Property name="createdAt" type="DateTime" visibility="private" />

            <php.Method
              name="__construct"
              visibility="public"
              parameters={[
                { name: "title", type: "string" },
                { name: "content", type: "string" }
              ]}
            >
              $this->id = uniqid();
              $this->title = $title;
              $this->content = $content;
              $this->createdAt = new DateTime();
            </php.Method>

            <php.Method name="getTitle" visibility="public" returnType="string">
              return $this->title;
            </php.Method>
          </php.Class>
        </php.Namespace>
      </php.SourceFile>

      {/* Repository Interface */}
      <php.SourceFile path="Repositories/PostRepositoryInterface.php">
        <php.Namespace name="App\Repositories">
          <php.Interface name="PostRepositoryInterface">
            <php.Method
              name="save"
              visibility="public"
              abstract
              returnType="bool"
              parameters={[{ name: "post", type: "Post" }]}
            />
            <php.Method
              name="findById"
              visibility="public"
              abstract
              returnType="?Post"
              parameters={[{ name: "id", type: "string" }]}
            />
          </php.Interface>
        </php.Namespace>
      </php.SourceFile>

      {/* Service */}
      <php.SourceFile path="Services/BlogService.php">
        <php.Namespace name="App\Services">
          <php.Class name="BlogService">
            <php.Property
              name="repository"
              type="PostRepositoryInterface"
              visibility="private"
              readonly
            />

            <php.Method
              name="__construct"
              visibility="public"
              parameters={[{ name: "repository", type: "PostRepositoryInterface" }]}
            >
              $this->repository = $repository;
            </php.Method>

            <php.Method
              name="createPost"
              visibility="public"
              returnType="Post"
              parameters={[
                { name: "title", type: "string" },
                { name: "content", type: "string" }
              ]}
            >
              $post = new Post($title, $content);
              $this->repository->save($post);
              return $post;
            </php.Method>
          </php.Class>
        </php.Namespace>
      </php.SourceFile>
    </php.ProjectDirectory>
  </ay.Output>
);
```

## Naming Policy

The PHP package follows PSR naming standards:

- **Classes, Interfaces, Traits, Enums**: `PascalCase`
- **Methods, Properties, Variables**: `camelCase`
- **Constants**: `CONSTANT_CASE`
- **Global Functions**: `snake_case`
- **Namespaces**: `PascalCase`

Reserved PHP keywords are automatically handled by appending an underscore.

```tsx
// Custom naming policy
const customNamePolicy = php.createPhpNamePolicy();

// Usage
<ay.Output namePolicy={customNamePolicy}>{/* Your components */}</ay.Output>;
```

## Development Setup

### Prerequisites

- Node.js 20+
- pnpm
- TypeScript

### Building

```bash
# Install dependencies
pnpm install

# Build the package
pnpm build

# Run tests
pnpm test

# Watch mode for development
pnpm watch
```

### Running Tests

```bash
# Run all tests
pnpm test

# Watch tests
pnpm test:watch

# Run specific test file
pnpm test class.test.tsx
```

### Adding to Your Project

1. Add to `pnpm-workspace.yaml`:

```yaml
packages:
  - "packages/php"
```

2. Add to `.chronus/config.yaml`:

```yaml
versionPolicies:
  - name: alloy
    packages:
      - "@alloy-js/php"
```

3. Update main `README.md` supported languages:

```markdown
### Supported Languages

- C#: @alloy-js/csharp
- Java: @alloy-js/java
- PHP: @alloy-js/php
- TypeScript: @alloy-js/typescript
```

## API Reference

### Components

| Component          | Description                              |
| ------------------ | ---------------------------------------- |
| `SourceFile`       | PHP source file with namespace support   |
| `Namespace`        | PHP namespace declaration                |
| `Class`            | PHP class with full OOP support          |
| `Interface`        | PHP interface declaration                |
| `Method`           | Class method with parameters and types   |
| `Property`         | Class property with visibility and types |
| `ProjectDirectory` | Complete PHP project with Composer       |

### Utilities

| Function                | Description                             |
| ----------------------- | --------------------------------------- |
| `createPhpNamePolicy()` | Creates PSR-compliant naming policy     |
| `usePhpNamePolicy()`    | Gets current naming policy from context |

## Contributing

1. Follow existing code patterns from Java/C# packages
2. Ensure PSR compliance in generated code
3. Add comprehensive tests for new features
4. Update documentation and examples

## License

MIT - See LICENSE file for details
