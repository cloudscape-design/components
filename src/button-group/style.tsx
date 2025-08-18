// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { SYSTEM } from '../internal/environment';
import customCssProps from '../internal/generated/custom-css-properties';
import { ButtonGroupProps } from './interfaces';

export function getButtonGroupStyles(style: ButtonGroupProps['style']) {
  if (SYSTEM !== 'core' || !style) {
    return undefined;
  }

  return {
    ...(style?.root?.background && {
      [customCssProps.styleBackgroundDefault]: style.root.background,
    }),
    ...(style?.root?.borderColor && {
      [customCssProps.styleBorderColorDefault]: style.root.borderColor,
    }),
    ...(style?.root?.borderRadius && {
      borderRadius: style.root.borderRadius,
    }),
    ...(style?.root?.borderWidth && {
      borderWidth: style.root.borderWidth,
    }),
    ...(style?.root?.gap && {
      gap: style.root.gap,
    }),
    ...(style?.root?.flexDirection && {
      flexDirection: style.root.flexDirection,
    }),
    ...(style?.root?.paddingBlock && {
      paddingBlock: style.root.paddingBlock,
    }),
    ...(style?.root?.paddingInline && {
      paddingInline: style.root.paddingInline,
    }),
    ...(style?.root?.focusRing && {
      [customCssProps.styleFocusRingBorderColor]: style.root.focusRing.borderColor,
      [customCssProps.styleFocusRingBorderRadius]: style.root.focusRing.borderRadius,
      [customCssProps.styleFocusRingBorderWidth]: style.root.focusRing.borderWidth,
    }),
  };
}

export function getButtonGroupItemStyles(style: ButtonGroupProps['style']) {
  if (SYSTEM !== 'core' || !style?.item) {
    return undefined;
  }

  return {
    ...(style.item.background && {
      [customCssProps.styleBackgroundActive]: style.item.background.active,
      [customCssProps.styleBackgroundDefault]: style.item.background.default,
      [customCssProps.styleBackgroundDisabled]: style.item.background.disabled,
      [customCssProps.styleBackgroundHover]: style.item.background.hover,
      '--awsui-button-group-item-background-pressed': style.item.background.pressed,
    }),
    ...(style.item.borderColor && {
      [customCssProps.styleBorderColorActive]: style.item.borderColor.active,
      [customCssProps.styleBorderColorDefault]: style.item.borderColor.default,
      [customCssProps.styleBorderColorDisabled]: style.item.borderColor.disabled,
      [customCssProps.styleBorderColorHover]: style.item.borderColor.hover,
      '--awsui-button-group-item-border-color-pressed': style.item.borderColor.pressed,
    }),
    ...(style.item.borderRadius && {
      borderRadius: style.item.borderRadius,
    }),
    ...(style.item.borderWidth && {
      borderWidth: style.item.borderWidth,
    }),
    ...(style.item.color && {
      [customCssProps.styleColorActive]: style.item.color.active,
      [customCssProps.styleColorDefault]: style.item.color.default,
      [customCssProps.styleColorDisabled]: style.item.color.disabled,
      [customCssProps.styleColorHover]: style.item.color.hover,
      '--awsui-button-group-item-color-pressed': style.item.color.pressed,
    }),
    ...(style.item.focusRing && {
      [customCssProps.styleFocusRingBorderColor]: style.item.focusRing.borderColor,
      [customCssProps.styleFocusRingBorderRadius]: style.item.focusRing.borderRadius,
      [customCssProps.styleFocusRingBorderWidth]: style.item.focusRing.borderWidth,
    }),
    ...(style.item.paddingBlock && {
      paddingBlock: style.item.paddingBlock,
    }),
    ...(style.item.paddingInline && {
      paddingInline: style.item.paddingInline,
    }),
  };
}
