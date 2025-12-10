// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { SYSTEM } from '../internal/environment';
import customCssProps from '../internal/generated/custom-css-properties';
import { ToggleButtonProps } from './interfaces';

export function getToggleButtonStyles(style: ToggleButtonProps['style']) {
  if (SYSTEM !== 'core') {
    return { nativeButtonStyles: {} };
  }

  // Styles NOT supported by InternalButton (pressed states only)
  // InternalButton will handle all other styles when the original style object is passed to it
  const nativeButtonStyles = {
    [customCssProps.styleBackgroundPressed]: style?.root?.background?.pressed,
    [customCssProps.styleBorderColorPressed]: style?.root?.borderColor?.pressed,
    [customCssProps.styleBoxShadowPressed]: style?.root?.boxShadow?.pressed,
    [customCssProps.styleColorPressed]: style?.root?.color?.pressed,
  };

  return {
    nativeButtonStyles,
  };
}
