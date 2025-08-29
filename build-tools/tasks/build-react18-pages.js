// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

const { parallel } = require('gulp');
const createConfig = require('../../pages/webpack.config.react18.cjs');
const { task } = require('../utils/gulp-utils');
const { buildPagesStatic, buildPagesSource } = require('../utils/build-with-webpack');

module.exports = task('build-react18-pages', parallel(buildPagesStatic.bind(null, createConfig), buildPagesSource));
