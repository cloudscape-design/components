// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { SYSTEM } from '../internal/environment';
import customCssProps from '../internal/generated/custom-css-properties';
import { ButtonGroupProps } from './interfaces';

export function getButtonGroupStyles(style: ButtonGroupProps['style']) {
  if (SYSTEM !== 'core' || !style?.root) {
    return undefined;
  }

  return {
    borderRadius: style?.root?.borderRadius,
    borderWidth: style?.root?.borderWidth,
    borderStyle: style?.root?.borderWidth ? 'solid' : undefined,
    boxShadow: style?.root?.boxShadow,
    gap: style?.root?.gap,
    flexDirection: style?.root?.flexDirection,
    paddingBlock: style?.root?.paddingBlock,
    paddingInline: style?.root?.paddingInline,
    background: style?.root?.background,
    borderColor: style?.root?.borderColor,
    ...(style?.root?.focusRing && {
      [customCssProps.styleFocusRingBorderColor]: style.root.focusRing?.borderColor,
      [customCssProps.styleFocusRingBorderRadius]: style.root.focusRing?.borderRadius,
      [customCssProps.styleFocusRingBorderWidth]: style.root.focusRing?.borderWidth,
    }),
  };
}

export function getButtonGroupItemStyles(style: ButtonGroupProps['style']) {
  if (SYSTEM !== 'core' || !style?.item) {
    return undefined;
  }

  return {
    ...(style?.item?.color && {
      [customCssProps.styleColorActive]: style.item.color?.active,
      [customCssProps.styleColorDefault]: style.item.color?.default,
      [customCssProps.styleColorDisabled]: style.item.color?.disabled,
      [customCssProps.styleColorHover]: style.item.color?.hover,
    }),
    ...(style?.item?.boxShadow && {
      [customCssProps.styleBoxShadowActive]: style.item.boxShadow?.active,
      [customCssProps.styleBoxShadowDefault]: style.item.boxShadow?.default,
      [customCssProps.styleBoxShadowDisabled]: style.item.boxShadow?.disabled,
      [customCssProps.styleBoxShadowHover]: style.item.boxShadow?.hover,
    }),
    ...(style?.item?.focusRing && {
      [customCssProps.styleFocusRingBorderColor]: style.item.focusRing?.borderColor,
      [customCssProps.styleFocusRingBorderRadius]: style.item.focusRing?.borderRadius,
      [customCssProps.styleFocusRingBorderWidth]: style.item.focusRing?.borderWidth,
    }),
  };
}
