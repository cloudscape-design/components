// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use strict';
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.documentTestUtils = void 0;
const extractor_1 = __importDefault(require('./extractor'));
const bootstrap_1 = require('../bootstrap');
// TODO: Align API with components util
function documentTestUtils(
  options,
  // It would be nicer to just specify the files via the inputFiles option.
  // However, that doesn't work with typedoc 0.17: https://github.com/TypeStrong/typedoc/issues/1263
  // As a workaround, we do the filtering ourselves in getTypeDocProject.
  filteringGlob
) {
  const project = (0, bootstrap_1.bootstrapProject)(options, filteringGlob);
  const definitions = (0, extractor_1.default)(project);
  return definitions;
}
exports.documentTestUtils = documentTestUtils;
//# sourceMappingURL=index.js.map
