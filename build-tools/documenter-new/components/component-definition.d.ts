// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import ts from 'typescript';

import type { ExpandedProp, ExtractedDescription } from './extractor';
import type { ComponentDefinition } from './interfaces';
export declare function buildComponentDefinition(
  name: string,
  props: Array<ExpandedProp>,
  functions: Array<ExpandedProp>,
  defaultValues: Record<string, string>,
  componentDescription: ExtractedDescription,
  checker: ts.TypeChecker
): ComponentDefinition;
