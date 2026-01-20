// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const { copyTask } = require('../utils/gulp-utils');

const copyBuildTools = copyTask(
  'build-tools',
  'node_modules/@cloudscape-design/build-tools/**/*',
  'lib/dev-pages/internal/build-tools'
);

module.exports = copyBuildTools;
