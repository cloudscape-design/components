// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Checkbox from '~components/checkbox';
import ColumnLayout from '~components/column-layout';
import Grid from '~components/grid';
import RadioGroup from '~components/radio-group';
import Slider from '~components/slider';
import SpaceBetween from '~components/space-between';
import Tiles from '~components/tiles';
import Toggle from '~components/toggle';

import { Section } from './utils';

export default function FormControls() {
  return (
    <Section header="Form controls">
      <Grid
        gridDefinition={[
          { colspan: { default: 12, l: 6 } },
          { colspan: { default: 12, l: 6 } },
          { colspan: { default: 12, xxs: 12 } },
        ]}
      >
        <Grid
          gridDefinition={[
            { colspan: { default: 12, xxs: 4 } },
            { colspan: { default: 12, xxs: 4 } },
            { colspan: { default: 12, xxs: 4 } },
          ]}
        >
          <SpaceBetween size="xxs">
            <Checkbox checked={true} ariaLabel="Checked">
              Checked
            </Checkbox>
            <Checkbox checked={false} ariaLabel="Unchecked">
              Unchecked
            </Checkbox>
            <Checkbox checked={true} disabled={true} ariaLabel="Disabled checked">
              Disabled
            </Checkbox>
            <Checkbox checked={false} disabled={true} ariaLabel="Disabled unchecked">
              Disabled
            </Checkbox>
            <Checkbox checked={true} readOnly={true} ariaLabel="Read-only checked">
              Read-only
            </Checkbox>
            <Checkbox checked={false} readOnly={true} ariaLabel="Read-only unchecked">
              Read-only
            </Checkbox>
          </SpaceBetween>

          <SpaceBetween size="xxs">
            <RadioGroup
              items={[
                { value: '1', label: 'Checked' },
                { value: '2', label: 'Unchecked' },
              ]}
              value={'1'}
              ariaLabel="Default radio group"
            />
            <RadioGroup
              items={[
                { value: '1', label: 'Disabled', disabled: true },
                { value: '2', label: 'Disabled', disabled: true },
              ]}
              value={'1'}
              ariaLabel="Disabled radio group"
            />
            <RadioGroup
              items={[
                { value: '1', label: 'Read-only' },
                { value: '2', label: 'Read-only' },
              ]}
              readOnly={true}
              value={'1'}
              ariaLabel="Read-only radio group"
            />
          </SpaceBetween>

          <SpaceBetween size="xxs">
            <Toggle checked={true} ariaLabel="Checked">
              Checked
            </Toggle>
            <Toggle checked={false} ariaLabel="Unchecked">
              Unchecked
            </Toggle>
            <Toggle checked={true} disabled={true} ariaLabel="Disabled checked">
              Disabled
            </Toggle>
            <Toggle checked={false} disabled={true} ariaLabel="Disabled unchecked">
              Disabled
            </Toggle>
            <Toggle checked={true} readOnly={true} ariaLabel="Read-only checked">
              Read-only
            </Toggle>
            <Toggle checked={false} readOnly={true} ariaLabel="Read-only unchecked">
              Read-only
            </Toggle>
          </SpaceBetween>
        </Grid>

        <ColumnLayout columns={2}>
          <SpaceBetween size="xs">
            <Tiles
              value="item1"
              items={[
                { label: 'Selected', value: 'item1', description: 'This is a description for item 1' },
                { label: 'Unselected', value: 'item2', description: 'This is a description for item 2' },
              ]}
              ariaLabel="Default tiles"
            />
            <Tiles
              value="item1"
              items={[
                { label: 'Disabled', value: 'item1', disabled: true, description: 'This is a description for item 1' },
                { label: 'Disabled', value: 'item2', disabled: true, description: 'This is a description for item 2' },
              ]}
              ariaLabel="Disabled tiles"
            />
          </SpaceBetween>
          <SpaceBetween size="xs">
            <Tiles
              value="item1"
              readOnly={true}
              items={[
                { label: 'Read-only', value: 'item1', description: 'This is a description for item 1' },
                { label: 'Read-only', value: 'item2', description: 'This is a description for item 2' },
              ]}
              ariaLabel="Read-only tiles"
            />
          </SpaceBetween>
        </ColumnLayout>

        <ColumnLayout columns={3}>
          <Slider value={50} max={100} min={0} ariaLabel="Default slider" />
          <Slider value={50} max={100} min={0} disabled={true} ariaLabel="Disabled slider" />
          <Slider value={50} max={100} min={0} readOnly={true} ariaLabel="Read-only slider" />
        </ColumnLayout>
      </Grid>
    </Section>
  );
}
