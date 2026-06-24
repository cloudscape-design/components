// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

module.exports = () => {
  const { shutdownWebdriver } = require('@cloudscape-design/browser-test-tools/chrome-launcher');
  shutdownWebdriver();
};
