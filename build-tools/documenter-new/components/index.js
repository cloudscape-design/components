// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.documentComponents = exports.writeComponentsDocumentation = void 0;
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const node_fs_1 = __importDefault(require('node:fs'));
const change_case_1 = require('change-case');
const pathe_1 = __importDefault(require('pathe'));
const micromatch_1 = require('micromatch');
const component_definition_1 = require('./component-definition');
const extractor_1 = require('./extractor');
const typescript_1 = require('../bootstrap/typescript');
const type_utils_1 = require('./type-utils');
function componentNameFromPath(componentPath) {
  const dashCaseName = pathe_1.default.basename(pathe_1.default.dirname(componentPath));
  return { dashCaseName, name: (0, change_case_1.pascalCase)(dashCaseName) };
}
function writeComponentsDocumentation({ outDir, ...options }) {
  const definitions = documentComponents(options);
  node_fs_1.default.mkdirSync(outDir, { recursive: true });
  for (const definition of definitions) {
    node_fs_1.default.writeFileSync(
      pathe_1.default.join(outDir, definition.dashCaseName + '.js'),
      `module.exports = ${JSON.stringify(definition, null, 2)};`
    );
  }
  const indexContent = `module.exports = {
    ${definitions
      .map(definition => `${JSON.stringify(definition.dashCaseName)}:require('./${definition.dashCaseName}')`)
      .join(',\n')}
  }`;
  node_fs_1.default.writeFileSync(pathe_1.default.join(outDir, 'index.js'), indexContent);
  node_fs_1.default.copyFileSync(require.resolve('./interfaces.d.ts'), pathe_1.default.join(outDir, 'interfaces.d.ts'));
  node_fs_1.default.writeFileSync(
    pathe_1.default.join(outDir, 'index.d.ts'),
    `import { ComponentDefinition } from './interfaces';
const definitions: Record<string, ComponentDefinition>;
export default definitions;
`
  );
}
exports.writeComponentsDocumentation = writeComponentsDocumentation;
function documentComponents(options) {
  const program = (0, typescript_1.bootstrapTypescriptProject)(options.tsconfigPath);
  const checker = program.getTypeChecker();
  const isMatch = (0, micromatch_1.matcher)(pathe_1.default.resolve(options.publicFilesGlob));
  const sourceFiles = program.getSourceFiles().filter(file => isMatch(file.fileName));
  if (sourceFiles.length === 0) {
    throw new Error(`No files found matching ${options.publicFilesGlob}`);
  }
  return sourceFiles.map(sourceFile => {
    var _a;
    const moduleSymbol = checker.getSymbolAtLocation(sourceFile);
    const { name, dashCaseName } = componentNameFromPath(sourceFile.fileName);
    // istanbul ignore next
    if (!moduleSymbol) {
      throw new Error(`Unable to resolve module: ${sourceFile.fileName}`);
    }
    const exportSymbols = checker.getExportsOfModule(moduleSymbol);
    const { propsSymbol, componentSymbol } = (0, extractor_1.extractExports)(
      name,
      exportSymbols,
      checker,
      (_a = options === null || options === void 0 ? void 0 : options.extraExports) !== null && _a !== void 0 ? _a : {}
    );
    const defaultValues = (0, extractor_1.extractDefaultValues)(componentSymbol, checker);
    const componentDescription = (0, type_utils_1.getDescription)(
      componentSymbol.getDocumentationComment(checker),
      (0, type_utils_1.extractDeclaration)(componentSymbol)
    );
    return (0, component_definition_1.buildComponentDefinition)(
      name,
      dashCaseName,
      propsSymbol,
      defaultValues,
      componentDescription,
      checker
    );
  });
}
exports.documentComponents = documentComponents;
//# sourceMappingURL=index.js.map
