// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import { PropertyFilterProps } from '@cloudscape-design/components/property-filter';

export function isTokenGroup(
  tokenOrGroup: PropertyFilterProps.Token | PropertyFilterProps.TokenGroup
): tokenOrGroup is PropertyFilterProps.TokenGroup {
  const key: keyof PropertyFilterProps.TokenGroup = 'operation';
  return key in tokenOrGroup;
}

export function isToken(
  tokenOrGroup: PropertyFilterProps.Token | PropertyFilterProps.TokenGroup
): tokenOrGroup is PropertyFilterProps.Token {
  const key: keyof PropertyFilterProps.Token = 'operator';
  return key in tokenOrGroup;
}
