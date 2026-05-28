// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { setGlobalTheme, Theme } from '~components/theming';

const themeA: Theme = {
  tokens: {
    colorTextAccent: '#ff0000',
  },
};

const themeB: Theme = {
  tokens: {
    colorTextAccent: '#0000ff',
  },
};

export default function GlobalThemeIframesPage() {
  const [themeApplied, setThemeApplied] = useState<string | null>(null);
  const iframeHref = window.location.href.replace('global-theme-iframes', 'global-theme-iframes-inner');

  return (
    <div>
      <h1>Global Theme with Iframes</h1>

      <output data-testid="current-theme">{themeApplied ?? 'none'}</output>

      <button
        data-testid="set-theme-a"
        onClick={() => {
          setGlobalTheme(themeA);
          setThemeApplied('theme-a');
        }}
      >
        Set Theme A
      </button>
      <button
        data-testid="set-theme-b"
        onClick={() => {
          setGlobalTheme(themeB);
          setThemeApplied('theme-b');
        }}
      >
        Set Theme B
      </button>

      <iframe id="iframe-1" src={iframeHref} title="iframe-1" />
      <iframe id="iframe-2" src={iframeHref} title="iframe-2" />
    </div>
  );
}
