// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.documentComponents = void 0;
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const change_case_1 = require('change-case');
const pathe_1 = __importDefault(require('pathe'));
const micromatch_1 = require('micromatch');
const component_definition_1 = require('./component-definition');
const extractor_1 = require('./extractor');
const typescript_1 = require('../bootstrap/typescript');
const type_utils_1 = require('./type-utils');
function componentNameFromPath(componentPath) {
  const directoryName = pathe_1.default.dirname(componentPath);
  return (0, change_case_1.pascalCase)(pathe_1.default.basename(directoryName));
}
function documentComponents(
  tsconfigPath,
  publicFilesGlob,
  // deprecated, now unused
  additionalInputFilePaths,
  options
) {
  const program = (0, typescript_1.bootstrapTypescriptProject)(tsconfigPath);
  const checker = program.getTypeChecker();
  const isMatch = (0, micromatch_1.matcher)(pathe_1.default.resolve(publicFilesGlob));
  return program
    .getSourceFiles()
    .filter(file => isMatch(file.fileName))
    .map(sourceFile => {
      var _a;
      const moduleSymbol = checker.getSymbolAtLocation(sourceFile);
      const name = componentNameFromPath(sourceFile.fileName);
      // istanbul ignore next
      if (!moduleSymbol) {
        throw new Error(`Unable to resolve module: ${sourceFile.fileName}`);
      }
      const exportSymbols = checker.getExportsOfModule(moduleSymbol);
      const { propsSymbol, componentSymbol } = (0, extractor_1.extractExports)(
        name,
        exportSymbols,
        checker,
        (_a = options === null || options === void 0 ? void 0 : options.extraExports) !== null && _a !== void 0
          ? _a
          : {}
      );
      const props = (0, extractor_1.extractProps)(propsSymbol, checker);
      const functions = (0, extractor_1.extractFunctions)(propsSymbol, checker);
      const defaultValues = (0, extractor_1.extractDefaultValues)(componentSymbol, checker);
      const componentDescription = (0, type_utils_1.getDescription)(
        componentSymbol.getDocumentationComment(checker),
        (0, type_utils_1.extractDeclaration)(componentSymbol)
      );
      return (0, component_definition_1.buildComponentDefinition)(
        name,
        props,
        functions,
        defaultValues,
        componentDescription,
        checker
      );
    });
}
exports.documentComponents = documentComponents;
