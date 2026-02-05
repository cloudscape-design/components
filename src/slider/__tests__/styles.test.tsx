// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { getSliderStyles } from '../styles';

// Mock the environment module
jest.mock('../../internal/environment', () => ({
  SYSTEM: 'core',
}));

const allStyles = {
  track: {
    backgroundColor: '#dbeafe',
  },
  range: {
    backgroundColor: {
      default: '#3b82f6',
      active: '#2563eb',
    },
  },
  handle: {
    backgroundColor: {
      default: '#3b82f6',
      hover: '#2563eb',
      active: '#1d4ed8',
    },
    borderRadius: '50%',
  },
};

describe('getSliderStyles', () => {
  afterEach(() => {
    jest.resetModules();
  });

  test('handles all possible style configurations', () => {
    expect(getSliderStyles(undefined)).toMatchSnapshot();
    expect(getSliderStyles({})).toMatchSnapshot();
    expect(getSliderStyles(allStyles)).toMatchSnapshot();
  });

  test('returns empty object when SYSTEM is not core', async () => {
    jest.resetModules();
    jest.doMock('../../internal/environment', () => ({
      SYSTEM: 'visual-refresh',
    }));

    const { getSliderStyles: getSliderStylesNonCore } = await import('../styles');

    expect(getSliderStylesNonCore(allStyles)).toEqual({});
  });
});
