import { describe, expect, it } from "vitest";
import * as php from "../src/index.js";
import { findFile, testRender } from "./utils.jsx";

describe("PHP Project Structure", () => {
  it("should render standalone ComposerJson component", () => {
    const result = testRender(
      <php.ComposerJson
        name="vendor/test-package"
        description="A test package"
        version="2.1.0"
        type="library"
        keywords={["test", "php"]}
        license="MIT"
        authors={[{ name: "John Doe", email: "john@example.com" }]}
        require={{
          php: "^8.1",
          "psr/log": "^3.0",
        }}
        require-dev={{
          "phpunit/phpunit": "^10.0",
        }}
        autoload={{
          "psr-4": {
            "Vendor\\TestPackage\\": "src/",
          },
        }}
        scripts={{
          test: "phpunit",
          "cs-fix": "php-cs-fixer fix",
        }}
      />,
    );
    const file = findFile(result, "composer.json");
    expect(file).toBeDefined();
    const composerContent = JSON.parse(file!.contents);
    expect(composerContent.name).toBe("vendor/test-package");
    expect(composerContent.version).toBe("2.1.0");
    expect(composerContent.keywords).toEqual(["test", "php"]);
    expect(composerContent.authors[0].name).toBe("John Doe");
    expect(composerContent.require.php).toBe("^8.1");
    expect(composerContent.scripts.test).toBe("phpunit");
  });

  it("should render GitIgnore with all sections", () => {
    const result = testRender(
      <php.GitIgnore
        composer={true}
        ide={true}
        os={true}
        testing={true}
        build={true}
        custom={["custom-dir/", "*.local"]}
        sections={[
          {
            title: "Project Specific",
            patterns: ["/storage/logs/", "/config/secrets.php"],
          },
        ]}
      />,
    );
    const file = findFile(result, ".gitignore");
    expect(file).toBeDefined();

    expect(result.contents).toContain("# Composer");
    expect(result.contents).toContain("/vendor/");
    expect(result.contents).toContain("# IDEs");
    expect(result.contents).toContain(".vscode/");
    expect(result.contents).toContain("# OS");
    expect(result.contents).toContain(".DS_Store");
    expect(result.contents).toContain("# Testing");
    expect(result.contents).toContain("/coverage/");
    expect(result.contents).toContain("# Build/Deploy");
    expect(result.contents).toContain("/.env");
    expect(result.contents).toContain("# Custom");
    expect(result.contents).toContain("custom-dir/");
    expect(result.contents).toContain("# Project Specific");
    expect(result.contents).toContain("/storage/logs/");
  });

  it("should render professional README", () => {
    const result = testRender(
      <php.ReadmeMarkdown
        name="Awesome Library"
        description="A comprehensive PHP library for awesome functionality"
        packageName="vendor/awesome-library"
        phpVersion="^8.1"
        repository="https://github.com/vendor/awesome-library"
        badges={[
          {
            alt: "Tests",
            image:
              "https://github.com/vendor/awesome-library/workflows/tests/badge.svg",
            link: "https://github.com/vendor/awesome-library/actions",
          },
          {
            alt: "Latest Version",
            image:
              "https://img.shields.io/packagist/v/vendor/awesome-library.svg",
          },
        ]}
        toc={true}
        usage={`\`\`\`php
<?php

use Vendor\\AwesomeLibrary\\Awesome;

$awesome = new Awesome();
$result = $awesome->doSomething();
\`\`\``}
        sections={[
          {
            title: "Features",
            content: "- Feature 1\n- Feature 2\n- Feature 3",
          },
          {
            title: "Configuration",
            content: "Configuration details here...",
          },
        ]}
        contributing="Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details."
        license="This package is open-sourced software licensed under the [MIT license](LICENSE.md)."
      />,
    );
    const file = findFile(result, "README.md");
    expect(file).toBeDefined();

    expect(result.contents).toContain("# Awesome Library");
    expect(result.contents).toContain("A comprehensive PHP library");
    expect(result.contents).toContain("## Table of Contents");
    expect(result.contents).toContain("- [Installation](#installation)");
    expect(result.contents).toContain(
      "composer require vendor/awesome-library",
    );
    expect(result.contents).toContain("- PHP ^8.1");
    expect(result.contents).toContain("## Usage");
    expect(result.contents).toContain("use Vendor\\AwesomeLibrary\\Awesome");
    expect(result.contents).toContain("## Features");
    expect(result.contents).toContain("## Configuration");
    expect(result.contents).toContain("## Contributing");
    expect(result.contents).toContain("## License");
    expect(result.contents).toContain("[![Tests]");
  });

  it("should render PHPUnit configuration", () => {
    const result = testRender(
      <php.PhpUnitConfig
        bootstrap="tests/bootstrap.php"
        testSuites={[
          { name: "unit", directory: "tests/Unit" },
          { name: "feature", directory: "tests/Feature" },
        ]}
        coverage={{
          include: ["src"],
          exclude: ["src/deprecated"],
          reports: {
            html: "coverage",
            clover: "coverage.xml",
            text: true,
          },
        }}
        logging={{
          junit: "tests/results/junit.xml",
          testdox: "tests/results/testdox.html",
        }}
      />,
    );
    const file = findFile(result, "phpunit.xml");
    expect(file).toBeDefined();

    expect(result.contents).toContain('bootstrap="tests/bootstrap.php"');
    expect(result.contents).toContain('<testsuite name="unit">');
    expect(result.contents).toContain("<directory>tests/Unit</directory>");
    expect(result.contents).toContain('<testsuite name="feature">');
    expect(result.contents).toContain("<coverage>");
    expect(result.contents).toContain("<include>");
    expect(result.contents).toContain("<directory>src</directory>");
    expect(result.contents).toContain("<exclude>");
    expect(result.contents).toContain("<directory>src/deprecated</directory>");
    expect(result.contents).toContain('<html outputDirectory="coverage"/>');
    expect(result.contents).toContain('<clover outputFile="coverage.xml"/>');
    expect(result.contents).toContain("<logging>");
    expect(result.contents).toContain(
      '<junit outputFile="tests/results/junit.xml"/>',
    );
  });
});

describe("PHP Project Layouts", () => {
  it("should render complete library project", () => {
    const result = testRender(
      <php.LibraryProject
        name="awesome-library"
        packageName="vendor/awesome-library"
        description="An awesome PHP library"
        namespace="Vendor\\AwesomeLibrary"
        phpVersion="^8.1"
        keywords={["awesome", "library"]}
        license="MIT"
        authors={[{ name: "Jane Developer", email: "jane@example.com" }]}
      />,
    );
    const file = findFile(result, "composer.json");
    expect(file).toBeDefined();
    const composerContent = JSON.parse(file!.contents);
    expect(composerContent.name).toBe("vendor/awesome-library");
    expect(composerContent.type).toBe("library");
    expect(composerContent.autoload["psr-4"]["Vendor\\AwesomeLibrary\\"]).toBe(
      "src/",
    );

    // Check that multiple files were generated
    expect(result.contents.length).toBeGreaterThan(5);

    // Check composer.json
    const composerFile = findFile(result, "composer.json");
    expect(composerFile).toBeDefined();

    // Check .gitignore
    const gitignoreFile = findFile(result, ".gitignore");
    expect(gitignoreFile).toBeDefined();
    expect(gitignoreFile!.contents).toContain("/vendor/");

    // Check README.md
    const readmeFile = findFile(result, "README.md");
    expect(readmeFile).toBeDefined();
    expect(readmeFile!.contents).toContain("# awesome-library");
    expect(readmeFile!.contents).toContain(
      "composer require vendor/awesome-library",
    );

    // Check PHPUnit config
    const phpunitFile = findFile(result, "phpunit.xml");
    expect(phpunitFile).toBeDefined();
    expect(phpunitFile!.contents).toContain('<testsuite name="unit">');

    // Check GitHub Actions
    const workflowFile = findFile(result, ".github/workflows/tests.yml");
    expect(workflowFile).toBeDefined();
    expect(workflowFile!.contents).toContain('name: "Tests"');

    // Check src directory structure
    const srcFiles = findFile(result, "src/");
    expect(srcFiles).toBeDefined();
    expect(srcFiles!.contents).toBeGreaterThan(0);

    // Check tests directory structure
    const testFiles = findFile(result, "tests/");
    expect(testFiles).toBeDefined();
    expect(testFiles!.contents).toBeGreaterThan(0);
  });

  it("should render application project with MVC structure", () => {
    const result = testRender(
      <php.ApplicationProject
        name="web-app"
        description="A modern web application"
        namespace="App"
        phpVersion="^8.2"
        framework="custom"
      />,
    );

    // Check composer.json
    const composerFile = findFile(result, "composer.json");
    expect(composerFile).toBeDefined();
    const composerContent = JSON.parse(composerFile!.contents);
    expect(composerContent.type).toBe("project");
    expect(composerContent.autoload["psr-4"]["App\\"]).toBe("src/");

    // Check MVC directory structure
    const controllers = findFile(result, "src/Controllers/");
    const models = findFile(result, "src/Models/");
    const services = findFile(result, "src/Services/");

    expect(controllers).toBeDefined();
    expect(models).toBeDefined();
    expect(services).toBeDefined();
  });
});
