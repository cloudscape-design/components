// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { SYSTEM } from '../internal/environment';
import { BadgeProps } from './interfaces';

export function getBadgeStyles(style: BadgeProps['style']) {
  if (!style?.root) {
    return undefined;
  }

  return SYSTEM === 'core'
    ? {
        background: style.root.background,
        borderColor: style.root.borderColor,
        borderRadius: style.root.borderRadius,
        borderWidth: style.root.borderWidth,
        borderStyle: style.root.borderStyle,
        paddingBlock: style.root.paddingBlock,
        paddingInline: style.root.paddingInline,
      }
    : undefined;
}
