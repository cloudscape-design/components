// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
// Theming stripped out — not needed for exploration purposes

export function applyCustomTheme(_customConfig?: Record<string, any>): void {}
export function resetToDefaults(): void {}
export function useThemeComparison() {
  return {
    applyDirectionA: () => {},
    applyDirectionB: () => {},
    resetToDefault: () => {},
  };
}
