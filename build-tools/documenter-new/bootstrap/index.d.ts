// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ProjectReflection, TypeDocAndTSOptions } from 'typedoc';
export declare function bootstrapProject(
  options: Partial<TypeDocAndTSOptions>,
  filteringGlob?: string,
  additionalInputFilePaths?: string[]
): ProjectReflection;
