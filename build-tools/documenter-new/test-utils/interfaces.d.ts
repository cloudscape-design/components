// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
export interface Parameter {
  name: string;
  typeName?: string;
  description?: string;
  flags: {
    isOptional?: boolean;
  };
  defaultValue?: string;
}
interface TypeArgument {
  name: string;
  type: string;
}
export interface TestUtilMethod {
  name: string;
  description?: string;
  returnType?: {
    name: string;
    type: string;
    typeArguments: Array<TypeArgument>;
  };
  parameters: Array<Parameter>;
  inheritedFrom?: {
    name: string;
  };
}
export interface TestUtilsDoc {
  name: string;
  methods: Array<TestUtilMethod>;
}
export {};
