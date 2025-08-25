// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { SYSTEM } from '../internal/environment';
import customCssProps from '../internal/generated/custom-css-properties';
import { ButtonProps } from './interfaces';

export function getButtonStyles(style: ButtonProps['style']) {
  if (SYSTEM !== 'core' || !style?.root) {
    return undefined;
  }

  return {
    borderRadius: style?.root?.borderRadius,
    borderWidth: style?.root?.borderWidth,
    paddingBlock: style?.root?.paddingBlock,
    paddingInline: style?.root?.paddingInline,
    ...(style?.root?.background && {
      [customCssProps.styleBackgroundActive]: style.root.background?.active,
      [customCssProps.styleBackgroundDefault]: style.root.background?.default,
      [customCssProps.styleBackgroundDisabled]: style.root.background?.disabled,
      [customCssProps.styleBackgroundHover]: style.root.background?.hover,
    }),
    ...(style?.root?.borderColor && {
      [customCssProps.styleBorderColorActive]: style.root.borderColor?.active,
      [customCssProps.styleBorderColorDefault]: style.root.borderColor?.default,
      [customCssProps.styleBorderColorDisabled]: style.root.borderColor?.disabled,
      [customCssProps.styleBorderColorHover]: style.root.borderColor?.hover,
    }),
    ...(style?.root?.boxShadow && {
      [customCssProps.styleBoxShadowActive]: style.root.boxShadow?.active,
      [customCssProps.styleBoxShadowDefault]: style.root.boxShadow?.default,
      [customCssProps.styleBoxShadowDisabled]: style.root.boxShadow?.disabled,
      [customCssProps.styleBoxShadowHover]: style.root.boxShadow?.hover,
    }),
    ...(style?.root?.color && {
      [customCssProps.styleColorActive]: style.root.color?.active,
      [customCssProps.styleColorDefault]: style.root.color?.default,
      [customCssProps.styleColorDisabled]: style.root.color?.disabled,
      [customCssProps.styleColorHover]: style.root.color?.hover,
    }),
    ...(style?.root?.focusRing && {
      [customCssProps.styleFocusRingBorderColor]: style.root.focusRing?.borderColor,
      [customCssProps.styleFocusRingBorderRadius]: style.root.focusRing?.borderRadius,
      [customCssProps.styleFocusRingBorderWidth]: style.root.focusRing?.borderWidth,
    }),
    ...(style?.root?.focusRing?.borderRadius && {
      [customCssProps.styleFocusRingBorderRadius]: style.root.focusRing.borderRadius,
    }),
  };
}
