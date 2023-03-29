// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext } from 'react';
import { THEME, ALWAYS_VISUAL_REFRESH } from '~components/internal/environment';
import SpaceBetween from '~components/space-between';
import AppContext from '../app-context';
import { Density, Mode } from '@cloudscape-design/global-styles';

export default function ThemeSwitcher() {
  const { mode, urlParams, setUrlParams, setMode } = useContext(AppContext);

  const vrSwitchProps: React.InputHTMLAttributes<HTMLInputElement> = {
    id: 'visual-refresh-toggle',
    type: 'checkbox',
  };

  if (ALWAYS_VISUAL_REFRESH) {
    vrSwitchProps.checked = true;
    vrSwitchProps.readOnly = true;
  } else {
    vrSwitchProps.checked = urlParams.visualRefresh;
    vrSwitchProps.onChange = event => {
      setUrlParams({ visualRefresh: event.target.checked });
      window.location.reload();
    };
  }

  return (
    <SpaceBetween direction="horizontal" size="xs">
      <label>
        Theme
        <select defaultValue={THEME}>
          <option value={THEME}>{THEME}</option>
        </select>
      </label>
      <label>
        <input {...vrSwitchProps} />
        Visual refresh
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
