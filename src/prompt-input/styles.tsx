// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import type { CSSProperties } from 'react';

import { SYSTEM } from '../internal/environment';
import customCssProps from '../internal/generated/custom-css-properties';
import { PromptInputProps } from './interfaces';

/**
 * Maps the public `style.menu.options`/`filterMatch` overrides to the internal
 * options-list custom properties consumed by the shared selectable-item/option
 * styles. Core system only, mirroring getPromptInputStyles. Unset values are
 * omitted so those styles keep falling back to design tokens. Returns undefined
 * when there is nothing to apply, so no custom properties are set on the list.
 */
export function getMenuOptionsListStyles(menuStyle: PromptInputProps.Style['menu']): CSSProperties | undefined {
  if (SYSTEM !== 'core' || (!menuStyle?.options && !menuStyle?.filterMatch)) {
    return undefined;
  }
  return {
    [customCssProps.optionBackgroundDefault]: menuStyle.options?.backgroundColor?.default,
    [customCssProps.optionBackgroundHighlighted]: menuStyle.options?.backgroundColor?.highlighted,
    [customCssProps.optionBackgroundSelected]: menuStyle.options?.backgroundColor?.selected,
    [customCssProps.optionColorDefault]: menuStyle.options?.color?.default,
    [customCssProps.optionColorHighlighted]: menuStyle.options?.color?.highlighted,
    [customCssProps.optionColorDisabled]: menuStyle.options?.color?.disabled,
    [customCssProps.optionGroupLabelColor]: menuStyle.options?.color?.groupLabel,
    [customCssProps.optionFilterMatchBackground]: menuStyle.filterMatch?.backgroundColor,
    [customCssProps.optionFilterMatchColor]: menuStyle.filterMatch?.color,
  } as CSSProperties;
}

export function getPromptInputStyles(style: PromptInputProps['style']) {
  if (SYSTEM !== 'core') {
    return {};
  }

  return {
    borderRadius: style?.root?.borderRadius,
    borderWidth: style?.root?.borderWidth,
    fontSize: style?.root?.fontSize,
    fontWeight: style?.root?.fontWeight,
    paddingBlock: style?.root?.paddingBlock,
    paddingInline: style?.root?.paddingInline,
    [customCssProps.promptInputStyleBackgroundDefault]: style?.root?.backgroundColor?.default,
    [customCssProps.promptInputStyleBackgroundDisabled]: style?.root?.backgroundColor?.disabled,
    [customCssProps.promptInputStyleBackgroundHover]: style?.root?.backgroundColor?.hover,
    [customCssProps.promptInputStyleBackgroundFocus]: style?.root?.backgroundColor?.focus,
    [customCssProps.promptInputStyleBackgroundReadonly]: style?.root?.backgroundColor?.readonly,
    [customCssProps.promptInputStyleBorderColorDefault]: style?.root?.borderColor?.default,
    [customCssProps.promptInputStyleBorderColorDisabled]: style?.root?.borderColor?.disabled,
    [customCssProps.promptInputStyleBorderColorHover]: style?.root?.borderColor?.hover,
    [customCssProps.promptInputStyleBorderColorFocus]: style?.root?.borderColor?.focus,
    [customCssProps.promptInputStyleBorderColorReadonly]: style?.root?.borderColor?.readonly,
    [customCssProps.promptInputStyleBoxShadowDefault]: style?.root?.boxShadow?.default,
    [customCssProps.promptInputStyleBoxShadowDisabled]: style?.root?.boxShadow?.disabled,
    [customCssProps.promptInputStyleBoxShadowHover]: style?.root?.boxShadow?.hover,
    [customCssProps.promptInputStyleBoxShadowFocus]: style?.root?.boxShadow?.focus,
    [customCssProps.promptInputStyleBoxShadowReadonly]: style?.root?.boxShadow?.readonly,
    [customCssProps.promptInputStyleColorDefault]: style?.root?.color?.default,
    [customCssProps.promptInputStyleColorDisabled]: style?.root?.color?.disabled,
    [customCssProps.promptInputStyleColorHover]: style?.root?.color?.hover,
    [customCssProps.promptInputStyleColorFocus]: style?.root?.color?.focus,
    [customCssProps.promptInputStyleColorReadonly]: style?.root?.color?.readonly,
    [customCssProps.promptInputStylePlaceholderColor]: style?.placeholder?.color,
    [customCssProps.promptInputStylePlaceholderFontSize]: style?.placeholder?.fontSize,
    [customCssProps.promptInputStylePlaceholderFontWeight]: style?.placeholder?.fontWeight,
    [customCssProps.promptInputStylePlaceholderFontStyle]: style?.placeholder?.fontStyle,
    [customCssProps.promptInputMenuStyleBackgroundColor]: style?.menu?.backgroundColor,
    [customCssProps.promptInputMenuStyleBorderColor]: style?.menu?.borderColor,
    [customCssProps.promptInputMenuStyleBorderRadius]: style?.menu?.borderRadius,
    [customCssProps.promptInputMenuStyleBorderWidth]: style?.menu?.borderWidth,
  };
}
