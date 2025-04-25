// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use strict';
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, '__esModule', { value: true });
exports.bootstrapProject = void 0;
const typedoc_1 = require('typedoc');
const micromatch_1 = require('micromatch');
const pathe_1 = require('pathe');
function bootstrapProject(options, filteringGlob, additionalInputFilePaths) {
  const app = new typedoc_1.Application();
  app.options.addReader(new typedoc_1.TSConfigReader());
  const { inputFiles, hasErrors } = app.bootstrap(options);
  if (hasErrors) {
    throw new Error('Errors during parsing configuration');
  }
  if (
    additionalInputFilePaths === null || additionalInputFilePaths === void 0 ? void 0 : additionalInputFilePaths.length
  ) {
    inputFiles.push(...additionalInputFilePaths);
  }
  const filteredInputFiles = filterFiles(inputFiles, filteringGlob);
  if (!filteredInputFiles.length) {
    throw new Error('No input files to convert');
  }
  const project = app.convert(filteredInputFiles);
  if (!project) {
    throw new Error('Project generation failed');
  }
  return project;
}
exports.bootstrapProject = bootstrapProject;
function filterFiles(inputFiles, filteringGlob) {
  if (!filteringGlob) {
    return inputFiles;
  }
  const isMatch = (0, micromatch_1.matcher)((0, pathe_1.resolve)(filteringGlob));
  return inputFiles.filter(file => isMatch(file));
}
//# sourceMappingURL=index.js.map
