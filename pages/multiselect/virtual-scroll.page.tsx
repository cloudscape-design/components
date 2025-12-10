// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useContext, useState } from 'react';

import { Multiselect, MultiselectProps, SegmentedControl } from '~components';

import AppContext, { AppContextType } from '../app/app-context';
import { SimplePage } from '../app/templates';

type DemoContext = React.Context<AppContextType<{ type?: string }>>;

const options: MultiselectProps.Options = Array.from({ length: 1000 }, (_, i) => ({
  value: `${i}`,
  label: `Option ${i + 1}`,
}));

export default function () {
  const { urlParams } = useContext(AppContext as DemoContext);
  const [selectedType, setSelectedType] = useState(urlParams.type || 'multiselect');

  const [selectedMulti, setSelectedMulti] = useState<MultiselectProps.Options>(options.slice(0, 2));
  const [selectedMultiWithSelectAll, setSelectedMultiWithSelectAll] = useState<MultiselectProps.Options>([]);

  return (
    <SimplePage
      title="Multiselect Virtual Scroll"
      i18n={{}}
      screenshotArea={{}}
      settings={
        <SegmentedControl
          selectedId={selectedType}
          onChange={({ detail }) => setSelectedType(detail.selectedId)}
          options={[
            { id: 'multiselect', text: 'Multiselect' },
            { id: 'multiselect-select-all', text: 'Multiselect with Select All' },
          ]}
        />
      }
    >
      <div
        style={{
          height: 500,
          padding: 10,
          // Prevents dropdown from expanding outside of the screenshot area
          overflow: 'auto',
        }}
      >
        {selectedType === 'multiselect' && (
          <Multiselect
            placeholder="Multiselect with virtual scroll"
            selectedOptions={selectedMulti}
            options={options}
            filteringType="manual"
            finishedText="End of all results"
            errorText="verylongtextwithoutspacesverylongtextwithoutspacesverylongtextwithoutspacesverylongtextwithoutspacesverylongtextwithoutspacesverylongtextwithoutspacesverylongtextwithoutspacesverylongtextwithoutspacesverylongtextwithoutspacesverylongtextwithoutspacesverylongtextwithoutspacesverylongtextwithoutspacesverylongtextwithoutspaces"
            recoveryText="Retry"
            onLoadItems={() => {}}
            onChange={event => setSelectedMulti(event.detail.selectedOptions)}
            tokenLimit={2}
            virtualScroll={true}
            expandToViewport={false}
            ariaLabel="multiselect demo"
            data-testid="multiselect-demo"
          />
        )}

        {selectedType === 'multiselect-select-all' && (
          <Multiselect
            placeholder="Multiselect with virtual scroll and select all"
            selectedOptions={selectedMultiWithSelectAll}
            options={options}
            filteringType="auto"
            finishedText="End of all results"
            onChange={event => setSelectedMultiWithSelectAll(event.detail.selectedOptions)}
            enableSelectAll={true}
            virtualScroll={true}
            expandToViewport={false}
            ariaLabel="multiselect with select all demo"
            data-testid="multiselect-select-all-demo"
          />
        )}
      </div>
    </SimplePage>
  );
}
