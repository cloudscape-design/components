// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext } from 'react';

import { Density, Mode } from '@cloudscape-design/global-styles';

import SpaceBetween from '~components/space-between';

import AppContext, { SELECTABLE_THEMES } from '../app-context';

const THEME_LABELS: Record<string, string> = {
  classic: 'Classic',
  'visual-refresh': 'Visual refresh',
  'one-theme': 'One theme',
  core: 'Core',
};

export default function ThemeSwitcher() {
  const { mode, urlParams, setUrlParams, setMode } = useContext(AppContext);

  function activateTheme(themeId: string) {
    setUrlParams({ theme: themeId });
    window.location.reload();
  }

  return (
    <SpaceBetween direction="horizontal" size="xs">
      <label>
        Theme{' '}
        <select
          id="theme-selector"
          value={urlParams.theme}
          disabled={SELECTABLE_THEMES.length <= 1}
          onChange={event => activateTheme(event.target.value)}
        >
          {SELECTABLE_THEMES.map(themeId => (
            <option key={themeId} value={themeId}>
              {THEME_LABELS[themeId] ?? themeId}
            </option>
          ))}
        </select>
      </label>
      <label>
        <input
          id="mode-toggle"
          type="checkbox"
          checked={mode === 'dark'}
          onChange={event => setMode(event.target.checked ? Mode.Dark : Mode.Light)}
        />
        Dark mode
      </label>
      <label>
        <input
          id="density-toggle"
          type="checkbox"
          checked={urlParams.density === 'compact'}
          onChange={event => setUrlParams({ density: event.target.checked ? Density.Compact : Density.Comfortable })}
        />
        Compact mode
      </label>
      <label>
        <input
          id="disabled-motion-toggle"
          type="checkbox"
          checked={urlParams.motionDisabled}
          onChange={event => setUrlParams({ motionDisabled: event.target.checked })}
        />
        Disable motion
      </label>
    </SpaceBetween>
  );
}
