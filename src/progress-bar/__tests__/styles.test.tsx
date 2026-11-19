// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import customCssProps from '../../internal/generated/custom-css-properties';
import { getProgressPercentageStyles, getProgressStyles, getProgressValueStyles } from '../styles';

// Mock the environment module
jest.mock('../../internal/environment', () => ({
  SYSTEM: 'core',
}));

describe('getProgressStyles', () => {
  afterEach(() => {
    jest.resetModules();
  });

  test('returns undefined when no style is provided', () => {
    expect(getProgressStyles(undefined)).toBeUndefined();
    expect(getProgressStyles({})).toBeUndefined();
  });

  test('returns progress bar styles when provided', () => {
    const style = {
      progressBar: {
        backgroundColor: '#e0e0e0',
        borderRadius: '8px',
        height: '8px',
      },
    };

    expect(getProgressStyles(style)).toEqual({
      [customCssProps.progressBarBackgroundColor]: '#e0e0e0',
      [customCssProps.progressBarBorderRadius]: '8px',
      [customCssProps.progressBarHeight]: '8px',
    });
  });

  test('returns undefined when SYSTEM is not core', async () => {
    jest.resetModules();
    jest.doMock('../../internal/environment', () => ({
      SYSTEM: 'visual-refresh',
    }));

    const { getProgressStyles: getProgressStylesNonCore } = await import('../styles');

    const style = {
      progressBar: {
        backgroundColor: '#e0e0e0',
      },
    };

    expect(getProgressStylesNonCore(style)).toBeUndefined();
  });
});

describe('getProgressValueStyles', () => {
  afterEach(() => {
    jest.resetModules();
  });

  test('returns undefined when no style is provided', () => {
    expect(getProgressValueStyles(undefined)).toBeUndefined();
    expect(getProgressValueStyles({})).toBeUndefined();
  });

  test('returns progress value styles when provided', () => {
    const style = {
      progressValue: {
        backgroundColor: '#0073bb',
      },
    };

    expect(getProgressValueStyles(style)).toEqual({
      [customCssProps.progressValueBackgroundColor]: '#0073bb',
    });
  });

  test('returns undefined when SYSTEM is not core', async () => {
    jest.resetModules();
    jest.doMock('../../internal/environment', () => ({
      SYSTEM: 'visual-refresh',
    }));

    const { getProgressValueStyles: getProgressValueStylesNonCore } = await import('../styles');

    const style = {
      progressValue: {
        backgroundColor: '#0073bb',
      },
    };

    expect(getProgressValueStylesNonCore(style)).toBeUndefined();
  });
});

describe('getProgressPercentageStyles', () => {
  afterEach(() => {
    jest.resetModules();
  });

  test('returns undefined when no style is provided', () => {
    expect(getProgressPercentageStyles(undefined)).toBeUndefined();
    expect(getProgressPercentageStyles({})).toBeUndefined();
  });

  test('returns progress percentage styles when provided', () => {
    const style = {
      progressPercentage: {
        color: '#0073bb',
        fontSize: '14px',
        fontWeight: '600',
      },
    };

    expect(getProgressPercentageStyles(style)).toEqual({
      color: '#0073bb',
      fontSize: '14px',
      fontWeight: '600',
    });
  });

  test('returns undefined when SYSTEM is not core', async () => {
    jest.resetModules();
    jest.doMock('../../internal/environment', () => ({
      SYSTEM: 'visual-refresh',
    }));

    const { getProgressPercentageStyles: getProgressPercentageStylesNonCore } = await import('../styles');

    const style = {
      progressPercentage: {
        color: '#0073bb',
      },
    };

    expect(getProgressPercentageStylesNonCore(style)).toBeUndefined();
  });
});
