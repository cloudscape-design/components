// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
export const requestNextTick = (callback: () => void) => {
  return setTimeout(callback, 0);
};
