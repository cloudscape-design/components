// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.bootstrapTypescriptProject = void 0;
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const typescript_1 = __importDefault(require('typescript'));
const pathe_1 = __importDefault(require('pathe'));
function printDiagnostics(diagnostics) {
  for (const diagnostic of diagnostics) {
    const message = typescript_1.default.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
    if (diagnostic.file) {
      const { line, character } = typescript_1.default.getLineAndCharacterOfPosition(diagnostic.file, diagnostic.start);
      console.error(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
    } else {
      console.error(message);
    }
  }
}
function loadTSConfig(tsconfigPath) {
  const configFile = typescript_1.default.readConfigFile(tsconfigPath, typescript_1.default.sys.readFile);
  if (configFile.error) {
    throw new Error('Failed to read tsconfig.json');
  }
  const config = typescript_1.default.parseJsonConfigFileContent(
    configFile.config,
    typescript_1.default.sys,
    pathe_1.default.dirname(tsconfigPath)
  );
  if (config.errors.length > 0) {
    throw new Error('Failed to parse tsconfig.json');
  }
  // this prints a warning that incremental mode is not supported in programmatic API
  config.options.incremental = false;
  delete config.options.tsBuildInfoFile;
  return config;
}
function bootstrapTypescriptProject(tsconfigPath) {
  const tsconfig = loadTSConfig(tsconfigPath);
  const program = typescript_1.default.createProgram(tsconfig.fileNames, tsconfig.options);
  const diagnostics = typescript_1.default.getPreEmitDiagnostics(program);
  if (diagnostics.length > 0) {
    printDiagnostics(diagnostics);
    throw new Error('Compilation failed');
  }
  return program;
}
exports.bootstrapTypescriptProject = bootstrapTypescriptProject;
//# sourceMappingURL=typescript.js.map
