import { SourceFile, code } from "@alloy-js/core";

export interface GitIgnoreProps {
  /** Include Composer-related ignores */
  composer?: boolean;
  /** Include IDE-related ignores */
  ide?: boolean;
  /** Include OS-related ignores */
  os?: boolean;
  /** Include testing-related ignores */
  testing?: boolean;
  /** Include build/deployment ignores */
  build?: boolean;
  /** Custom patterns to ignore */
  custom?: string[];
  /** Additional sections with custom patterns */
  sections?: Array<{
    title: string;
    patterns: string[];
  }>;
}

/**
 * Generates a .gitignore file with common PHP project patterns
 */
export function GitIgnore(props: GitIgnoreProps = {}) {
  const {
    composer = true,
    ide = true,
    os = true,
    testing = true,
    build = true,
    custom = [],
    sections = [],
  } = props;

  const patterns: string[] = [];

  // Composer dependencies
  if (composer) {
    patterns.push(
      "# Composer",
      "/vendor/",
      "composer.lock",
      "composer.phar",
      "",
    );
  }

  // IDE files
  if (ide) {
    patterns.push("# IDEs", ".vscode/", ".idea/", "*.swp", "*.swo", "*~", "");
  }

  // OS files
  if (os) {
    patterns.push(
      "# OS",
      ".DS_Store",
      ".DS_Store?",
      "._*",
      ".Spotlight-V100",
      ".Trashes",
      "ehthumbs.db",
      "Thumbs.db",
      "",
    );
  }

  // Testing
  if (testing) {
    patterns.push(
      "# Testing",
      "/coverage/",
      "/.phpunit.cache/",
      "/phpunit.xml",
      "/phpstan.neon",
      "/psalm.xml",
      "",
    );
  }

  // Build/deployment
  if (build) {
    patterns.push(
      "# Build/Deploy",
      "/build/",
      "/dist/",
      "/.env",
      "/.env.local",
      "/.env.*.local",
      "/var/cache/",
      "/var/logs/",
      "/var/sessions/",
      "",
    );
  }

  // Custom patterns
  if (custom.length > 0) {
    patterns.push("# Custom", ...custom, "");
  }

  // Additional sections
  sections.forEach((section) => {
    patterns.push(`# ${section.title}`, ...section.patterns, "");
  });

  return (
    <SourceFile path=".gitignore" filetype="text">
      {code`${patterns.join("\n").trim()}`}
    </SourceFile>
  );
}
