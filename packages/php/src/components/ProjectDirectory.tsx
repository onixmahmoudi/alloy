import { Children, SourceDirectory } from "@alloy-js/core";
import { ComposerJson, ComposerJsonProps } from "./ComposerJson.jsx";

export interface ProjectDirectoryProps {
  name: string;
  composerConfig?: ComposerJsonProps;
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
      {props.composerConfig && <ComposerJson {...props.composerConfig} />}
      <SourceDirectory path={srcDir}>{props.children}</SourceDirectory>
    </SourceDirectory>
  );
}
