// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.getObjectDefinition = void 0;
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const typescript_1 = __importDefault(require('typescript'));
const type_utils_1 = require('./type-utils');
function isArrayType(type) {
  const symbol = type.getSymbol();
  if (!symbol) {
    return false;
  }
  return symbol.getName() === 'Array' || symbol.getName() === 'ReadonlyArray';
}
function getObjectDefinition(type, rawType, rawTypeNode, checker) {
  const realType = rawType.getNonNullableType();
  const realTypeName = (0, type_utils_1.stringifyType)(realType, checker);
  if (
    realType.flags & typescript_1.default.TypeFlags.String ||
    realType.flags & typescript_1.default.TypeFlags.StringLiteral ||
    realType.flags & typescript_1.default.TypeFlags.Boolean ||
    realType.flags & typescript_1.default.TypeFlags.Number ||
    isArrayType(realType) ||
    realTypeName === 'HTMLElement'
  ) {
    // do not expand built-in Javascript methods or primitive values
    return { type };
  }
  if (realType.isUnionOrIntersection()) {
    return getUnionTypeDefinition(realTypeName, realType, rawTypeNode, checker);
  }
  if (realType.getProperties().length > 0) {
    return {
      type: type,
      inlineType: {
        name: realTypeName,
        type: 'object',
        properties: realType
          .getProperties()
          .map(prop => {
            const propType = checker.getTypeAtLocation((0, type_utils_1.extractDeclaration)(prop));
            return {
              name: prop.getName(),
              type: (0, type_utils_1.stringifyType)(propType, checker),
              optional: (0, type_utils_1.isOptional)(propType),
            };
          })
          .sort((a, b) => a.name.localeCompare(b.name)),
      },
    };
  }
  if (realType.getCallSignatures().length > 0) {
    if (realType.getCallSignatures().length > 1) {
      throw new Error('Multiple call signatures are not supported');
    }
    const signature = realType.getCallSignatures()[0];
    return {
      type,
      inlineType: {
        name: realTypeName,
        type: 'function',
        returnType: (0, type_utils_1.stringifyType)(signature.getReturnType(), checker),
        parameters: signature.getParameters().map(param => {
          const paramType = checker.getTypeAtLocation((0, type_utils_1.extractDeclaration)(param));
          return {
            name: param.getName(),
            type: (0, type_utils_1.stringifyType)(paramType, checker),
          };
        }),
      },
    };
  }
  return { type };
}
exports.getObjectDefinition = getObjectDefinition;
function getPrimitiveType(type) {
  if (type.types.every(subtype => subtype.isStringLiteral())) {
    return 'string';
  }
  if (type.types.every(subtype => subtype.isNumberLiteral())) {
    return 'number';
  }
  return undefined;
}
function getUnionTypeDefinition(realTypeName, realType, typeNode, checker) {
  const valueDescriptions = (0, type_utils_1.extractValueDescriptions)(realType, typeNode);
  const primitiveType = getPrimitiveType(realType);
  const values = realType.types.map(subtype =>
    primitiveType ? subtype.value.toString() : (0, type_utils_1.stringifyType)(subtype, checker)
  );
  return {
    type: primitiveType !== null && primitiveType !== void 0 ? primitiveType : realTypeName,
    inlineType: {
      name: realTypeName,
      type: 'union',
      valueDescriptions: valueDescriptions.length > 0 ? zipValueDescriptions(values, valueDescriptions) : undefined,
      values: values,
    },
  };
}
function zipValueDescriptions(values, descriptions) {
  const descriptionsMap = {};
  values.forEach((value, index) => {
    const description = descriptions[index];
    if (description) {
      descriptionsMap[value] = description;
    }
  });
  return descriptionsMap;
}
//# sourceMappingURL=object-definition.js.map
