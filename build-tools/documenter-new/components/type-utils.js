// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.extractDeclaration =
  exports.extractValueDescriptions =
  exports.getDescription =
  exports.stringifyType =
  exports.unwrapNamespaceDeclaration =
  exports.isOptional =
    void 0;
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const typescript_1 = __importDefault(require('typescript'));
function isOptional(type) {
  if (!type.isUnionOrIntersection()) {
    return false;
  }
  return !!type.types.find(t => t.flags & typescript_1.default.TypeFlags.Undefined);
}
exports.isOptional = isOptional;
function unwrapNamespaceDeclaration(declaration) {
  if (!declaration) {
    return [];
  }
  const namespaceBlock = declaration
    .getChildren()
    .find(node => node.kind === typescript_1.default.SyntaxKind.ModuleBlock);
  if (!namespaceBlock) {
    return [];
  }
  const moduleContent = namespaceBlock
    .getChildren()
    .find(node => node.kind === typescript_1.default.SyntaxKind.SyntaxList);
  if (!moduleContent) {
    return [];
  }
  return moduleContent.getChildren();
}
exports.unwrapNamespaceDeclaration = unwrapNamespaceDeclaration;
function stripUndefined(typeString) {
  return typeString.replace(/\| undefined$/, '').trim();
}
function stringifyType(type, checker) {
  return stripUndefined(
    checker.typeToString(
      type,
      undefined,
      typescript_1.default.TypeFormatFlags.WriteArrayAsGenericType |
        typescript_1.default.TypeFormatFlags.UseFullyQualifiedType |
        typescript_1.default.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope
    )
  );
}
exports.stringifyType = stringifyType;
function expandTags(extraTags) {
  return extraTags.map(tag => ({
    name: tag.tagName.text,
    text: typescript_1.default.getTextOfJSDocComment(tag.comment),
  }));
}
function getDescription(docComment, declaration) {
  return {
    text: docComment.length > 0 ? typescript_1.default.displayPartsToString(docComment) : undefined,
    tags: expandTags(typescript_1.default.getJSDocTags(declaration)),
  };
}
exports.getDescription = getDescription;
function extractValueDescriptions(type, typeNode) {
  var _a;
  if (type.aliasSymbol) {
    // Traverse from "variant: ButtonProps.Variant" to "type Variant = ..."
    const aliasDeclaration = extractDeclaration(type.aliasSymbol);
    if (typescript_1.default.isTypeAliasDeclaration(aliasDeclaration)) {
      typeNode = aliasDeclaration.type;
    }
  }
  if (!typeNode) {
    return [];
  }
  const maybeList = typeNode.getChildren()[0];
  // based on similar code in typedoc
  // https://github.com/TypeStrong/typedoc/blob/6090b3e31471cea3728db1b03888bca5703b437e/src/lib/converter/symbols.ts#L406-L438
  if (maybeList.kind !== typescript_1.default.SyntaxKind.SyntaxList) {
    return [];
  }
  const rawComments = [];
  let memberIndex = 0;
  for (const child of maybeList.getChildren()) {
    const text = child.getFullText();
    if (text.includes('/**')) {
      rawComments[memberIndex] =
        ((_a = rawComments[memberIndex]) !== null && _a !== void 0 ? _a : '') + child.getFullText();
    }
    if (child.kind !== typescript_1.default.SyntaxKind.BarToken) {
      memberIndex++;
    }
  }
  // Array.from to fix sparse array
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array#array_methods_and_empty_slots
  return Array.from(rawComments).map(comment => {
    if (!comment) {
      return undefined;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const systemTags = Array.from(comment.matchAll(/@awsuiSystem\s+(\w+)/g), ([_, system]) => system);
    return systemTags.length > 0 ? { systemTags } : undefined;
  });
}
exports.extractValueDescriptions = extractValueDescriptions;
function extractDeclaration(symbol) {
  const declarations = symbol.getDeclarations();
  if (!declarations || declarations.length === 0) {
    throw new Error(`No declaration found for symbol: ${symbol.getName()}`);
  }
  if (declarations.length > 1) {
    throw new Error(`Multiple declarations found for symbol: ${symbol.getName()}`);
  }
  return declarations[0];
}
exports.extractDeclaration = extractDeclaration;
//# sourceMappingURL=type-utils.js.map
