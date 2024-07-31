// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { InternalVariant } from './interfaces';

export function variantSupportsDescription(variant: InternalVariant) {
  return ['container', 'default', 'footer'].includes(variant);
}

export function variantSupportsActions(variant: InternalVariant) {
  return ['container', 'compact', 'default'].includes(variant);
}

export function variantSupportsInfoLink(variant: InternalVariant) {
  return ['container', 'compact'].includes(variant);
}
