// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { DeclarationReflection, Type, UnionType } from 'typedoc/dist/lib/models';
export declare function isOptionalDeclaration(prop: DeclarationReflection): boolean;
export declare function isForwardRefDeclaration({ type, name }: DeclarationReflection): boolean;
export declare function getDeclarationSourceFilename(declaration: DeclarationReflection): string;
export declare function excludeUndefinedTypeFromUnion(type: UnionType): Type[];
export declare function isTypeDefined(type?: Type): boolean;
export declare function isTypeUndefined(type?: Type): boolean;
