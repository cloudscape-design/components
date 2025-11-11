// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import {
  getContentStyles,
  getContentWrapperStyles,
  getFooterStyles,
  getHeaderStyles,
  getMediaStyles,
  getRootStyles,
} from '../style';

jest.mock('../../internal/environment', () => ({
  SYSTEM: 'core',
}));

describe('Container style utilities', () => {
  afterEach(() => {
    jest.resetModules();
  });

  test('getRootStyles returns empty object when style is undefined', () => {
    expect(getRootStyles(undefined)).toEqual({});
  });

  test('getContentStyles returns empty object when style is undefined', () => {
    expect(getContentStyles(undefined)).toEqual({});
  });

  test('getContentWrapperStyles returns empty object when style is undefined', () => {
    expect(getContentWrapperStyles(undefined)).toEqual({});
  });

  test('getContentWrapperStyles returns borderRadius when provided', () => {
    expect(getContentWrapperStyles({ root: { borderRadius: '20px' } })).toEqual({
      borderRadius: '20px',
    });
  });

  test('getHeaderStyles returns empty object when style is undefined', () => {
    expect(getHeaderStyles(undefined)).toEqual({});
  });

  test('getFooterStyles returns empty object when style is undefined', () => {
    expect(getFooterStyles(undefined)).toEqual({});
  });

  test('getMediaStyles returns border radius properties when style is undefined', () => {
    expect(getMediaStyles('top', undefined)).toEqual({
      borderEndEndRadius: '0px',
      borderEndStartRadius: '0px',
    });
  });

  test('returns empty object when SYSTEM is not core', async () => {
    jest.resetModules();
    jest.doMock('../../internal/environment', () => ({
      SYSTEM: 'visual-refresh',
    }));

    const styleModule = await import('../style');
    const style = { root: { background: 'red' } };

    expect(styleModule.getRootStyles(style)).toEqual({});
    expect(styleModule.getContentStyles(style)).toEqual({});
    expect(styleModule.getContentWrapperStyles(style)).toEqual({});
    expect(styleModule.getHeaderStyles(style)).toEqual({});
    expect(styleModule.getFooterStyles(style)).toEqual({});
    expect(styleModule.getMediaStyles('top', style)).toEqual({});
  });
});
