// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { SYSTEM } from '../internal/environment';
import customCssProps from '../internal/generated/custom-css-properties';
import { TokenProps } from './interfaces';

export function getTokenRootStyles(style: TokenProps['style']) {
  if (SYSTEM !== 'core') {
    return {};
  }

  const properties = {
    borderRadius: style?.root?.borderRadius,
    borderWidth: style?.root?.borderWidth,
    paddingBlock: style?.root?.paddingBlock,
    paddingInline: style?.root?.paddingInline,
    [customCssProps.tokenStyleBackgroundDefault]: style?.root?.background?.default,
    [customCssProps.tokenStyleBackgroundDisabled]: style?.root?.background?.disabled,
    [customCssProps.tokenStyleBackgroundHover]: style?.root?.background?.hover,
    [customCssProps.tokenStyleBorderColorDefault]: style?.root?.borderColor?.default,
    [customCssProps.tokenStyleBorderColorDisabled]: style?.root?.borderColor?.disabled,
    [customCssProps.tokenStyleBorderColorHover]: style?.root?.borderColor?.hover,
    [customCssProps.tokenStyleColorDefault]: style?.root?.color?.default,
    [customCssProps.tokenStyleColorDisabled]: style?.root?.color?.disabled,
    [customCssProps.tokenStyleColorHover]: style?.root?.color?.hover,
    [customCssProps.tokenStyleDismissColorDefault]: style?.dismissButton?.color?.default,
    [customCssProps.tokenStyleDismissColorDisabled]: style?.dismissButton?.color?.disabled,
    [customCssProps.tokenStyleDismissColorHover]: style?.dismissButton?.color?.hover,
    ...(style?.dismissButton?.focusRing && {
      [customCssProps.styleFocusRingBorderColor]: style.dismissButton.focusRing.borderColor,
      [customCssProps.styleFocusRingBorderRadius]: style.dismissButton.focusRing.borderRadius,
      [customCssProps.styleFocusRingBorderWidth]: style.dismissButton.focusRing.borderWidth,
    }),
  };

  return Object.fromEntries(Object.entries(properties).filter(([, value]) => value !== undefined));
}
