// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
export const awsuiGlobalFlagsSymbol = Symbol.for('awsui-global-flags');

interface GlobalFlags {
  removeHighContrastHeader?: boolean;
  appLayoutWidget?: boolean;
}

export interface FlagsHolder {
  [awsuiGlobalFlagsSymbol]?: GlobalFlags;
}

export const getTopWindow = () => {
  return window.top;
};

function getGlobal() {
  return typeof window !== 'undefined' ? window : globalThis;
}

function readFlag(window: unknown, flagName: keyof GlobalFlags) {
  const holder = window as FlagsHolder | null;
  return holder?.[awsuiGlobalFlagsSymbol]?.[flagName];
}

export const getGlobalFlag = (flagName: keyof GlobalFlags): GlobalFlags[keyof GlobalFlags] | undefined => {
  try {
    const ownFlag = readFlag(getGlobal(), flagName);
    if (ownFlag !== undefined) {
      return ownFlag;
    }
    return readFlag(getTopWindow(), flagName);
  } catch (e) {
    return undefined;
  }
};
