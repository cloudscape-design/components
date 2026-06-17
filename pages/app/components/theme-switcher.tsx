// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext } from 'react';

import { Density, Mode } from '@cloudscape-design/global-styles';

import { ALWAYS_VISUAL_REFRESH } from '~components/internal/environment';
import SpaceBetween from '~components/space-between';

import AppContext from '../app-context';
import { CLASSIC_THEME_ID, includedThemes, resolveActiveTheme } from '../theme-config';

export default function ThemeSwitcher() {
  const { mode, urlParams, setUrlParams, setMode } = useContext(AppContext);

  const activeTheme = resolveActiveTheme(urlParams.theme, Boolean(urlParams.visualRefresh));

  function activateTheme(themeId: string) {
    setUrlParams({ theme: themeId });
    window.location.reload();
  }

  // Built from the themes compiled into this build. Classic is the baseline, except in
  // always-visual-refresh builds where visual refresh is forced on and classic isn't selectable.
  const themeOptions = [
    ...(ALWAYS_VISUAL_REFRESH ? [] : [{ id: CLASSIC_THEME_ID, label: 'Classic' }]),
    ...includedThemes,
  ];
  const selectedThemeId = activeTheme?.id ?? (ALWAYS_VISUAL_REFRESH ? 'visual-refresh' : CLASSIC_THEME_ID);

  return (
    <SpaceBetween direction="horizontal" size="xs">
      <label>
        Theme{' '}
        <select
          id="theme-selector"
          value={selectedThemeId}
          disabled={ALWAYS_VISUAL_REFRESH}
          onChange={event => activateTheme(event.target.value)}
        >
          {themeOptions.map(theme => (
            <option key={theme.id} value={theme.id}>
              {theme.label}
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
