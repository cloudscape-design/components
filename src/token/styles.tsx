// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ButtonProps } from '../button/interfaces';
import { SYSTEM } from '../internal/environment';
import customCssProps from '../internal/generated/custom-css-properties';
import { TokenProps } from './interfaces';

export function getTokenRootStyles(style: TokenProps['style']) {
  if (SYSTEM !== 'core') {
    return {};
  }

  return {
    borderRadius: style?.root?.borderRadius,
    borderWidth: style?.root?.borderWidth,
    paddingBlock: style?.root?.paddingBlock,
    paddingInline: style?.root?.paddingInline,
    [customCssProps.tokenStyleBackgroundDefault]: style?.root?.background?.default,
    [customCssProps.tokenStyleBackgroundDisabled]: style?.root?.background?.disabled,
    [customCssProps.tokenStyleBackgroundReadOnly]: style?.root?.background?.readOnly,
    [customCssProps.tokenStyleBorderColorDefault]: style?.root?.borderColor?.default,
    [customCssProps.tokenStyleBorderColorDisabled]: style?.root?.borderColor?.disabled,
    [customCssProps.tokenStyleBorderColorReadOnly]: style?.root?.borderColor?.readOnly,
  };
}

// Maps the token's dismiss button style to the button style. Button has no read-only state: a read-only token
// shows its dismiss button as disabled, and the disabled color wins when both apply. The token never had an
// active color, so pressing keeps the hover color.
export function getDismissButtonStyles(
  style: TokenProps['style'],
  { disabled, readOnly }: { disabled?: boolean; readOnly?: boolean }
): ButtonProps.Style | undefined {
  const dismissButton = style?.dismissButton;
  if (SYSTEM !== 'core' || !dismissButton) {
    return undefined;
  }
  const color = dismissButton.color;
  return {
    root: {
      color: color && {
        default: color.default,
        hover: color.hover,
        active: color.hover,
        disabled: readOnly && !disabled ? color.readOnly : color.disabled,
      },
      focusRing: dismissButton.focusRing,
    },
  };
}
