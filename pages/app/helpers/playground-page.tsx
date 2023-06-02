// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useContext, useState } from 'react';
import Header from '~components/header';
import { Box, Select, SelectProps } from '~components';
import { SettingsEditor } from './settings-editor';
import AppContext, { AppContextType } from '../app-context';
import { omit } from 'lodash';

const settingsVisibilityOptions: SelectProps.Option[] = [
  { value: 'editable' },
  { value: 'readonly' },
  { value: 'hidden' },
];

export function PlaygroundPage<S extends object>({
  title,
  children,
  defaultSettings,
}: {
  title: string;
  children: (settings: S) => React.ReactNode;
  defaultSettings: S;
}) {
  const { urlParams, setUrlParams } = useContext(AppContext as React.Context<AppContextType<S>>);
  const [selectedOption, setSelectedOption] = useState(settingsVisibilityOptions[0]);

  const settings: S = { ...defaultSettings, ...omit(urlParams, ['density', 'motionDisabled', 'visualRefresh']) };
  const onChangeSettings = (settings: S) => setUrlParams(settings);

  return (
    <Box padding="l">
      <Box margin={{ bottom: 'm' }}>
        <Header
          variant="h1"
          actions={
            <Select
              selectedOption={selectedOption}
              options={settingsVisibilityOptions}
              onChange={({ detail }) => setSelectedOption(detail.selectedOption)}
            />
          }
        >
          {title}
        </Header>
      </Box>

      <Box>
        {selectedOption.value === 'editable' || selectedOption.value === 'readonly' ? (
          <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '16px' }}>
            <Box>
              <SettingsEditor
                settings={settings}
                onChange={onChangeSettings}
                readonly={selectedOption.value === 'readonly'}
              />
            </Box>

            <div style={{ overflowX: 'auto' }}>{children(settings)}</div>
          </div>
        ) : null}

        {selectedOption.value === 'hidden' ? children(settings) : null}
      </Box>
    </Box>
  );
}
