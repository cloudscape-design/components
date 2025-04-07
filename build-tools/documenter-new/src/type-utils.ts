// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import ts from 'typescript';

export function isOptional(type: ts.Type) {
  if (!type.isUnionOrIntersection()) {
    return false;
  }
  return !!type.types.find(t => t.flags & ts.TypeFlags.Undefined);
}

export function unwrapNamespaceDeclaration(declaration: ts.Declaration | undefined) {
  if (!declaration) {
    return [];
  }
  const namespaceBlock = declaration.getChildren().find(node => node.kind === ts.SyntaxKind.ModuleBlock);
  if (!namespaceBlock) {
    return [];
  }
  const moduleContent = namespaceBlock.getChildren().find(node => node.kind === ts.SyntaxKind.SyntaxList);
  if (!moduleContent) {
    return [];
  }
  return moduleContent.getChildren();
}

function stripUndefined(typeString: string) {
  return typeString.replace(/\| undefined$/, '').trim();
}

export function stringifyType(type: ts.Type, checker: ts.TypeChecker) {
  return stripUndefined(
    checker.typeToString(
      type,
      undefined,
      ts.TypeFormatFlags.WriteArrayAsGenericType |
        ts.TypeFormatFlags.UseFullyQualifiedType |
        ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope
    )
  );
}

function expandTags(extraTags: ReadonlyArray<ts.JSDocTag>) {
  return extraTags.map(tag => ({
    name: tag.tagName.text,
    text: ts.getTextOfJSDocComment(tag.comment),
  }));
}

export function getDescription(docComment: Array<ts.SymbolDisplayPart>, declaration: ts.Node) {
  return {
    text: docComment.length > 0 ? ts.displayPartsToString(docComment) : undefined,
    tags: expandTags(ts.getJSDocTags(declaration)),
  };
}

export function extractDeclaration(symbol: ts.Symbol) {
  const declarations = symbol.getDeclarations();
  if (!declarations || declarations.length === 0) {
    throw new Error(`No declaration found for symbol: ${symbol.getName()}`);
  }
  if (declarations.length > 1) {
    throw new Error(`Multiple declarations found for symbol: ${symbol.getName()}`);
  }
  return declarations[0];
}
