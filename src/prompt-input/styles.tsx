// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { SYSTEM } from '../internal/environment';
import customCssProps from '../internal/generated/custom-css-properties';
import { PromptInputProps } from './interfaces';

export function getPromptInputStyles(style: PromptInputProps['style']) {
  if (SYSTEM !== 'core') {
    return {};
  }

  const properties = {
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
  };

  return Object.fromEntries(Object.entries(properties).filter(([, value]) => value !== undefined));
}
