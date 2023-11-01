// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext } from 'react';
import { ALWAYS_VISUAL_REFRESH } from '~components/internal/environment';
import { Popover, SpaceBetween } from '~components';
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
    <Popover
      header="Settings"
      position="bottom"
      size="large"
      content={
        <SpaceBetween direction="vertical" size="xs">
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
              onChange={event =>
                setUrlParams({ density: event.target.checked ? Density.Compact : Density.Comfortable })
              }
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

          <label>
            <input
              id="disabled-motion-toggle"
              type="checkbox"
              checked={urlParams.direction === 'rtl'}
              onChange={event => {
                setUrlParams({ direction: event.target.checked ? 'rtl' : 'ltr' });
                window.location.reload();
              }}
            />
            Right to Left
          </label>
        </SpaceBetween>
      }
    >
      Demo Page Settings
    </Popover>
  );
}
