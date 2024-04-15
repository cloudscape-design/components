// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as globalFlags from '../global-flags';
import { FlagsHolder, awsuiGlobalFlagsSymbol } from '../global-flags';
const { getGlobalFlag } = globalFlags;

declare const window: Window & FlagsHolder;

afterEach(() => {
  delete window[awsuiGlobalFlagsSymbol];
  jest.restoreAllMocks();
});

describe('getGlobalFlag', () => {
  test('returns undefined if the global flags object does not exist', () => {
    expect(getGlobalFlag('appLayoutWidget')).toBeUndefined();
  });
  test('returns undefined if the global flags object exists but the flag is not set', () => {
    window[awsuiGlobalFlagsSymbol] = {};
    expect(getGlobalFlag('appLayoutWidget')).toBeUndefined();
  });
  test('returns appLayoutWidget value when defined', () => {
    window[awsuiGlobalFlagsSymbol] = { appLayoutWidget: false };
    expect(getGlobalFlag('appLayoutWidget')).toBe(false);
    window[awsuiGlobalFlagsSymbol].appLayoutWidget = true;
    expect(getGlobalFlag('appLayoutWidget')).toBe(true);
  });
  test('returns appLayoutWidget value when defined in top window', () => {
    jest
      .spyOn(globalFlags, 'getTopWindow')
      .mockReturnValue({ [awsuiGlobalFlagsSymbol]: { appLayoutWidget: true } } as typeof window);
    expect(getGlobalFlag('appLayoutWidget')).toBe(true);
    jest.restoreAllMocks();

    jest
      .spyOn(globalFlags, 'getTopWindow')
      .mockReturnValue({ [awsuiGlobalFlagsSymbol]: { appLayoutWidget: false } } as typeof window);
    expect(getGlobalFlag('appLayoutWidget')).toBe(false);
  });
  test('privileges values in the self window', () => {
    jest
      .spyOn(globalFlags, 'getTopWindow')
      .mockReturnValue({ [awsuiGlobalFlagsSymbol]: { appLayoutWidget: false } } as typeof window);
    window[awsuiGlobalFlagsSymbol] = { appLayoutWidget: true };
    expect(getGlobalFlag('appLayoutWidget')).toBe(true);
  });
  test('returns top window value when not defined in the self window', () => {
    jest
      .spyOn(globalFlags, 'getTopWindow')
      .mockReturnValue({ [awsuiGlobalFlagsSymbol]: { appLayoutWidget: true } } as typeof window);
    window[awsuiGlobalFlagsSymbol] = {};
    expect(getGlobalFlag('appLayoutWidget')).toBe(true);
  });
  test('returns undefined when top window is not available', () => {
    jest.spyOn(globalFlags, 'getTopWindow').mockReturnValue(null);
    expect(getGlobalFlag('appLayoutWidget')).toBeUndefined();
  });
  test('returns undefined when an error is thrown and flag is not defined in own window', () => {
    jest.spyOn(globalFlags, 'getTopWindow').mockImplementation(() => {
      throw new Error('whatever');
    });
    expect(getGlobalFlag('appLayoutWidget')).toBeUndefined();
  });
  test('returns value when an error is thrown and flag is defined in own window', () => {
    jest.spyOn(globalFlags, 'getTopWindow').mockImplementation(() => {
      throw new Error('whatever');
    });
    window[awsuiGlobalFlagsSymbol] = { appLayoutWidget: true };
    expect(getGlobalFlag('appLayoutWidget')).toBe(true);
  });
});
