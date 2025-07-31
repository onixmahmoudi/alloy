import { Children, SourceDirectory } from "@alloy-js/core";
import { ComposerJson, ComposerJsonProps } from "./ComposerJson.js";
import { GitIgnore, GitIgnoreProps } from "./GitIgnore.js";
import { Psr4Structure, Psr4StructureProps } from "./Psr4Directory.js";
import { ReadmeMarkdown, ReadmeProps } from "./ReadmeMarkdown.js";
import { TestingStructure, TestingStructureProps } from "./TestingStructure.js";

export interface BaseProjectProps {
  /** Project name */
  name: string;
  /** Project directory path */
  path?: string;
  /** Composer configuration */
  composer: ComposerJsonProps;
  /** README configuration */
  readme?: ReadmeProps;
  /** Git ignore configuration */
  gitignore?: GitIgnoreProps;
  /** PSR-4 structure configuration */
  psr4?: Psr4StructureProps;
  /** Testing configuration */
  testing?: TestingStructureProps;
  /** Include development files */
  devFiles?: boolean;
  /** Children components */
  children?: Children;
}

/**
 * Base project layout with common PHP project structure
 */
export function BaseProject(props: BaseProjectProps) {
  const {
    name,
    path = name,
    composer,
    readme,
    gitignore = {},
    psr4,
    testing,
    devFiles = true,
    children,
  } = props;

  return (
    <SourceDirectory path={path}>
      {/* Composer configuration */}
      <ComposerJson {...composer} />

      {/* Development files */}
      {devFiles && (
        <>
          {/* Git ignore */}
          <GitIgnore {...gitignore} />

          {/* README */}
          {readme && <ReadmeMarkdown {...readme} />}
        </>
      )}

      {/* PSR-4 source structure */}
      {psr4 && <Psr4Structure {...psr4} />}

      {/* Testing structure */}
      {testing && <TestingStructure {...testing} />}

      {/* Custom children */}
      {children}
    </SourceDirectory>
  );
}

export interface LibraryProjectProps
  extends Omit<BaseProjectProps, "composer"> {
  /** Package name (vendor/package) */
  packageName: string;
  /** Package description */
  description: string;
  /** Package version */
  version?: string;
  /** Root namespace */
  namespace: string;
  /** PHP version requirement */
  phpVersion?: string;
  /** Package keywords */
  keywords?: string[];
  /** Package license */
  license?: string;
  /** Authors */
  authors?: Array<{
    name: string;
    email?: string;
  }>;
}

/**
 * PHP Library project layout
 */
export function LibraryProject(props: LibraryProjectProps) {
  const {
    packageName,
    description,
    version = "1.0.0",
    namespace,
    phpVersion = "^8.0",
    keywords = [],
    license = "MIT",
    authors = [],
    ...baseProps
  } = props;

  const composer: ComposerJsonProps = {
    name: packageName,
    description,
    version,
    type: "library",
    keywords,
    license,
    authors,
    require: {
      php: phpVersion,
    },
    "require-dev": {
      "phpunit/phpunit": "^10.0",
      "phpstan/phpstan": "^1.0",
      "squizlabs/php_codesniffer": "^3.0",
    },
    autoload: {
      "psr-4": {
        [`${namespace}\\`]: "src/",
      },
    },
    "autoload-dev": {
      "psr-4": {
        [`${namespace}\\Tests\\`]: "tests/",
      },
    },
    scripts: {
      test: "phpunit",
      "test-coverage": "phpunit --coverage-html coverage",
      phpstan: "phpstan analyse src",
      "cs-check": "phpcs",
      "cs-fix": "phpcbf",
    },
  };

  const readme: ReadmeProps = {
    name: baseProps.name,
    description,
    packageName,
    phpVersion,
    installation: `Install the package via Composer:

\`\`\`bash
composer require ${packageName}
\`\`\``,
    usage: `\`\`\`php
<?php

use ${namespace}\\YourClass;

$instance = new YourClass();
\`\`\``,
    contributing: `Contributions are welcome! Please feel free to submit a Pull Request.

### Development

\`\`\`bash
# Install dependencies
composer install

# Run tests
composer test

# Run static analysis
composer phpstan

# Check code style
composer cs-check
\`\`\``,
  };

  return (
    <BaseProject
      {...baseProps}
      composer={composer}
      readme={readme}
      psr4={{
        rootNamespace: namespace,
        srcPath: "src",
      }}
      testing={{
        framework: "phpunit",
        phpunitConfig: {
          bootstrap: "vendor/autoload.php",
          testSuites: [
            { name: "unit", directory: "tests/Unit" },
            { name: "integration", directory: "tests/Integration" },
          ],
          coverage: {
            include: ["src"],
            reports: {
              html: "coverage",
              clover: "coverage.xml",
            },
          },
        },
        structure: {
          unit: true,
          integration: true,
        },
      }}
    />
  );
}

export interface ApplicationProjectProps
  extends Omit<BaseProjectProps, "composer"> {
  /** Application description */
  description: string;
  /** Root namespace */
  namespace: string;
  /** PHP version requirement */
  phpVersion?: string;
  /** Framework (laravel, symfony, etc.) */
  framework?: "laravel" | "symfony" | "custom";
}

/**
 * PHP Application project layout
 */
export function ApplicationProject(props: ApplicationProjectProps) {
  const {
    description,
    namespace,
    phpVersion = "^8.1",
    framework = "custom",
    ...baseProps
  } = props;

  const composer: ComposerJsonProps = {
    name: baseProps.name,
    description,
    type: "project",
    require: {
      php: phpVersion,
    },
    "require-dev": {
      "phpunit/phpunit": "^10.0",
      "phpstan/phpstan": "^1.0",
    },
    autoload: {
      "psr-4": {
        [`${namespace}\\`]: "src/",
      },
    },
    "autoload-dev": {
      "psr-4": {
        [`${namespace}\\Tests\\`]: "tests/",
      },
    },
  };

  return (
    <BaseProject
      {...baseProps}
      composer={composer}
      psr4={{
        rootNamespace: namespace,
        srcPath: "src",
        structure: {
          controllers: true,
          models: true,
          services: true,
          repositories: true,
          middleware: true,
          exceptions: true,
          traits: true,
          interfaces: true,
          enums: true,
          events: true,
          listeners: true,
        },
      }}
      testing={{
        framework: "phpunit",
        structure: {
          unit: true,
          feature: true,
          integration: true,
        },
      }}
    />
  );
}
