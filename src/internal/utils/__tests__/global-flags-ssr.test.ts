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
    expect(getGlobalFlag('appLayoutWidget')).toBeUndefined();
  });
  test('returns undefined if the global flags object exists but the flag is not set', () => {
    global[awsuiGlobalFlagsSymbol] = {};
    expect(getGlobalFlag('appLayoutWidget')).toBeUndefined();
  });
  test('returns appLayoutWidget value when defined', () => {
    global[awsuiGlobalFlagsSymbol] = { appLayoutWidget: false };
    expect(getGlobalFlag('appLayoutWidget')).toBe(false);
    global[awsuiGlobalFlagsSymbol].appLayoutWidget = true;
    expect(getGlobalFlag('appLayoutWidget')).toBe(true);
  });
});
