// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';
import Header from '~components/header';
import { Box, Select, SelectProps } from '~components';
import { SettingsEditor } from './settings-editor';

const settingsVisibilityOptions: SelectProps.Option[] = [
  { value: 'editable' },
  { value: 'readonly' },
  { value: 'hidden' },
];

export function PlaygroundPage<S extends object>({
  title,
  children,
  settings,
  onChangeSettings,
}: {
  title: string;
  children: React.ReactNode;
  settings: S;
  onChangeSettings(settings: S): void;
}) {
  const [selectedOption, setSelectedOption] = useState(settingsVisibilityOptions[0]);
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

            <div style={{ overflowX: 'auto' }}>{children}</div>
          </div>
        ) : null}

        {selectedOption.value === 'hidden' ? children : null}
      </Box>
    </Box>
  );
}
