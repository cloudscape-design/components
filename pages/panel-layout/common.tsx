// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import FormField from '~components/form-field';
import { PanelLayoutProps } from '~components/panel-layout';
import SegmentedControl from '~components/segmented-control';

interface SettingProps<T> {
  value: T;
  onChange: (value: T) => void;
}

export function DisplaySetting({ value, onChange }: SettingProps<PanelLayoutProps.Display>) {
  return (
    <FormField label="Display">
      <SegmentedControl
        options={[
          { id: 'all', text: 'all' },
          { id: 'panel-only', text: 'panel-only' },
          { id: 'main-only', text: 'main-only' },
        ]}
        selectedId={value}
        onChange={({ detail }) => onChange(detail.selectedId as PanelLayoutProps.Display)}
      />
    </FormField>
  );
}

export function PanelPositionSetting({
  label = 'Panel position',
  value,
  onChange,
}: SettingProps<PanelLayoutProps.PanelPosition> & { label?: string }) {
  return (
    <FormField label={label}>
      <SegmentedControl
        options={[
          { id: 'side-start', text: 'side-start' },
          { id: 'side-end', text: 'side-end' },
        ]}
        selectedId={value}
        onChange={({ detail }) => onChange(detail.selectedId as PanelLayoutProps.PanelPosition)}
      />
    </FormField>
  );
}
