// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import ts from 'typescript';

import type { ExtractedDescription } from './extractor';
import type { ComponentDefinition } from './interfaces';
export declare function buildComponentDefinition(
  name: string,
  dashCaseName: string,
  propsSymbol: ts.Symbol,
  defaultValues: Record<string, string>,
  componentDescription: ExtractedDescription,
  checker: ts.TypeChecker
): ComponentDefinition;
