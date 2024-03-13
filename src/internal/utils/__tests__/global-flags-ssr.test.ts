/**
 * @jest-environment node
 */
/* eslint-disable header/header */
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as globalFlags from '../global-flags';
import { awsuiGlobalFlagsSymbol, FlagsHolder } from '../global-flags';
const { getGlobalFlag } = globalFlags;

declare const global: typeof globalThis & FlagsHolder;

afterEach(() => {
  delete global[awsuiGlobalFlagsSymbol];
});

describe('getGlobalFlag', () => {
  test('ensure no window in this environment', () => {
    expect(typeof window === 'undefined').toBe(true);
  });

  test('returns undefined if the global flags object does not exist', () => {
    expect(getGlobalFlag('removeHighContrastHeader')).toBeUndefined();
  });
  test('returns undefined if the global flags object exists but the flag is not set', () => {
    global[awsuiGlobalFlagsSymbol] = {};
    expect(getGlobalFlag('removeHighContrastHeader')).toBeUndefined();
  });
  test('returns removeHighContrastHeader value when defined', () => {
    global[awsuiGlobalFlagsSymbol] = { removeHighContrastHeader: false };
    expect(getGlobalFlag('removeHighContrastHeader')).toBe(false);
    global[awsuiGlobalFlagsSymbol].removeHighContrastHeader = true;
    expect(getGlobalFlag('removeHighContrastHeader')).toBe(true);
  });
});
