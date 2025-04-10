// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { DeclarationReflection, Reflection, SignatureReflection, Type } from 'typedoc/dist/lib/models';
export declare function buildFullName(reflection: Reflection): string;
export declare function buildCallSignature(signature: SignatureReflection, enclose?: boolean): string;
export declare function buildType(type?: Type, enclose?: boolean): string;
export declare function buildNodeDescription(node: Reflection): string | undefined;
export declare function buildDeclarationDescription(declaration: DeclarationReflection): string | undefined;
