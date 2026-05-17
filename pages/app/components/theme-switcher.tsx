// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext } from 'react';

import { Density, Mode } from '@cloudscape-design/global-styles';

import { ALWAYS_VISUAL_REFRESH } from '~components/internal/environment';
import SpaceBetween from '~components/space-between';

import AppContext from '../app-context';

type ThemeOption = 'classic' | 'visual-refresh' | 'one-theme';

export default function ThemeSwitcher() {
  const { mode, urlParams, setUrlParams, setMode } = useContext(AppContext);

  const currentTheme: ThemeOption = urlParams.oneTheme
    ? 'one-theme'
    : urlParams.visualRefresh
      ? 'visual-refresh'
      : 'classic';

  const setTheme = (next: ThemeOption) => {
    setUrlParams({
      visualRefresh: next === 'visual-refresh' || !!ALWAYS_VISUAL_REFRESH,
      oneTheme: next === 'one-theme',
    });
    window.location.reload();
  };

  const themeOptions: Array<{ value: ThemeOption; label: string; id: string; disabled?: boolean }> = [
    { value: 'classic', label: 'Classic', id: 'classic-toggle', disabled: !!ALWAYS_VISUAL_REFRESH },
    { value: 'visual-refresh', label: 'Visual refresh', id: 'visual-refresh-toggle' },
    { value: 'one-theme', label: 'One theme', id: 'one-theme-toggle' },
  ];

  return (
    <SpaceBetween direction="horizontal" size="xs">
      {themeOptions.map(option => (
        <label key={option.value}>
          <input
            id={option.id}
            type="radio"
            name="theme"
            checked={currentTheme === option.value}
            disabled={option.disabled}
            onChange={() => setTheme(option.value)}
          />
          {option.label}
        </label>
      ))}
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
