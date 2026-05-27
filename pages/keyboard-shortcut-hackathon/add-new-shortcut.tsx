// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { Box, Button, FormField, Input, Multiselect, Select, SpaceBetween } from '~components';

import { shortcuts } from './shortcuts';

function AddNewShortcut({ customItems, setCustomItems }: any) {
  const shortcutNames = shortcuts.map(shortcut => shortcut.name);
  const [actions, setActions] = React.useState<any>([]);
  const [keyCombo, setKeyCombo] = React.useState<any>({ key1: { label: 'Command', value: '1' }, key2: null });
  const [shortcutName, setShortcutName] = React.useState('');

  const actionOptions = shortcutNames.map((name, index) => ({
    label: name,
    value: `${index}`,
    disabled: !actions.map((action: any) => action.label).includes(name) && actions.length >= 3,
  }));

  return (
    <SpaceBetween size="xl">
      <FormField label="Action" description="Select up to 3 actions that can take place at once.">
        <SpaceBetween size="xs">
          <Multiselect
            selectedOptions={actions}
            onChange={({ detail }) => setActions(detail.selectedOptions)}
            options={actionOptions}
            placeholder="Choose options"
          />
        </SpaceBetween>
      </FormField>
      <FormField label="Key combination">
        <SpaceBetween direction="horizontal" size="xs">
          <Select
            selectedOption={keyCombo.key1}
            onChange={({ detail }) => setKeyCombo({ key1: detail.selectedOption, key2: keyCombo.key2 })}
            options={[
              { label: 'Command', value: '1' },
              { label: 'Control', value: '2' },
              { label: 'Option', value: '3' },
              { label: 'Shift', value: '4' },
            ]}
          />
          <Select
            selectedOption={keyCombo.key2}
            onChange={({ detail }) => setKeyCombo({ key1: keyCombo.key1, key2: detail.selectedOption })}
            options={[
              { label: 'A', value: '1' },
              { label: 'B', value: '2' },
              { label: 'C', value: '3' },
              { label: 'D', value: '4' },
              { label: 'E', value: '5' },
              { label: 'F', value: '6' },
              { label: 'X', value: '7' },
            ]}
          />
        </SpaceBetween>
      </FormField>
      <FormField label="Shortcut name" description="Add an optional name for the shortcut. Will default to the action.">
        <Input
          placeholder="Go into focus mode"
          value={shortcutName}
          onChange={({ detail }) => setShortcutName(detail.value)}
        />
      </FormField>
      <Box float="right">
        <SpaceBetween direction="horizontal" size="xs">
          <Button>Cancel</Button>
          <Button
            variant="primary"
            onClick={() => {
              setCustomItems([
                ...customItems,
                {
                  name: shortcutName || `${actions[0].label} + ${actions[1]?.label} + ${actions[2]?.label}`,
                  shortcut: `${keyCombo.key1.label} + ${keyCombo.key2.label}`,
                  actions: actions,
                  status: 'Enabled',
                },
              ]);
              setActions([]);
              setShortcutName('');
              setKeyCombo({ key1: null, key2: null });
            }}
          >
            Submit
          </Button>
        </SpaceBetween>
      </Box>
    </SpaceBetween>
  );
}

export default AddNewShortcut;
