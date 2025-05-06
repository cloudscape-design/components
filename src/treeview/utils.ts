// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export function getItemPosition(index: number, itemsLength: number) {
  if (index === 0) {
    return 'start';
  }

  if (index === itemsLength - 1) {
    return 'end';
  }

  return 'middle';
}
