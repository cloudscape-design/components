// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import SegmentedControl from '~components/segmented-control';

export default function SegmentedControlEdgeCase() {
  return (
    <article>
      <h1>SegmentedControl Edge Case</h1>
      <SegmentedControl
        options={[
          { text: 'Segment-1', iconName: 'settings', id: 'seg-1', disabled: false },
          { text: 'Segment-2', iconName: 'settings', id: 'seg-2', disabled: true },
          { text: 'Segment-3', iconName: 'settings', id: 'seg-3', disabled: false },
          { text: 'Segment-4', iconName: 'settings', id: 'seg-4', disabled: false },
          { text: 'Segment-5', iconName: 'settings', id: 'seg-5', disabled: false },
        ]}
        selectedId="seg-5"
        label="Segmented Control Label"
      />
    </article>
  );
}
