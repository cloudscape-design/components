// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { SYSTEM } from '../internal/environment';
import customCssProps from '../internal/generated/custom-css-properties';
import { SegmentedControlProps } from './interfaces';

export function getSegmentedControlRootStyles(style: SegmentedControlProps['style']) {
  if (SYSTEM !== 'core') {
    return {};
  }

  return {
    borderRadius: style?.root?.borderRadius,
  };
}

export function getSegmentedControlSegmentStyles(style: SegmentedControlProps['style']) {
  if (SYSTEM !== 'core') {
    return {};
  }

  return {
    borderRadius: style?.segment?.borderRadius,
    fontSize: style?.segment?.fontSize,
    paddingBlock: style?.segment?.paddingBlock,
    paddingInline: style?.segment?.paddingInline,
    [customCssProps.styleBackgroundActive]: style?.segment?.background?.active,
    [customCssProps.styleBackgroundDefault]: style?.segment?.background?.default,
    [customCssProps.styleBackgroundDisabled]: style?.segment?.background?.disabled,
    [customCssProps.styleBackgroundHover]: style?.segment?.background?.hover,
    [customCssProps.styleColorActive]: style?.segment?.color?.active,
    [customCssProps.styleColorDefault]: style?.segment?.color?.default,
    [customCssProps.styleColorDisabled]: style?.segment?.color?.disabled,
    [customCssProps.styleColorHover]: style?.segment?.color?.hover,
    [customCssProps.styleFocusRingBorderColor]: style?.segment?.focusRing?.borderColor,
    [customCssProps.styleFocusRingBorderRadius]: style?.segment?.focusRing?.borderRadius,
    [customCssProps.styleFocusRingBorderWidth]: style?.segment?.focusRing?.borderWidth,
  };
}
