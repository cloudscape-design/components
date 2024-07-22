// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export function getToggleIcon<T>(pressed: boolean, defaultIcon?: T, pressedIcon?: T): T | undefined {
  if (pressed) {
    return pressedIcon ?? defaultIcon;
  }

  return defaultIcon;
}
