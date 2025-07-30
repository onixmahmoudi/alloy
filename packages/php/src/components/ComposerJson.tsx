import { SourceFile, code } from "@alloy-js/core";

export interface ComposerDependencies {
  [packageName: string]: string;
}

export interface ComposerAutoload {
  "psr-4"?: Record<string, string>;
  "psr-0"?: Record<string, string>;
  files?: string[];
  classmap?: string[];
}

export interface ComposerScripts {
  [scriptName: string]: string | string[];
}

export interface ComposerConfig {
  [key: string]: any;
}

export interface ComposerJsonProps {
  name: string;
  description: string;
  version?: string;
  type?: "library" | "project" | "metapackage" | "composer-plugin";
  keywords?: string[];
  homepage?: string;
  license?: string | string[];
  authors?: Array<{
    name: string;
    email?: string;
    homepage?: string;
    role?: string;
  }>;
  require?: ComposerDependencies;
  "require-dev"?: ComposerDependencies;
  suggest?: ComposerDependencies;
  autoload?: ComposerAutoload;
  "autoload-dev"?: ComposerAutoload;
  scripts?: ComposerScripts;
  config?: ComposerConfig;
  extra?: Record<string, any>;
  bin?: string[];
  archive?: {
    exclude?: string[];
  };
}

/**
 * Represents a composer.json file with full Composer specification support
 */
export function ComposerJson(props: ComposerJsonProps) {
  const composerData: any = {
    name: props.name,
    description: props.description,
    type: props.type || "library",
  };

  // Add optional fields only if provided
  if (props.version) composerData.version = props.version;
  if (props.keywords) composerData.keywords = props.keywords;
  if (props.homepage) composerData.homepage = props.homepage;
  if (props.license) composerData.license = props.license;
  if (props.authors) composerData.authors = props.authors;
  if (props.require) composerData.require = props.require;
  if (props["require-dev"]) composerData["require-dev"] = props["require-dev"];
  if (props.suggest) composerData.suggest = props.suggest;
  if (props.autoload) composerData.autoload = props.autoload;
  if (props["autoload-dev"])
    composerData["autoload-dev"] = props["autoload-dev"];
  if (props.scripts) composerData.scripts = props.scripts;
  if (props.config) composerData.config = props.config;
  if (props.extra) composerData.extra = props.extra;
  if (props.bin) composerData.bin = props.bin;
  if (props.archive) composerData.archive = props.archive;

  return (
    <SourceFile path="composer.json" filetype="json">
      {code`${JSON.stringify(composerData, null, 2)}`}
    </SourceFile>
  );
}
