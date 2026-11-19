// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useRef } from 'react';

import Input from '~components/input';
import SegmentedControl from '~components/segmented-control';

import AppContext, { AppContextType } from '../app/app-context';

type PageContext = React.Context<
  AppContextType<{
    selectedId: 'seg-1' | 'seg-2';
  }>
>;

export default function SegmentedControlPage() {
  const firstInputRef = useRef<HTMLInputElement>(null);

  const {
    urlParams: { selectedId = 'seg-1' },
    setUrlParams,
  } = useContext(AppContext as PageContext);

  return (
    <article>
      <h1>SegmentedControl demo</h1>
      <Input id="focus-target" ref={firstInputRef} ariaLabel="Input Label" value="" readOnly={true} />
      <SegmentedControl
        options={[
          { text: 'Segment-1', iconName: 'settings', id: 'seg-1', disabled: false },
          { text: 'Segment-2', iconName: 'settings', id: 'seg-2', disabled: false },
        ]}
        onChange={event => setUrlParams({ selectedId: event.detail.selectedId as any })}
        selectedId={selectedId}
        label="Segmented Control Label"
      />
      <Input ariaLabel="Input Label" value="" readOnly={true} onFocus={() => firstInputRef.current?.focus()} />
    </article>
  );
}
