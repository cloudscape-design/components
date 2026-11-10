// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { createConfig } from './vite.config.mjs';

// The integration tests use a development build of the pages, see build-tools/utils/dev-pages-server.js
export function createIntegConfig() {
  const config = createConfig({ outputPath: 'pages/lib/static-integ' });
  // Tests need stable pages, which do not reload when files change
  config.server.hmr = false;
  return config;
}

export default () => createIntegConfig();
