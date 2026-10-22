// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// Do-it-yourself Select and Multiselect built only from public Dropdown, OptionList, Button and Input,
// rendered next to the real Select and Multiselect for comparing focus, keyboard and screen reader behavior.
//
// Trigger ARIA through the public Button API:
// - Can set: aria-expanded (ariaExpanded), aria-haspopup="listbox" (ariaHaspopup), aria-controls (ariaControls),
//   aria-label (ariaLabel), aria-describedby (ariaDescribedby).
// - Cannot set: aria-labelledby (no ariaLabelledby prop, so the visible label is only linked through
//   ariaLabel text), role="combobox", aria-activedescendant (focus moves into the list instead), and
//   aria-required / aria-invalid that a form field trigger would carry.
// - aria-controls can only reference the OptionList root `id`, which is not the role="listbox" element itself
//   (the listbox gets a generated id).

import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';

import Box from '~components/box';
import Button, { ButtonProps } from '~components/button';
import Checkbox from '~components/checkbox';
import Dropdown from '~components/dropdown';
import Header from '~components/header';
import Input from '~components/input';
import Multiselect, { MultiselectProps } from '~components/multiselect';
import OptionList, { OptionListProps } from '~components/option-list';
import Select, { SelectProps } from '~components/select';
import SpaceBetween from '~components/space-between';

import AppContext, { AppContextType } from '../app/app-context';
import { SimplePage } from '../app/templates';

import styles from './in-dropdown.scss';

type PageContext = React.Context<AppContextType<{ longList?: boolean; expandToViewport?: boolean }>>;

const shortOptions: OptionListProps.Option[] = [
  { value: 'us-east-1', label: 'US East (N. Virginia)' },
  { value: 'us-east-2', label: 'US East (Ohio)' },
  { value: 'us-west-1', label: 'US West (N. California)' },
  { value: 'us-west-2', label: 'US West (Oregon)', description: 'Lowest cost region for this workload.' },
  { value: 'eu-west-1', label: 'Europe (Ireland)' },
  { value: 'eu-central-1', label: 'Europe (Frankfurt)' },
  { value: 'ap-south-1', label: 'Asia Pacific (Mumbai)' },
  { value: 'ap-northeast-1', label: 'Asia Pacific (Tokyo)', disabled: true, disabledReason: 'Not enabled' },
  { value: 'sa-east-1', label: 'South America (São Paulo)' },
  { value: 'ca-central-1', label: 'Canada (Central)' },
];

const longOptions: OptionListProps.Option[] = [
  ...shortOptions,
  ...Array.from({ length: 200 - shortOptions.length }, (_, index) => ({
    value: `option-${index + 1}`,
    label: `Option ${index + 1}`,
  })),
];

const i18nStrings: OptionListProps.I18nStrings = { selectedAriaLabel: 'Selected' };

function useDiyDropdown() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<ButtonProps.Ref>(null);
  const listRef = useRef<OptionListProps.Ref>(null);

  // Move focus into the list once the Dropdown has rendered its content.
  useEffect(() => {
    if (open) {
      listRef.current?.focus();
    }
  }, [open]);

  const close = ({ returnFocus }: { returnFocus: boolean }) => {
    setOpen(false);
    if (returnFocus) {
      triggerRef.current?.focus();
    }
  };

  return { open, setOpen, close, triggerRef, listRef };
}

function DiySelect({ options, expandToViewport }: { options: OptionListProps.Options; expandToViewport: boolean }) {
  const id = 'diy-select';
  const { open, setOpen, close, triggerRef, listRef } = useDiyDropdown();
  const [selectedOptions, setSelectedOptions] = useState<ReadonlyArray<OptionListProps.Option>>([]);
  const triggerText = selectedOptions[0]?.label ?? 'Choose an option';

  return (
    <SpaceBetween size="xs">
      <Header variant="h2" id={`${id}-label`}>
        DIY single select
      </Header>
      <Dropdown
        open={open}
        onOutsideClick={() => close({ returnFocus: false })}
        onEscape={() => close({ returnFocus: true })}
        minWidth={320}
        expandToViewport={expandToViewport}
        // No ariaRole here: OptionList already renders role="listbox", and wrapping it in another listbox is invalid.
        trigger={
          <Button
            id={`${id}-trigger`}
            ref={triggerRef}
            ariaLabel={`DIY single select, ${triggerText}`}
            ariaExpanded={open}
            ariaHaspopup="listbox"
            ariaControls={open ? `${id}-list` : undefined}
            iconName="caret-down-filled"
            iconAlign="right"
            onClick={() => setOpen(!open)}
          >
            {triggerText}
          </Button>
        }
        content={
          <div className={styles['scrollable-list']}>
            <OptionList
              id={`${id}-list`}
              ref={listRef}
              ariaLabelledby={`${id}-label`}
              selectionType="single"
              options={options}
              selectedOptions={selectedOptions}
              i18nStrings={i18nStrings}
              onChange={({ detail }) => {
                setSelectedOptions(detail.selectedOptions);
                close({ returnFocus: true });
              }}
            />
          </div>
        }
      />
      <Box variant="small" id={`${id}-value`}>
        Selected: {selectedOptions[0]?.value ?? 'none'}
      </Box>
    </SpaceBetween>
  );
}

function DiyMultiselect({
  options,
  expandToViewport,
}: {
  options: OptionListProps.Options;
  expandToViewport: boolean;
}) {
  const id = 'diy-multiselect';
  const { open, setOpen, close, triggerRef, listRef } = useDiyDropdown();
  const [selectedOptions, setSelectedOptions] = useState<ReadonlyArray<OptionListProps.Option>>([]);
  const [filteringText, setFilteringText] = useState('');
  const triggerText = selectedOptions.length > 0 ? `${selectedOptions.length} selected` : 'Choose options';

  const filteredOptions = useMemo(() => {
    const text = filteringText.trim().toLowerCase();
    return text ? options.filter(option => (option.label ?? '').toLowerCase().includes(text)) : options;
  }, [options, filteringText]);

  return (
    <SpaceBetween size="xs">
      <Header variant="h2" id={`${id}-label`}>
        DIY multiselect
      </Header>
      <Dropdown
        open={open}
        onOutsideClick={() => close({ returnFocus: false })}
        onEscape={() => close({ returnFocus: true })}
        minWidth={320}
        expandToViewport={expandToViewport}
        // No ariaRole here: OptionList already renders role="listbox", and wrapping it in another listbox is invalid.
        // Known limitation: while focus is in the filter input, arrow keys do not move the list highlight and
        // there is no aria-activedescendant link, unlike the real Multiselect. Users must Tab into the list.
        header={
          <Box padding="xs">
            <Input
              id={`${id}-filter`}
              type="search"
              ariaLabel="Filter options"
              placeholder="Filter options"
              value={filteringText}
              onChange={({ detail }) => setFilteringText(detail.value)}
            />
          </Box>
        }
        trigger={
          <Button
            id={`${id}-trigger`}
            ref={triggerRef}
            ariaLabel={`DIY multiselect, ${triggerText}`}
            ariaExpanded={open}
            ariaHaspopup="listbox"
            ariaControls={open ? `${id}-list` : undefined}
            iconName="caret-down-filled"
            iconAlign="right"
            onClick={() => setOpen(!open)}
          >
            {triggerText}
          </Button>
        }
        content={
          <OptionList
            id={`${id}-list`}
            className={styles['scrollable-list']}
            ref={listRef}
            ariaLabelledby={`${id}-label`}
            selectionType="multi"
            options={filteredOptions}
            selectedOptions={selectedOptions}
            i18nStrings={i18nStrings}
            onChange={({ detail }) => setSelectedOptions(detail.selectedOptions)}
          />
        }
      />
      <Box variant="small" id={`${id}-value`}>
        Selected: {selectedOptions.map(option => option.value).join(', ') || 'none'}
      </Box>
    </SpaceBetween>
  );
}

function RealSelect({ options, expandToViewport }: { options: SelectProps.Options; expandToViewport: boolean }) {
  const id = 'real-select';
  const [selectedOption, setSelectedOption] = useState<SelectProps.Option | null>(null);
  return (
    <SpaceBetween size="xs">
      <Header variant="h2" id={`${id}-label`}>
        Select
      </Header>
      <Select
        id={`${id}-trigger`}
        ariaLabelledby={`${id}-label`}
        placeholder="Choose an option"
        selectedAriaLabel="Selected"
        options={options}
        expandToViewport={expandToViewport}
        selectedOption={selectedOption}
        onChange={({ detail }) => setSelectedOption(detail.selectedOption)}
      />
    </SpaceBetween>
  );
}

function RealMultiselect({
  options,
  expandToViewport,
}: {
  options: MultiselectProps.Options;
  expandToViewport: boolean;
}) {
  const id = 'real-multiselect';
  const [selectedOptions, setSelectedOptions] = useState<ReadonlyArray<MultiselectProps.Option>>([]);
  return (
    <SpaceBetween size="xs">
      <Header variant="h2" id={`${id}-label`}>
        Multiselect
      </Header>
      <Multiselect
        id={`${id}-trigger`}
        ariaLabelledby={`${id}-label`}
        placeholder="Choose options"
        selectedAriaLabel="Selected"
        filteringType="auto"
        filteringPlaceholder="Filter options"
        filteringAriaLabel="Filter options"
        options={options}
        expandToViewport={expandToViewport}
        selectedOptions={selectedOptions}
        onChange={({ detail }) => setSelectedOptions(detail.selectedOptions)}
      />
    </SpaceBetween>
  );
}

export default function OptionListInDropdownPage() {
  const { urlParams, setUrlParams } = useContext(AppContext as PageContext);
  const longList = urlParams.longList ?? false;
  const expandToViewport = urlParams.expandToViewport ?? false;
  const options = longList ? longOptions : shortOptions;

  return (
    <SimplePage
      title="Option list: DIY select and multiselect in a Dropdown"
      settings={
        <SpaceBetween size="xs">
          <Checkbox
            id="long-list-toggle"
            checked={longList}
            onChange={({ detail }) => setUrlParams({ longList: detail.checked })}
          >
            Long list (200 options)
          </Checkbox>
          <Checkbox
            id="expand-to-viewport-toggle"
            checked={expandToViewport}
            onChange={({ detail }) => setUrlParams({ expandToViewport: detail.checked })}
          >
            Expand to viewport
          </Checkbox>
        </SpaceBetween>
      }
      screenshotArea={{}}
    >
      <div style={{ maxInlineSize: 520 }}>
        <SpaceBetween size="xl">
          <DiySelect options={options} expandToViewport={expandToViewport} />
          <DiyMultiselect options={options} expandToViewport={expandToViewport} />
          <RealSelect options={options} expandToViewport={expandToViewport} />
          <RealMultiselect options={options} expandToViewport={expandToViewport} />
        </SpaceBetween>
      </div>
    </SimplePage>
  );
}
