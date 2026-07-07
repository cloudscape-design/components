// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

/**
 * Secures the public interfaces contract.
 *
 * Public component interface files live at `src/{component}/interfaces.ts(x)` and must expose ONLY
 * public API types. To keep them safe for downstream design systems to proxy/extend, they may only
 * pull types from public locations. Any intra-repo type can otherwise be imported into a public
 * interface by mistake (internal helpers, implementation files, `src/internal/**`, sibling
 * `internal-interfaces.ts`, etc.), so this rule uses an allowlist rather than a denylist.
 *
 * Within a public interface file, an import / re-export source is allowed only when it is:
 *   - an external package (a non-relative specifier, e.g. `react`, `@cloudscape-design/*`); or
 *   - another component's public interface file (a relative path ending in `/interfaces`); or
 *   - the shared public types location (`src/types`, a relative path with a `types/` segment).
 *
 * Everything else is reported. The rule additionally forbids declaring or re-exporting `Internal*`
 * named types in the public file. It is a no-op outside public interface files, so internal files
 * (internal-interfaces.ts, src/internal/**, nested sub-module interfaces) are unaffected.
 */

// Matches a public component interface file: exactly one segment under `src/`, named `interfaces.ts(x)`.
// Excludes the internal/types buckets and any nested (deeper) interface file.
const PUBLIC_INTERFACE_RE = /(?:^|\/)src\/(?!internal\/|types\/)([^/]+)\/interfaces\.tsx?$/;

// Names starting with `Internal` followed by an upper-case letter are, by convention, internal types.
const INTERNAL_NAME_RE = /^Internal[A-Z]/;

/**
 * Whether a module specifier is an allowed import source for a public interface file.
 */
function isAllowedSource(source) {
  if (typeof source !== 'string') {
    return true;
  }
  // External packages (anything that is not a relative path). The contract targets intra-repo types.
  if (!source.startsWith('.')) {
    return true;
  }
  // Another component's public interface file, e.g. `../button/interfaces`.
  // Note: `internal-interfaces` ends in `-interfaces`, not `/interfaces`, so it is NOT allowed.
  if (/\/interfaces$/.test(source)) {
    return true;
  }
  // The shared public types location, e.g. `../types/base-component`.
  if (/(?:^|\/)types\//.test(source)) {
    return true;
  }
  return false;
}

function getComponent(filename) {
  const match = PUBLIC_INTERFACE_RE.exec(filename.replace(/\\/g, '/'));
  return match ? match[1] : null;
}

module.exports = {
  meta: {
    type: 'problem',
    messages: {
      internalDeclaration:
        "'{{name}}' looks like an internal type and must not be declared in a public interface file. Move it to 'src/{{component}}/internal-interfaces.ts'.",
      disallowedImport:
        "Public interface files may only import from another component's interfaces ('../<component>/interfaces') or shared public types ('src/types'). Importing from '{{source}}' is not allowed — if it is a public type, move it to 'src/types' and import it from there.",
      disallowedReexport:
        "Public interface files may only re-export from another component's interfaces or 'src/types'. Re-exporting from '{{source}}' is not allowed, as it can expose internal types through the public API surface.",
      internalReexportName: "Public interface files must not export '{{name}}' under an internal name.",
    },
    docs: {
      description:
        'Restricts imports in public component interface files (src/{component}/interfaces.{ts,tsx}) to other component interfaces or shared public types (src/types), preventing internal types from leaking into the public API surface.',
    },
    schema: [],
  },
  create(context) {
    const filename = context.filename || context.getFilename();
    const component = getComponent(filename);
    if (!component) {
      // Not a public component interface file: the contract does not apply here.
      return {};
    }

    function reportInternalName(node, name) {
      if (name && INTERNAL_NAME_RE.test(name)) {
        context.report({ node, messageId: 'internalDeclaration', data: { name, component } });
      }
    }

    return {
      // Declaring an internal-named type (exported or not) in the public file.
      TSInterfaceDeclaration(node) {
        reportInternalName(node.id, node.id && node.id.name);
      },
      TSTypeAliasDeclaration(node) {
        reportInternalName(node.id, node.id && node.id.name);
      },
      TSEnumDeclaration(node) {
        reportInternalName(node.id, node.id && node.id.name);
      },

      // Imports must come from an allowed source.
      ImportDeclaration(node) {
        const source = node.source && node.source.value;
        if (!isAllowedSource(source)) {
          context.report({ node, messageId: 'disallowedImport', data: { source } });
        }
      },

      // Re-exports must come from an allowed source; bindings must not be exposed under an internal name.
      ExportNamedDeclaration(node) {
        const source = node.source && node.source.value;
        if (!isAllowedSource(source)) {
          context.report({ node, messageId: 'disallowedReexport', data: { source } });
          return;
        }
        for (const spec of node.specifiers || []) {
          const exportedName = spec.exported && spec.exported.name;
          if (exportedName && INTERNAL_NAME_RE.test(exportedName)) {
            context.report({ node: spec, messageId: 'internalReexportName', data: { name: exportedName } });
          }
        }
      },
      ExportAllDeclaration(node) {
        const source = node.source && node.source.value;
        if (!isAllowedSource(source)) {
          context.report({ node, messageId: 'disallowedReexport', data: { source } });
        }
      },
    };
  },
};
