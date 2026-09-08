// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import ButtonDropdown, { ButtonDropdownProps } from '~components/button-dropdown';
import Checkbox from '~components/checkbox';
import FormField from '~components/form-field';
import RadioGroup from '~components/radio-group';
import SpaceBetween from '~components/space-between';

import { SimplePage } from '../app/templates';

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
  const [expandToViewport, setExpandToViewport] = useState(false);
  const onItemClick = (e: CustomEvent<ButtonDropdownProps.ItemClickDetails>) => console.log('clicked', e.detail.id);

  // Interactive: filteringType switcher
  const [filteringType, setFilteringType] = useState<ButtonDropdownProps.FilteringType>('manual');
  const [switcherItems, setSwitcherItems] = useState<ButtonDropdownProps.Items>(SOURCE_ITEMS);

  // Interactive: server delay control
  const [serverDelay, setServerDelay] = useState('400');
  const [serverItems, setServerItems] = useState<ButtonDropdownProps.Items>(SOURCE_ITEMS);
  const [serverStatus, setServerStatus] = useState<ButtonDropdownProps.AsyncLoadingStatusType>('finished');

  // Preconfigured: client-side manual filtering
  const [clientItems, setClientItems] = useState<ButtonDropdownProps.Items>(SOURCE_ITEMS);

  // Preconfigured: server-side manual filtering (fixed 400 ms)
  const [preItems, setPreItems] = useState<ButtonDropdownProps.Items>(SOURCE_ITEMS);
  const [preStatus, setPreStatus] = useState<ButtonDropdownProps.AsyncLoadingStatusType>('finished');

  return (
    <SimplePage
      title="ButtonDropdown manual filtering"
      settings={
        <Checkbox checked={expandToViewport} onChange={e => setExpandToViewport(e.detail.checked)}>
          Expand to viewport
        </Checkbox>
      }
    >
      <SpaceBetween size="xxl">
        {/* Interactive: filteringType switcher */}
        <div>
          <h2>Interactive - filteringType switcher</h2>
          <p>Switch between none, auto, and manual on the same dropdown to compare behavior.</p>
          <FormField label="filteringType">
            <RadioGroup
              value={filteringType}
              onChange={e => setFilteringType(e.detail.value as ButtonDropdownProps.FilteringType)}
              items={[
                { value: 'none', label: 'none' },
                { value: 'auto', label: 'auto (client-side)' },
                { value: 'manual', label: 'manual (consumer-controlled)' },
              ]}
            />
          </FormField>
          <br />
          <ButtonDropdown
            items={filteringType === 'manual' ? switcherItems : SOURCE_ITEMS}
            filteringType={filteringType}
            filteringPlaceholder="Filter actions"
            noMatch={<span>No actions match.</span>}
            expandToViewport={expandToViewport}
            filteringResultsText={(m, t) => `${m} of ${t}`}
            onItemClick={onItemClick}
            onLoadItems={({ detail: { filteringText } }) => {
              setSwitcherItems(filterItems(filteringText));
            }}
          >
            Actions
          </ButtonDropdown>
        </div>

        {/* Interactive: server delay control */}
        <div>
          <h2>Interactive - server delay control</h2>
          <p>
            Set delay to 0 ms to stay in the loading state long enough to inspect it, or use 1500 ms for slow network
            testing.
          </p>
          <FormField label="Simulated server delay">
            <RadioGroup
              value={serverDelay}
              onChange={e => setServerDelay(e.detail.value)}
              items={[
                { value: '0', label: '0 ms (instant)' },
                { value: '400', label: '400 ms' },
                { value: '1500', label: '1500 ms (slow)' },
              ]}
            />
          </FormField>
          <br />
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
        </div>

        {/* Preconfigured: client-side manual */}
        <div>
          <h2>Preconfigured - client-side manual filtering</h2>
          <p>App filters synchronously inside onLoadItems. No status indicators needed.</p>
          <ButtonDropdown
            items={clientItems}
            filteringType="manual"
            filteringPlaceholder="Filter actions"
            noMatch={<span>No actions match. Try a different keyword.</span>}
            expandToViewport={expandToViewport}
            filteringResultsText={(m, t) => `${m} of ${t} matches`}
            onItemClick={onItemClick}
            onLoadItems={({ detail: { filteringText } }) => {
              setClientItems(filterItems(filteringText));
            }}
          >
            Actions
          </ButtonDropdown>
        </div>

        {/* Preconfigured: server-side manual */}
        <div>
          <h2>Preconfigured - server-side manual filtering</h2>
          <p>App calls a fake API on every filter change. Loading spinner appears while the request is in flight.</p>
          <ButtonDropdown
            items={preItems}
            filteringType="manual"
            filteringPlaceholder="Search actions"
            asyncLoadingProps={{
              statusType: preStatus,
              loadingText: () => 'Searching...',
              empty: () => 'No actions found',
            }}
            noMatch={<span>No actions match. Try a different keyword.</span>}
            expandToViewport={expandToViewport}
            filteringResultsText={(m, t) => `${m} of ${t} matches`}
            onItemClick={onItemClick}
            onLoadItems={({ detail: { filteringText } }) => {
              setPreStatus('loading');
              setPreItems([]);
              simulateServer(filteringText, 400).then(results => {
                setPreItems(results);
                setPreStatus('finished');
              });
            }}
          >
            Actions
          </ButtonDropdown>
        </div>
      </SpaceBetween>
    </SimplePage>
  );
}
