// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { SYSTEM } from '../internal/environment';
import customCssProps from '../internal/generated/custom-css-properties';
import { SliderProps } from './interfaces';

export function getSliderStyles(style: SliderProps['style']) {
  if (SYSTEM !== 'core') {
    return {};
  }

  return {
    [customCssProps.styleSliderTrackBackgroundColor]: style?.track?.backgroundColor,
    [customCssProps.styleSliderRangeBackgroundDefault]: style?.range?.backgroundColor?.default,
    [customCssProps.styleSliderRangeBackgroundActive]: style?.range?.backgroundColor?.active,
    [customCssProps.styleSliderHandleBackgroundDefault]: style?.handle?.backgroundColor?.default,
    [customCssProps.styleSliderHandleBackgroundHover]: style?.handle?.backgroundColor?.hover,
    [customCssProps.styleSliderHandleBackgroundActive]: style?.handle?.backgroundColor?.active,
    [customCssProps.styleSliderHandleBorderRadius]: style?.handle?.borderRadius,
  };
}
