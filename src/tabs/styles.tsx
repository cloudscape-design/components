// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { SYSTEM } from '../internal/environment';
import customCssProps from '../internal/generated/custom-css-properties';
import { TabsProps } from './interfaces';

export function getTabStyles(style: TabsProps['style']) {
  if (SYSTEM !== 'core') {
    return undefined;
  }

  return {
    borderRadius: style?.tabs?.borderRadius,
    borderWidth: style?.tabs?.borderWidth,
    fontSize: style?.tabs?.fontSize,
    fontWeight: style?.tabs?.fontWeight,
    paddingBlock: style?.tabs?.paddingBlock,
    paddingInline: style?.tabs?.paddingInline,
    [customCssProps.styleBackgroundActive]: style?.tabs?.backgroundColor?.active,
    [customCssProps.styleBackgroundDefault]: style?.tabs?.backgroundColor?.default,
    [customCssProps.styleBackgroundDisabled]: style?.tabs?.backgroundColor?.disabled,
    [customCssProps.styleBackgroundHover]: style?.tabs?.backgroundColor?.hover,
    [customCssProps.styleBorderColorActive]: style?.tabs?.borderColor?.active,
    [customCssProps.styleBorderColorDefault]: style?.tabs?.borderColor?.default,
    [customCssProps.styleBorderColorDisabled]: style?.tabs?.borderColor?.disabled,
    [customCssProps.styleBorderColorHover]: style?.tabs?.borderColor?.hover,
    [customCssProps.styleColorActive]: style?.tabs?.color?.active,
    [customCssProps.styleColorDefault]: style?.tabs?.color?.default,
    [customCssProps.styleColorDisabled]: style?.tabs?.color?.disabled,
    [customCssProps.styleColorHover]: style?.tabs?.color?.hover,
    [customCssProps.styleFocusRingBorderColor]: style?.tabs?.focusRing?.borderColor,
    [customCssProps.styleFocusRingBorderRadius]: style?.tabs?.focusRing?.borderRadius,
    [customCssProps.styleFocusRingBorderWidth]: style?.tabs?.focusRing?.borderWidth,
  };
}

export function getTabContainerStyles(style: TabsProps['style']) {
  if (SYSTEM !== 'core') {
    return undefined;
  }

  return {
    [customCssProps.styleTabsUnderlineColor]: style?.underline?.color,
    [customCssProps.styleTabsUnderlineWidth]: style?.underline?.width,
    [customCssProps.styleTabsUnderlineBorderRadius]: style?.underline?.borderRadius,
    [customCssProps.styleTabsDividerColor]: style?.divider?.color,
    [customCssProps.styleTabsDividerWidth]: style?.divider?.width,
  };
}

export function getTabHeaderStyles(style: TabsProps['style']) {
  if (SYSTEM !== 'core') {
    return undefined;
  }

  return {
    [customCssProps.styleTabsHeaderDividerColor]: style?.headerDivider?.color,
    [customCssProps.styleTabsHeaderDividerWidth]: style?.headerDivider?.width,
  };
}
