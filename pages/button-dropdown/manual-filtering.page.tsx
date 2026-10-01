// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useState } from 'react';

import ButtonDropdown, { ButtonDropdownProps } from '~components/button-dropdown';
import Checkbox from '~components/checkbox';
import FormField from '~components/form-field';
import RadioGroup from '~components/radio-group';
import SpaceBetween from '~components/space-between';

import AppContext, { AppContextType } from '../app/app-context';
import { SimplePage } from '../app/templates';

type Scenario = 'client' | 'server';

type PageContext = React.Context<
  AppContextType<{
    scenario: Scenario;
    expandToViewport: boolean;
    filteringType: ButtonDropdownProps.FilteringType;
    serverDelay: string;
  }>
>;

const SOURCE_ITEMS: ButtonDropdownProps.Item[] = [
  { id: 'cut', text: 'Cut', labelTag: 'Ctrl+X' },
  { id: 'copy', text: 'Copy', labelTag: 'Ctrl+C' },
  { id: 'paste', text: 'Paste', labelTag: 'Ctrl+V' },
  { id: 'undo', text: 'Undo', labelTag: 'Ctrl+Z' },
  { id: 'redo', text: 'Redo', labelTag: 'Ctrl+Y' },
  { id: 'select-all', text: 'Select all', labelTag: 'Ctrl+A' },
  { id: 'find', text: 'Find and replace', secondaryText: 'Search within document', labelTag: 'Ctrl+H' },
  { id: 'preferences', text: 'Preferences', secondaryText: 'Configure editor settings' },
];

function filterItems(text: string): ButtonDropdownProps.Items {
  const q = text.toLowerCase();
  return SOURCE_ITEMS.filter(i => (i.text ?? '').toLowerCase().includes(q));
}

function simulateServer(text: string, delayMs: number): Promise<ButtonDropdownProps.Items> {
  return new Promise(resolve => setTimeout(() => resolve(filterItems(text)), delayMs));
}

export default function ButtonDropdownManualFilteringPage() {
  // Page configuration lives in the URL so that each setup is directly linkable and targetable by
  // integration tests. Request results below stay in local state.
  const {
    urlParams: { scenario = 'client', expandToViewport = false, filteringType = 'manual', serverDelay = '400' },
    setUrlParams,
  } = useContext(AppContext as PageContext);
  const onItemClick = (e: CustomEvent<ButtonDropdownProps.ItemClickDetails>) => console.log('clicked', e.detail.id);

  // Scenario "client": items filtered synchronously by the consumer when filteringType is manual.
  const [clientItems, setClientItems] = useState<ButtonDropdownProps.Items>(SOURCE_ITEMS);

  // Scenario "server": items fetched from a simulated server with a configurable delay.
  const [serverItems, setServerItems] = useState<ButtonDropdownProps.Items>(SOURCE_ITEMS);
  const [serverStatus, setServerStatus] = useState<ButtonDropdownProps.AsyncLoadingStatusType>('finished');

  const content =
    scenario === 'client' ? (
      <ButtonDropdown
        items={filteringType === 'manual' ? clientItems : SOURCE_ITEMS}
        filteringType={filteringType}
        filteringPlaceholder="Filter actions"
        noMatch={<span>No actions match.</span>}
        expandToViewport={expandToViewport}
        filteringResultsText={(m, t) => `${m} of ${t}`}
        onItemClick={onItemClick}
        onLoadItems={({ detail: { filteringText } }) => {
          setClientItems(filterItems(filteringText));
        }}
      >
        Actions
      </ButtonDropdown>
    ) : (
      <ButtonDropdown
        items={serverItems}
        filteringType="manual"
        filteringPlaceholder="Search actions"
        asyncLoadingProps={{
          statusType: serverStatus,
          loadingText: () => 'Searching...',
          empty: () => 'No actions found',
        }}
        noMatch={<span>No actions match.</span>}
        expandToViewport={expandToViewport}
        filteringResultsText={(m, t) => `${m} of ${t}`}
        onItemClick={onItemClick}
        onLoadItems={({ detail: { filteringText } }) => {
          setServerStatus('loading');
          setServerItems([]);
          simulateServer(filteringText, parseInt(serverDelay, 10)).then(results => {
            setServerItems(results);
            setServerStatus('finished');
          });
        }}
      >
        Actions
      </ButtonDropdown>
    );

  return (
    <SimplePage
      title="ButtonDropdown manual filtering"
      settings={
        <SpaceBetween size="m" direction="horizontal">
          <FormField label="Scenario">
            <RadioGroup
              value={scenario}
              onChange={e => setUrlParams({ scenario: e.detail.value as Scenario })}
              items={[
                { value: 'client', label: 'Client-side filtering' },
                { value: 'server', label: 'Server-side filtering' },
              ]}
            />
          </FormField>
          {scenario === 'client' && (
            <FormField label="filteringType">
              <RadioGroup
                value={filteringType}
                onChange={e => setUrlParams({ filteringType: e.detail.value as ButtonDropdownProps.FilteringType })}
                items={[
                  { value: 'none', label: 'none' },
                  { value: 'auto', label: 'auto (client-side)' },
                  { value: 'manual', label: 'manual (consumer-controlled)' },
                ]}
              />
            </FormField>
          )}
          {scenario === 'server' && (
            <FormField label="Simulated server delay">
              <RadioGroup
                value={serverDelay}
                onChange={e => setUrlParams({ serverDelay: e.detail.value })}
                items={[
                  { value: '0', label: '0 ms (instant)' },
                  { value: '400', label: '400 ms' },
                  { value: '1500', label: '1500 ms (slow)' },
                ]}
              />
            </FormField>
          )}
          <Checkbox checked={expandToViewport} onChange={e => setUrlParams({ expandToViewport: e.detail.checked })}>
            Expand to viewport
          </Checkbox>
        </SpaceBetween>
      }
    >
      {content}
    </SimplePage>
  );
}
