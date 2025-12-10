// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { getContentStyles, getFooterStyles, getHeaderStyles, getMediaStyles, getRootStyles } from '../style';

jest.mock('../../internal/environment', () => ({
  SYSTEM: 'core',
}));

const allStyles = {
  root: {
    background: '#ffffff',
    borderColor: '#e0e0e0',
    borderRadius: '8px',
    borderWidth: '1px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  content: {
    paddingBlock: '16px',
    paddingInline: '20px',
  },
  header: {
    paddingBlock: '12px',
    paddingInline: '20px',
  },
  footer: {
    root: {
      paddingBlock: '12px',
      paddingInline: '20px',
    },
    divider: {
      borderColor: '#e0e0e0',
      borderWidth: '1px',
    },
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

describe('getFooterStyles', () => {
  afterEach(() => {
    jest.resetModules();
  });

  test('handles all possible style configurations', () => {
    expect(getFooterStyles(undefined)).toMatchSnapshot();
    expect(getFooterStyles({})).toMatchSnapshot();
    expect(getFooterStyles(allStyles)).toMatchSnapshot();
  });

  test('returns empty object when SYSTEM is not core', async () => {
    jest.resetModules();
    jest.doMock('../../internal/environment', () => ({
      SYSTEM: 'visual-refresh',
    }));

    const { getFooterStyles: getFooterStylesNonCore } = await import('../style');

    const result = getFooterStylesNonCore(allStyles);
    expect(result).toEqual({});
  });
});

describe('getMediaStyles', () => {
  afterEach(() => {
    jest.resetModules();
  });

  test('handles all possible style configurations', () => {
    expect(getMediaStyles('top', undefined)).toMatchSnapshot();
    expect(getMediaStyles('top', {})).toMatchSnapshot();
    expect(getMediaStyles('top', allStyles)).toMatchSnapshot();
    expect(getMediaStyles('side', undefined)).toMatchSnapshot();
    expect(getMediaStyles('side', {})).toMatchSnapshot();
    expect(getMediaStyles('side', allStyles)).toMatchSnapshot();
  });

  test('returns empty object when SYSTEM is not core', async () => {
    jest.resetModules();
    jest.doMock('../../internal/environment', () => ({
      SYSTEM: 'visual-refresh',
    }));

    const { getMediaStyles: getMediaStylesNonCore } = await import('../style');

    const result = getMediaStylesNonCore('top', allStyles);
    expect(result).toEqual({});
  });
});
