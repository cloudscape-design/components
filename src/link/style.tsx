// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { SYSTEM } from '../internal/environment';
import customCssProps from '../internal/generated/custom-css-properties';
import { LinkProps } from './interfaces';

export function getLinkStyles(style: LinkProps['style']) {
  let properties = {};

  if (style?.root && SYSTEM === 'core') {
    properties = {
      background: style.root?.background,
      color: style.root?.color,
      paddingBlock: style.root?.paddingBlock,
      paddingInline: style.root?.paddingInline,
      fontSize: style.root?.fontSize,
      ...(style.root?.focusRing && {
        [customCssProps.styleFocusRingBorderColor]: style.root.focusRing?.borderColor,
        [customCssProps.styleFocusRingBorderRadius]: style.root.focusRing?.borderRadius,
        [customCssProps.styleFocusRingBorderWidth]: style.root.focusRing?.borderWidth,
      }),
    };
  }

  return properties;
}
