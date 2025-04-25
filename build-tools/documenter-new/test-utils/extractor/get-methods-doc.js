// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.getMethodsDoc = void 0;
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const typedoc_1 = require('typedoc');
const schema_1 = __importDefault(require('../../schema'));
function getName(methodSignature) {
  return methodSignature.name;
}
// TODO: Extend and reuse existing utils
function getReturnType(methodSignature) {
  // Error is check in calling function
  // TODO: Get right type. "Type" does e.g. not have .name
  const signatureReturnType = methodSignature.signatures[0].type;
  if (signatureReturnType === undefined) {
    throw Error('expected return type to be defined');
  }
  const returnType = {
    name: signatureReturnType.name,
    type: signatureReturnType.type,
    typeArguments: getTypeArguments(signatureReturnType.typeArguments),
  };
  // TODO: Reuse schema.code.buildType
  if (schema_1.default.types.isArrayType(signatureReturnType)) {
    returnType.name = signatureReturnType.type;
    returnType.type = signatureReturnType.elementType.type;
    returnType.typeArguments = getTypeArguments(signatureReturnType.elementType.typeArguments.constraint);
  }
  // TODO: Try to reuse buildUnionTypeDefinition
  if (schema_1.default.types.isUnionType(signatureReturnType)) {
    // TODO: This doesn't work well with the website currently
    const returnTypeNames = signatureReturnType.types.map(t => t.name).join(' | ');
    returnType.name = returnTypeNames;
  }
  return returnType;
}
function getTypeArguments(typeArguments) {
  if (typeArguments && typeArguments.map) {
    return typeArguments.map(arg => ({ name: arg.name, type: arg.type }));
  }
}
// TODO: Reuse existing functionality in components
function getParameters(methodSignature) {
  const parameters = methodSignature.signatures[0].parameters;
  if (!parameters) {
    return [];
  }
  const parametersDoc = parameters.map(param => {
    var _a;
    return {
      name: param.name,
      typeName: (_a = param.type) === null || _a === void 0 ? void 0 : _a.name,
      description: schema_1.default.code.buildNodeDescription(param),
      flags: { isOptional: param.flags.isOptional },
      defaultValue: param.defaultValue ? param.defaultValue.trim() : undefined,
    };
  });
  return parametersDoc;
}
function getInheritedFrom(methodSignature) {
  let inheritedFrom = undefined;
  if (methodSignature.inheritedFrom) {
    inheritedFrom = {
      name: methodSignature.inheritedFrom.name,
    };
  }
  return inheritedFrom;
}
function getMethodsDoc(childReflections = []) {
  const methodReflections = childReflections.filter(child => {
    const isPublic = !child.flags.isPrivate && !child.flags.isProtected;
    const isMethod = child.kind === typedoc_1.ReflectionKind.Method;
    return isPublic && isMethod;
  });
  // TODO: Try to reuse existing functionality from components
  const testUtilMethodsDocs = methodReflections.map(methodSignature => {
    if (!methodSignature.signatures) {
      throw new Error('Expected method to have signatures');
    }
    const outMethod = {};
    outMethod.name = getName(methodSignature);
    outMethod.description = schema_1.default.code.buildDeclarationDescription(methodSignature);
    outMethod.returnType = getReturnType(methodSignature);
    outMethod.parameters = getParameters(methodSignature);
    outMethod.inheritedFrom = getInheritedFrom(methodSignature);
    return outMethod;
  });
  return testUtilMethodsDocs;
}
exports.getMethodsDoc = getMethodsDoc;
//# sourceMappingURL=get-methods-doc.js.map
