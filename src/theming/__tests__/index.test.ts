// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import {
  applyGlobalTheme,
  applyTheme,
  generateThemeStylesheet,
  setGlobalTheme,
  Theme,
} from '../../../lib/components/theming';

const findStyleNode = () => document.head.querySelector('style');
const findAllStyleNodes = () => document.head.querySelectorAll('style');
const attachNonceMetaElement = (nonce: string) => {
  const metaNode = document.createElement('meta');
  metaNode.name = 'nonce';
  metaNode.content = nonce;
  document.head.appendChild(metaNode);
};

const themeStorageKey = Symbol.for('awsui-global-theme');

const theme: Theme = {
  tokens: {
    colorTextAccent: {
      light: 'red',
      dark: 'orange',
    },
  },
};

const anotherTheme: Theme = {
  tokens: {
    colorTextAccent: {
      light: 'blue',
      dark: 'green',
    },
  },
};

afterEach(() => {
  // Clean up global theme state between tests.
  delete (window as any)[themeStorageKey];
  document.head.querySelectorAll('style').forEach(node => node.remove());
});

test('applyTheme appends and removes awsui style node', () => {
  const { reset } = applyTheme({ theme });

  expect(findStyleNode()).not.toBeNull();

  reset();

  expect(findStyleNode()).toBeNull();
});

test('applyTheme respects nonce meta elements', () => {
  const nonce = 'fgw4g5saf';
  attachNonceMetaElement(nonce);

  applyTheme({ theme });

  expect(findStyleNode()).toHaveAttribute('nonce', nonce);
});

test('generateThemeStylesheet returns the theme override stylesheet as a string', () => {
  expect(generateThemeStylesheet({ theme })).toEqual(expect.any(String));
});

describe('setGlobalTheme', () => {
  test('stores the theme on window using the well-known symbol', () => {
    setGlobalTheme(theme);

    expect((window as any)[themeStorageKey]).toBe(theme);
  });

  test('dispatches a change event on the top window', () => {
    const listener = jest.fn();
    window.addEventListener('awsui-global-theme-change', listener);

    setGlobalTheme(theme);

    expect(listener).toHaveBeenCalledTimes(1);

    window.removeEventListener('awsui-global-theme-change', listener);
  });

  test('overwrites a previously set theme', () => {
    setGlobalTheme(theme);
    setGlobalTheme(anotherTheme);

    expect((window as any)[themeStorageKey]).toBe(anotherTheme);
  });
});

describe('applyGlobalTheme', () => {
  let resetGlobalTheme: () => void;

  afterEach(() => {
    resetGlobalTheme();
  });

  test('applies the current global theme immediately', () => {
    setGlobalTheme(theme);

    ({ reset: resetGlobalTheme } = applyGlobalTheme());

    expect(findStyleNode()).not.toBeNull();
  });

  test('does not apply a style node when no global theme is set', () => {
    ({ reset: resetGlobalTheme } = applyGlobalTheme());

    expect(findStyleNode()).toBeNull();
  });

  test('reacts to subsequent setGlobalTheme calls', () => {
    ({ reset: resetGlobalTheme } = applyGlobalTheme());

    expect(findStyleNode()).toBeNull();

    setGlobalTheme(theme);

    expect(findStyleNode()).not.toBeNull();
  });

  test('replaces the previous style node when the theme changes', () => {
    ({ reset: resetGlobalTheme } = applyGlobalTheme());

    setGlobalTheme(theme);
    const firstContent = findStyleNode()?.textContent;

    setGlobalTheme(anotherTheme);
    const secondContent = findStyleNode()?.textContent;

    // Only one style node should exist at a time.
    expect(findAllStyleNodes()).toHaveLength(1);
    // Content should differ between themes.
    expect(firstContent).not.toEqual(secondContent);
  });

  test('reset removes the style node and stops listening', () => {
    ({ reset: resetGlobalTheme } = applyGlobalTheme());

    setGlobalTheme(theme);
    expect(findStyleNode()).not.toBeNull();

    resetGlobalTheme();

    expect(findStyleNode()).toBeNull();

    // Further theme changes should have no effect.
    setGlobalTheme(anotherTheme);
    expect(findStyleNode()).toBeNull();
  });
});
