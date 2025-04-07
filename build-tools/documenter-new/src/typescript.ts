// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import pathe from 'pathe';
import ts from 'typescript';

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

function loadTSConfig(tsconfigPath: string): ts.ParsedCommandLine {
  const configFile = ts.readConfigFile(tsconfigPath, ts.sys.readFile);
  if (configFile.error) {
    throw new Error('Failed to read tsconfig.json');
  }
  const config = ts.parseJsonConfigFileContent(configFile.config, ts.sys, pathe.dirname(tsconfigPath));
  if (config.errors.length > 0) {
    throw new Error('Failed to parse tsconfig.json');
  }
  // this prints a warning that incremental mode is not supported in programmatic API
  config.options.incremental = false;
  delete config.options.tsBuildInfoFile;
  return config;
}

export function bootstrapTypescriptProject(tsconfigPath: string) {
  const tsconfig = loadTSConfig(tsconfigPath);
  const program = ts.createProgram(tsconfig.fileNames, tsconfig.options);

  const diagnostics = ts.getPreEmitDiagnostics(program);
  if (diagnostics.length > 0) {
    printDiagnostics(diagnostics);
    throw new Error('Compilation failed');
  }

  return program;
}
