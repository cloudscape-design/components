// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import path from 'node:path';

import { pascalCase } from 'change-case';
import glob from 'glob';
import ts from 'typescript';

import { buildComponentDefinition, type ExpandedProp } from './component-definition.ts';
import { extractDefaultValues, validateExports } from './extractor.ts';
import { isOptional, stringifyType, unwrapNamespaceDeclaration } from './type-utils.ts';
import type { ComponentDefinition } from './types.ts';

/**
 * TODO
 * 1. ~Inherited props~
 * 2. ~Strip undefined, render optional flag~
 * 3. ~Render ref functions~
 * 4. ~Render inline detail type~
 * 5. ~Render enum values~
 * 6. ~Render detail types~
 * 4. ~Detect default values~
 * 1. Resolve type names nicer - todo later
 */

function loadTSConfig(tsconfigPath: string): ts.ParsedCommandLine {
  const configFile = ts.readConfigFile(tsconfigPath, ts.sys.readFile);
  if (configFile.error) {
    throw new Error('Failed to read tsconfig.json');
  }
  const config = ts.parseJsonConfigFileContent(configFile.config, ts.sys, path.dirname(tsconfigPath));
  if (config.errors.length > 0) {
    throw new Error('Failed to parse tsconfig.json');
  }
  // suppress warning
  config.options.incremental = false;
  return config;
}

// TODO future feature
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function extractMemberComments(type: ts.Type) {
  function unwrapUndefined(type: ts.Type) {
    if (!type || !type.isUnion()) {
      return type;
    }
    return type.types.find(t => !(t.flags & ts.TypeFlags.Undefined))?.aliasSymbol;
  }
  const actualType = type.aliasSymbol ?? unwrapUndefined(type.origin);
  if (!actualType) {
    return [];
  }
  const maybeList = actualType.getDeclarations()[0].type.getChildren()[0];
  // https://github.com/TypeStrong/typedoc/blob/6090b3e31471cea3728db1b03888bca5703b437e/src/lib/converter/symbols.ts#L406-L438
  if (maybeList.kind !== ts.SyntaxKind.SyntaxList) {
    return [];
  }
  const members = [];
  let memberIndex = 0;
  for (const child of maybeList.getChildren()) {
    const text = child.getFullText();
    if (text.includes('/**')) {
      members[memberIndex] = (members[memberIndex] ?? '') + child.getFullText();
    }

    if (child.kind !== ts.SyntaxKind.BarToken) {
      ++memberIndex;
    }
  }
  return members;
}

function expandTags(extraTags: ReadonlyArray<ts.JSDocTag>) {
  return extraTags.map(tag => ({
    name: tag.tagName.text,
    text: ts.getTextOfJSDocComment(tag.comment),
  }));
}

function extractProps(propsSymbol: ts.Symbol, checker: ts.TypeChecker) {
  const exportType = checker.getDeclaredTypeOfSymbol(propsSymbol);

  return exportType
    .getProperties()
    .map((value): ExpandedProp => {
      const declaration = value.getDeclarations()[0];
      const type = checker.getTypeAtLocation(declaration);
      // const unwrappedType = unwrapUndefined(type);
      return {
        name: value.name,
        type: stringifyType(type, checker),
        rawType: type,
        isOptional: isOptional(type),
        description: {
          text: ts.displayPartsToString(value.getDocumentationComment(checker)),
          tags: expandTags(ts.getJSDocTags(declaration)),
        },
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

function extractFunctions(propsSymbol: ts.Symbol, checker: ts.TypeChecker) {
  const namespaceDeclaration = checker
    .getDeclaredTypeOfSymbol(propsSymbol)
    .getSymbol()
    ?.getDeclarations()
    ?.find(decl => decl.kind === ts.SyntaxKind.ModuleDeclaration);
  if (!namespaceDeclaration) {
    return [];
  }
  const refType = unwrapNamespaceDeclaration(namespaceDeclaration)
    .map(child => checker.getTypeAtLocation(child))
    .find(type => (type.getSymbol() ?? type.aliasSymbol)?.getName() === 'Ref');

  if (!refType) {
    return [];
  }
  return refType
    .getProperties()
    .map((value): ExpandedProp => {
      const declaration = value.getDeclarations()[0];
      const type = checker.getTypeAtLocation(declaration);
      return {
        name: value.name,
        type: stringifyType(type, checker),
        rawType: type,
        isOptional: isOptional(type),
        description: {
          text: ts.displayPartsToString(value.getDocumentationComment(checker)),
          tags: expandTags(ts.getJSDocTags(declaration)),
        },
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

function printDiagnostics(diagnostics: readonly ts.Diagnostic[]): void {
  for (const diagnostic of diagnostics) {
    const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
    if (diagnostic.file) {
      const { line, character } = ts.getLineAndCharacterOfPosition(diagnostic.file, diagnostic.start!);
      console.error(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
    } else {
      console.error(message);
    }
  }
}

function componentNameFromPath(componentPath: string) {
  const directoryName = path.dirname(componentPath);
  return pascalCase(path.basename(directoryName));
}

export function documentComponents(tsconfigPath: string, componentsGlob: string): Array<ComponentDefinition> {
  const tsconfig = loadTSConfig(tsconfigPath);
  const program = ts.createProgram(tsconfig.fileNames, tsconfig.options);
  const checker = program.getTypeChecker();

  const diagnostics = ts.getPreEmitDiagnostics(program);
  if (diagnostics.length > 0) {
    printDiagnostics(diagnostics);
    throw new Error('Compilation failed');
  }

  return glob.sync(componentsGlob).map(componentPath => {
    const name = componentNameFromPath(componentPath);
    const sourceFile = program.getSourceFile(componentPath);
    const moduleSymbol = checker.getSymbolAtLocation(sourceFile);

    if (!moduleSymbol) {
      throw new Error(`Unable to resolve module: ${componentPath}`);
    }
    const exportSymbols = checker.getExportsOfModule(moduleSymbol);
    validateExports(name, exportSymbols, checker);
    const propsSymbol = exportSymbols.find(symbol => symbol.getName() === `${name}Props`);
    const defaultExport = exportSymbols.find(symbol => symbol.getName() === 'default')!;
    const props = extractProps(propsSymbol, checker);
    const defaultValues = extractDefaultValues(defaultExport, checker);

    const functions = extractFunctions(propsSymbol, checker);
    return buildComponentDefinition(name, props, functions, defaultValues, checker);
  });
}
