// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const execa = require('execa');
const { task } = require('../utils/gulp-utils');

module.exports = task('size-limit', () => execa('size-limit', { stdio: 'inherit' }));
