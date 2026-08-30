// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { SYSTEM } from '../internal/environment';
import customCssProps from '../internal/generated/custom-css-properties';
import { StepsProps } from './interfaces';

export function getStepsStyles(style: StepsProps['style']): React.CSSProperties | undefined {
  if (SYSTEM !== 'core') {
    return undefined;
  }

  return {
    [customCssProps.styleStepsConnectorColor]: style?.connector?.color,
  };
}
