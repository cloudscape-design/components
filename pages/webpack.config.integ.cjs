// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const merge = require('lodash/merge');
const baseConfig = require('./webpack.config.cjs');

module.exports = (...args) => {
  const react18 = process.env.REACT_VERSION === '18';
  const webConfig = baseConfig({ ...args, react18 });

  merge(webConfig, {
    devServer: {
      client: false,
      hot: false,
    },
  });

  return webConfig;
};
