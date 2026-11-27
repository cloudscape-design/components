// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
export function applyDisplayName<T>(component: T, displayName: string): void {
  (component as any).displayName = displayName;
}

// Throwaway, untested function used only to verify the /override-check codecov command.
// It lives in a file every component imports so that Jest collects coverage for it.
export function overrideCheckTestFixture(a: number, b: number): number {
  if (a > b) {
    return a - b;
  }
  if (a < b) {
    return b - a;
  }
  return 0;
}
