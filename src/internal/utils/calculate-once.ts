// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
export function calculateOnce<T>(callback: () => T) {
  let result: T | undefined = undefined;
  return () => {
    if (result === undefined) {
      result = callback();
    }
    return result;
  };
}
