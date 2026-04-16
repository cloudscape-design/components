#!/usr/bin/env node
// Usage: node scripts/generate-style-api-docs.mjs <path-to-style-api-index.js> [output.md]
// Example: node scripts/generate-style-api-docs.mjs lib/components/style-api/index.js style-api.md

import { writeFileSync } from 'fs';
import { resolve } from 'path';
import { pathToFileURL } from 'url';

const [inputPath, outputPath] = process.argv.slice(2);

if (!inputPath) {
  console.error('Usage: generate-style-api-docs.mjs <path-to-style-api-index.js> [output.md]');
  process.exit(1);
}

const absoluteInput = resolve(inputPath);
const exports = await import(pathToFileURL(absoluteInput));

const lines = [];

for (const [componentName, styleApi] of Object.entries(exports)) {
  if (!styleApi || !Array.isArray(styleApi.variables) || !Array.isArray(styleApi.selectors)) {
    continue;
  }

  const title = componentName[0].toUpperCase() + componentName.slice(1);
  lines.push(`# ${title}\n`);

  // CSS Variables
  lines.push(`## CSS Variables\n`);
  if (styleApi.variables.length === 0) {
    lines.push('_No CSS variables defined._\n');
  } else {
    lines.push('| Variable | Description |');
    lines.push('|----------|-------------|');
    for (const v of styleApi.variables) {
      lines.push(`| \`${v.name}\` | ${v.description ?? ''} |`);
    }
    lines.push('');
  }

  // Selectors
  lines.push(`## Selectors\n`);
  if (styleApi.selectors.length === 0) {
    lines.push('_No selectors defined._\n');
  } else {
    for (const sel of styleApi.selectors) {
      lines.push(`### \`.${sel.className}\`\n`);
      if (sel.description) {
        lines.push(`${sel.description}\n`);
      }
      if (sel.tags?.length) {
        lines.push(`**Applies to:** ${sel.tags.map(t => `\`<${t}>\``).join(', ')}\n`);
      }
      if (sel.attributes?.length) {
        lines.push('**Attributes:**\n');
        lines.push('| Attribute | Description |');
        lines.push('|-----------|-------------|');
        for (const attr of sel.attributes) {
          lines.push(`| \`${attr.name}\` | ${attr.description ?? ''} |`);
        }
        lines.push('');
      }
    }
  }
}

const destination = outputPath ?? 'style-api.md';
writeFileSync(destination, lines.join('\n'));
console.log(`Written to ${destination}`);
