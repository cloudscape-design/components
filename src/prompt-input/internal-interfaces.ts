// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { PromptInputProps } from './interfaces';

/**
 * Internal style overrides for the trigger menu dropdown. Not part of the public
 * `PromptInputProps.Style`; passed via the `_menu` key (see `PromptInputInternalStyle`).
 */
export interface PromptInputMenuStyle {
  backgroundColor?: string;
  borderColor?: string;
  borderRadius?: string;
  borderWidth?: string;

  /** Themes the option rows, which are opaque and cover the surface `backgroundColor`. */
  options?: {
    backgroundColor?: {
      default?: string;
      /** Applied to the hovered/keyboard-highlighted option. */
      highlighted?: string;
      selected?: string;
    };
    color?: {
      default?: string;
      /** Applied to the hovered/keyboard-highlighted option. */
      highlighted?: string;
      disabled?: string;
      /** Applied to non-interactive option group labels. */
      groupLabel?: string;
    };
  };

  /** Themes the substring highlight on options matching the filtering text. */
  filterMatch?: {
    backgroundColor?: string;
    color?: string;
  };
}

/**
 * `PromptInputProps.Style` plus the internal `_menu` escape hatch. Consumers pass
 * menu styling by casting the `style` value to this type.
 */
export type PromptInputInternalStyle = PromptInputProps.Style & {
  _menu?: PromptInputMenuStyle;
};
