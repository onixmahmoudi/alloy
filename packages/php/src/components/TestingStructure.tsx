import { Children, SourceDirectory, SourceFile, code } from "@alloy-js/core";

export interface PhpUnitConfigProps {
  /** Bootstrap file path */
  bootstrap?: string;
  /** Test suites configuration */
  testSuites?: Array<{
    name: string;
    directory: string;
    suffix?: string;
  }>;
  /** Coverage configuration */
  coverage?: {
    include?: string[];
    exclude?: string[];
    reports?: {
      html?: string;
      clover?: string;
      text?: boolean;
    };
  };
  /** Logging configuration */
  logging?: {
    junit?: string;
    testdox?: string;
  };
}

/**
 * Generates a phpunit.xml configuration file
 */
export function PhpUnitConfig(props: PhpUnitConfigProps = {}) {
  const {
    bootstrap = "vendor/autoload.php",
    testSuites = [{ name: "default", directory: "tests" }],
    coverage,
    logging,
  } = props;

  let config = `<?xml version="1.0" encoding="UTF-8"?>
<phpunit xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:noNamespaceSchemaLocation="vendor/phpunit/phpunit/phpunit.xsd"
         bootstrap="${bootstrap}"
         colors="true"
         processIsolation="false"
         stopOnFailure="false">
    
    <testsuites>`;

  testSuites.forEach((suite) => {
    config += `
        <testsuite name="${suite.name}">
            <directory>${suite.directory}</directory>`;
    if (suite.suffix) {
      config += `
            <suffix>${suite.suffix}</suffix>`;
    }
    config += `
        </testsuite>`;
  });

  config += `
    </testsuites>`;

  if (coverage) {
    config += `
    
    <coverage>`;

    if (coverage.include) {
      config += `
        <include>`;
      coverage.include.forEach((path) => {
        config += `
            <directory>${path}</directory>`;
      });
      config += `
        </include>`;
    }

    if (coverage.exclude) {
      config += `
        <exclude>`;
      coverage.exclude.forEach((path) => {
        config += `
            <directory>${path}</directory>`;
      });
      config += `
        </exclude>`;
    }

    if (coverage.reports) {
      config += `
        <report>`;
      if (coverage.reports.html) {
        config += `
            <html outputDirectory="${coverage.reports.html}"/>`;
      }
      if (coverage.reports.clover) {
        config += `
            <clover outputFile="${coverage.reports.clover}"/>`;
      }
      if (coverage.reports.text) {
        config += `
            <text outputFile="php://stdout"/>`;
      }
      config += `
        </report>`;
    }

    config += `
    </coverage>`;
  }

  if (logging) {
    config += `
    
    <logging>`;
    if (logging.junit) {
      config += `
        <junit outputFile="${logging.junit}"/>`;
    }
    if (logging.testdox) {
      config += `
        <testdoxHtml outputFile="${logging.testdox}"/>`;
    }
    config += `
    </logging>`;
  }

  config += `
</phpunit>`;

  return (
    <SourceFile path="phpunit.xml" filetype="xml">
      {code`${config}`}
    </SourceFile>
  );
}

export interface TestingStructureProps {
  /** Testing framework (phpunit, pest, etc.) */
  framework?: "phpunit" | "pest";
  /** Test directory name */
  testDir?: string;
  /** Include PHPUnit configuration */
  phpunitConfig?: PhpUnitConfigProps;
  /** Include test bootstrap file */
  bootstrap?: boolean;
  /** Test directory structure */
  structure?: {
    unit?: boolean;
    feature?: boolean;
    integration?: boolean;
    functional?: boolean;
  };
  /** Children components */
  children?: Children;
}

/**
 * Creates a complete testing directory structure
 */
export function TestingStructure(props: TestingStructureProps = {}) {
  const {
    framework = "phpunit",
    testDir = "tests",
    phpunitConfig,
    bootstrap = true,
    structure = { unit: true, feature: true },
    children,
  } = props;

  return (
    <>
      {/* PHPUnit configuration */}
      {framework === "phpunit" && <PhpUnitConfig {...phpunitConfig} />}

      {/* Test directory structure */}
      <SourceDirectory path={testDir}>
        {/* Bootstrap file */}
        {bootstrap && (
          <SourceFile path="bootstrap.php" filetype="php">
            {code`<?php

require_once dirname(__DIR__) . '/vendor/autoload.php';

// Test environment setup
// Add any global test configuration here`}
          </SourceFile>
        )}

        {/* Test directories */}
        {structure.unit && (
          <SourceDirectory path="Unit">
            {/* Unit test examples can be added here */}
          </SourceDirectory>
        )}

        {structure.feature && (
          <SourceDirectory path="Feature">
            {/* Feature test examples can be added here */}
          </SourceDirectory>
        )}

        {structure.integration && (
          <SourceDirectory path="Integration">
            {/* Integration test examples can be added here */}
          </SourceDirectory>
        )}

        {structure.functional && (
          <SourceDirectory path="Functional">
            {/* Functional test examples can be added here */}
          </SourceDirectory>
        )}

        {children}
      </SourceDirectory>
    </>
  );
}
