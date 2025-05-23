// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const merge = require('lodash/merge');
const baseConfig = require('./webpack.config.cjs');

module.exports = (...args) => {
  const webConfig = baseConfig(...args);

  merge(webConfig, {
    devServer: {
      client: false,
      hot: false,
    },
  });

  return webConfig;
};
