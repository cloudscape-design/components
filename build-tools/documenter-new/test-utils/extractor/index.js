// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const typedoc_1 = require('typedoc');
const get_methods_doc_1 = require('./get-methods-doc');
function getWrapperClasses(project) {
  var _a;
  const projectClone = Object.assign({}, project);
  const wrapperClasses =
    (_a = projectClone.children) === null || _a === void 0
      ? void 0
      : _a.flatMap(child => child.children).filter(child => !!child && child.kind === typedoc_1.ReflectionKind.Class);
  // Undefined values get filtered out before
  return wrapperClasses;
}
function extractRelevantDocumentation(project) {
  const wrapperClasses = getWrapperClasses(project);
  // TODO: Make this output structure match the components one
  const documentation = wrapperClasses.map(classDesc => {
    return {
      name: classDesc.name,
      methods: (0, get_methods_doc_1.getMethodsDoc)(classDesc.children || []),
    };
  });
  return documentation;
}
exports.default = extractRelevantDocumentation;
//# sourceMappingURL=index.js.map
