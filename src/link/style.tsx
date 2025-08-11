// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { SYSTEM } from '../internal/environment.js';
import customCssProps from '../internal/generated/custom-css-properties';
import { LinkProps } from './interfaces.js';

export function getLinkStyles(style: LinkProps['style']) {
  let properties = {};

  if (style?.root && SYSTEM === 'core') {
    properties = {
      ...(style?.root?.color && {
        [customCssProps.styleColorActive]: style.root.color?.active,
        [customCssProps.styleColorDefault]: style.root.color?.default,
        [customCssProps.styleColorHover]: style.root.color?.hover,
      }),
      ...(style.root?.focusRing && {
        [customCssProps.styleFocusRingBorderColor]: style.root.focusRing?.borderColor,
        [customCssProps.styleFocusRingBorderRadius]: style.root.focusRing?.borderRadius,
        [customCssProps.styleFocusRingBorderWidth]: style.root.focusRing?.borderWidth,
      }),
    };
  }

  return properties;
}
