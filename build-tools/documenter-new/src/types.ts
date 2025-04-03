// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
export interface ComponentDefinition {
  name: string;
  /** @deprecated */
  releaseStatus: string;
  /** @deprecated */
  version?: string;
  /** @deprecated */
  description?: string;
  properties: ComponentProperty[];
  regions: ComponentRegion[];
  functions: ComponentFunction[];
  events: EventHandler[];
}

export interface ComponentProperty {
  name: string;
  description?: string;
  optional: boolean;
  type: string;
  inlineType?: TypeDefinition;
  defaultValue?: string;
  analyticsTag?: string;
  deprecatedTag?: string;
  visualRefreshTag?: string;
  i18nTag?: true | undefined;
  systemTags?: Array<string>;
}

export interface ComponentRegion {
  name: string;
  description?: string;
  displayName?: string;
  isDefault: boolean;
  deprecatedTag?: string;
  visualRefreshTag?: string;
  i18nTag?: true | undefined;
}

export interface ComponentFunction {
  name: string;
  description?: string;
  parameters: FunctionParameter[];
  returnType: string;
}

type TypeDefinition = ObjectDefinition | FunctionDefinition | UnionTypeDefinition;

export interface ObjectDefinition {
  name: string;
  type: 'object';
  properties: ObjectDefinitionProperty[];
}

export interface ObjectDefinitionProperty {
  name: string;
  optional: boolean;
  type: string;
}

export interface FunctionDefinition {
  name: string;
  type: 'function';
  returnType: string;
  parameters: FunctionParameter[];
}

export interface FunctionParameter {
  name: string;
  type: string;
}

export interface UnionTypeDefinition {
  name: string;
  type: 'union';
  values: string[];
}

export interface EventHandler {
  name: string;
  description?: string;
  detailType?: string;
  detailInlineType?: TypeDefinition;
  cancelable: boolean;
  deprecatedTag?: string;
}
