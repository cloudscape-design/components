// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import path from 'node:path';

import ts from 'typescript';

interface ExportedValue {
  name: string;
  type: string;
  members?: string[];
}

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

function unwrapUndefined(type: ts.Type) {
  if (!type || !type.isUnion()) {
    return type;
  }
  return type.types.find(t => !(t.flags & ts.TypeFlags.Undefined))?.aliasSymbol;
}

function extractMemberComments(type: ts.Type) {
  const actualType = type.aliasSymbol ?? unwrapUndefined(type.origin);
  // TODO support .origin prop
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

function expandType(name: ts.__String, type: ts.Type) {
  if (type.isUnionOrIntersection()) {
    if (name === 'variant') {
      debugger;
    }
    const comments = extractMemberComments(type);

    return type.types
      .filter(t => {
        return !(t.flags & ts.TypeFlags.Undefined);
      })
      .map((t, index) => {
        return {
          name: checker.typeToString(t),
          description: comments[index],
        };
      });
  }
  return {};
}

function extractExports(sourceFile: ts.SourceFile, checker: ts.TypeChecker): ExportedValue[] {
  const exports: ExportedValue[] = [];
  const moduleSymbol = checker.getSymbolAtLocation(sourceFile);

  if (!moduleSymbol) {
    throw new Error(`Unable to resolve module: ${sourceFile.fileName}`);
  }
  const exportSymbols = checker.getExportsOfModule(moduleSymbol);
  for (const symbol of exportSymbols) {
    const name = symbol.getName();

    const symbolType = checker.getDeclaredTypeOfSymbol(symbol);

    if (name.endsWith('Props')) {
      const members = [];
      symbolType.getSymbol().members.forEach((value, key) => {
        const type = checker.getTypeAtLocation(value.getDeclarations()[0]);
        members.push({
          name: key,
          type: checker.typeToString(type),
          expandedType: expandType(key, type),
          description: value.getDocumentationComment(checker),
        });
      });
      exports.push({ name, type: checker.typeToString(symbolType), members });
    } else if (name === 'default') {
      const declaration = symbol.getDeclarations()[0];
      if (ts.isExportAssignment(declaration)) {
        const type = checker.getTypeAtLocation(declaration.expression);
        exports.push({ name, type: checker.typeToString(type) });
      } else if (ts.isFunctionDeclaration(declaration)) {
        const type = checker.getTypeAtLocation(declaration);
        exports.push({ name, type: checker.typeToString(type) });
      } else {
        throw new Error(`Export is not an export assigment: ${name}`);
      }
    } else {
      // throw new Error(`Unexpected export: ${name}`);
    }
  }

  return exports;
}

function printDiagnostics(diagnostics: readonly ts.Diagnostic[]): void {
  for (const diagnostic of diagnostics) {
    const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
    if (diagnostic.file) {
      const { line, character } = ts.getLineAndCharacterOfPosition(diagnostic.file, diagnostic.start!);
      console.log(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
    } else {
      console.log(message);
    }
  }
}

const filePath = path.resolve(process.argv[2]);
const tsconfig = loadTSConfig('tsconfig.json');
const program = ts.createProgram(tsconfig.fileNames, tsconfig.options);
const checker = program.getTypeChecker();

const diagnostics = ts.getPreEmitDiagnostics(program);
if (diagnostics.length > 0) {
  printDiagnostics(diagnostics);
  process.exit(1);
}

const sourceFile = program.getSourceFile(filePath);

if (!sourceFile) {
  console.error('Failed to load file.');
  process.exit(1);
}

const exportedValues = extractExports(sourceFile, checker);
console.log(JSON.stringify(exportedValues, null, 2));
