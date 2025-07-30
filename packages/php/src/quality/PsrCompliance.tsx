import { Children, SourceFile, code } from "@alloy-js/core";

export interface PsrComplianceProps {
  /** PSR standards to check */
  standards?: ("PSR-1" | "PSR-2" | "PSR-4" | "PSR-12")[];
  /** Exclude specific rules */
  excludeRules?: string[];
  /** Custom configuration */
  customConfig?: Record<string, any>;
}

/**
 * Generates PHP CodeSniffer configuration for PSR compliance
 */
export function PhpCodeSnifferConfig(props: PsrComplianceProps = {}) {
  const {
    standards = ["PSR-12"],
    excludeRules = [],
    customConfig = {}
  } = props;

  const config = {
    "default_standard": standards.join(","),
    "installed_paths": [
      "../../squizlabs/php_codesniffer/src/Standards"
    ],
    "ignore": [
      "*/vendor/*",
      "*/node_modules/*",
      "*/storage/*",
      "*/bootstrap/cache/*"
    ],
    "extensions": ["php"],
    "exclude": excludeRules,
    ...customConfig
  };

  return (
    <SourceFile path="phpcs.xml" filetype="xml">
      {code`<?xml version="1.0"?>
<ruleset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
         name="Project Coding Standard"
         xsi:noNamespaceSchemaLocation="vendor/squizlabs/php_codesniffer/phpcs.xsd">

    <description>Project coding standards</description>

    <!-- Include PSR standards -->
    ${standards.map(standard => `<rule ref="${standard}"/>`).join("\n    ")}

    <!-- Exclude specific rules -->
    ${excludeRules.map(rule => `<rule ref="${rule}"><exclude/></rule>`).join("\n    ")}

    <!-- File patterns to check -->
    <file>src/</file>
    <file>tests/</file>

    <!-- Ignore patterns -->
    ${config.ignore.map(pattern => `<exclude-pattern>${pattern}</exclude-pattern>`).join("\n    ")}

    <!-- Extensions to check -->
    <arg name="extensions" value="php"/>
    <arg name="colors"/>
    <arg value="sp"/>

</ruleset>`}
    </SourceFile>
  );
}

export interface PhpStanConfigProps {
  /** Analysis level (0-9) */
  level?: number;
  /** Paths to analyze */
  paths?: string[];
  /** Paths to exclude */
  excludePaths?: string[];
  /** Bootstrap files */
  bootstrapFiles?: string[];
  /** Extensions to include */
  extensions?: string[];
  /** Custom rules */
  customRules?: string[];
  /** Memory limit */
  memoryLimit?: string;
}

/**
 * Generates PHPStan configuration for static analysis
 */
export function PhpStanConfig(props: PhpStanConfigProps = {}) {
  const {
    level = 8,
    paths = ["src", "tests"],
    excludePaths = [],
    bootstrapFiles = [],
    extensions = ["php"],
    customRules = [],
    memoryLimit = "1G"
  } = props;

  const config = {
    parameters: {
      level,
      paths,
      excludePaths,
      bootstrapFiles,
      fileExtensions: extensions,
      memoryLimitFile: memoryLimit,
      checkMissingIterableValueType: false,
      checkGenericClassInNonGenericObjectType: false,
      reportUnmatchedIgnoredErrors: false
    },
    rules: customRules,
    includes: [
      "vendor/phpstan/phpstan/conf/bleedingEdge.neon"
    ]
  };

  const neonContent = generateNeonConfig(config);

  return (
    <SourceFile path="phpstan.neon" filetype="text">
      {code`${neonContent}`}
    </SourceFile>
  );
}

/**
 * Simple NEON configuration generator
 */
function generateNeonConfig(config: any): string {
  let neon = "";

  // Parameters section
  if (config.parameters) {
    neon += "parameters:\n";
    for (const [key, value] of Object.entries(config.parameters)) {
      if (Array.isArray(value)) {
        neon += `    ${key}:\n`;
        (value as any[]).forEach(item => {
          neon += `        - ${item}\n`;
        });
      } else {
        neon += `    ${key}: ${value}\n`;
      }
    }
    neon += "\n";
  }

  // Rules section
  if (config.rules?.length > 0) {
    neon += "rules:\n";
    config.rules.forEach((rule: string) => {
      neon += `    - ${rule}\n`;
    });
    neon += "\n";
  }

  // Includes section
  if (config.includes?.length > 0) {
    neon += "includes:\n";
    config.includes.forEach((include: string) => {
      neon += `    - ${include}\n`;
    });
  }

  return neon.trim();
}

export interface PhpCsFixerConfigProps {
  /** Preset to use */
  preset?: "@PSR1" | "@PSR2" | "@PSR12" | "@Symfony" | "@PHP80Migration" | "@PHP81Migration";
  /** Custom rules */
  rules?: Record<string, any>;
  /** Risk level */
  riskLevel?: "safe" | "risky";
  /** File finder configuration */
  finder?: {
    directories?: string[];
    exclude?: string[];
    notPath?: string[];
    name?: string[];
  };
}

/**
 * Generates PHP CS Fixer configuration
 */
export function PhpCsFixerConfig(props: PhpCsFixerConfigProps = {}) {
  const {
    preset = "@PSR12",
    rules = {},
    riskLevel = "safe",
    finder = {}
  } = props;

  const {
    directories = ["src", "tests"],
    exclude = ["vendor", "node_modules"],
    notPath = [],
    name = ["*.php"]
  } = finder;

  return (
    <SourceFile path=".php-cs-fixer.php" filetype="php">
      {code`<?php

$finder = PhpCsFixer\\Finder::create()
    ->in([${directories.map(d => `'${d}'`).join(", ")}])
    ->exclude([${exclude.map(e => `'${e}'`).join(", ")}])
    ${notPath.length > 0 ? `.notPath([${notPath.map(p => `'${p}'`).join(", ")}])` : ""}
    ->name([${name.map(n => `'${n}'`).join(", ")}]);

$config = new PhpCsFixer\\Config();

return $config
    ->setRules([
        '${preset}' => true,
        ${Object.entries(rules).map(([rule, value]) => 
          `'${rule}' => ${JSON.stringify(value)}`
        ).join(",\n        ")}
    ])
    ->setRiskyAllowed(${riskLevel === "risky" ? "true" : "false"})
    ->setFinder($finder);`}
    </SourceFile>
  );
}

export interface QualityToolsSetupProps {
  /** Include PHP CodeSniffer */
  phpcs?: boolean | PsrComplianceProps;
  /** Include PHPStan */
  phpstan?: boolean | PhpStanConfigProps;
  /** Include PHP CS Fixer */
  phpCsFixer?: boolean | PhpCsFixerConfigProps;
  /** Include Psalm */
  psalm?: boolean;
  /** Include PHPMD */
  phpmd?: boolean;
  /** Include Rector */
  rector?: boolean;
  /** Add Composer scripts */
  addComposerScripts?: boolean;
}

/**
 * Complete quality tools setup for PHP projects
 */
export function QualityToolsSetup(props: QualityToolsSetupProps = {}) {
  const {
    phpcs = true,
    phpstan = true,
    phpCsFixer = true,
    psalm = false,
    phpmd = false,
    rector = false,
    addComposerScripts = true
  } = props;

  return (
    <>
      {/* PHP CodeSniffer */}
      {phpcs && (
        <PhpCodeSnifferConfig 
          {...(typeof phpcs === "object" ? phpcs : {})} 
        />
      )}

      {/* PHPStan */}
      {phpstan && (
        <PhpStanConfig 
          {...(typeof phpstan === "object" ? phpstan : {})} 
        />
      )}

      {/* PHP CS Fixer */}
      {phpCsFixer && (
        <PhpCsFixerConfig 
          {...(typeof phpCsFixer === "object" ? phpCsFixer : {})} 
        />
      )}

      {/* Psalm */}
      {psalm && (
        <SourceFile path="psalm.xml" filetype="xml">
          {code`<?xml version="1.0"?>
<psalm
    errorLevel="3"
    resolveFromConfigFile="true"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns="https://getpsalm.org/schema/config"
    xsi:schemaLocation="https://getpsalm.org/schema/config vendor/vimeo/psalm/config.xsd"
>
    <projectFiles>
        <directory name="src" />
        <ignoreFiles>
            <directory name="vendor" />
        </ignoreFiles>
    </projectFiles>
</psalm>`}
        </SourceFile>
      )}

      {/* PHPMD */}
      {phpmd && (
        <SourceFile path="phpmd.xml" filetype="xml">
          {code`<?xml version="1.0"?>
<ruleset name="Project Mess Detector Rules"
         xmlns="http://pmd.sf.net/ruleset/1.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://pmd.sf.net/ruleset/1.0.0 http://pmd.sf.net/ruleset_xml_schema.xsd"
         xsi:noNamespaceSchemaLocation="http://pmd.sf.net/ruleset_xml_schema.xsd">

    <description>Project PHPMD ruleset</description>

    <rule ref="rulesets/cleancode.xml" />
    <rule ref="rulesets/codesize.xml" />
    <rule ref="rulesets/controversial.xml" />
    <rule ref="rulesets/design.xml" />
    <rule ref="rulesets/naming.xml" />
    <rule ref="rulesets/unusedcode.xml" />

</ruleset>`}
        </SourceFile>
      )}

      {/* Rector */}
      {rector && (
        <SourceFile path="rector.php" filetype="php">
          {code`<?php

declare(strict_types=1);

use Rector\\Config\\RectorConfig;
use Rector\\Set\\ValueObject\\LevelSetList;
use Rector\\Set\\ValueObject\\SetList;

return static function (RectorConfig $rectorConfig): void {
    $rectorConfig->paths([
        __DIR__ . '/src',
        __DIR__ . '/tests',
    ]);

    $rectorConfig->sets([
        LevelSetList::UP_TO_PHP_81,
        SetList::CODE_QUALITY,
        SetList::DEAD_CODE,
        SetList::EARLY_RETURN,
        SetList::TYPE_DECLARATION,
    ]);
};`}
        </SourceFile>
      )}

      {/* GitHub workflow for quality checks */}
      <SourceFile path=".github/workflows/quality.yml" filetype="yaml">
        {code`name: Quality Checks

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  quality:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup PHP
      uses: shivammathur/setup-php@v2
      with:
        php-version: '8.1'
        extensions: dom, curl, libxml, mbstring, zip
        tools: composer:v2
    
    - name: Cache Composer packages
      id: composer-cache
      uses: actions/cache@v3
      with:
        path: vendor
        key: ${{ runner.os }}-php-${{ hashFiles('**/composer.lock') }}
        restore-keys: |
          ${{ runner.os }}-php-
    
    - name: Install dependencies
      run: composer install --prefer-dist --no-progress
    
    ${phpcs ? `- name: Run PHP CodeSniffer
      run: vendor/bin/phpcs
    ` : ""}
    ${phpstan ? `- name: Run PHPStan
      run: vendor/bin/phpstan analyse
    ` : ""}
    ${psalm ? `- name: Run Psalm
      run: vendor/bin/psalm
    ` : ""}
    ${phpmd ? `- name: Run PHPMD
      run: vendor/bin/phpmd src text phpmd.xml
    ` : ""}
    ${rector ? `- name: Run Rector (dry-run)
      run: vendor/bin/rector process --dry-run
    ` : ""}`}
      </SourceFile>
    </>
  );
} 