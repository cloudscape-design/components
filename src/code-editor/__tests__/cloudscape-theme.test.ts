// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {
  CLOUDSCAPE_ACE_THEME_CSS_CLASS,
  CLOUDSCAPE_ACE_THEME_ID,
  defineCloudscapeAceTheme,
  isCloudscapeAceTheme,
} from '../../../lib/components/code-editor/cloudscape-theme';

describe('isCloudscapeAceTheme', () => {
  it('returns true only for the cloudscape theme id', () => {
    expect(isCloudscapeAceTheme(CLOUDSCAPE_ACE_THEME_ID)).toBe(true);
    expect(isCloudscapeAceTheme('cloudscape')).toBe(true);
  });

  it('returns false for other themes and undefined', () => {
    expect(isCloudscapeAceTheme('dawn')).toBe(false);
    expect(isCloudscapeAceTheme('cloud_editor_dark')).toBe(false);
    expect(isCloudscapeAceTheme(undefined)).toBe(false);
  });
});

describe('defineCloudscapeAceTheme', () => {
  it('registers an ace/theme/cloudscape module with token-driven (empty) cssText', () => {
    const ace = { define: jest.fn() };
    defineCloudscapeAceTheme(ace);

    expect(ace.define).toHaveBeenCalledTimes(1);
    const [moduleId, deps, factory] = ace.define.mock.calls[0];
    expect(moduleId).toBe('ace/theme/cloudscape');
    expect(deps).toEqual(expect.arrayContaining(['require', 'exports', 'module']));

    const exports: Record<string, unknown> = {};
    factory(() => undefined, exports, {});
    expect(exports.cssClass).toBe(CLOUDSCAPE_ACE_THEME_CSS_CLASS);
    expect(exports.isDark).toBe(false);
    // Colors are supplied by the Cloudscape stylesheet, so no inline CSS.
    expect(exports.cssText).toBe('');
    expect(exports.$id).toBe('ace/theme/cloudscape');
  });

  it('registers the theme at most once per ace instance', () => {
    const ace = { define: jest.fn() };
    defineCloudscapeAceTheme(ace);
    defineCloudscapeAceTheme(ace);
    expect(ace.define).toHaveBeenCalledTimes(1);
  });

  it('is a no-op for an ace instance without a define function', () => {
    expect(() => defineCloudscapeAceTheme({})).not.toThrow();
    expect(() => defineCloudscapeAceTheme(null)).not.toThrow();
    expect(() => defineCloudscapeAceTheme(undefined)).not.toThrow();
  });
});
