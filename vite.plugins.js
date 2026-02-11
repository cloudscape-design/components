// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
export function createPagesScssModulesPlugin() {
  const virtualToReal = new Map();

  return {
    name: 'pages-scss-modules',
    enforce: 'pre',

    async resolveId(source, importer, options) {
      // Skip if not an SCSS file or already a module
      if (!source.endsWith('.scss') || source.endsWith('.module.scss')) {
        return null;
      }

      // Only process files imported from pages/ or app/
      if (!importer || (!importer.includes('/pages/') && !importer.includes('/app/'))) {
        return null;
      }

      // Only process relative imports
      if (!source.startsWith('./') && !source.startsWith('../')) {
        return null;
      }

      const resolved = await this.resolve(source, importer, {
        ...options,
        skipSelf: true,
      });
      if (!resolved) {
        return null;
      }

      const virtualPath = resolved.id.replace(/\.scss$/, '.virtual.module.scss');
      virtualToReal.set(virtualPath, resolved.id);

      return virtualPath;
    },

    load(id) {
      const realPath = virtualToReal.get(id);
      if (realPath) {
        return import('fs/promises').then(fs => fs.readFile(realPath, 'utf-8'));
      }
      return null;
    },
  };
}

/**
 * Creates a Vite plugin that replaces EJS-style placeholders in HTML with values.
 *
 * Problem:
 * Vite doesn't process EJS templates, so <%= KEY %> syntax doesn't work.
 * However, you may want to inject build-time values into your HTML.
 *
 * Solution:
 * This plugin uses the transformIndexHtml hook to replace all occurrences of
 * <%= KEY %> with the corresponding value from the data object.
 *
 * How it works:
 * 1. Takes a data object mapping keys to values
 * 2. During HTML transformation, replaces <%= KEY %> with the stringified value
 *
 * @param {Object} options - Plugin options
 * @param {Object<string, any>} options.data - Key-value pairs to inject into HTML
 * @returns {import('vite').Plugin} Vite plugin configuration
 *
 * @example
 * createHTMLSecretsInjectionPlugin({
 *   data: {
 *     'process.env.NODE_ENV': process.env.NODE_ENV,
 *     'API_URL': 'https://api.example.com',
 *   }
 * })
 *
 * // In HTML: <%= process.env.NODE_ENV %> becomes 'production'
 */
export function createHTMLSecretsInjectionPlugin(options = { data: {} }) {
  const { data } = options;

  return {
    name: 'html-secrets-injection',
    enforce: 'pre',

    transformIndexHtml(html) {
      let result = html;

      for (const [key, value] of Object.entries(data)) {
        // Escape special regex characters in the key
        const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        // Match <%= KEY %> with optional whitespace
        const pattern = new RegExp(`<%=\\s*${escapedKey}\\s*%>`, 'g');
        // Replace with the stringified value (without quotes for raw injection)
        result = result.replace(pattern, String(value));
      }

      return result;
    },
  };
}
