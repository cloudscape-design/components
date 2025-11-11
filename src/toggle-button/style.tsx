// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { SYSTEM } from '../internal/environment';
import customCssProps from '../internal/generated/custom-css-properties';
import { ToggleButtonProps } from './interfaces';

export function getToggleButtonStyles(style: ToggleButtonProps['style']) {
  if (SYSTEM !== 'core') {
    return {};
  }

  const properties = {
    borderRadius: style?.root?.borderRadius,
    borderWidth: style?.root?.borderWidth,
    paddingBlock: style?.root?.paddingBlock,
    paddingInline: style?.root?.paddingInline,
    [customCssProps.styleBackgroundActive]: style?.root?.background?.active,
    [customCssProps.styleBackgroundDefault]: style?.root?.background?.default,
    [customCssProps.styleBackgroundDisabled]: style?.root?.background?.disabled,
    [customCssProps.styleBackgroundHover]: style?.root?.background?.hover,
    [customCssProps.styleBackgroundPressed]: style?.root?.background?.pressed,
    [customCssProps.styleBorderColorActive]: style?.root?.borderColor?.active,
    [customCssProps.styleBorderColorDefault]: style?.root?.borderColor?.default,
    [customCssProps.styleBorderColorDisabled]: style?.root?.borderColor?.disabled,
    [customCssProps.styleBorderColorHover]: style?.root?.borderColor?.hover,
    [customCssProps.styleBorderColorPressed]: style?.root?.borderColor?.pressed,
    [customCssProps.styleBoxShadowActive]: style?.root?.boxShadow?.active,
    [customCssProps.styleBoxShadowDefault]: style?.root?.boxShadow?.default,
    [customCssProps.styleBoxShadowDisabled]: style?.root?.boxShadow?.disabled,
    [customCssProps.styleBoxShadowHover]: style?.root?.boxShadow?.hover,
    [customCssProps.styleBoxShadowPressed]: style?.root?.boxShadow?.pressed,
    [customCssProps.styleColorActive]: style?.root?.color?.active,
    [customCssProps.styleColorDefault]: style?.root?.color?.default,
    [customCssProps.styleColorDisabled]: style?.root?.color?.disabled,
    [customCssProps.styleColorHover]: style?.root?.color?.hover,
    [customCssProps.styleColorPressed]: style?.root?.color?.pressed,
    [customCssProps.styleFocusRingBorderColor]: style?.root?.focusRing?.borderColor,
    [customCssProps.styleFocusRingBorderRadius]: style?.root?.focusRing?.borderRadius,
    [customCssProps.styleFocusRingBorderWidth]: style?.root?.focusRing?.borderWidth,
  };

  return Object.fromEntries(Object.entries(properties).filter(([, value]) => value));
}
