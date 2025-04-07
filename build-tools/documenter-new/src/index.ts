// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { pascalCase } from 'change-case';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { matcher } from 'micromatch';
import pathe from 'pathe';

import { buildComponentDefinition } from './component-definition';
import { extractDefaultValues, extractExports, extractFunctions, extractProps } from './extractor';
import type { ComponentDefinition } from './interfaces';
import { bootstrapTypescriptProject } from './typescript';

function componentNameFromPath(componentPath: string) {
  const directoryName = pathe.dirname(componentPath);
  return pascalCase(pathe.basename(directoryName));
}

interface DocumenterOptions {
  extraExports?: Record<string, Array<string>>;
}

export function documentComponents(
  tsconfigPath: string,
  publicFilesGlob: string,
  // deprecated, now unused
  additionalInputFilePaths?: Array<string>,
  options?: DocumenterOptions
): Array<ComponentDefinition> {
  const program = bootstrapTypescriptProject(tsconfigPath);
  const checker = program.getTypeChecker();

  const isMatch = matcher(pathe.resolve(publicFilesGlob));

  return program
    .getSourceFiles()
    .filter(file => isMatch(file.fileName))
    .map(sourceFile => {
      const moduleSymbol = checker.getSymbolAtLocation(sourceFile);
      const name = componentNameFromPath(sourceFile.fileName);

      if (!moduleSymbol) {
        throw new Error(`Unable to resolve module: ${sourceFile.fileName}`);
      }
      const exportSymbols = checker.getExportsOfModule(moduleSymbol);
      const { propsSymbol, componentSymbol } = extractExports(
        name,
        exportSymbols,
        checker,
        options?.extraExports ?? {}
      );
      const props = extractProps(propsSymbol, checker);
      const functions = extractFunctions(propsSymbol, checker);
      const defaultValues = extractDefaultValues(componentSymbol, checker);

      return buildComponentDefinition(name, props, functions, defaultValues, checker);
    });
}
