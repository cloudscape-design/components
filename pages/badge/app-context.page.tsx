// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext } from 'react';

import Badge, { BadgeProps } from '~components/badge';
import FormField from '~components/form-field';
import Select from '~components/select';
import SpaceBetween from '~components/space-between';

import AppContext, { AppContextType } from '../app/app-context';
import { SimplePage } from '../app/templates';

type PageContext = React.Context<AppContextType<{ color: BadgeProps['color'] }>>;

const colorOptions: Array<{ value: NonNullable<BadgeProps['color']>; label: string }> = [
  { value: 'grey', label: 'Grey' },
  { value: 'blue', label: 'Blue' },
  { value: 'green', label: 'Green' },
  { value: 'red', label: 'Red' },
  { value: 'severity-critical', label: 'Severity critical' },
  { value: 'severity-high', label: 'Severity high' },
  { value: 'severity-medium', label: 'Severity medium' },
  { value: 'severity-low', label: 'Severity low' },
  { value: 'severity-neutral', label: 'Severity neutral' },
];

export default function BadgeAppContext() {
  const { urlParams, setUrlParams } = useContext(AppContext as PageContext);
  const color = urlParams.color ?? 'grey';

  return (
    <SimplePage
      title="Badge - App Context"
      screenshotArea={{}}
      settings={
        <FormField label="Color">
          <Select
            selectedOption={colorOptions.find(o => o.value === color) ?? colorOptions[0]}
            options={colorOptions}
            onChange={({ detail }) => setUrlParams({ color: detail.selectedOption.value as BadgeProps['color'] })}
          />
        </FormField>
      }
    >
      <SpaceBetween direction="horizontal" size="m">
        <Badge color={color}>Badge</Badge>
        <Badge color={color}>Status: Active</Badge>
        <Badge color={color}>42</Badge>
      </SpaceBetween>
    </SimplePage>
  );
}
