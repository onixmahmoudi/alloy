import { SourceFile, code } from "@alloy-js/core";

export interface ReadmeSection {
  title: string;
  content: string;
}

export interface ReadmeProps {
  /** Project name */
  name: string;
  /** Project description */
  description: string;
  /** Installation instructions */
  installation?: string;
  /** Usage examples */
  usage?: string;
  /** API documentation */
  api?: string;
  /** Contributing guidelines */
  contributing?: string;
  /** License information */
  license?: string;
  /** PHP version requirements */
  phpVersion?: string;
  /** Composer package name */
  packageName?: string;
  /** GitHub repository URL */
  repository?: string;
  /** Project badges */
  badges?: Array<{
    alt: string;
    image: string;
    link?: string;
  }>;
  /** Custom sections */
  sections?: ReadmeSection[];
  /** Table of contents */
  toc?: boolean;
}

/**
 * Generates a professional README.md file for PHP projects
 */
export function ReadmeMarkdown(props: ReadmeProps) {
  const {
    name,
    description,
    phpVersion = "^8.0",
    packageName,
    repository,
    badges = [],
    toc = true,
    sections = [],
  } = props;

  let content = `# ${name}\n\n`;

  // Add description
  content += `${description}\n\n`;

  // Add badges
  if (badges.length > 0) {
    badges.forEach((badge) => {
      if (badge.link) {
        content += `[![${badge.alt}](${badge.image})](${badge.link}) `;
      } else {
        content += `![${badge.alt}](${badge.image}) `;
      }
    });
    content += "\n\n";
  }

  // Table of contents
  if (toc) {
    content += "## Table of Contents\n\n";
    content += "- [Installation](#installation)\n";
    if (props.usage) content += "- [Usage](#usage)\n";
    if (props.api) content += "- [API Documentation](#api-documentation)\n";
    sections.forEach((section) => {
      const anchor = section.title.toLowerCase().replace(/\s+/g, "-");
      content += `- [${section.title}](#${anchor})\n`;
    });
    if (props.contributing) content += "- [Contributing](#contributing)\n";
    if (props.license) content += "- [License](#license)\n";
    content += "\n";
  }

  // Installation
  content += "## Installation\n\n";
  if (packageName) {
    content += `Install via Composer:\n\n`;
    content += "```bash\n";
    content += `composer require ${packageName}\n`;
    content += "```\n\n";
  }

  content += "### Requirements\n\n";
  content += `- PHP ${phpVersion}\n`;
  content += "- Composer\n\n";

  if (props.installation) {
    content += props.installation + "\n\n";
  }

  // Usage
  if (props.usage) {
    content += "## Usage\n\n";
    content += props.usage + "\n\n";
  }

  // API Documentation
  if (props.api) {
    content += "## API Documentation\n\n";
    content += props.api + "\n\n";
  }

  // Custom sections
  sections.forEach((section) => {
    content += `## ${section.title}\n\n`;
    content += section.content + "\n\n";
  });

  // Contributing
  if (props.contributing) {
    content += "## Contributing\n\n";
    content += props.contributing + "\n\n";
  }

  // License
  if (props.license) {
    content += "## License\n\n";
    content += props.license + "\n\n";
  }

  return (
    <SourceFile path="README.md" filetype="markdown">
      {code`${content.trim()}`}
    </SourceFile>
  );
}
