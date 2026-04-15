// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useLayoutEffect, useState } from 'react';

import {
  AppLayoutToolbar,
  Autosuggest,
  Box,
  Button,
  ButtonDropdown,
  ButtonGroup,
  Cards,
  Container,
  DatePicker,
  Grid,
  Header,
  Input,
  Link,
  Multiselect,
  SegmentedControl,
  Select,
  SelectProps,
  SideNavigation,
  SpaceBetween,
  StatusIndicator,
  Table,
  Tiles,
  ToggleButton,
} from '~components';
import { MultiselectProps } from '~components/multiselect';
import { applyTheme, Theme } from '~components/theming';

import { Breadcrumbs, Tools } from '../app-layout/utils/content-blocks';
import { drawerItems, drawerLabels } from '../app-layout/utils/drawers';
import labels from '../app-layout/utils/labels';
import * as toolsContent from '../app-layout/utils/tools-content';

function Typography() {
  return (
    <SpaceBetween size="s">
      <Box variant="h1">Heading XL (h1)</Box>
      <Box variant="h2">Heading L (h2)</Box>
      <Box variant="h3">Heading M (h3)</Box>
      <Box variant="h4">Heading S (h4)</Box>
      <Box variant="h5">Heading XS (h5)</Box>
      <Link variant="awsui-value-large" href="#" ariaLabel="Running instances (14)">
        14
      </Link>
      <Box variant="awsui-value-large">Display L bold</Box>
      <Box variant="awsui-value-large" fontWeight="light">
        Display L light
      </Box>
      <Box variant="p">Body M — Regular paragraph text used for descriptions and content blocks.</Box>
      <Box variant="small">Body S — Small text used for secondary information.</Box>
    </SpaceBetween>
  );
}

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
        <ButtonDropdown
          items={[
            { text: 'Delete', id: 'rm', disabled: false },
            { text: 'Move', id: 'mv', disabled: false },
          ]}
        >
          Short
        </ButtonDropdown>
        <ButtonDropdown
          items={[
            {
              text: 'Launch instance from template',
              id: 'launch-instance-from-template',
            },
          ]}
          mainAction={{ text: 'Launch instance' }}
          variant="primary"
        />
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
  const [selectedOptionVariant, setSelectedOptionVariant] = useState<SelectProps.Option | null>({
    label: 'Option 1',
    value: '1',
    iconName: 'settings',
    description: 'sub value',
    tags: ['CPU-v2', '2Gb RAM'],
    labelTag: '128Gb',
  });
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
        <Select
          selectedOption={selectedOptionVariant}
          onChange={({ detail }) => setSelectedOptionVariant(detail.selectedOption)}
          options={[
            {
              label: 'Option 1',
              value: '1',
              iconName: 'settings',
              description: 'sub value',
              tags: ['CPU-v2', '2Gb RAM'],
              labelTag: '128Gb',
            },
            {
              label: 'Option 2',
              value: '2',
              iconName: 'settings',
              description: 'sub value',
              tags: ['CPU-v2', '2Gb RAM'],
              labelTag: '128Gb',
            },
          ]}
          triggerVariant="option"
        />
        <Select
          invalid={true}
          selectedOption={selectedOptionVariant}
          onChange={({ detail }) => setSelectedOptionVariant(detail.selectedOption)}
          options={[
            {
              label: 'Option 1',
              value: '1',
              iconName: 'settings',
              description: 'sub value',
              tags: ['CPU-v2', '2Gb RAM'],
              labelTag: '128Gb',
            },
            {
              label: 'Option 2',
              value: '2',
              iconName: 'settings',
              description: 'sub value',
              tags: ['CPU-v2', '2Gb RAM'],
              labelTag: '128Gb',
            },
          ]}
          triggerVariant="option"
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

interface ItemType {
  name: string;
  type: string;
  size: string;
  status: string;
  statusType: 'success' | 'error' | 'warning';
}

function TableCardsAndTiles() {
  const [selectedItems, setSelectedItems] = useState<ItemType[]>([
    { name: 'Item 2', type: 'Type B', size: '25 KB', status: 'Inactive', statusType: 'error' },
  ]);
  const [selectedTile, setSelectedTile] = useState<string | null>('tile-1');

  return (
    <SpaceBetween size="l">
      <Table
        selectionType="multi"
        selectedItems={selectedItems}
        onSelectionChange={({ detail }) => setSelectedItems(detail.selectedItems)}
        trackBy="name"
        ariaLabels={{
          selectionGroupLabel: 'Items selection',
          allItemsSelectionLabel: () => 'select all',
          itemSelectionLabel: (_selection, item) => item.name,
        }}
        columnDefinitions={[
          { id: 'name', header: 'Name', cell: item => item.name },
          { id: 'type', header: 'Type', cell: item => item.type },
          { id: 'size', header: 'Size', cell: item => item.size },
          {
            id: 'status',
            header: 'Status',
            cell: item => <StatusIndicator type={item.statusType}>{item.status}</StatusIndicator>,
          },
        ]}
        items={[
          { name: 'Item 1', type: 'Type A', size: '10 KB', status: 'Active', statusType: 'success' as const },
          { name: 'Item 2', type: 'Type B', size: '25 KB', status: 'Inactive', statusType: 'error' as const },
          { name: 'Item 3', type: 'Type A', size: '15 KB', status: 'Pending', statusType: 'warning' as const },
        ]}
        header={<Box variant="h3">Table</Box>}
        sortingDisabled={true}
      />

      <Cards
        selectionType="multi"
        selectedItems={selectedItems}
        onSelectionChange={({ detail }) => setSelectedItems(detail.selectedItems)}
        trackBy="name"
        ariaLabels={{
          selectionGroupLabel: 'Items selection',
          itemSelectionLabel: (_selection, item) => item.name,
        }}
        cardDefinition={{
          header: item => item.name,
          sections: [
            { id: 'type', header: 'Type', content: item => item.type },
            { id: 'size', header: 'Size', content: item => item.size },
            {
              id: 'status',
              header: 'Status',
              content: item => <StatusIndicator type={item.statusType}>{item.status}</StatusIndicator>,
            },
          ],
        }}
        items={[
          { name: 'Card 1', type: 'Type A', size: '10 KB', status: 'Active', statusType: 'success' as const },
          { name: 'Card 2', type: 'Type B', size: '25 KB', status: 'Inactive', statusType: 'error' as const },
          { name: 'Card 3', type: 'Type A', size: '15 KB', status: 'Pending', statusType: 'warning' as const },
        ]}
        header={<Box variant="h3">Cards</Box>}
        cardsPerRow={[{ cards: 3 }]}
      />

      <Tiles
        value={selectedTile}
        onChange={({ detail }) => setSelectedTile(detail.value)}
        items={[
          { value: 'tile-1', label: 'Option A', description: 'Description for option A' },
          { value: 'tile-2', label: 'Option B', description: 'Description for option B' },
          { value: 'tile-3', label: 'Option C', description: 'Description for option C' },
        ]}
        columns={3}
      />
    </SpaceBetween>
  );
}

function AppLayoutToolbarWithDrawers() {
  const [activeDrawerId, setActiveDrawerId] = useState<string | null>(null);
  const [activeHref, setActiveHref] = React.useState('#/page1');

  return (
    <AppLayoutToolbar
      ariaLabels={{ ...labels, ...drawerLabels }}
      breadcrumbs={<Breadcrumbs />}
      navigation={
        <SideNavigation
          activeHref={activeHref}
          header={{ href: '#/', text: 'Service name' }}
          onFollow={event => {
            if (!event.detail.external) {
              event.preventDefault();
              setActiveHref(event.detail.href);
            }
          }}
          items={[
            { type: 'link', text: 'Page 1', href: '#/page1' },
            { type: 'link', text: 'Page 2', href: '#/page2' },
            { type: 'link', text: 'Page 3', href: '#/page3' },
            { type: 'link', text: 'Page 4', href: '#/page4' },
            { type: 'divider' },
            {
              type: 'link',
              text: 'Documentation',
              href: 'https://example.com',
              external: true,
            },
          ]}
        />
      }
      tools={<Tools>{toolsContent.long}</Tools>}
      content={<Container header={<Header variant="h2">Demo container</Header>}>Content placeholder</Container>}
      drawers={drawerItems}
      onDrawerChange={event => setActiveDrawerId(event.detail.activeDrawerId)}
      activeDrawerId={activeDrawerId}
    />
  );
}

export default function ThemedComponentsPage() {
  const [themed, setThemed] = useState<boolean>(false);

  useLayoutEffect(() => {
    let reset: () => void = () => {};
    if (themed) {
      const theme: Theme = {
        tokens: {
          spaceButtonHorizontal: '12px',
          spaceButtonVertical: '4px',
          borderRadiusButton: '8px',
          borderWidthButton: '1px',
          borderWidthToken: '1px',
          borderWidthItemSelected: '1px',
          borderWidthCardSelected: '1px',
          colorTextAccent: { light: '#1b232d', dark: '#F9F9FB' },
          //spaceFieldVertical: '4px',
        },
      };

      const result = applyTheme({
        theme,
        baseThemeId: 'visual-refresh',
      });
      reset = result.reset;
    }
    return reset;
  }, [themed]);

  return (
    <div style={{ padding: 15 }}>
      <h1>Themed components</h1>

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

        <Typography />

        <SpaceBetween size="l">
          <Grid gridDefinition={[{ colspan: { default: 12, xxs: 6 } }, { colspan: { default: 12, xxs: 6 } }]}>
            <Buttons />
            <Inputs />
          </Grid>
        </SpaceBetween>

        <SpaceBetween size="xs">
          <StatusIndicator type="error">Error</StatusIndicator>
          <StatusIndicator type="success">Success</StatusIndicator>
          <StatusIndicator type="warning">Warning</StatusIndicator>
          <StatusIndicator type="info">Info</StatusIndicator>
        </SpaceBetween>

        <TableCardsAndTiles />

        <AppLayoutToolbarWithDrawers />
      </SpaceBetween>
    </div>
  );
}
