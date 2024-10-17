// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useState } from 'react';
import { range } from 'lodash';

import Autosuggest from '~components/autosuggest';
import Button from '~components/button';
import ButtonDropdown from '~components/button-dropdown';
import Popover from '~components/popover';
import PropertyFilter, { PropertyFilterProps } from '~components/property-filter';
import Select, { SelectProps } from '~components/select';
import SpaceBetween from '~components/space-between';

import AppContext, { AppContextType } from '../app/app-context';
import { i18nStrings as propertyFilterI18n, labels as propertyFilterLabels } from '../property-filter/common-props';
import ScreenshotArea from '../utils/screenshot-area';
import { SampleDropdown, SampleModal } from './common';

import styles from './styles.scss';

const autosuggestOptions = [
  {
    value: 'Option 0',
    tags: ['tag1', 'tag2'],
    filteringTags: ['bla', 'opt'],
    description: 'description1 long enough to stretch the dropdown beyond the trigger width',
  },
  { value: 'Option 1', labelTag: 'This is a label tag' },
  { value: 'Option 2' },
  { value: 'Option 3', description: 'description2' },
  { value: 'Option 4' },
  { value: 'Option 5' },
  { value: 'Option 6' },
  { value: 'Option 7' },
  { value: 'Option 8' },
  { value: 'Option 9' },
  { value: 'Option 10' },
  { value: 'Option 11' },
  { value: 'Option 12' },
  { value: 'Option 13' },
  { value: 'Option 14' },
  { value: 'Option 15' },
  { value: 'Option 16' },
  { value: 'Option 17' },
  { value: 'Option 18' },
];

const selectOptions: SelectProps.Options = [
  { value: 'first', label: 'Simple' },
  { value: 'second', label: 'With small icon', iconName: 'folder' },
  {
    value: 'third',
    label: 'With big icon icon',
    description: 'Very big option',
    iconSvg: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" focusable="false">
        <circle cx="8" cy="8" r="7" />
        <circle cx="8" cy="8" r="3" />
      </svg>
    ),
  },
  {
    label: 'Option group',
    options: [{ value: 'forth', label: 'Nested option' }],
  },
  { value: 'fifth', label: 'Option 5' },
  { value: 'sixth', label: 'Option 6' },
  { value: 'seventh', label: 'Option 7' },
];

export const buttonDropdownItems = [
  {
    id: 'category1',
    text: 'category1',
    items: [...Array(2)].map((_, index) => ({
      id: 'category1Subitem' + index,
      text: 'Sub item ' + index,
    })),
  },
  {
    id: 'category2',
    text: 'category2',
    items: [...Array(50)].map((_, index) => ({
      id: 'category2Subitem' + index,
      text: 'Cat 2 Sub item ' + index,
    })),
  },
  ...[...Array(10)].map((_, index) => ({
    id: 'item' + index,
    text: 'Item ' + index,
  })),
  {
    id: 'category3',
    text: 'category3',
    items: [...Array(50)].map((_, index) => ({
      id: 'category3Subitem' + index,
      text: 'Sub item ' + index,
    })),
  },
];

const propertyFilterOptions = range(100).map(value => ({
  propertyKey: 'property',
  value: value + '',
}));

interface ComponentProps {
  id: string;
  expandToViewport: boolean;
}

const components = {
  Autosuggest: ({ id, expandToViewport }: ComponentProps) => {
    const [value, setValue] = useState('');

    return (
      <div style={{ inlineSize: '200px' }}>
        <Autosuggest
          id={id}
          value={value}
          options={autosuggestOptions}
          onChange={e => setValue(e.detail.value)}
          enteredTextLabel={(value: string) => `Use: ${value}`}
          ariaLabel="simple autosuggest"
          empty={<span>Nothing found</span>}
          expandToViewport={expandToViewport}
        />
      </div>
    );
  },
  Select: ({ id, expandToViewport }: ComponentProps) => {
    const [selectedOption, setSelectedOption] = useState<SelectProps['selectedOption']>(null);

    return (
      <Select
        id={id}
        placeholder="Select an option"
        selectedOption={selectedOption}
        options={selectOptions}
        finishedText="End of all results"
        onChange={event => setSelectedOption(event.detail.selectedOption)}
        expandToViewport={expandToViewport}
        aria-label="sample select"
      />
    );
  },
  ButtonDropdown: ({ id, expandToViewport }: ComponentProps) => {
    return (
      <ButtonDropdown id={id} expandToViewport={expandToViewport} expandableGroups={true} items={buttonDropdownItems}>
        Open dropdown
      </ButtonDropdown>
    );
  },
  PropertyFilter: ({ id, expandToViewport }: ComponentProps) => {
    const [query, setQuery] = useState<PropertyFilterProps['query']>({
      tokens: [{ operator: ':', value: '1' } as const],
      operation: 'and',
    });

    return (
      <PropertyFilter
        id={id}
        query={query}
        onChange={e => setQuery(e.detail)}
        filteringProperties={[
          {
            key: 'property',
            operators: ['=', '!=', '>', '<', '<=', '>='],
            propertyLabel: 'label',
            groupValuesLabel: `Label values`,
          },
        ]}
        filteringOptions={propertyFilterOptions}
        {...propertyFilterLabels}
        i18nStrings={propertyFilterI18n}
        expandToViewport={expandToViewport}
      />
    );
  },
};

interface DemoConfiguration {
  componentType: keyof typeof components;
  expandToViewport: boolean;
}

export type DropdownExpandableContext = React.Context<AppContextType<DemoConfiguration>>;

export function Configurator({
  componentType,
  expandToViewport,
  onChange,
}: DemoConfiguration & {
  onChange: (value: Partial<DemoConfiguration>) => void;
}) {
  return (
    <SpaceBetween size="m" direction="horizontal">
      <select
        value={componentType}
        onChange={event => onChange({ componentType: event.target.value as DemoConfiguration['componentType'] })}
        aria-label="select component"
      >
        {Object.keys(components).map(key => (
          <option key={key} value={key}>
            {key}
          </option>
        ))}
      </select>
      <label>
        <input
          type="checkbox"
          checked={expandToViewport}
          onChange={event => onChange({ expandToViewport: event.target.checked })}
        />{' '}
        expandToViewport
      </label>
    </SpaceBetween>
  );
}

export function DropdownsDemo({ componentType, expandToViewport }: DemoConfiguration) {
  const Component = components[componentType];
  return (
    <div className={styles['wide-container']}>
      <div className={styles.row}>
        <Component id="top-left" expandToViewport={expandToViewport} />
        <Component id="top-right" expandToViewport={expandToViewport} />
      </div>
      <div className={styles.row}>
        <SampleModal id="show-modal">
          <SpaceBetween direction="horizontal" size="m">
            <Component id="in-modal" expandToViewport={expandToViewport} />
            <Popover
              size="medium"
              header="Sample popover"
              content={<Component id="in-modal-and-popover" expandToViewport={expandToViewport} />}
              dismissAriaLabel="Close"
              triggerType="custom"
            >
              <Button>Show popover</Button>
            </Popover>
            <SampleDropdown id="show-in-modal-dropdown">
              <Component id="in-modal-and-dropdown" expandToViewport={expandToViewport} />
            </SampleDropdown>
          </SpaceBetween>
        </SampleModal>

        <SampleDropdown id="show-dropdown">
          <Component id="in-dropdown" expandToViewport={expandToViewport} />
        </SampleDropdown>

        <Popover
          size="medium"
          header="Sample popover"
          content={<Component id="in-popover" expandToViewport={expandToViewport} />}
          dismissAriaLabel="Close"
          triggerType="custom"
        >
          <Button id="show-popover">Show popover</Button>
        </Popover>
      </div>
      <div className={styles.row}>
        <Component id="bottom-left" expandToViewport={expandToViewport} />
        <Component id="bottom-right" expandToViewport={expandToViewport} />
      </div>
    </div>
  );
}

export default function () {
  const {
    urlParams: { componentType = 'Autosuggest', expandToViewport = true },
    setUrlParams,
  } = useContext(AppContext as DropdownExpandableContext);
  return (
    <ScreenshotArea>
      <h1>Expandable dropdown scenarios</h1>
      <Configurator componentType={componentType} expandToViewport={expandToViewport} onChange={setUrlParams} />
      <DropdownsDemo componentType={componentType} expandToViewport={expandToViewport} />
    </ScreenshotArea>
  );
}
