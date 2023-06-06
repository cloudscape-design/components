// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ThemePreset, GlobalValue, TypedModeValueOverride } from '@cloudscape-design/theming-build';

export interface TypedOverride {
  tokens: Partial<Record<string, GlobalValue | TypedModeValueOverride>>;
}
export const preset: ThemePreset;
