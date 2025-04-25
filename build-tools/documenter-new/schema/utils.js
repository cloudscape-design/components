// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.isTypeUndefined =
  exports.isTypeDefined =
  exports.excludeUndefinedTypeFromUnion =
  exports.getDeclarationSourceFilename =
  exports.isForwardRefDeclaration =
  exports.isOptionalDeclaration =
    void 0;
const types_1 = require('./types');
function isOptionalDeclaration(prop) {
  if (prop.flags.isOptional) {
    return true;
  }
  const type = prop.type;
  return type !== undefined && (0, types_1.isUnionType)(type) && type.types.find(isTypeUndefined) !== undefined;
}
exports.isOptionalDeclaration = isOptionalDeclaration;
function isForwardRefDeclaration({ type, name }) {
  var _a, _b;
  const isForwardRef =
    (0, types_1.isReferenceType)(type) && type.symbolFullyQualifiedName.endsWith('React.ForwardRefExoticComponent');
  const isParametrizedForwardRef = Boolean(
    (0, types_1.isReferenceType)(type) &&
      type.name === `${name}ForwardRefType` &&
      ((_b = (_a = type.reflection) === null || _a === void 0 ? void 0 : _a.signatures) === null || _b === void 0
        ? void 0
        : _b.some(({ name, type }) => {
            return (
              name === '__call' &&
              (0, types_1.isReferenceType)(type) &&
              type.symbolFullyQualifiedName.endsWith('JSX.Element')
            );
          }))
  );
  return isForwardRef || isParametrizedForwardRef;
}
exports.isForwardRefDeclaration = isForwardRefDeclaration;
function getDeclarationSourceFilename(declaration) {
  var _a, _b, _c;
  return (_c =
    (_b = (_a = declaration.sources) === null || _a === void 0 ? void 0 : _a[0].file) === null || _b === void 0
      ? void 0
      : _b.fullFileName) !== null && _c !== void 0
    ? _c
    : 'unknown location';
}
exports.getDeclarationSourceFilename = getDeclarationSourceFilename;
function excludeUndefinedTypeFromUnion(type) {
  return type.types.filter(isTypeDefined);
}
exports.excludeUndefinedTypeFromUnion = excludeUndefinedTypeFromUnion;
function isTypeDefined(type) {
  if (type && type.type === 'undefined') {
    return false;
  }
  if ((0, types_1.isIntrinsicType)(type) || (0, types_1.isTypeParameter)(type)) {
    return type.name !== 'undefined';
  }
  if ((0, types_1.isUnionType)(type)) {
    return excludeUndefinedTypeFromUnion(type).length > 0;
  }
  return true;
}
exports.isTypeDefined = isTypeDefined;
function isTypeUndefined(type) {
  return !isTypeDefined(type);
}
exports.isTypeUndefined = isTypeUndefined;
//# sourceMappingURL=utils.js.map
