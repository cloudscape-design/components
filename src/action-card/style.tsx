// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { SYSTEM } from '../internal/environment';
import customCssProps from '../internal/generated/custom-css-properties';
import { ActionCardProps } from './interfaces';

export function getRootStyles(style: ActionCardProps.Style | undefined) {
  if (SYSTEM !== 'core' || !style?.root) {
    return {};
  }

  return {
    ...(style.root.background && {
      [customCssProps.styleActionCardBackgroundActive]: style.root.background?.active,
      [customCssProps.styleActionCardBackgroundDefault]: style.root.background?.default,
      [customCssProps.styleActionCardBackgroundDisabled]: style.root.background?.disabled,
      [customCssProps.styleActionCardBackgroundHover]: style.root.background?.hover,
    }),
    ...(style.root.borderColor && {
      [customCssProps.styleActionCardBorderColorActive]: style.root.borderColor?.active,
      [customCssProps.styleActionCardBorderColorDefault]: style.root.borderColor?.default,
      [customCssProps.styleActionCardBorderColorDisabled]: style.root.borderColor?.disabled,
      [customCssProps.styleActionCardBorderColorHover]: style.root.borderColor?.hover,
    }),
    ...(style.root.borderRadius && {
      [customCssProps.styleActionCardBorderRadiusDefault]: style.root.borderRadius?.default,
      [customCssProps.styleActionCardBorderRadiusHover]: style.root.borderRadius?.hover,
      [customCssProps.styleActionCardBorderRadiusActive]: style.root.borderRadius?.active,
      [customCssProps.styleActionCardBorderRadiusDisabled]: style.root.borderRadius?.disabled,
    }),
    ...(style.root.borderWidth && {
      [customCssProps.styleActionCardBorderWidthDefault]: style.root.borderWidth?.default,
      [customCssProps.styleActionCardBorderWidthHover]: style.root.borderWidth?.hover,
      [customCssProps.styleActionCardBorderWidthActive]: style.root.borderWidth?.active,
      [customCssProps.styleActionCardBorderWidthDisabled]: style.root.borderWidth?.disabled,
    }),
    ...(style.root.boxShadow && {
      [customCssProps.styleActionCardBoxShadowActive]: style.root.boxShadow?.active,
      [customCssProps.styleActionCardBoxShadowDefault]: style.root.boxShadow?.default,
      [customCssProps.styleActionCardBoxShadowDisabled]: style.root.boxShadow?.disabled,
      [customCssProps.styleActionCardBoxShadowHover]: style.root.boxShadow?.hover,
    }),
    ...(style.root.focusRing && {
      [customCssProps.styleActionCardFocusRingBorderColor]: style.root.focusRing?.borderColor,
      [customCssProps.styleActionCardFocusRingBorderRadius]: style.root.focusRing?.borderRadius,
      [customCssProps.styleActionCardFocusRingBorderWidth]: style.root.focusRing?.borderWidth,
    }),
  };
}

export function getHeaderStyles(style: ActionCardProps.Style | undefined) {
  if (SYSTEM !== 'core' || !style?.header) {
    return {};
  }

  return {
    paddingBlock: style.header.paddingBlock,
    paddingInline: style.header.paddingInline,
  };
}

export function getContentStyles(style: ActionCardProps.Style | undefined) {
  if (SYSTEM !== 'core' || !style?.content) {
    return {};
  }

  return {
    paddingBlock: style.content.paddingBlock,
    paddingInline: style.content.paddingInline,
  };
}
