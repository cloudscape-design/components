// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { getSegmentedControlRootStyles, getSegmentedControlSegmentStyles } from '../style';

// Mock the environment module
jest.mock('../../internal/environment', () => ({
  SYSTEM: 'core',
}));

const allStyles = {
  root: {
    borderRadius: '8px',
  },
  segment: {
    borderRadius: '6px',
    fontSize: '14px',
    paddingBlock: '8px',
    paddingInline: '12px',
    background: {
      active: '#0073bb',
      default: '#ffffff',
      disabled: '#f0f0f0',
      hover: '#fafafa',
    },
    color: {
      active: '#ffffff',
      default: '#000000',
      disabled: '#999999',
      hover: '#000000',
    },
    focusRing: {
      borderColor: '#0073bb',
      borderRadius: '8px',
      borderWidth: '2px',
    },
  },
};

describe('getSegmentedControlRootStyles', () => {
  afterEach(() => {
    jest.resetModules();
  });

  test('handles all possible style configurations', () => {
    expect(getSegmentedControlRootStyles(undefined)).toMatchSnapshot();
    expect(getSegmentedControlRootStyles({})).toMatchSnapshot();
    expect(getSegmentedControlRootStyles(allStyles)).toMatchSnapshot();
  });

  test('returns empty object when SYSTEM is not core', async () => {
    jest.resetModules();
    jest.doMock('../../internal/environment', () => ({
      SYSTEM: 'visual-refresh',
    }));

    const { getSegmentedControlRootStyles: getSegmentedControlRootStylesNonCore } = await import('../style');

    const style = {
      root: {
        borderRadius: '8px',
      },
    };

    const result = getSegmentedControlRootStylesNonCore(style);
    expect(result).toEqual({});
  });
});

describe('getSegmentedControlSegmentStyles', () => {
  afterEach(() => {
    jest.resetModules();
  });

  test('handles all possible style configurations', () => {
    expect(getSegmentedControlSegmentStyles(undefined)).toMatchSnapshot();
    expect(getSegmentedControlSegmentStyles({})).toMatchSnapshot();
    expect(getSegmentedControlSegmentStyles(allStyles)).toMatchSnapshot();
  });

  test('returns empty object when SYSTEM is not core', async () => {
    jest.resetModules();
    jest.doMock('../../internal/environment', () => ({
      SYSTEM: 'visual-refresh',
    }));

    const { getSegmentedControlSegmentStyles: getSegmentedControlSegmentStylesNonCore } = await import('../style');

    const style = {
      segment: {
        borderRadius: '6px',
        fontSize: '14px',
      },
    };

    const result = getSegmentedControlSegmentStylesNonCore(style);
    expect(result).toEqual({});
  });
});
