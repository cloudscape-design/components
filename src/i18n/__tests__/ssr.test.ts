/**
 * @jest-environment node
 */
/* eslint-disable header/header */
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { I18nProvider, I18nProviderProps } from '../../../lib/components/i18n';
import { TestComponent, MESSAGES } from './test-component';

let consoleWarnSpy: jest.SpyInstance;
beforeEach(() => {
  consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
});
afterEach(() => {
  consoleWarnSpy?.mockRestore();
});

test(`not running in DOM`, () => {
  expect(typeof document).toBe('undefined');
});

test(`renders nested components with correct strings in SSR`, () => {
  const content = renderToStaticMarkup(
    React.createElement(
      I18nProvider,
      // Casting because props expects children to be present, but children shouldn't be provided in props.
      { messages: [MESSAGES], locale: 'en' } as unknown as I18nProviderProps,
      React.createElement(TestComponent, null)
    )
  );

  expect(content).toContain(`<li id="top-level-string">top level string</li>`);
  expect(content).toContain(`<li id="top-level-function">top level function</li>`);
  expect(content).toContain(`<li id="nested-string">nested string</li>`);
  expect(content).toContain(`<li id="nested-function">nested function</li>`);
});

test(`outputs a warning if a locale wasn't provided during server rendering`, () => {
  const content = renderToStaticMarkup(
    React.createElement(
      I18nProvider,
      // Casting because props expects children to be present, but children shouldn't be provided in props.
      { messages: [MESSAGES] } as unknown as I18nProviderProps,
      React.createElement(TestComponent, null)
    )
  );

  // A fallback to "en" should still happen.
  expect(content).toContain(`<li id="top-level-string">top level string</li>`);

  expect(console.warn).toHaveBeenCalledTimes(1);
  expect(console.warn).toHaveBeenCalledWith(
    '[AwsUi] [I18nProvider] An explicit locale was not provided during server rendering. This can lead to a hydration mismatch on the client.'
  );
});
