// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
// Stub for generated styles.css.js / styles.selectors.js modules.
// These are normally produced by `gulp quick-build` but may not exist when running tests from source.
// Returns an empty object so CSS class lookups resolve to undefined (matching the jest css-transformer
// behaviour for built artifacts).
/* global module */
module.exports = new Proxy(
  {},
  {
    get(_target, prop) {
      if (prop === '__esModule') {
        return true;
      }
      if (prop === 'default') {
        return module.exports;
      }
      // Return the class name as-is so toHaveClass assertions against selector keys still match.
      return String(prop);
    },
  }
);
