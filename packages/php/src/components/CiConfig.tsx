import { SourceDirectory, SourceFile, code } from "@alloy-js/core";

export interface PhpVersion {
  version: string;
  extensions?: string[];
}

export interface GitHubActionsProps {
  /** Workflow name */
  name?: string;
  /** PHP versions to test */
  phpVersions?: string[];
  /** Dependencies strategy (lowest, locked, highest) */
  dependencies?: ("lowest" | "locked" | "highest")[];
  /** Operating systems to test */
  os?: string[];
  /** Include code coverage */
  coverage?: boolean;
  /** Coverage service (codecov, coveralls) */
  coverageService?: "codecov" | "coveralls";
  /** Additional steps */
  additionalSteps?: Array<{
    name: string;
    run: string;
  }>;
}

/**
 * Generates a GitHub Actions workflow for PHP projects
 */
export function GitHubActions(props: GitHubActionsProps = {}) {
  const {
    name = "Tests",
    phpVersions = ["8.0", "8.1", "8.2"],
    dependencies = ["locked"],
    os = ["ubuntu-latest"],
    coverage = true,
    coverageService = "codecov",
    additionalSteps = [],
  } = props;

  const workflow = {
    name,
    on: {
      push: {
        branches: ["main", "develop"],
      },
      pull_request: {
        branches: ["main", "develop"],
      },
    },
    jobs: {
      tests: {
        "runs-on": "${{ matrix.os }}",
        strategy: {
          matrix: {
            os: os,
            php: phpVersions,
            dependencies: dependencies,
          },
        },
        name: "PHP ${{ matrix.php }} - ${{ matrix.dependencies }} - ${{ matrix.os }}",
        steps: [
          {
            name: "Checkout code",
            uses: "actions/checkout@v4",
          },
          {
            name: "Setup PHP",
            uses: "shivammathur/setup-php@v2",
            with: {
              php: "${{ matrix.php }}",
              extensions:
                "dom, curl, libxml, mbstring, zip, pcntl, pdo, sqlite, pdo_sqlite, bcmath, soap, intl, gd, exif, iconv",
              coverage: coverage ? "xdebug" : "none",
            },
          },
          {
            name: "Setup problem matchers",
            run: 'echo "::add-matcher::${{ runner.tool_cache }}/php.json"',
          },
          {
            name: "Install dependencies",
            run: (() => {
              let installCmd = "composer update";
              const strategies = {
                lowest: "--prefer-lowest",
                locked: "--prefer-stable --no-progress",
                highest: "--prefer-stable",
              };
              return `${installCmd} ${strategies[dependencies[0] as keyof typeof strategies]} --no-interaction`;
            })(),
          },
          {
            name: "Execute tests",
            run:
              coverage ?
                "vendor/bin/phpunit --coverage-clover=coverage.xml"
              : "vendor/bin/phpunit",
          },
        ],
      },
    },
  };

  // Add coverage upload step
  if (coverage && coverageService === "codecov") {
    workflow.jobs.tests.steps.push({
      name: "Upload coverage to Codecov",
      uses: "codecov/codecov-action@v3",
      with: {
        file: "./coverage.xml",
        fail_ci_if_error: true,
      },
    });
  }

  // Add additional steps
  additionalSteps.forEach((step) => {
    workflow.jobs.tests.steps.push({
      name: step.name,
      run: step.run,
    });
  });

  return (
    <SourceDirectory path=".github/workflows">
      <SourceFile path="tests.yml" filetype="yaml">
        {code`${generateYaml(workflow)}`}
      </SourceFile>
    </SourceDirectory>
  );
}

/**
 * Simple YAML generator for workflow files
 */
function generateYaml(obj: any, indent = 0): string {
  const spaces = "  ".repeat(indent);
  let yaml = "";

  for (const [key, value] of Object.entries(obj)) {
    if (value === null || value === undefined) {
      yaml += `${spaces}${key}: null\n`;
    } else if (typeof value === "string") {
      if (value.includes("${{") || value.includes("\n")) {
        yaml += `${spaces}${key}: ${value}\n`;
      } else {
        yaml += `${spaces}${key}: "${value}"\n`;
      }
    } else if (typeof value === "number" || typeof value === "boolean") {
      yaml += `${spaces}${key}: ${value}\n`;
    } else if (Array.isArray(value)) {
      yaml += `${spaces}${key}:\n`;
      value.forEach((item) => {
        if (typeof item === "object") {
          yaml += `${spaces}  -\n`;
          yaml += generateYaml(item, indent + 2).replace(/^  /, "    ");
        } else {
          yaml += `${spaces}  - ${typeof item === "string" ? `"${item}"` : item}\n`;
        }
      });
    } else if (typeof value === "object") {
      yaml += `${spaces}${key}:\n`;
      yaml += generateYaml(value, indent + 1);
    }
  }

  return yaml;
}

export interface TravisCiProps {
  /** PHP versions to test */
  phpVersions?: string[];
  /** Include code coverage */
  coverage?: boolean;
}

/**
 * Generates a Travis CI configuration
 */
export function TravisCi(props: TravisCiProps = {}) {
  const { phpVersions = ["8.0", "8.1", "8.2"], coverage = true } = props;

  const config = {
    language: "php",
    php: phpVersions,
    cache: {
      directories: ["$HOME/.composer/cache"],
    },
    before_script: ["composer install --prefer-dist --no-interaction"],
    script: [
      coverage ?
        "vendor/bin/phpunit --coverage-clover=coverage.xml"
      : "vendor/bin/phpunit",
    ],
  };

  if (coverage) {
    config["after_success"] = ["bash <(curl -s https://codecov.io/bash)"];
  }

  return (
    <SourceFile path=".travis.yml" filetype="yaml">
      {code`${generateYaml(config)}`}
    </SourceFile>
  );
}
