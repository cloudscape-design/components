// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useContext, useEffect, useRef } from 'react';
import { Box, Button, Toggle } from '~components';

import styles from './styles.scss';
import AppContext from '../app-context';
import { SettingsEditor } from './settings-editor';

export function SettingsPanel() {
  const {
    urlParams: { showSettingsEditor, readonlySettings },
    setUrlParams,
    settings,
    setSettings,
    defaultSettings = {},
  } = useContext(AppContext);

  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const panel = panelRef.current;

    if (!showSettingsEditor || !panel) {
      return;
    }

    const originalBodyPadding = document.body.style.paddingRight;

    document.body.style.paddingRight = '400px';
    panel.style.width = '400px';

    return () => {
      document.body.style.paddingRight = originalBodyPadding;
    };
  }, [showSettingsEditor]);

  if (!showSettingsEditor) {
    return null;
  }

  const onClose = () => setUrlParams({ showSettingsEditor: false });
  const setReadonly = (value: boolean) => setUrlParams({ readonlySettings: value });

  return (
    <div ref={panelRef} className={styles.panel}>
      <div className={styles['panel-body']}>
        <div style={{ position: 'absolute', top: '6px', right: '4px' }}>
          <Button onClick={onClose} variant="icon" iconName="close" />
        </div>

        <div className={styles['panel-content']}>
          <Box variant="h3">Context settings</Box>

          <Toggle onChange={({ detail }) => setReadonly(detail.checked)} checked={readonlySettings}>
            Readonly
          </Toggle>

          <SettingsEditor readonly={readonlySettings} settings={settings ?? defaultSettings} onChange={setSettings} />
        </div>
      </div>
    </div>
  );
}
