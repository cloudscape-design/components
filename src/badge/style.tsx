// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { SYSTEM } from '../internal/environment';
import { BadgeProps } from './interfaces';

export function getBadgeStyles(style: BadgeProps['style']) {
  let properties = {};

  if (style?.root && SYSTEM === 'core') {
    properties = {
      background: style.root.background,
      borderColor: style.root.borderColor,
      borderRadius: style.root.borderRadius,
      borderWidth: style.root.borderWidth,
      color: style.root.color,
      paddingBlock: style.root.paddingBlock,
      paddingInline: style.root.paddingInline,
    };
  }

  return properties;
}
