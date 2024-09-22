// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const path = require('path');
const integConfig = require('./jest.integ.config');

module.exports = {
  ...integConfig,
  setupFilesAfterEnv: [path.join(__dirname, 'build-tools', 'integ', 'setup.motion.js')],
  testRegex: '(/(__motion__)/.*(\\.|/)test)\\.[jt]sx?$',
};
