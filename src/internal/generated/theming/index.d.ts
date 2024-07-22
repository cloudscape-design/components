// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/* This file is only for the compiler. The artifacts will contain the generated file instead. */
import { GlobalValue, ThemePreset, TypedModeValueOverride } from '@cloudscape-design/theming-runtime';

export interface TypedOverride {
  tokens: Partial<Record<string, GlobalValue | TypedModeValueOverride>>;
}
export declare const preset: ThemePreset;
