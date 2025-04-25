// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import ts from 'typescript';
export interface ExtractedDescription {
  text: string | undefined;
  tags: Array<{
    name: string;
    text: string | undefined;
  }>;
}
export interface ExpandedProp {
  name: string;
  type: string;
  isOptional: boolean;
  rawType: ts.Type;
  rawTypeNode: ts.TypeNode | undefined;
  description: ExtractedDescription;
}
export declare function extractDefaultValues(exportSymbol: ts.Symbol, checker: ts.TypeChecker): Record<string, string>;
export declare function extractProps(propsSymbol: ts.Symbol, checker: ts.TypeChecker): ExpandedProp[];
export declare function extractTypes(
  propsSymbol: ts.Symbol,
  checker: ts.TypeChecker
): (ts.InterfaceDeclaration | ts.TypeAliasDeclaration)[];
export declare function extractFunctions(
  componentName: string,
  typeNode: ts.Node | undefined,
  checker: ts.TypeChecker
): ExpandedProp[];
export declare function extractExports(
  componentName: string,
  exportSymbols: ts.Symbol[],
  checker: ts.TypeChecker,
  extraExports: Record<string, Array<string>>
): {
  componentSymbol: ts.Symbol;
  propsSymbol: ts.Symbol;
};
