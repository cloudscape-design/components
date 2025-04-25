// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import type { ComponentDefinition } from './interfaces';
export interface DocumenterOptions {
  tsconfigPath: string;
  publicFilesGlob: string;
  extraExports?: Record<string, Array<string>>;
}
export interface WriteOptions {
  outDir: string;
}
export declare function writeComponentsDocumentation({ outDir, ...options }: WriteOptions & DocumenterOptions): void;
export declare function documentComponents(options: DocumenterOptions): Array<ComponentDefinition>;
