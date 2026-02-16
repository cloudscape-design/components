// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { getInputStylesCss } from '../internal/utils/input-styles';
import { TextFilterProps } from './interfaces';

export function getTextFilterStyles(style: TextFilterProps['style']) {
  return getInputStylesCss(style);
}
