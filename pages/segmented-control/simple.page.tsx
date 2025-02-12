// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { Box, Button, Select, SpaceBetween } from '~components';
import SegmentedControl from '~components/segmented-control';

export default function SegmentedControlPage() {
  const [selectedFirstId, setSelecteFirstdId] = useState<string | null>('seg1-1');
  const [selectedSecondId, setSelecteSecondId] = useState<string | null>('seg2-1');
  const [selectedId, setSelectedId] = useState<string | null>('seg-4');
  return (
    <article>
      <h1>SegmentedControl demo</h1>
      <SpaceBetween size="l">
        <Box margin={{ horizontal: 'm', vertical: 'xxl' }}>
          <SpaceBetween size="xl" direction="horizontal">
            <SegmentedControl
              options={[
                { text: 'Logs Insights QL', id: 'seg1-1', disabled: false },
                { text: 'OpenSearch PPL', id: 'seg1-2', disabled: false },
                { text: 'OpenSearch SQL', id: 'seg1-3', disabled: false },
              ]}
              onChange={event => setSelecteFirstdId(event.detail.selectedId)}
              selectedId={selectedFirstId}
              label="Segmented Control Label"
            />
            <Select
              selectedOption={null}
              placeholder="Select an option"
              options={[
                { label: 'Option 1', value: '1' },
                { label: 'Option 2', value: '2' },
                { label: 'Option 3', value: '3' },
                { label: 'Option 4', value: '4' },
                { label: 'Option 5', value: '5' },
              ]}
            />
            <Button>Button</Button>
          </SpaceBetween>
        </Box>
        <Box margin={{ horizontal: 'm', vertical: 'xxl' }}>
          <SegmentedControl
            options={[
              { iconName: 'view-horizontal', id: 'seg2-1', disabled: false },
              { iconName: 'view-vertical', id: 'seg2-2', disabled: false },
              { iconName: 'view-full', id: 'seg2-3', disabled: false },
            ]}
            onChange={event => setSelecteSecondId(event.detail.selectedId)}
            selectedId={selectedSecondId}
            label="Segmented Control Label"
          />
        </Box>
        <Box margin={{ horizontal: 'm', vertical: 'xxl' }}>
          <SegmentedControl
            options={[
              { text: 'Segment-1', iconName: 'settings', id: 'seg-1', disabled: false },
              { text: 'S2', iconName: 'settings', id: 'seg-2', disabled: false },
              { text: 'S3', iconName: 'settings', id: 'seg-3', disabled: false },
              { text: 'Segment-4 Logs Insights QL', iconName: 'settings', id: 'seg-4', disabled: false },
              { text: 'Segment-5', iconName: 'settings', id: 'seg-5', disabled: false },
              { text: 'Segment-6 Logs Insights QL', iconName: 'settings', id: 'seg-6', disabled: false },
            ]}
            onChange={event => setSelectedId(event.detail.selectedId)}
            selectedId={selectedId}
            label="Segmented Control Label"
          />
        </Box>
      </SpaceBetween>
    </article>
  );
}
