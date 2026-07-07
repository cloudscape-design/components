// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { SYSTEM } from '../environment';
import customCssProps from '../generated/custom-css-properties';

/**
 * Shared style interface for input-like components (input, textarea, text-filter).
 * Components can extend or alias this interface in their own interfaces.ts files.
 */
export interface InputStyleProps {
  root?: {
    backgroundColor?: {
      default?: string;
      disabled?: string;
      focus?: string;
      hover?: string;
      readonly?: string;
    };
    borderColor?: {
      default?: string;
      disabled?: string;
      focus?: string;
      hover?: string;
      readonly?: string;
    };
    borderRadius?: string;
    borderWidth?: string;
    boxShadow?: {
      default?: string;
      disabled?: string;
      focus?: string;
      hover?: string;
      readonly?: string;
    };
    color?: {
      default?: string;
      disabled?: string;
      focus?: string;
      hover?: string;
      readonly?: string;
    };
    fontSize?: string;
    fontWeight?: string;
    paddingBlock?: string;
    paddingInline?: string;
  };
  placeholder?: {
    color?: string;
    fontSize?: string;
    fontStyle?: string;
    fontWeight?: string;
  };
}

/**
 * Maps input-like component style props to CSS custom properties.
 * Used by input, textarea, and text-filter components.
 *
 * @param style - The style props to map
 * @param requireRoot - If true, returns undefined when style.root is not provided (textarea behavior).
 *                      If false, returns object with undefined values (input/text-filter behavior).
 */
export function getInputStylesCss(style: InputStyleProps | undefined, requireRoot = false) {
  if (SYSTEM !== 'core') {
    return undefined;
  }

  if (requireRoot && !style?.root) {
    return undefined;
  }

  return {
    borderRadius: style?.root?.borderRadius,
    borderWidth: style?.root?.borderWidth,
    fontSize: style?.root?.fontSize,
    fontWeight: style?.root?.fontWeight,
    paddingBlock: style?.root?.paddingBlock,
    paddingInline: style?.root?.paddingInline,
    [customCssProps.styleBackgroundDefault]: style?.root?.backgroundColor?.default,
    [customCssProps.styleBackgroundDisabled]: style?.root?.backgroundColor?.disabled,
    [customCssProps.styleBackgroundHover]: style?.root?.backgroundColor?.hover,
    [customCssProps.styleBackgroundFocus]: style?.root?.backgroundColor?.focus,
    [customCssProps.styleBackgroundReadonly]: style?.root?.backgroundColor?.readonly,
    [customCssProps.styleBorderColorDefault]: style?.root?.borderColor?.default,
    [customCssProps.styleBorderColorDisabled]: style?.root?.borderColor?.disabled,
    [customCssProps.styleBorderColorHover]: style?.root?.borderColor?.hover,
    [customCssProps.styleBorderColorFocus]: style?.root?.borderColor?.focus,
    [customCssProps.styleBorderColorReadonly]: style?.root?.borderColor?.readonly,
    [customCssProps.styleBoxShadowDefault]: style?.root?.boxShadow?.default,
    [customCssProps.styleBoxShadowDisabled]: style?.root?.boxShadow?.disabled,
    [customCssProps.styleBoxShadowHover]: style?.root?.boxShadow?.hover,
    [customCssProps.styleBoxShadowFocus]: style?.root?.boxShadow?.focus,
    [customCssProps.styleBoxShadowReadonly]: style?.root?.boxShadow?.readonly,
    [customCssProps.styleColorDefault]: style?.root?.color?.default,
    [customCssProps.styleColorDisabled]: style?.root?.color?.disabled,
    [customCssProps.styleColorHover]: style?.root?.color?.hover,
    [customCssProps.styleColorFocus]: style?.root?.color?.focus,
    [customCssProps.styleColorReadonly]: style?.root?.color?.readonly,
    [customCssProps.stylePlaceholderColor]: style?.placeholder?.color,
    [customCssProps.stylePlaceholderFontSize]: style?.placeholder?.fontSize,
    [customCssProps.stylePlaceholderFontWeight]: style?.placeholder?.fontWeight,
    [customCssProps.stylePlaceholderFontStyle]: style?.placeholder?.fontStyle,
  };
}
