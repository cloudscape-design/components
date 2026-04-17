#!/usr/bin/env node
// Usage: node --experimental-loader ./scripts/esm-loader.mjs scripts/generate-style-api-docs.mjs <path-to-style-api-index.js> [output.md]
// Example: node --experimental-loader ./scripts/esm-loader.mjs scripts/generate-style-api-docs.mjs lib/components/style-api/index.js style-api.md

import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { pathToFileURL } from 'url';

const [inputPath, outputPath] = process.argv.slice(2);

if (!inputPath) {
  console.error(
    'Usage: generate-style-api-docs.mjs <path-to-style-api-index.js> [output.md]'
  );
  process.exit(1);
}

// ── Helpers ──────────────────────────────────────────────────────────────────

/** "buttonDropdown" → "Button Dropdown", "collectionPreferences" → "Collection Preferences" */
function formatComponentName(camelCase) {
  return camelCase
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, c => c.toUpperCase())
    .trim();
}

function variablesTable(variables) {
  const lines = [];
  lines.push('| Variable | Description |');
  lines.push('|----------|-------------|');
  for (const v of variables) {
    lines.push(`| \`${v.name}\` | ${v.description ?? ''} |`);
  }
  return lines;
}

// ── Load static preamble ──────────────────────────────────────────────────────

const staticPath = resolve('style-api-static.md');
let preamble = '';
try {
  preamble = readFileSync(staticPath, 'utf8').trimEnd();
} catch {
  console.warn(`Warning: could not read style-api-static.md — output will have no preamble.`);
}

// ── Load style API exports ────────────────────────────────────────────────────

const absoluteInput = resolve(inputPath);
const exports = await import(pathToFileURL(absoluteInput));

// ── Generate component sections ───────────────────────────────────────────────

const lines = [];

for (const [componentName, styleApi] of Object.entries(exports)) {
  if (!styleApi || !Array.isArray(styleApi.variables) || !Array.isArray(styleApi.selectors)) {
    continue;
  }

  const title = formatComponentName(componentName);
  lines.push(`### ${title}\n`);

  // Top-level CSS variables (shared across all selectors)
  if (styleApi.variables.length > 0) {
    lines.push(`#### CSS Variables\n`);
    lines.push(...variablesTable(styleApi.variables));
    lines.push('');
  }

  // Selectors
  if (styleApi.selectors.length > 0) {
    lines.push(`#### Selectors\n`);
    for (const sel of styleApi.selectors) {
      lines.push(`##### \`.${sel.className}\`\n`);

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
      if (sel.variables?.length) {
        lines.push('**CSS Variables:**\n');
        lines.push(...variablesTable(sel.variables));
        lines.push('');
      }
    }
  }
}

// ── Assemble and write ────────────────────────────────────────────────────────

const generated = lines.join('\n');
const output = preamble ? `${preamble}\n\n${generated}` : generated;

const destination = outputPath ?? 'style-api.md';
writeFileSync(destination, output);
console.log(`Written to ${destination}`);
