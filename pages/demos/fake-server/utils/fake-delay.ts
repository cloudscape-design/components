// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
export const DEFAULT_DEMO_DELAY = 500;

export default function fakeDelay(ms = DEFAULT_DEMO_DELAY) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
