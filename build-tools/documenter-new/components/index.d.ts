// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import type { ComponentDefinition } from './interfaces';
export interface DocumenterOptions {
  extraExports?: Record<string, Array<string>>;
}
export declare function documentComponents(
  tsconfigPath: string,
  publicFilesGlob: string,
  additionalInputFilePaths?: Array<string>,
  options?: DocumenterOptions
): Array<ComponentDefinition>;
