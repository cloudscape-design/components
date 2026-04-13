// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { SYSTEM } from '../internal/environment';
import { SkeletonProps } from './interfaces';

export function getSkeletonStyles(style: SkeletonProps['style']) {
  let properties = {};

  if (style?.root && SYSTEM === 'core') {
    properties = {
      background: style.root.background,
      borderRadius: style.root.borderRadius,
    };
  }

  return properties;
}
