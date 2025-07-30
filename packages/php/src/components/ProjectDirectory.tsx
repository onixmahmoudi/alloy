import { Children, SourceDirectory, SourceFile, code } from "@alloy-js/core";

export interface ComposerConfig {
  name: string;
  description: string;
  version?: string;
  type?: string;
  autoload?: {
    "psr-4"?: Record<string, string>;
  };
  require?: Record<string, string>;
  "require-dev"?: Record<string, string>;
}

export interface ProjectDirectoryProps {
  name: string;
  composerConfig: ComposerConfig;
  srcDir?: string;
  children?: Children;
}

/**
 * Represents a PHP project directory with Composer configuration
 */
export function ProjectDirectory(props: ProjectDirectoryProps) {
  const srcDir = props.srcDir || "src";

  return (
    <SourceDirectory path={props.name}>
      <SourceFile path="composer.json" filetype="json">
        {code`${JSON.stringify(
          {
            name: props.composerConfig.name,
            description: props.composerConfig.description,
            version: props.composerConfig.version || "1.0.0",
            type: props.composerConfig.type || "library",
            autoload: props.composerConfig.autoload || {
              "psr-4": {
                [`${props.composerConfig.name.split("/")[1]?.replace("-", "")}\\`]: `${srcDir}/`,
              },
            },
            require: props.composerConfig.require || {
              php: "^8.0",
            },
            "require-dev": props.composerConfig["require-dev"] || {},
          },
          null,
          2,
        )}`}
      </SourceFile>
      <SourceDirectory path={srcDir}>{props.children}</SourceDirectory>
    </SourceDirectory>
  );
}
