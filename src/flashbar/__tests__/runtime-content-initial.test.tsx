// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import testRenderer, { ReactTestRenderer, ReactTestRendererJSON } from 'react-test-renderer';

import Flashbar from '../../../lib/components/flashbar';
import awsuiPlugins from '../../../lib/components/internal/plugins';
import { awsuiPluginsInternal } from '../../../lib/components/internal/plugins/api';
import { AlertFlashContentConfig } from '../../../lib/components/internal/plugins/controllers/alert-flash-content';

import stylesCss from '../../../lib/components/flashbar/styles.css.js';

afterEach(() => {
  awsuiPluginsInternal.flashContent.clearRegisteredReplacer();
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

describe('initialCheck method', () => {
  let initialCheck: jest.Mock<boolean>;
  const getFirstFlash = (basicRender: ReactTestRenderer) =>
    (
      ((basicRender.toJSON() as ReactTestRendererJSON).children![0] as ReactTestRendererJSON)
        .children![0] as ReactTestRendererJSON
    ).children![0] as ReactTestRendererJSON;
  beforeEach(() => {
    initialCheck = jest.fn(() => true);
    const plugin: AlertFlashContentConfig = {
      id: 'plugin-1',
      runReplacer: () => {
        return { update: () => {}, unmount: () => {} };
      },
      initialCheck,
    };
    awsuiPlugins.flashContent.registerContentReplacer(plugin);
  });

  test('calls `initialCheck` method, and hides flash if true', () => {
    const basicRender = testRenderer.create(<Flashbar items={[{}]} />);
    expect(initialCheck).toHaveBeenCalledTimes(1);
    expect(getFirstFlash(basicRender).props.className.split(' ')).toEqual(
      expect.arrayContaining([stylesCss['initial-hidden']])
    );
  });

  test('re-shows alert on next render', () => {
    const basicRender = testRenderer.create(<Flashbar items={[{}]} />);
    basicRender.update(<Flashbar items={[{}]} />);
    expect(initialCheck).toHaveBeenCalledTimes(1);
    expect(getFirstFlash(basicRender).props.className.split(' ')).toEqual(
      expect.not.arrayContaining([stylesCss['initial-hidden']])
    );
  });

  test('does not hide flash if `initialCheck` returns false', () => {
    initialCheck.mockReturnValue(false);
    const basicRender = testRenderer.create(<Flashbar items={[{}]} />);
    expect(initialCheck).toHaveBeenCalledTimes(1);
    expect(getFirstFlash(basicRender).props.className.split(' ')).toEqual(
      expect.not.arrayContaining([stylesCss['initial-hidden']])
    );
  });
});
