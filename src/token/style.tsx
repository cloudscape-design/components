// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { SYSTEM } from '../internal/environment';
import customCssProps from '../internal/generated/custom-css-properties';
import { TokenProps } from './interfaces';

export function getTokenStyles(style: TokenProps['style']) {
  if (SYSTEM !== 'core' || !style?.root) {
    return undefined;
  }

  return {
    borderRadius: style.root?.borderRadius,
    borderWidth: style.root?.borderWidth,
    ...(style.root?.background && {
      [customCssProps.tokenStyleBackgroundDefault]: style.root.background?.default,
      [customCssProps.tokenStyleBackgroundDisabled]: style.root.background?.disabled,
      [customCssProps.tokenStyleBackgroundReadOnly]: style.root.background?.readOnly,
    }),
    ...(style.root?.borderColor && {
      [customCssProps.tokenStyleBorderColorDefault]: style.root.borderColor?.default,
      [customCssProps.tokenStyleBorderColorDisabled]: style.root.borderColor?.disabled,
      [customCssProps.tokenStyleBorderColorReadOnly]: style.root.borderColor?.readOnly,
    }),
    ...(style.root?.color && {
      color: style.root.color,
    }),
  };
}

export function getDismissButtonStyles(style: TokenProps['style']) {
  if (SYSTEM !== 'core' || !style?.dismissButton) {
    return undefined;
  }

  return {
    ...(style.dismissButton?.color && {
      [customCssProps.tokenStyleDismissColorDefault]: style.dismissButton.color?.default,
      [customCssProps.tokenStyleDismissColorDisabled]: style.dismissButton.color?.disabled,
      [customCssProps.tokenStyleDismissColorHover]: style.dismissButton.color?.hover,
      [customCssProps.tokenStyleDismissColorReadOnly]: style.dismissButton.color?.readOnly,
    }),
  };
}
