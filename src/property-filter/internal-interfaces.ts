// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {
  PropertyFilterOperation,
  PropertyFilterOperator,
  PropertyFilterOperatorForm,
  PropertyFilterProperty,
  PropertyFilterTokenType,
} from '@cloudscape-design/collection-hooks';

import { ComparisonOperator, PropertyFilterTextOperatorExtended } from './interfaces';

// Utility types

export interface InternalFilteringProperty<TokenValue = any> {
  propertyKey: string;
  propertyLabel: string;
  groupValuesLabel: string;
  propertyGroup?: string;
  operators: readonly PropertyFilterOperator[];
  defaultOperator: PropertyFilterOperator;
  getTokenType: (operator?: PropertyFilterOperator) => PropertyFilterTokenType;
  getValueFormatter: (operator?: PropertyFilterOperator) => null | ((value: any) => string);
  getValueFormRenderer: (operator?: PropertyFilterOperator) => null | PropertyFilterOperatorForm<TokenValue>;
  getOperatorDescription: (operator?: PropertyFilterOperator) => string | null;
  // Original property used in callbacks.
  externalProperty: PropertyFilterProperty;
}

export interface InternalFilteringOption {
  property: null | InternalFilteringProperty;
  value: string;
  label: string;
  tags?: ReadonlyArray<string>;
  filteringTags?: ReadonlyArray<string>;
}

export interface InternalFreeTextFiltering {
  disabled: boolean;
  operators: readonly (PropertyFilterOperator | PropertyFilterTextOperatorExtended)[];
  defaultOperator: PropertyFilterOperator;
  getOperatorDescription: (operator: PropertyFilterOperator) => string | null;
}

export interface InternalToken<TokenValue = any> {
  standaloneIndex?: number;
  property: null | InternalFilteringProperty<TokenValue>;
  operator: PropertyFilterOperator;
  value: TokenValue;
}

export interface InternalTokenGroup<TokenValue = any> {
  operation: PropertyFilterOperation;
  tokens: readonly (InternalToken<TokenValue> | InternalTokenGroup<TokenValue>)[];
}

export type InternalQuery = InternalTokenGroup;

export type ParsedText =
  | { step: 'property'; property: InternalFilteringProperty; operator: ComparisonOperator; value: string }
  | { step: 'operator'; property: InternalFilteringProperty; operatorPrefix: string }
  | { step: 'free-text'; operator?: ComparisonOperator; value: string };
