// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

/**
 * WIP (v0): Cloudscape-aligned Ace theme.
 *
 * Instead of shipping yet another Ace theme with hard-coded hex colors, this
 * module registers a lightweight Ace theme whose colors are driven entirely by
 * Cloudscape design tokens. The theme registers an empty `cssText` and relies
 * on a `cssClass` (`ace-cloudscape`) that the Cloudscape stylesheet
 * (`cloudscape-ace-theme.scss`) targets. Because the token custom properties
 * change with the active visual mode, the same single theme automatically
 * adapts to light and dark mode instead of requiring separate light/dark
 * variants.
 *
 * This is additive and opt-in: consumers get it only when they select the
 * `'cloudscape'` theme (via `preferences.theme`) and, if they want it available
 * in the preferences modal, add it to their `themes` prop.
 */

// The Ace theme id (used as `ace/theme/cloudscape`) and the value accepted by
// `CodeEditorProps.Preferences.theme`.
export const CLOUDSCAPE_ACE_THEME_ID = 'cloudscape';

// The CSS class Ace applies to the editor container for this theme. The
// Cloudscape stylesheet keys all token-driven colors off this class.
export const CLOUDSCAPE_ACE_THEME_CSS_CLASS = 'ace-cloudscape';

const ACE_MODULE_ID = `ace/theme/${CLOUDSCAPE_ACE_THEME_ID}`;

// Track which Ace instances we've already registered the theme on. Consumers
// provide their own `ace` object, so this keeps registration idempotent per
// instance without leaking across (potentially multiple) Ace builds.
const registeredInstances = new WeakSet<object>();

/**
 * Registers the Cloudscape Ace theme on the provided Ace instance. Safe to call
 * multiple times; registration happens at most once per Ace instance. Must be
 * called before `editor.setTheme('ace/theme/cloudscape')` so Ace can resolve
 * the module synchronously.
 */
export function defineCloudscapeAceTheme(ace: any): void {
  if (!ace || typeof ace.define !== 'function') {
    return;
  }
  if (registeredInstances.has(ace)) {
    return;
  }

  ace.define(
    ACE_MODULE_ID,
    ['require', 'exports', 'module'],
    function (_require: unknown, exports: Record<string, unknown>) {
      // `isDark` only controls whether Ace adds the `ace_dark` marker class.
      // Our colors come from visual-mode-aware tokens, so we don't depend on it.
      exports.isDark = false;
      exports.cssClass = CLOUDSCAPE_ACE_THEME_CSS_CLASS;
      // Colors are provided by the Cloudscape stylesheet, so no inline CSS here.
      exports.cssText = '';
      exports.$id = ACE_MODULE_ID;
    }
  );

  registeredInstances.add(ace);
}

/**
 * Returns true when the given theme value is the opt-in Cloudscape theme.
 */
export function isCloudscapeAceTheme(theme: string | undefined): boolean {
  return theme === CLOUDSCAPE_ACE_THEME_ID;
}
