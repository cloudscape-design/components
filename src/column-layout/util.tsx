// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
export function repeat<T>(value: T, times: number): T[] {
  const array = [];
  for (let i = 0; i < times; i++) {
    array[i] = value;
  }
  return array;
}
