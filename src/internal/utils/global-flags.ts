// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
export const awsuiGlobalFlagsSymbol = Symbol.for('awsui-global-flags');

interface GlobalFlags {
  removeHighContrastHeader?: boolean;
}

interface ExtendedWindow extends Window {
  [awsuiGlobalFlagsSymbol]?: GlobalFlags;
}
declare const window: ExtendedWindow;

export const getTopWindow = (): ExtendedWindow | undefined => {
  return window.top as ExtendedWindow;
};

export const getGlobalFlag = (flagName: keyof GlobalFlags): GlobalFlags[keyof GlobalFlags] | undefined => {
  try {
    if (typeof window !== 'undefined') {
      const topWindow = getTopWindow();
      return window[awsuiGlobalFlagsSymbol]?.[flagName] ?? topWindow?.[awsuiGlobalFlagsSymbol]?.[flagName];
    }
  } catch (e) {
    return undefined;
  }
};
