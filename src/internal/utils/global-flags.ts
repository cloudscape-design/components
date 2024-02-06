// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
export const awsuiGlobalFlagsSymbol = Symbol.for('awsui-global-flags');

interface GlobalFlags {
  removeHighContrastHeader?: boolean;
  enableAppLayoutWidget?: boolean;
}

interface ExtendedWindow extends Window {
  [awsuiGlobalFlagsSymbol]?: GlobalFlags;
}
declare const window: ExtendedWindow;

export const getTopWindow = (): ExtendedWindow | undefined => {
  return window.top as ExtendedWindow;
};

function readFlag(window: ExtendedWindow | undefined, flagName: keyof GlobalFlags) {
  if (typeof window === 'undefined' || !window[awsuiGlobalFlagsSymbol]) {
    return undefined;
  }
  return window[awsuiGlobalFlagsSymbol][flagName];
}

export const getGlobalFlag = (flagName: keyof GlobalFlags): GlobalFlags[keyof GlobalFlags] | undefined => {
  try {
    const ownFlag = readFlag(window, flagName);
    if (ownFlag !== undefined) {
      return ownFlag;
    }
    return readFlag(getTopWindow(), flagName);
  } catch (e) {
    return undefined;
  }
};
