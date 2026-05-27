// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const waitOn = require('wait-on');

module.exports = async () => {
  if (process.env.BROWSER === 'safari') {
    // safaridriver is started by the CI workflow on port 4444.
    await waitOn({ resources: ['http-get://localhost:4444/status'], timeout: 10000 });
  } else {
    const { startWebdriver } = require('@cloudscape-design/browser-test-tools/chrome-launcher');
    await startWebdriver();
  }
};
