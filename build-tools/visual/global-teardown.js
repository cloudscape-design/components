// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
module.exports = () => {
  if (process.env.BROWSER === 'safari') {
    if (global.__DRIVER_PROCESS__) {
      global.__DRIVER_PROCESS__.kill();
    }
  } else {
    const { shutdownWebdriver } = require('@cloudscape-design/browser-test-tools/chrome-launcher');
    shutdownWebdriver();
  }
};
