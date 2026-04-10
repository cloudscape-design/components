// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { getContentStyles, getHeaderStyles, getRootStyles } from '../style';

jest.mock('../../internal/environment', () => ({
  SYSTEM: 'core',
}));

const allStyles = {
  root: {
    background: {
      default: '#ffffff',
      hover: '#f5f5f5',
      active: '#eeeeee',
      disabled: '#fafafa',
    },
    borderColor: {
      default: '#e0e0e0',
      hover: '#bdbdbd',
      active: '#9e9e9e',
      disabled: '#eeeeee',
    },
    borderRadius: {
      default: '8px',
      hover: '8px',
      active: '8px',
      disabled: '8px',
    },
    borderWidth: {
      default: '1px',
      hover: '2px',
      active: '2px',
      disabled: '1px',
    },
    boxShadow: {
      default: '0 1px 3px rgba(0,0,0,0.1)',
      hover: '0 2px 6px rgba(0,0,0,0.15)',
      active: '0 1px 2px rgba(0,0,0,0.2)',
      disabled: 'none',
    },
    focusRing: {
      borderColor: '#0073bb',
      borderRadius: '10px',
      borderWidth: '2px',
    },
  },
  content: {
    paddingBlock: '16px',
    paddingInline: '20px',
  },
  header: {
    paddingBlock: '12px',
    paddingInline: '20px',
  },
};

describe('getRootStyles', () => {
  afterEach(() => {
    jest.resetModules();
  });

  test('handles all possible style configurations', () => {
    expect(getRootStyles(undefined)).toMatchSnapshot();
    expect(getRootStyles({})).toMatchSnapshot();
    expect(getRootStyles(allStyles)).toMatchSnapshot();
  });

  test('returns empty object when SYSTEM is not core', async () => {
    jest.resetModules();
    jest.doMock('../../internal/environment', () => ({
      SYSTEM: 'visual-refresh',
    }));

    const { getRootStyles: getRootStylesNonCore } = await import('../style');

    const result = getRootStylesNonCore(allStyles);
    expect(result).toEqual({});
  });
});

describe('getContentStyles', () => {
  afterEach(() => {
    jest.resetModules();
  });

  test('handles all possible style configurations', () => {
    expect(getContentStyles(undefined)).toMatchSnapshot();
    expect(getContentStyles({})).toMatchSnapshot();
    expect(getContentStyles(allStyles)).toMatchSnapshot();
  });

  test('returns empty object when SYSTEM is not core', async () => {
    jest.resetModules();
    jest.doMock('../../internal/environment', () => ({
      SYSTEM: 'visual-refresh',
    }));

    const { getContentStyles: getContentStylesNonCore } = await import('../style');

    const result = getContentStylesNonCore(allStyles);
    expect(result).toEqual({});
  });
});

describe('getHeaderStyles', () => {
  afterEach(() => {
    jest.resetModules();
  });

  test('handles all possible style configurations', () => {
    expect(getHeaderStyles(undefined)).toMatchSnapshot();
    expect(getHeaderStyles({})).toMatchSnapshot();
    expect(getHeaderStyles(allStyles)).toMatchSnapshot();
  });

  test('returns empty object when SYSTEM is not core', async () => {
    jest.resetModules();
    jest.doMock('../../internal/environment', () => ({
      SYSTEM: 'visual-refresh',
    }));

    const { getHeaderStyles: getHeaderStylesNonCore } = await import('../style');

    const result = getHeaderStylesNonCore(allStyles);
    expect(result).toEqual({});
  });
});
