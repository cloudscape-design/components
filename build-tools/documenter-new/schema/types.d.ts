// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import {
  ArrayType,
  IntrinsicType,
  ReferenceType,
  ReflectionType,
  StringLiteralType,
  TupleType,
  Type,
  TypeParameterType,
  UnionType,
} from 'typedoc/dist/lib/models';
export declare function isStringLiteralType(type?: Type): type is StringLiteralType;
export declare function isReferenceType(type?: Type): type is ReferenceType;
export declare function isIntrinsicType(type?: Type): type is IntrinsicType;
export declare function isReflectionType(type?: Type): type is ReflectionType;
export declare function isArrayType(type?: Type): type is ArrayType;
export declare function isUnionType(type?: Type): type is UnionType;
export declare function isTypeParameter(type?: Type): type is TypeParameterType;
export declare function isTupleType(type?: Type): type is TupleType;
