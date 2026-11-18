// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import clsx from 'clsx';

import { SegmentedControl, SegmentedControlProps, SpaceBetween } from '~components';

import { SimplePage } from '../app/templates';

import styles from './style-api-v2.scss';

const textOptions: SegmentedControlProps.Option[] = [
  { id: 'list', text: 'List' },
  { id: 'cards', text: 'Cards' },
  { id: 'table', text: 'Table', disabled: true },
];

const iconOptions: SegmentedControlProps.Option[] = [
  { id: 'list', iconName: 'view-full', iconAlt: 'List' },
  { id: 'cards', iconName: 'view-horizontal', iconAlt: 'Cards' },
  { id: 'table', iconName: 'view-vertical', iconAlt: 'Table', disabled: true },
];

interface StyledSegmentedControlProps {
  options: SegmentedControlProps.Option[];
  label: string;
  square?: boolean;
}

function StyledSegmentedControl({ options, label, square }: StyledSegmentedControlProps) {
  const [selectedId, setSelectedId] = useState('list');
  return (
    <SegmentedControl
      selectedId={selectedId}
      options={options}
      label={label}
      onChange={({ detail }) => setSelectedId(detail.selectedId)}
      {...{
        styleClassNames: {
          root: styles.root,
          segment: clsx(styles.segment, square && styles['segment-square']),
          divider: styles.divider,
          select: { trigger: styles['select-trigger'], dropdown: styles['select-dropdown'] },
        },
      }}
    />
  );
}

export default function () {
  return (
    <SimplePage title="SegmentedControl - Style API v2" screenshotArea={{ disableAnimations: true }}>
      <SpaceBetween size="m" direction="horizontal">
        <StyledSegmentedControl options={textOptions} label="View" />
        <StyledSegmentedControl options={textOptions} label="View, square segments" square={true} />
      </SpaceBetween>
      <SpaceBetween size="m" direction="horizontal">
        <StyledSegmentedControl options={iconOptions} label="Layout" />
      </SpaceBetween>
    </SimplePage>
  );
}
