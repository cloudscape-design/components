// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export const getVisualTheme = (theme: string, isVR: boolean) => {
  if (theme === 'polaris' && isVR) {
    return 'vr';
  }

  return theme;
};
