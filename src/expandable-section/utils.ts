// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { InternalVariant } from './interfaces';

const variantIsOneOf = (variant: InternalVariant, oneOf: InternalVariant[]) => oneOf.includes(variant);

export function variantSupportsDescription(variant: InternalVariant) {
  return variantIsOneOf(variant, ['container', 'default', 'footer', 'inline']);
}

export function variantSupportsActions(variant: InternalVariant) {
  return variantIsOneOf(variant, ['container', 'compact', 'default', 'inline']);
}

export function variantSupportsInfoLink(variant: InternalVariant) {
  return variantIsOneOf(variant, ['container', 'compact']);
}

export function variantRequiresActionsDivider(variant: InternalVariant) {
  return variantIsOneOf(variant, ['default', 'inline']);
}
