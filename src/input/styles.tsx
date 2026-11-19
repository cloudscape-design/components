// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { getInputStylesCss } from '../internal/utils/input-styles';
import { InputProps } from './interfaces';

export function getInputStyles(style: InputProps['style']) {
  return getInputStylesCss(style);
}
