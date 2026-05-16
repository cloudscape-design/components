// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { loadThemeRegistry, ThemeTokens } from '@cloudscape-design/theming-runtime';
import { applyTheme, ApplyThemeResult } from '../../theming';

const registry = loadThemeRegistry();

let currentResult: ApplyThemeResult | null = null;

registry.onThemeChange((tokens: ThemeTokens) => {
  currentResult?.reset();
  currentResult = applyTheme({ theme: { tokens, contexts: {} } });
});
