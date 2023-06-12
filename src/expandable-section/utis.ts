// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ExpandableSectionProps } from './interfaces';

export function variantSupportsDescription(variant: ExpandableSectionProps.Variant) {
  return variant === 'container' || variant === 'default';
}
