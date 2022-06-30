// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
export function joinObjectPath(segments: ReadonlyArray<string>) {
  return segments.reduce((prev, next) => {
    if (prev && prev[prev.length - 1] !== '/') {
      prev = prev + '/';
    }
    return prev + next;
  }, '');
}
