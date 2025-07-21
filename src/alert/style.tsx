// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { SYSTEM } from '../internal/environment';
import { AlertProps } from './interfaces';

export function getAlertStyles(style: AlertProps['style']) {
  let properties = {};

  if (style?.root && SYSTEM === 'core') {
    properties = {
      background: style.root.background,
      borderColor: style.root.borderColor,
      borderRadius: style.root.borderRadius,
      borderWidth: style.root.borderWidth,
      color: style.root.color,
    };
  }

  if (style?.dismissButton && SYSTEM === 'core') {
    properties = {
      ...properties,
      dismissButton: {
        color: {
          default: style.dismissButton.color?.default,
          hover: style.dismissButton.color?.hover,
          active: style.dismissButton.color?.active,
        },
        focusRing: {
          borderColor: style.dismissButton.focusRing?.borderColor,
          borderRadius: style.dismissButton.focusRing?.borderRadius,
          borderWidth: style.dismissButton.focusRing?.borderWidth,
        },
      },
    };
  }

  return properties;
}
