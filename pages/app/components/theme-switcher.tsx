// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useEffect } from 'react';

import { Density, Mode } from '@cloudscape-design/global-styles';

import { ALWAYS_VISUAL_REFRESH, THEME } from '~components/internal/environment';
import SpaceBetween from '~components/space-between';

import AppContext from '../app-context';

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

  useEffect(() => {
    let keyPressed: any = {};

    const handleKeyDown = (e: any) => {
      keyPressed[e.key + e.location] = true;

      if (keyPressed.Control1 === true && keyPressed.d0 === true) {
        // Left shift+CONTROL pressed!
        if (mode === 'dark') {
          setMode(Mode.Light);
          keyPressed = {}; // reset key map
        } else if (mode === 'light') {
          setMode(Mode.Dark);
          keyPressed = {}; // reset key map
        }
      }

      if (keyPressed.Control1 === true && keyPressed.c0 === true) {
        e.preventDefault();
        if (urlParams.density === 'comfortable') {
          setUrlParams({ density: Density.Compact });
        } else if (urlParams.density === 'compact') {
          setUrlParams({ density: Density.Comfortable });
        }
        keyPressed = {}; // reset key map
      }

      if (keyPressed.Control1 === true && keyPressed.m0 === true) {
        e.preventDefault();
        setUrlParams({ motionDisabled: !urlParams.motionDisabled });
        keyPressed = {}; // reset key map
      }

      if (keyPressed.Control1 === true && keyPressed.r0 === true) {
        e.preventDefault();
        document.documentElement.setAttribute('dir', 'rtl');
        keyPressed = {}; // reset key map
      }

      if (keyPressed.Control1 === true && keyPressed.l0 === true) {
        e.preventDefault();
        document.documentElement.setAttribute('dir', 'ltr');
        keyPressed = {}; // reset key map
      }

      if (keyPressed.Control1 === true && keyPressed.v0 === true) {
        e.preventDefault();
        if (ALWAYS_VISUAL_REFRESH) {
          setUrlParams({ visualRefresh: true });
        } else {
          setUrlParams({ visualRefresh: !urlParams.visualRefresh });
          window.location.reload();
        }
        keyPressed = {}; // reset key map
      }
    };

    const handleKeyUp = (e: any) => {
      keyPressed[e.key + e.location] = false;

      keyPressed = {};
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [mode, urlParams.density, urlParams.motionDisabled, urlParams.visualRefresh, setMode, setUrlParams]);

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
