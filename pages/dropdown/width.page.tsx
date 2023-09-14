// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useState } from 'react';
import Select, { SelectProps } from '~components/select';
import Multiselect, { MultiselectProps } from '~components/multiselect';
import Autosuggest from '~components/autosuggest';
import ButtonDropdown from '~components/button-dropdown';
import PropertyFilter, { PropertyFilterProps } from '~components/property-filter';
import AppContext, { AppContextType } from '../app/app-context';
import SpaceBetween from '~components/space-between';
import ColumnLayout from '~components/column-layout';
import { range } from 'lodash';
import { i18nStrings as propertyFilterI18n } from '../property-filter/common-props';

type DemoContext = React.Context<
  AppContextType<{
    component: string;
    triggerWidth: string;
    virtualScroll: boolean;
    expandToViewport: boolean;
    containerWidth: string;
  }>
>;

const shortOptionText = 'Short text';
const longOptionText =
  'A very very very very very very very very very very very very very very very very very very very very very very very very very very long text';

const componentOptions: ReadonlyArray<SelectProps.Option> = [
  {
    value: 'autosuggest',
    label: 'Autosuggest',
  },
  {
    value: 'button-dropdown',
    label: 'Button dropdown',
  },
  {
    value: 'multiselect',
    label: 'Multiselect',
  },
  {
    value: 'select',
    label: 'Select',
  },
  {
    value: 'property-filter',
    label: 'Property filter',
  },
];

function SettingsForm() {
  const { urlParams, setUrlParams } = useContext(AppContext as DemoContext);

  return (
    <ColumnLayout columns={4}>
      <label>
        Component{' '}
        <select
          value={componentOptions.find(option => option.value === urlParams.component)?.value || ''}
          onChange={event => setUrlParams({ component: event.target.value })}
        >
          <option value="" disabled={true}>
            Select a component
          </option>
          {componentOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <label>
        Trigger width{' '}
        <input
          placeholder={'example: 300px'}
          value={urlParams.triggerWidth || ''}
          onChange={event => setUrlParams({ triggerWidth: event.target.value })}
        />
      </label>
      <label>
        Container width{' '}
        <input
          placeholder={'example: 500px'}
          value={urlParams.containerWidth || ''}
          onChange={event => setUrlParams({ containerWidth: event.target.value })}
        />
      </label>
      <label>
        <input
          type="checkbox"
          checked={urlParams.expandToViewport}
          onChange={event => setUrlParams({ expandToViewport: event.target.checked })}
        />{' '}
        expandToViewport
      </label>
      {['autosuggest', 'multiselect', 'property-filter', 'select'].includes(urlParams.component) && (
        <label>
          <input
            type="checkbox"
            checked={urlParams.virtualScroll}
            onChange={event => setUrlParams({ virtualScroll: event.target.checked })}
          />{' '}
          virtualScroll
        </label>
      )}
    </ColumnLayout>
  );
}

function CustomAutosuggest({ expandToViewport, virtualScroll }: { expandToViewport: boolean; virtualScroll: boolean }) {
  const [value, setValue] = useState('');
  return (
    <Autosuggest
      value={value}
      onChange={e => setValue(e.detail.value)}
      options={[
        { value: longOptionText, tags: ['tag1', 'tag2'], filteringTags: ['bla', 'opt'], description: 'description1' },
        { value: shortOptionText, labelTag: 'This is a label tag' },
      ]}
      ariaLabel="simple autosuggest"
      virtualScroll={virtualScroll}
      expandToViewport={expandToViewport}
    />
  );
}

function CustomButtonDropdown({ expandToViewport }: { expandToViewport: boolean }) {
  return (
    <ButtonDropdown
      expandToViewport={expandToViewport}
      expandableGroups={true}
      items={[
        {
          id: 'category1',
          text: longOptionText,
        },
        {
          id: 'category2',
          text: shortOptionText,
        },
      ]}
    >
      Open dropdown
    </ButtonDropdown>
  );
}

function CustomMultiSelect({ expandToViewport, virtualScroll }: { expandToViewport: boolean; virtualScroll: boolean }) {
  const [selectedOptions, setSelectedOptions] = useState<ReadonlyArray<MultiselectProps.Option>>([]);
  return (
    <Multiselect
      expandToViewport={expandToViewport}
      virtualScroll={virtualScroll}
      options={[
        { value: 'first', label: longOptionText },
        {
          value: 'second',
          label: shortOptionText,
        },
      ]}
      selectedOptions={selectedOptions}
      onChange={({ detail }) => setSelectedOptions(detail.selectedOptions)}
    />
  );
}

function CustomSelect({ expandToViewport, virtualScroll }: { expandToViewport: boolean; virtualScroll: boolean }) {
  const [selectedOption, setSelectedOption] = useState<SelectProps['selectedOption']>(null);
  return (
    <Select
      selectedOption={selectedOption}
      options={[
        {
          value: longOptionText,
          tags: ['tag1', 'tag2'],
          filteringTags: ['bla', 'opt'],
          description: 'description1',
        },
        { value: shortOptionText },
      ]}
      onChange={event => setSelectedOption(event.detail.selectedOption)}
      ariaLabel={'simple select'}
      filteringType={'auto'}
      virtualScroll={virtualScroll}
      expandToViewport={expandToViewport}
    />
  );
}

function CustomPropertyFilter({
  expandToViewport,
  virtualScroll,
}: {
  expandToViewport: boolean;
  virtualScroll: boolean;
}) {
  const [query, setQuery] = useState<PropertyFilterProps['query']>({
    tokens: [{ operator: ':', value: '1' } as const],
    operation: 'and',
  });

  return (
    <PropertyFilter
      query={query}
      onChange={e => setQuery(e.detail)}
      filteringProperties={[
        {
          key: 'property',
          operators: ['=', '!=', '>', '<', '<=', '>='],
          propertyLabel: longOptionText,
          groupValuesLabel: `Label values`,
        },
      ]}
      filteringOptions={range(100).map(value => ({
        propertyKey: 'property',
        value: value + '',
      }))}
      filteringLoadingText={'loading text'}
      filteringErrorText={'error text'}
      filteringRecoveryText={'recovery text'}
      filteringFinishedText={'finished text'}
      i18nStrings={propertyFilterI18n}
      expandToViewport={expandToViewport}
      virtualScroll={virtualScroll}
    />
  );
}

export default function () {
  const { urlParams } = useContext(AppContext as DemoContext);

  const { component, triggerWidth, virtualScroll, expandToViewport, containerWidth } = urlParams;
  return (
    <article>
      <h1>Dropdown width</h1>
      <SpaceBetween size="l">
        <SettingsForm />
        <div style={{ width: containerWidth, height: '300px', overflow: 'hidden', border: `1px solid blue` }}>
          <div style={{ width: triggerWidth }}>
            {component === 'autosuggest' && (
              <CustomAutosuggest virtualScroll={virtualScroll} expandToViewport={expandToViewport} />
            )}
            {component === 'button-dropdown' && <CustomButtonDropdown expandToViewport={expandToViewport} />}
            {component === 'multiselect' && (
              <CustomMultiSelect expandToViewport={expandToViewport} virtualScroll={virtualScroll} />
            )}
            {component === 'property-filter' && (
              <CustomPropertyFilter expandToViewport={expandToViewport} virtualScroll={virtualScroll} />
            )}
            {component === 'select' && (
              <CustomSelect expandToViewport={expandToViewport} virtualScroll={virtualScroll} />
            )}
          </div>
        </div>
      </SpaceBetween>
    </article>
  );
}
