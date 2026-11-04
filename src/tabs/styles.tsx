// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { SYSTEM } from '../internal/environment';
import customCssProps from '../internal/generated/custom-css-properties';
import { TabsProps } from './interfaces';

// Splits a `padding-block` value into its start and end parts, keeping functions such as calc() intact.
// The parts feed the custom properties that the tab box, the link and the action and dismiss spans read.
export function splitBlockValue(value: string | undefined): [string | undefined, string | undefined] {
  if (!value) {
    return [undefined, undefined];
  }
  const parts: string[] = [];
  let depth = 0;
  let current = '';
  for (const char of value.trim()) {
    if (char === '(') {
      depth++;
    } else if (char === ')') {
      depth--;
    }
    if (depth === 0 && /\s/.test(char)) {
      if (current) {
        parts.push(current);
        current = '';
      }
    } else {
      current += char;
    }
  }
  if (current) {
    parts.push(current);
  }
  return [parts[0], parts[1] ?? parts[0]];
}

export function getTabStyles(style: TabsProps['style']) {
  if (SYSTEM !== 'core') {
    return undefined;
  }

  const [paddingBlockStart, paddingBlockEnd] = splitBlockValue(style?.tab?.paddingBlock);

  return {
    borderRadius: style?.tab?.borderRadius,
    borderWidth: style?.tab?.borderWidth,
    fontSize: style?.tab?.fontSize,
    fontWeight: style?.tab?.fontWeight,
    [customCssProps.styleTabsPaddingBlockStart]: paddingBlockStart,
    [customCssProps.styleTabsPaddingBlockEnd]: paddingBlockEnd,
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

// Inline padding stays on the trigger so that the label keeps its position next to the action and dismiss button.
export function getTabTriggerStyles(style: TabsProps['style']) {
  if (SYSTEM !== 'core') {
    return undefined;
  }

  return {
    paddingInline: style?.tab?.paddingInline,
  };
}

export function getTabContainerStyles(style: TabsProps['style']) {
  if (SYSTEM !== 'core') {
    return undefined;
  }

  return {
    [customCssProps.styleTabsActiveIndicatorColor]: style?.tab?.activeIndicator?.color,
    [customCssProps.styleTabsActiveIndicatorWidth]: style?.tab?.activeIndicator?.width,
    [customCssProps.styleTabsActiveIndicatorBorderRadius]: style?.tab?.activeIndicator?.borderRadius,
    [customCssProps.styleTabsSeparatorColor]: style?.tabSeparator?.color,
    [customCssProps.styleTabsSeparatorWidth]: style?.tabSeparator?.width,
  };
}
