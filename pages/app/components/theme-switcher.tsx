// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useState } from 'react';
import { THEME, ALWAYS_VISUAL_REFRESH } from '~components/internal/environment';
import { Modal, SpaceBetween } from '~components';
import AppContext from '../app-context';
import { Density, Mode } from '@cloudscape-design/global-styles';

export default function ThemeSwitcher() {
  const { mode, urlParams, setUrlParams, setMode } = useContext(AppContext);
  const [isSettingsModalVisible, setIsSettingsModalVisible] = useState(false);

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
    <>
      <button onClick={() => setIsSettingsModalVisible(true)}>Demo Page Settings</button>

      <Modal
        header="Demo Page Settings"
        onDismiss={() => setIsSettingsModalVisible(false)}
        visible={isSettingsModalVisible}
      >
        <SpaceBetween direction="vertical" size="xs">
          <label>
            Theme
            <select defaultValue={THEME}>
              <option value={THEME}>{THEME}</option>
            </select>
          </label>
          <label>
            Direction
            <select
              onChange={event => setUrlParams({ direction: event.target.value as 'rtl' | 'ltr' })}
              defaultValue={urlParams.direction}
            >
              <option value="ltr">Left-to-Right</option>
              <option value="rtl">Right-to-Left</option>
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
        </SpaceBetween>
      </Modal>
    </>
  );
}
