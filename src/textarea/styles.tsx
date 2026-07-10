// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { getInputStylesCss } from '../internal/utils/input-styles';
import { TextareaProps } from './interfaces';

export function getTextareaStyles(style: TextareaProps['style']) {
  return getInputStylesCss(style, true);
}
