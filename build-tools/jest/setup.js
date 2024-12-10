// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

if (typeof window !== 'undefined') {
  require('@testing-library/jest-dom/extend-expect');
  const { cleanup } = require('@testing-library/react');
  afterEach(cleanup);
}
