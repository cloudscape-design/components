// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { SYSTEM } from '../internal/environment';
import customCssProps from '../internal/generated/custom-css-properties';
import { ProgressBarProps } from './interfaces';

export function getProgressStyles(style: ProgressBarProps['style']) {
  if (SYSTEM !== 'core' || !style?.progressBar) {
    return undefined;
  }

  return {
    [customCssProps.progressBarBackgroundColor]: style.progressBar.backgroundColor,
    [customCssProps.progressBarBorderRadius]: style.progressBar.borderRadius,
    [customCssProps.progressBarHeight]: style.progressBar.height,
  };
}

export function getProgressValueStyles(style: ProgressBarProps['style']) {
  if (SYSTEM !== 'core' || !style?.progressValue) {
    return undefined;
  }

  return {
    [customCssProps.progressValueBackgroundColor]: style.progressValue.backgroundColor,
  };
}

export function getProgressPercentageStyles(style: ProgressBarProps['style']) {
  if (SYSTEM !== 'core' || !style?.progressPercentage) {
    return undefined;
  }

  return {
    color: style.progressPercentage.color,
    fontSize: style.progressPercentage.fontSize,
    fontWeight: style.progressPercentage.fontWeight,
  };
}
