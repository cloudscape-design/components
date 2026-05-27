// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
module.exports = () => {
  if (process.env.BROWSER !== 'safari') {
    const { shutdownWebdriver } = require('@cloudscape-design/browser-test-tools/chrome-launcher');
    shutdownWebdriver();
  }
  // Safari: safaridriver is managed by the CI workflow, nothing to tear down.
};
