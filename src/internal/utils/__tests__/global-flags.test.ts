// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as globalFlags from '../global-flags';
const { getGlobalFlag } = globalFlags;

const awsuiGlobalFlagsSymbol = Symbol.for('awsui-global-flags');
interface GlobalFlags {
  removeHighContrastHeader?: boolean;
}

interface ExtendedWindow extends Window {
  [awsuiGlobalFlagsSymbol]?: GlobalFlags;
}
declare const window: ExtendedWindow;

afterEach(() => {
  delete window[awsuiGlobalFlagsSymbol];
  jest.restoreAllMocks();
});

describe('getGlobalFlag', () => {
  test('returns undefined if there global flags are not defined', () => {
    expect(getGlobalFlag('removeHighContrastHeader')).toBeUndefined();
  });
  test('returns undefined if global flags are defined but flag is not set', () => {
    window[awsuiGlobalFlagsSymbol] = {};
    expect(getGlobalFlag('removeHighContrastHeader')).toBeUndefined();
  });
  test('returns removeHighContrastHeader value', () => {
    window[awsuiGlobalFlagsSymbol] = { removeHighContrastHeader: false };
    expect(getGlobalFlag('removeHighContrastHeader')).toBe(false);
    window[awsuiGlobalFlagsSymbol].removeHighContrastHeader = true;
    expect(getGlobalFlag('removeHighContrastHeader')).toBe(true);
  });
  test('returns removeHighContrastHeader value when defined in top window', () => {
    jest
      .spyOn(globalFlags, 'getTopWindow')
      .mockReturnValue({ [awsuiGlobalFlagsSymbol]: { removeHighContrastHeader: true } } as unknown as ExtendedWindow);
    expect(getGlobalFlag('removeHighContrastHeader')).toBe(true);
    jest.restoreAllMocks();

    jest
      .spyOn(globalFlags, 'getTopWindow')
      .mockReturnValue({ [awsuiGlobalFlagsSymbol]: { removeHighContrastHeader: false } } as unknown as ExtendedWindow);
    expect(getGlobalFlag('removeHighContrastHeader')).toBe(false);
  });
  test('privileges values in the self window', () => {
    jest
      .spyOn(globalFlags, 'getTopWindow')
      .mockReturnValue({ [awsuiGlobalFlagsSymbol]: { removeHighContrastHeader: false } } as unknown as ExtendedWindow);
    window[awsuiGlobalFlagsSymbol] = { removeHighContrastHeader: true };
    expect(getGlobalFlag('removeHighContrastHeader')).toBe(true);
  });
  test('returns top window value when not defined in the self window', () => {
    jest
      .spyOn(globalFlags, 'getTopWindow')
      .mockReturnValue({ [awsuiGlobalFlagsSymbol]: { removeHighContrastHeader: true } } as unknown as ExtendedWindow);
    window[awsuiGlobalFlagsSymbol] = {};
    expect(getGlobalFlag('removeHighContrastHeader')).toBe(true);
  });
  test('returns undefined when top window is undefined', () => {
    jest.spyOn(globalFlags, 'getTopWindow').mockReturnValue(undefined);
    expect(getGlobalFlag('removeHighContrastHeader')).toBeUndefined();
  });
  test('returns undefined when an error is thrown', () => {
    jest.spyOn(globalFlags, 'getTopWindow').mockImplementation(() => {
      throw new Error('whatever');
    });
    expect(getGlobalFlag('removeHighContrastHeader')).toBeUndefined();
  });
});
