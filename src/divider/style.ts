// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { SYSTEM } from '../internal/environment';
import { DividerProps } from './interfaces';

export function getDividerStyles(style: DividerProps['style']) {
  if (style?.root && SYSTEM === 'core') {
    return {
      borderColor: style.root.borderColor,
      borderWidth: style.root.borderWidth,
    };
  }
  return {};
}
