// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import ts from 'typescript';

import { ValueDescription } from './interfaces';
export declare function isOptional(type: ts.Type): boolean;
export declare function unwrapNamespaceDeclaration(declaration: ts.Declaration | undefined): ts.Node[];
export declare function stringifyType(type: ts.Type, checker: ts.TypeChecker): string;
export declare function getDescription(
  docComment: Array<ts.SymbolDisplayPart>,
  declaration: ts.Node
): {
  text: string | undefined;
  tags: {
    name: string;
    text: string | undefined;
  }[];
};
export declare function extractValueDescriptions(
  type: ts.UnionOrIntersectionType,
  typeNode: ts.TypeNode | undefined
): (ValueDescription | undefined)[];
export declare function extractDeclaration(symbol: ts.Symbol): ts.Declaration;
