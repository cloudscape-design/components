// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import {
  GlobalValue,
  Override,
  ReferenceTokens,
  ThemePreset,
  TypedModeValueOverride,
} from '@cloudscape-design/theming-build';

export interface TypedOverride extends Override {
  tokens: Partial<Record<string, GlobalValue | TypedModeValueOverride>>;

  /**
   * @awsuiSystem core
   */
  referenceTokens?: ReferenceTokens;
}
export const preset: ThemePreset;
