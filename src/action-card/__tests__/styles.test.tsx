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

  test('returns empty object when style is undefined', () => {
    expect(getRootStyles(undefined)).toEqual({});
  });

  test('returns empty object when style has no root', () => {
    expect(getRootStyles({})).toEqual({});
  });

  test('returns all CSS custom properties when all root styles are provided', () => {
    expect(getRootStyles(allStyles)).toMatchSnapshot();
  });

  test('returns only background properties when only background is set', () => {
    const result = getRootStyles({ root: { background: allStyles.root!.background } });
    expect(result).toMatchSnapshot();
  });

  test('returns only borderColor properties when only borderColor is set', () => {
    const result = getRootStyles({ root: { borderColor: allStyles.root!.borderColor } });
    expect(result).toMatchSnapshot();
  });

  test('returns only borderRadius properties when only borderRadius is set', () => {
    const result = getRootStyles({ root: { borderRadius: allStyles.root!.borderRadius } });
    expect(result).toMatchSnapshot();
  });

  test('returns only borderWidth properties when only borderWidth is set', () => {
    const result = getRootStyles({ root: { borderWidth: allStyles.root!.borderWidth } });
    expect(result).toMatchSnapshot();
  });

  test('returns only boxShadow properties when only boxShadow is set', () => {
    const result = getRootStyles({ root: { boxShadow: allStyles.root!.boxShadow } });
    expect(result).toMatchSnapshot();
  });

  test('returns only focusRing properties when only focusRing is set', () => {
    const result = getRootStyles({ root: { focusRing: allStyles.root!.focusRing } });
    expect(result).toMatchSnapshot();
  });

  test('returns empty object when root has no style sub-properties', () => {
    const result = getRootStyles({ root: {} });
    expect(result).toEqual({});
  });

  test('returns empty object for root when SYSTEM is not core', async () => {
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

  test('returns empty object when style is undefined', () => {
    expect(getContentStyles(undefined)).toEqual({});
  });

  test('returns empty object when style has no content', () => {
    expect(getContentStyles({})).toEqual({});
  });

  test('returns when content styles are provided', () => {
    expect(getContentStyles(allStyles)).toEqual({
      paddingBlock: '16px',
      paddingInline: '20px',
    });
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

  test('returns empty object when style is undefined', () => {
    expect(getHeaderStyles(undefined)).toEqual({});
  });

  test('returns empty object when style has no header', () => {
    expect(getHeaderStyles({})).toEqual({});
  });

  test('returns padding properties when header styles are provided', () => {
    expect(getHeaderStyles(allStyles)).toEqual({
      paddingBlock: '12px',
      paddingInline: '20px',
    });
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
