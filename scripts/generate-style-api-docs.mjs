#!/usr/bin/env node
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable no-unsanitized/method */
// Usage: node scripts/generate-style-api-docs.mjs <path-to-style-api.js> [output.md]
// Example: node scripts/generate-style-api-docs.mjs lib/components/button/experiment-button-style-api.js

import { writeFileSync } from 'fs';
import { basename, resolve } from 'path';
import { pathToFileURL } from 'url';

const [inputPath, outputPath] = process.argv.slice(2);

if (!inputPath) {
  console.error('Usage: generate-style-api-docs.mjs <path-to-style-api.js> [output.md]');
  process.exit(1);
}

const absoluteInput = resolve(inputPath);
const module = await import(pathToFileURL(absoluteInput));
const styleApi = module.default;

if (!styleApi || !Array.isArray(styleApi.variables) || !Array.isArray(styleApi.selectors)) {
  console.error('Invalid style API: expected { variables: [...], selectors: [...] }');
  process.exit(1);
}

const componentName = basename(absoluteInput)
  .replace(/experiment-/, '')
  .replace(/-style-api\.js$/, '');

const lines = [];

lines.push(`# ${componentName[0].toUpperCase() + componentName.slice(1)} Style API\n`);

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
      lines.push(`**Tags:** ${sel.tags.map(t => `\`<${t}>\``).join(', ')}\n`);
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

const markdown = lines.join('\n');
const destination = outputPath ?? `${componentName}-style-api.md`;
writeFileSync(destination, markdown);
console.log(`Written to ${destination}`);
