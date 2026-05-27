// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect } from 'react';

import { preset } from '~components/internal/generated/theming';
import { applyGlobalTheme } from '~components/theming';

const colorProperty = preset.propertiesMap.colorTextAccent;

export default function GlobalThemeIframesContentPage() {
  useEffect(() => {
    applyGlobalTheme();
  }, []);

  return (
    <div data-testid="iframe-content">
      <span data-testid="themed-element" style={{ color: `var(${colorProperty})` }}>
        Themed text
      </span>
    </div>
  );
}
