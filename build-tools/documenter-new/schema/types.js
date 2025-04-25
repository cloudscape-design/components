// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.isTupleType =
  exports.isTypeParameter =
  exports.isUnionType =
  exports.isArrayType =
  exports.isReflectionType =
  exports.isIntrinsicType =
  exports.isReferenceType =
  exports.isStringLiteralType =
    void 0;
function isStringLiteralType(type) {
  return type !== undefined && type.type === 'stringLiteral';
}
exports.isStringLiteralType = isStringLiteralType;
function isReferenceType(type) {
  return type !== undefined && type.type === 'reference';
}
exports.isReferenceType = isReferenceType;
function isIntrinsicType(type) {
  return type !== undefined && type.type === 'intrinsic';
}
exports.isIntrinsicType = isIntrinsicType;
function isReflectionType(type) {
  return type !== undefined && type.type === 'reflection';
}
exports.isReflectionType = isReflectionType;
function isArrayType(type) {
  return type !== undefined && type.type === 'array';
}
exports.isArrayType = isArrayType;
function isUnionType(type) {
  return type !== undefined && type.type === 'union';
}
exports.isUnionType = isUnionType;
function isTypeParameter(type) {
  return type !== undefined && type.type === 'typeParameter';
}
exports.isTypeParameter = isTypeParameter;
function isTupleType(type) {
  return type !== undefined && type.type === 'tuple';
}
exports.isTupleType = isTupleType;
//# sourceMappingURL=types.js.map
