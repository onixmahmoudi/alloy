import { Children, SourceDirectory } from "@alloy-js/core";

export interface Psr4DirectoryProps {
  /** The namespace prefix (e.g., "App\\Models\\") */
  namespace: string;
  /** The directory path relative to autoload root */
  path?: string;
  /** Child source files and directories */
  children?: Children;
}

/**
 * Creates a PSR-4 compliant directory structure
 * Automatically maps namespace to directory path
 */
export function Psr4Directory(props: Psr4DirectoryProps) {
  const { namespace, children } = props;

  // Convert namespace to directory path if not provided
  const directoryPath = props.path || namespaceToPath(namespace);

  return <SourceDirectory path={directoryPath}>{children}</SourceDirectory>;
}

/**
 * Converts a PSR-4 namespace to a directory path
 * e.g., "App\\Models\\User\\" -> "App/Models/User"
 */
export function namespaceToPath(namespace: string): string {
  return namespace
    .replace(/\\/g, "/") // Convert backslashes to forward slashes
    .replace(/\/+$/, "") // Remove trailing slashes
    .replace(/^\/+/, ""); // Remove leading slashes
}

/**
 * Converts a directory path to a PSR-4 namespace
 * e.g., "App/Models/User" -> "App\\Models\\User\\"
 */
export function pathToNamespace(path: string): string {
  return (
    path
      .replace(/\//g, "\\") // Convert forward slashes to backslashes
      .replace(/\\+$/, "") // Remove trailing backslashes
      .replace(/^\\+/, "") + // Remove leading backslashes
    "\\"
  ); // Add trailing backslash
}

export interface Psr4StructureProps {
  /** Root namespace (e.g., "App") */
  rootNamespace: string;
  /** Source directory path (e.g., "src") */
  srcPath?: string;
  /** Common directory structure */
  structure?: {
    controllers?: boolean;
    models?: boolean;
    services?: boolean;
    repositories?: boolean;
    middleware?: boolean;
    exceptions?: boolean;
    traits?: boolean;
    interfaces?: boolean;
    enums?: boolean;
    events?: boolean;
    listeners?: boolean;
    jobs?: boolean;
    commands?: boolean;
  };
  /** Custom directories */
  customDirectories?: string[];
  /** Children components */
  children?: Children;
}

/**
 * Creates a complete PSR-4 directory structure with common PHP application directories
 */
export function Psr4Structure(props: Psr4StructureProps) {
  const {
    rootNamespace,
    srcPath = "src",
    structure = {},
    customDirectories = [],
    children,
  } = props;

  const {
    controllers = false,
    models = false,
    services = false,
    repositories = false,
    middleware = false,
    exceptions = false,
    traits = false,
    interfaces = false,
    enums = false,
    events = false,
    listeners = false,
    jobs = false,
    commands = false,
  } = structure;

  return (
    <SourceDirectory path={srcPath}>
      {controllers && (
        <Psr4Directory namespace={`${rootNamespace}\\Controllers`} />
      )}
      {models && <Psr4Directory namespace={`${rootNamespace}\\Models`} />}
      {services && <Psr4Directory namespace={`${rootNamespace}\\Services`} />}
      {repositories && (
        <Psr4Directory namespace={`${rootNamespace}\\Repositories`} />
      )}
      {middleware && (
        <Psr4Directory namespace={`${rootNamespace}\\Middleware`} />
      )}
      {exceptions && (
        <Psr4Directory namespace={`${rootNamespace}\\Exceptions`} />
      )}
      {traits && <Psr4Directory namespace={`${rootNamespace}\\Traits`} />}
      {interfaces && (
        <Psr4Directory namespace={`${rootNamespace}\\Contracts`} />
      )}
      {enums && <Psr4Directory namespace={`${rootNamespace}\\Enums`} />}
      {events && <Psr4Directory namespace={`${rootNamespace}\\Events`} />}
      {listeners && <Psr4Directory namespace={`${rootNamespace}\\Listeners`} />}
      {jobs && <Psr4Directory namespace={`${rootNamespace}\\Jobs`} />}
      {commands && (
        <Psr4Directory namespace={`${rootNamespace}\\Console\\Commands`} />
      )}

      {/* Custom directories */}
      {customDirectories.map((dir) => (
        <Psr4Directory
          key={dir}
          namespace={`${rootNamespace}\\${dir.replace(/\//g, "\\")}`}
        />
      ))}

      {children}
    </SourceDirectory>
  );
}
