// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useLayoutEffect, useState } from 'react';

import {
  Autosuggest,
  Button,
  ButtonGroup,
  Calendar,
  DatePicker,
  ExpandableSection,
  Grid,
  Input,
  Multiselect,
  SegmentedControl,
  Select,
  SelectProps,
  SpaceBetween,
  ToggleButton,
} from '~components';
import { MultiselectProps } from '~components/multiselect';
import { applyTheme, Theme } from '~components/theming';

function Buttons() {
  const [selectedSegment, setSelectedSegment] = useState('seg-1');
  const [toggle1, setToggle1] = useState(true);
  const [toggle2, setToggle2] = useState(false);
  const [toggle3, setToggle3] = useState(false);
  const [toggle4, setToggle4] = useState(true);
  const [toggle5, setToggle5] = useState(false);
  const [toggle6, setToggle6] = useState(true);

  return (
    <SpaceBetween size="l">
      <SpaceBetween direction="horizontal" size="m" alignItems="center">
        <Button variant="primary">Primary button</Button>
        <Button variant="normal">Secondary button</Button>
        <Button iconName="refresh" ariaLabel="Icon in normal button" />
        <Button variant="link">Tertiary button</Button>
      </SpaceBetween>
      <SpaceBetween direction="horizontal" size="m" alignItems="center">
        <Button variant="primary" disabled={true}>
          Primary button
        </Button>
        <Button variant="normal" disabled={true}>
          Secondary button
        </Button>
        <Button iconName="refresh" disabled={true} ariaLabel="Disabled refresh button" />
        <Button variant="link" disabled={true}>
          Tertiary button
        </Button>
      </SpaceBetween>
      <SpaceBetween direction="horizontal" size="m" alignItems="center">
        <Button variant="inline-icon" iconName="copy" ariaLabel="Inline icon button" />
        <Button variant="icon" iconName="add-plus" ariaLabel="Icon button" />
        <ButtonGroup
          ariaLabel="Button group"
          items={[
            {
              type: 'icon-button',
              id: 'copy',
              iconName: 'upload',
              text: 'Upload files',
            },
            {
              type: 'icon-button',
              id: 'expand',
              iconName: 'expand',
              text: 'Go full page',
            },
          ]}
          variant="icon"
        />
      </SpaceBetween>
      <SpaceBetween direction="horizontal" size="m" alignItems="center">
        <ToggleButton
          onChange={({ detail }) => setToggle1(detail.pressed)}
          pressed={toggle1}
          iconName="star"
          pressedIconName="star-filled"
        >
          Toggle button
        </ToggleButton>
        <ToggleButton
          onChange={({ detail }) => setToggle2(detail.pressed)}
          pressed={toggle2}
          iconName="star"
          pressedIconName="star-filled"
        >
          Toggle button
        </ToggleButton>
        <ToggleButton
          onChange={({ detail }) => setToggle3(detail.pressed)}
          pressed={toggle3}
          iconName="star"
          pressedIconName="star-filled"
          ariaLabel="Toggle button"
        />
        <ToggleButton
          onChange={({ detail }) => setToggle4(detail.pressed)}
          pressed={toggle4}
          iconName="star"
          pressedIconName="star-filled"
          ariaLabel="Toggle button pressed"
        />
        <ToggleButton
          variant="icon"
          onChange={({ detail }) => setToggle5(detail.pressed)}
          pressed={toggle5}
          iconName="star"
          pressedIconName="star-filled"
          ariaLabel="Toggle button icon"
        />
        <ToggleButton
          variant="icon"
          onChange={({ detail }) => setToggle6(detail.pressed)}
          pressed={toggle6}
          iconName="star"
          pressedIconName="star-filled"
          ariaLabel="Toggle button icon pressed"
        />
      </SpaceBetween>
      <SpaceBetween direction="horizontal" size="m" alignItems="center">
        <ToggleButton pressed={true} iconName="star" pressedIconName="star-filled" disabled={true}>
          Toggle button
        </ToggleButton>
        <ToggleButton pressed={false} iconName="star" pressedIconName="star-filled" disabled={true}>
          Toggle button
        </ToggleButton>
        <ToggleButton
          pressed={false}
          iconName="star"
          pressedIconName="star-filled"
          disabled={true}
          ariaLabel="Toggle button disabled"
        />
        <ToggleButton
          pressed={true}
          iconName="star"
          pressedIconName="star-filled"
          disabled={true}
          ariaLabel="Toggle button disabled pressed"
        />
        <ToggleButton
          variant="icon"
          pressed={false}
          iconName="star"
          pressedIconName="star-filled"
          disabled={true}
          ariaLabel="Toggle button icon disabled"
        />
        <ToggleButton
          variant="icon"
          pressed={true}
          iconName="star"
          pressedIconName="star-filled"
          disabled={true}
          ariaLabel="Toggle button icon disabled pressed"
        />
      </SpaceBetween>
      <SegmentedControl
        selectedId={selectedSegment}
        onChange={({ detail }) => setSelectedSegment(detail.selectedId)}
        label="Default segmented control"
        options={[
          { text: 'Segment 1', id: 'seg-1' },
          { text: 'Segment 2', id: 'seg-2' },
          { text: 'Segment 3', id: 'seg-3' },
        ]}
      />
    </SpaceBetween>
  );
}

function Inputs() {
  const selectOptions = generateDropdownOptions(10) as SelectProps.Options;
  const multiSelectOptions = generateDropdownOptions() as MultiselectProps.Options;
  const [inputValue, setInputValue] = useState('Sample text');
  const [selectedOption, setSelectedOption] = useState<SelectProps.Option>(selectOptions[1] as SelectProps.Option);
  const [selectedItems, setSelectedItems] = useState([
    multiSelectOptions[1],
    multiSelectOptions[3],
  ] as MultiselectProps.Options);
  const [autosuggestValue, setAutosuggestValue] = useState('');
  const [dateValue, setDateValue] = useState('2018-01-02');

  return (
    <Grid>
      <SpaceBetween size="s" direction="horizontal">
        <Input value={inputValue} placeholder="Input" onChange={({ detail }) => setInputValue(detail.value)} />
        <Input value={inputValue} disabled={true} placeholder="Disabled input" />
        <Input value={inputValue} readOnly={true} placeholder="Read-only input" />
      </SpaceBetween>
      <SpaceBetween size="s" direction="horizontal">
        <Select
          options={selectOptions}
          selectedOption={selectedOption}
          placeholder="Select"
          onChange={({ detail }) => setSelectedOption(detail.selectedOption)}
        />
        <Select options={selectOptions} selectedOption={selectedOption} disabled={true} placeholder="Disabled select" />
        <Select
          options={selectOptions}
          selectedOption={selectedOption}
          readOnly={true}
          placeholder="Read-only select"
        />
      </SpaceBetween>
      <SpaceBetween size="s" direction="horizontal">
        <Multiselect
          options={multiSelectOptions}
          placeholder="Multiselect"
          selectedOptions={selectedItems}
          deselectAriaLabel={option => `Remove ${option.label}`}
          onChange={({ detail }) => setSelectedItems(detail.selectedOptions)}
        />
        <Multiselect
          disabled={true}
          placeholder="Disabled multi-select"
          selectedOptions={selectedItems}
          deselectAriaLabel={option => `Remove ${option.label}`}
        />
        <Multiselect
          readOnly={true}
          placeholder="Read-only multi-select"
          selectedOptions={selectedItems}
          deselectAriaLabel={option => `Remove ${option.label}`}
        />
      </SpaceBetween>
      <SpaceBetween size="s" direction="horizontal">
        <Autosuggest
          value={autosuggestValue}
          placeholder="Autosuggest"
          options={selectOptions}
          onChange={({ detail }) => setAutosuggestValue(detail.value)}
        />
        <Autosuggest value={autosuggestValue} disabled={true} placeholder="Disabled autosuggest" options={[]} />
        <Autosuggest value={autosuggestValue} readOnly={true} placeholder="Read-only autosuggest" options={[]} />
      </SpaceBetween>
      <SpaceBetween direction="horizontal" size="l">
        <DatePicker
          value={dateValue}
          placeholder="Datepicker"
          openCalendarAriaLabel={() => 'Open calendar'}
          onChange={({ detail }) => {
            setDateValue(detail.value);
          }}
        />
        <DatePicker
          value={dateValue}
          disabled={true}
          placeholder="Disabled date picker"
          openCalendarAriaLabel={() => 'Open calendar'}
          onChange={({ detail }) => {
            setDateValue(detail.value);
          }}
        />
        <DatePicker
          value={dateValue}
          readOnly={true}
          placeholder="Readonly date picker"
          openCalendarAriaLabel={() => 'Open calendar'}
          onChange={({ detail }) => {
            setDateValue(detail.value);
          }}
        />
      </SpaceBetween>
      <SpaceBetween size="xl" direction="horizontal">
        <Calendar
          onChange={({ detail }) => setDateValue(detail.value)}
          value={dateValue}
          isDateEnabled={date => date.getDay() !== 6 && date.getDay() !== 0}
        />
        <SpaceBetween size="s">
          <ExpandableSection variant="footer" headerText="Expandable section">
            Expanded
          </ExpandableSection>
        </SpaceBetween>
      </SpaceBetween>
    </Grid>
  );
}

const generateDropdownOptions = (count = 25): SelectProps.Options | MultiselectProps.Options => {
  return [...Array(count).keys()].map(n => {
    const numberToDisplay = (n + 1).toString();
    const baseOption = {
      id: numberToDisplay,
      value: numberToDisplay,
      label: `Option ${numberToDisplay}`,
    };
    if (n === 0 || n === 24 || n === 49) {
      return { ...baseOption, disabled: true, disabledReason: 'disabled reason' };
    }
    return baseOption;
  });
};

export default function ThemedComponentsPage() {
  const [themed, setThemed] = useState<boolean>(false);
  const [strokeSmall] = useState<string>('2');
  const [strokeNormal] = useState<string>('2');
  const [strokeMedium] = useState<string>('2');
  const [strokeBig] = useState<string>('3');
  const [strokeLarge] = useState<string>('4');

  // Reload page once after initial load to fix theme application
  useLayoutEffect(() => {
    const hasReloaded = sessionStorage.getItem('themed-stroke-width-reloaded');
    if (!hasReloaded) {
      sessionStorage.setItem('themed-stroke-width-reloaded', 'true');
      window.location.reload();
    }
  }, []);

  useLayoutEffect(() => {
    let reset: () => void = () => {};
    if (themed) {
      const theme: Theme = {
        tokens: {
          spaceButtonHorizontal: '12px',
          spaceButtonVertical: '4px',
          borderRadiusButton: '8px',
          borderWidthButton: '1px',
          sizeVerticalInput: '30px',
          borderWidthToken: '1px',
          spaceControlVertical: '3px',
        },
      };

      const result = applyTheme({
        theme,
        baseThemeId: 'visual-refresh',
      });
      reset = result.reset;
    }
    return reset;
  }, [themed, strokeSmall, strokeNormal, strokeMedium, strokeBig, strokeLarge]);

  return (
    <div style={{ padding: 15 }}>
      <h1>Themed icon stroke width</h1>

      <SpaceBetween size="xl">
        <SpaceBetween size="l" direction="vertical">
          <label>
            <input
              type="checkbox"
              data-testid="apply-theme"
              checked={themed}
              onChange={evt => setThemed(evt.currentTarget.checked)}
            />
            <span style={{ marginInlineStart: 5 }}>Apply custom themes</span>
          </label>
        </SpaceBetween>

        <SpaceBetween size="l">
          <Grid gridDefinition={[{ colspan: { default: 12, xxs: 6 } }, { colspan: { default: 12, xxs: 6 } }]}>
            <Buttons />
            <Inputs />
          </Grid>
        </SpaceBetween>
      </SpaceBetween>
    </div>
  );
}
