// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { SYSTEM } from '../internal/environment';
import customCssProps from '../internal/generated/custom-css-properties';
import { DropdownProps } from './interfaces';

export function getDropdownStyles(style: DropdownProps['style']) {
  if (SYSTEM !== 'core' || !style?.dropdown) {
    return undefined;
  }

  return {
    background: style.dropdown.background,
    [customCssProps.dropdownContentBorderColor]: style.dropdown.borderColor,
    [customCssProps.dropdownContentBorderWidth]: style.dropdown.borderWidth,
    [customCssProps.dropdownContentBorderRadius]: style.dropdown.borderRadius,
  };
}
