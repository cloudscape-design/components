// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.buildDeclarationDescription =
  exports.buildNodeDescription =
  exports.buildType =
  exports.buildCallSignature =
  exports.buildFullName =
    void 0;
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const models_1 = require('typedoc/dist/lib/models');
const types_1 = require('./types');
const utils_1 = require('./utils');
function buildFullName(reflection) {
  const result = [reflection.name];
  while (reflection.parent && reflection.parent.kind !== models_1.ReflectionKind.Module) {
    reflection = reflection.parent;
    result.push(reflection.name);
  }
  return result.reverse().join('.');
}
exports.buildFullName = buildFullName;
function buildCallSignature(signature, enclose = false) {
  var _a;
  const parameters =
    (_a = signature.parameters) === null || _a === void 0
      ? void 0
      : _a.map(parameter => `${parameter.name}: ${buildType(parameter.type)}`).join(', ');
  const call = `(${parameters !== null && parameters !== void 0 ? parameters : ''}) => ${buildType(signature.type)}`;
  return enclose ? `(${call})` : call;
}
exports.buildCallSignature = buildCallSignature;
function buildType(type, enclose = false) {
  var _a;
  if (type) {
    if ((0, types_1.isReflectionType)(type)) {
      const reflected = type.declaration;
      if (reflected.signatures && reflected.signatures[0]) {
        return buildCallSignature(reflected.signatures[0], enclose);
      }
      return buildType(type.declaration.type);
    }
    if ((0, types_1.isReferenceType)(type)) {
      let name = (_a = type.reflection && buildFullName(type.reflection)) !== null && _a !== void 0 ? _a : type.name;
      if (type.typeArguments) {
        name += `<${type.typeArguments.map(type => buildType(type)).join(', ')}>`;
      }
      return name;
    }
    if ((0, types_1.isArrayType)(type)) {
      const elementType = buildType(type.elementType);
      return `Array<${elementType}>`;
    }
    if ((0, types_1.isIntrinsicType)(type) || (0, types_1.isTypeParameter)(type)) {
      return type.name;
    }
    if ((0, types_1.isStringLiteralType)(type)) {
      return JSON.stringify(type.value);
    }
    if ((0, types_1.isUnionType)(type)) {
      const defined = (0, utils_1.excludeUndefinedTypeFromUnion)(type);
      return defined
        .map(type => buildType(type, defined.length > 1))
        .sort()
        .join(' | ');
    }
    if ((0, types_1.isTupleType)(type)) {
      return `[${[type.elements.map(posType => buildType(posType))].join(', ')}]`;
    }
    return type.type;
  }
  return 'unknown';
}
exports.buildType = buildType;
function buildNodeDescription(node) {
  if (node.comment) {
    return node.comment.text ? `${node.comment.shortText}\n${node.comment.text}` : node.comment.shortText;
  }
}
exports.buildNodeDescription = buildNodeDescription;
function buildDeclarationDescription(declaration) {
  var _a;
  if (declaration.comment) {
    return buildNodeDescription(declaration);
  }
  const signatureWithComment =
    (_a = declaration.signatures) === null || _a === void 0 ? void 0 : _a.find(signature => signature.comment);
  if (signatureWithComment) {
    return buildNodeDescription(signatureWithComment);
  }
}
exports.buildDeclarationDescription = buildDeclarationDescription;
//# sourceMappingURL=code.js.map
