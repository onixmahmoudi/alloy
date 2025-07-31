import { useImportManager } from "./ImportManager.js";

export interface UseStatementGroupProps {
  /** Group title/comment */
  title?: string;
  /** Whether to add blank lines around the group */
  addBlankLines?: boolean;
}

/**
 * Renders optimized use statements with automatic grouping
 */
export function OptimizedUseStatements(props: UseStatementGroupProps = {}) {
  const { title, addBlankLines = true } = props;
  const importManager = useImportManager();

  const imports = importManager.getOptimizedImports();

  if (imports.length === 0) {
    return null;
  }

  return (
    <>
      {title && (
        <>
          // {title}
          <hbr />
        </>
      )}
      {addBlankLines && <hbr />}
      {imports.map((importRecord) => (
        <>
          use {importRecord.importPath}
          {importRecord.alias && <> as {importRecord.alias}</>};
          <hbr />
        </>
      ))}
      {addBlankLines && <hbr />}
    </>
  );
}

export interface GroupedUseStatementsProps {
  /** Whether to group by vendor */
  groupByVendor?: boolean;
  /** Whether to group by type */
  groupByType?: boolean;
  /** Custom group definitions */
  customGroups?: Array<{
    title: string;
    pattern: RegExp;
    priority: number;
  }>;
}

/**
 * Renders use statements with sophisticated grouping
 */
export function GroupedUseStatements(props: GroupedUseStatementsProps = {}) {
  const { groupByVendor = true, groupByType = true, customGroups = [] } = props;
  const importManager = useImportManager();

  const imports = importManager.getOptimizedImports();

  if (imports.length === 0) {
    return null;
  }

  // Define default groups
  const groups = [
    ...customGroups,
    {
      title: "Framework Components",
      pattern: /^(Laravel|Symfony|Doctrine|Psr)\\/,
      priority: 1,
    },
    {
      title: "Third Party Libraries",
      pattern: /^[A-Z][a-z]+\\/,
      priority: 2,
    },
    {
      title: "Application Classes",
      pattern: /^App\\/,
      priority: 3,
    },
  ];

  // Group imports
  const groupedImports = new Map<string, typeof imports>();
  const ungrouped: typeof imports = [];

  for (const importRecord of imports) {
    let matched = false;

    for (const group of groups.sort((a, b) => a.priority - b.priority)) {
      if (group.pattern.test(importRecord.importPath)) {
        if (!groupedImports.has(group.title)) {
          groupedImports.set(group.title, []);
        }
        groupedImports.get(group.title)!.push(importRecord);
        matched = true;
        break;
      }
    }

    if (!matched) {
      ungrouped.push(importRecord);
    }
  }

  return (
    <>
      {/* Render grouped imports */}
      {Array.from(groupedImports.entries()).map(([title, groupImports]) => (
        <>
          // {title}
          <hbr />
          {groupImports.map((importRecord) => (
            <>
              use {importRecord.importPath}
              {importRecord.alias && <> as {importRecord.alias}</>};
              <hbr />
            </>
          ))}
          <hbr />
        </>
      ))}

      {/* Render ungrouped imports */}
      {ungrouped.length > 0 && (
        <>
          {ungrouped.map((importRecord) => (
            <>
              use {importRecord.importPath}
              {importRecord.alias && <> as {importRecord.alias}</>};
              <hbr />
            </>
          ))}
          <hbr />
        </>
      )}
    </>
  );
}

export interface ConditionalUseStatementProps {
  /** Import path */
  importPath: string;
  /** Alias */
  alias?: string;
  /** Condition for including this import */
  condition: boolean;
  /** PHP version requirement */
  phpVersion?: string;
  /** Whether this is an optional dependency */
  optional?: boolean;
}

/**
 * Conditional use statement with version and dependency checks
 */
export function ConditionalUseStatement(props: ConditionalUseStatementProps) {
  const { importPath, alias, condition, phpVersion, optional } = props;

  if (!condition) {
    return null;
  }

  return (
    <>
      {phpVersion && (
        <>
          // Requires PHP {phpVersion}+
          <hbr />
        </>
      )}
      {optional && (
        <>
          // Optional dependency
          <hbr />
        </>
      )}
      use {importPath}
      {alias && <> as {alias}</>};
      <hbr />
    </>
  );
}

export interface BulkUseStatementProps {
  /** Base namespace */
  baseNamespace: string;
  /** Classes to import from the namespace */
  classes: Array<{
    name: string;
    alias?: string;
  }>;
  /** Whether to use grouped syntax */
  useGroupedSyntax?: boolean;
}

/**
 * Bulk import from a single namespace
 */
export function BulkUseStatement(props: BulkUseStatementProps) {
  const { baseNamespace, classes, useGroupedSyntax = true } = props;

  if (classes.length === 0) {
    return null;
  }

  if (useGroupedSyntax && classes.length > 3) {
    // Use grouped import syntax: use Namespace\{ClassA, ClassB as B, ClassC};
    return (
      <>
        use {baseNamespace}\{"{"}
        {classes.map((cls, index) => (
          <>
            {index > 0 && ", "}
            {cls.name}
            {cls.alias && <> as {cls.alias}</>}
          </>
        ))}
        {"}"};
        <hbr />
      </>
    );
  } else {
    // Use individual import statements
    return (
      <>
        {classes.map((cls) => (
          <>
            use {baseNamespace}\{cls.name}
            {cls.alias && <> as {cls.alias}</>};
            <hbr />
          </>
        ))}
      </>
    );
  }
}
