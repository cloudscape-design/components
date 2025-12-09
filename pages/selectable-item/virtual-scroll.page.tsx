// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useContext, useState } from 'react';

import { Multiselect, MultiselectProps, SegmentedControl, SpaceBetween } from '~components';
import Autosuggest, { AutosuggestProps } from '~components/autosuggest';
import PropertyFilter, { PropertyFilterProps } from '~components/property-filter';
import Select, { SelectProps } from '~components/select';

import AppContext, { AppContextType } from '../app/app-context';
import { SimplePage } from '../app/templates';

type DemoContext = React.Context<AppContextType<{ type?: string }>>;

const options: SelectProps.Options = Array.from({ length: 1000 }, (_, i) => ({
  value: `${i}`,
  label: `Option ${i + 1}`,
}));

const autosuggestOptions: AutosuggestProps.Options = Array.from({ length: 1000 }, (_, i) => ({
  value: `Option ${i + 1}`,
  description: `Description for option ${i + 1}`,
}));

export default function () {
  const { urlParams } = useContext(AppContext as DemoContext);
  const [selectedType, setSelectedType] = useState(urlParams.type || 'select');

  const [selected, setSelected] = useState<SelectProps['selectedOption']>(null);
  const [selectedMulti, setSelectedMulti] = useState<MultiselectProps.Options>(options.slice(0, 2));
  const [selectedMultiWithSelectAll, setSelectedMultiWithSelectAll] = useState<MultiselectProps.Options>([]);
  const [autosuggestValue, setAutosuggestValue] = useState('');
  const [query, setQuery] = useState<PropertyFilterProps.Query>({ tokens: [], operation: 'and' });

  return (
    <SimplePage title="Virtual Scroll" i18n={{}} screenshotArea={{}}>
      <div
        style={{
          height: 500,
          padding: 10,
          // Prevents dropdown from expanding outside of the screenshot area
          overflow: 'auto',
        }}
      >
        <SpaceBetween size="m">
          <SegmentedControl
            selectedId={selectedType}
            onChange={({ detail }) => setSelectedType(detail.selectedId)}
            options={[
              { id: 'select', text: 'Select' },
              { id: 'multiselect', text: 'Multiselect' },
              { id: 'multiselect-select-all', text: 'Multiselect with Select All' },
              { id: 'autosuggest', text: 'Autosuggest' },
              { id: 'property-filter', text: 'PropertyFilter' },
            ]}
          />

          {selectedType === 'select' && (
            <Select
              placeholder="Select with virtual scroll"
              selectedOption={selected}
              options={options}
              filteringType="auto"
              finishedText="End of all results"
              onChange={event => setSelected(event.detail.selectedOption)}
              virtualScroll={true}
              expandToViewport={false}
              ariaLabel="select demo"
              data-testid="select-demo"
            />
          )}

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

          {selectedType === 'autosuggest' && (
            <Autosuggest
              value={autosuggestValue}
              options={autosuggestOptions}
              onChange={event => setAutosuggestValue(event.detail.value)}
              enteredTextLabel={value => `Use: "${value}"`}
              placeholder="Autosuggest with virtual scroll"
              ariaLabel="autosuggest demo"
              virtualScroll={true}
              expandToViewport={false}
              data-testid="autosuggest-demo"
            />
          )}

          {selectedType === 'property-filter' && (
            <PropertyFilter
              query={query}
              onChange={({ detail }) => setQuery(detail)}
              filteringProperties={[
                {
                  key: 'property',
                  operators: ['=', '!='],
                  propertyLabel: 'Property',
                  groupValuesLabel: 'Property values',
                },
              ]}
              filteringOptions={options.map(opt => ({ propertyKey: 'property', value: opt.value! }))}
              virtualScroll={true}
              expandToViewport={false}
              data-testid="property-filter-demo"
            />
          )}
        </SpaceBetween>
      </div>
    </SimplePage>
  );
}
