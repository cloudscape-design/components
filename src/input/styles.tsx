// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { SYSTEM } from '../internal/environment';
import customCssProps from '../internal/generated/custom-css-properties';
import { InputProps } from './interfaces';
import { parsePaddingInline } from './utils';

export function getInputStyles(style: InputProps['style']) {
  let properties = {};

  if (style?.root && SYSTEM === 'core') {
    // We are only supporting logical shorthand properties for padding (e.g. "10px 30px"),
    // so wen ened to deconstruct this into start- and end-padding to be able to style
    // them separately.
    const { start: paddingStart, end: paddingEnd } = parsePaddingInline(style?.root?.paddingInline);

    properties = {
      borderRadius: style?.root?.borderRadius,
      borderWidth: style?.root?.borderWidth,
      fontSize: style?.root?.fontSize,
      fontWeight: style?.root?.fontWeight,
      paddingBlock: style?.root?.paddingBlock,
      ...(style?.root?.paddingInline && {
        [customCssProps.stylePaddingInline]: style.root.paddingInline,
      }),
      ...(paddingStart && {
        [customCssProps.stylePaddingInlineStart]: paddingStart,
      }),
      ...(paddingEnd && {
        [customCssProps.stylePaddingInlineEnd]: paddingEnd,
      }),
      ...(style?.root?.backgroundColor && {
        [customCssProps.styleBackgroundDefault]: style.root.backgroundColor?.default,
        [customCssProps.styleBackgroundDisabled]: style.root.backgroundColor?.disabled,
        [customCssProps.styleBackgroundHover]: style.root.backgroundColor?.hover,
        [customCssProps.styleBackgroundFocus]: style.root.backgroundColor?.focus,
        [customCssProps.styleBackgroundReadonly]: style.root.backgroundColor?.readonly,
      }),
      ...(style?.root?.borderColor && {
        [customCssProps.styleBorderColorDefault]: style.root.borderColor?.default,
        [customCssProps.styleBorderColorDisabled]: style.root.borderColor?.disabled,
        [customCssProps.styleBorderColorHover]: style.root.borderColor?.hover,
        [customCssProps.styleBorderColorFocus]: style.root.borderColor?.focus,
        [customCssProps.styleBorderColorReadonly]: style.root.borderColor?.readonly,
      }),
      ...(style?.root?.boxShadow && {
        [customCssProps.styleBoxShadowDefault]: style.root.boxShadow?.default,
        [customCssProps.styleBoxShadowDisabled]: style.root.boxShadow?.disabled,
        [customCssProps.styleBoxShadowHover]: style.root.boxShadow?.hover,
        [customCssProps.styleBoxShadowFocus]: style.root.boxShadow?.focus,
        [customCssProps.styleBoxShadowReadonly]: style.root.boxShadow?.readonly,
      }),
      ...(style?.root?.color && {
        [customCssProps.styleColorDefault]: style.root.color?.default,
        [customCssProps.styleColorDisabled]: style.root.color?.disabled,
        [customCssProps.styleColorHover]: style.root.color?.hover,
        [customCssProps.styleColorFocus]: style.root.color?.focus,
        [customCssProps.styleColorReadonly]: style.root.color?.readonly,
      }),
      ...(style?.placeholder && {
        [customCssProps.stylePlaceholderColor]: style.placeholder?.color,
        [customCssProps.stylePlaceholderFontSize]: style.placeholder?.fontSize,
        [customCssProps.stylePlaceholderFontWeight]: style.placeholder?.fontWeight,
        [customCssProps.stylePlaceholderFontStyle]: style.placeholder?.fontStyle,
      }),
    };

    return properties;
  }
}
