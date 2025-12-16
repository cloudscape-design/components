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
    borderRadius: style?.tab?.borderRadius,
    borderWidth: style?.tab?.borderWidth,
    fontSize: style?.tab?.fontSize,
    fontWeight: style?.tab?.fontWeight,
    paddingBlock: style?.tab?.paddingBlock,
    paddingInline: style?.tab?.paddingInline,
    [customCssProps.styleBackgroundActive]: style?.tab?.backgroundColor?.active,
    [customCssProps.styleBackgroundDefault]: style?.tab?.backgroundColor?.default,
    [customCssProps.styleBackgroundDisabled]: style?.tab?.backgroundColor?.disabled,
    [customCssProps.styleBackgroundHover]: style?.tab?.backgroundColor?.hover,
    [customCssProps.styleBorderColorActive]: style?.tab?.borderColor?.active,
    [customCssProps.styleBorderColorDefault]: style?.tab?.borderColor?.default,
    [customCssProps.styleBorderColorDisabled]: style?.tab?.borderColor?.disabled,
    [customCssProps.styleBorderColorHover]: style?.tab?.borderColor?.hover,
    [customCssProps.styleColorActive]: style?.tab?.color?.active,
    [customCssProps.styleColorDefault]: style?.tab?.color?.default,
    [customCssProps.styleColorDisabled]: style?.tab?.color?.disabled,
    [customCssProps.styleColorHover]: style?.tab?.color?.hover,
    [customCssProps.styleFocusRingBorderColor]: style?.tab?.focusRing?.borderColor,
    [customCssProps.styleFocusRingBorderRadius]: style?.tab?.focusRing?.borderRadius,
    [customCssProps.styleFocusRingBorderWidth]: style?.tab?.focusRing?.borderWidth,
  };
}

export function getTabContainerStyles(style: TabsProps['style']) {
  if (SYSTEM !== 'core') {
    return undefined;
  }

  return {
    [customCssProps.styleTabsUnderlineColor]: style?.tab?.underline?.color,
    [customCssProps.styleTabsUnderlineWidth]: style?.tab?.underline?.width,
    [customCssProps.styleTabsUnderlineBorderRadius]: style?.tab?.underline?.borderRadius,
    [customCssProps.styleTabsSeparatorColor]: style?.tabSeparator?.color,
    [customCssProps.styleTabsSeparatorWidth]: style?.tabSeparator?.width,
  };
}

export function getTabHeaderStyles(style: TabsProps['style']) {
  if (SYSTEM !== 'core') {
    return undefined;
  }

  return {
    [customCssProps.styleTabsHeaderBorderColor]: style?.headerBorder?.color,
    [customCssProps.styleTabsHeaderBorderWidth]: style?.headerBorder?.width,
  };
}
