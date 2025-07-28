// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { SYSTEM } from '../internal/environment';
import { AlertProps } from './interfaces';

export function getAlertStyles(style: AlertProps['style']) {
  if (SYSTEM !== 'core' || !style?.root) {
    return undefined;
  }

  return {
    background: style.root?.background,
    borderColor: style.root?.borderColor,
    borderRadius: style.root?.borderRadius,
    borderWidth: style.root?.borderWidth,
    color: style.root?.color,
  };
}

export function getDismissButtonStyles(style: AlertProps['style']) {
  if (SYSTEM !== 'core' || !style?.dismissButton) {
    return undefined;
  }

  return {
    root: {
      color: {
        active: style.dismissButton?.color?.active,
        default: style.dismissButton?.color?.default,
        hover: style.dismissButton?.color?.hover,
      },
      focusRing: {
        borderColor: style.dismissButton?.focusRing?.borderColor,
        borderRadius: style.dismissButton?.focusRing?.borderRadius,
        borderWidth: style.dismissButton?.focusRing?.borderWidth,
      },
    },
  };
}
