// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import testRenderer, { ReactTestRendererJSON } from 'react-test-renderer';

import Alert from '../../../lib/components/alert/index.js';
import { awsuiPluginsInternal } from '../../../lib/components/internal/plugins/api.js';
import { AlertFlashContentConfig } from '../../../lib/components/internal/plugins/controllers/alert-flash-content.js';
import awsuiPlugins from '../../../lib/components/internal/plugins/index.js';

import stylesCss from '../../../lib/components/alert/styles.css.js';

afterEach(() => {
  awsuiPluginsInternal.alertContent.clearRegisteredReplacer();
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

// In a separate file as mixing react-test-renderer and @testing-library/react in a single file can cause some issues.
// We use react-test-renderer here as it works at a slightly lower level, so doesn't "hide" the first render cycle from tests.
describe('initialCheck method', () => {
  let initialCheck: jest.Mock<boolean>;
  beforeEach(() => {
    initialCheck = jest.fn(() => true);
    const plugin: AlertFlashContentConfig = {
      id: 'plugin-1',
      runReplacer: () => {
        return { update: () => {}, unmount: () => {} };
      },
      initialCheck,
    };
    awsuiPlugins.alertContent.registerContentReplacer(plugin);
  });

  test('calls `initialCheck` method, and hides alert if true', () => {
    const basicRender = testRenderer.create(<Alert type="error">Content</Alert>);
    expect(initialCheck).toHaveBeenCalledTimes(1);
    expect((basicRender.toJSON() as ReactTestRendererJSON).props.className.split(' ')).toEqual(
      expect.arrayContaining([stylesCss['initial-hidden']])
    );
  });

  test('re-shows alert on next render', () => {
    const basicRender = testRenderer.create(<Alert type="error">Content</Alert>);
    basicRender.update(<Alert type="error">Content</Alert>);
    expect(initialCheck).toHaveBeenCalledTimes(1);
    expect((basicRender.toJSON() as ReactTestRendererJSON).props.className.split(' ')).toEqual(
      expect.not.arrayContaining([stylesCss['initial-hidden']])
    );
  });

  test('does not hide alert if `initialCheck` returns false', () => {
    initialCheck.mockReturnValue(false);
    const basicRender = testRenderer.create(<Alert type="error">Content</Alert>);
    expect((basicRender.toJSON() as ReactTestRendererJSON).props.className.split(' ')).toEqual(
      expect.not.arrayContaining([stylesCss['initial-hidden']])
    );
  });
});
