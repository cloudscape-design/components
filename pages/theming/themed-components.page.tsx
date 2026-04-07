// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useLayoutEffect, useState } from 'react';

import {
  AppLayoutToolbar,
  Autosuggest,
  Button,
  ButtonGroup,
  Calendar,
  ContentLayout,
  DatePicker,
  ExpandableSection,
  Grid,
  Header,
  Input,
  Multiselect,
  SegmentedControl,
  Select,
  SelectProps,
  SpaceBetween,
  SplitPanel,
  StatusIndicator,
  Toggle,
  ToggleButton,
} from '~components';
import { AppLayoutProps } from '~components/app-layout';
import { MultiselectProps } from '~components/multiselect';
import PropertyFilter, { PropertyFilterProps } from '~components/property-filter';
import { applyTheme, Theme } from '~components/theming';

import { Breadcrumbs, Containers, Navigation, Tools } from '../app-layout/utils/content-blocks';
import { drawerItems, drawerLabels } from '../app-layout/utils/drawers';
import labels from '../app-layout/utils/labels';
import { splitPaneli18nStrings } from '../app-layout/utils/strings';
import * as toolsContent from '../app-layout/utils/tools-content';

import appLayoutStyles from '../app-layout/styles.scss';

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
          onChange={({ detail }) => setSelectedItems(detail.selectedOptions)}
        />
        <Multiselect disabled={true} placeholder="Disabled multi-select" selectedOptions={selectedItems} />
        <Multiselect readOnly={true} placeholder="Read-only multi-select" selectedOptions={selectedItems} />
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

function AppLayoutToolbarWithDrawers() {
  const [activeDrawerId, setActiveDrawerId] = useState<string | null>(null);
  const [hasDrawers, setHasDrawers] = useState(true);
  const appLayoutRef = React.useRef<AppLayoutProps.Ref>(null);

  function openDrawer(id: string) {
    setActiveDrawerId(id);
    appLayoutRef.current?.focusActiveDrawer();
  }

  return (
    <AppLayoutToolbar
      ref={appLayoutRef}
      ariaLabels={{ ...labels, ...drawerLabels }}
      breadcrumbs={<Breadcrumbs />}
      navigation={<Navigation />}
      tools={<Tools>{toolsContent.long}</Tools>}
      content={
        <ContentLayout
          header={
            <SpaceBetween size="m">
              <Header variant="h1" description="AppLayoutToolbar with multiple custom drawers.">
                Toolbar with Drawers
              </Header>
              <SpaceBetween size="xs">
                <Toggle
                  checked={hasDrawers}
                  onChange={({ detail }) => setHasDrawers(detail.checked)}
                  data-id="toggle-drawers"
                >
                  Has Drawers
                </Toggle>
              </SpaceBetween>
              <Button onClick={() => openDrawer('security')} data-testid="open-drawer-button">
                Open drawer
              </Button>
              <Button onClick={() => openDrawer('pro-help')} data-testid="open-drawer-button-2">
                Open second drawer
              </Button>
            </SpaceBetween>
          }
        >
          <Containers />
        </ContentLayout>
      }
      splitPanel={
        <SplitPanel header="Split panel header" i18nStrings={splitPaneli18nStrings}>
          <SpaceBetween size="l">
            <div className={appLayoutStyles.contentPlaceholder} />
            <div className={appLayoutStyles.contentPlaceholder} />
            <div className={appLayoutStyles.contentPlaceholder} />
          </SpaceBetween>
        </SplitPanel>
      }
      drawers={hasDrawers ? drawerItems : undefined}
      onDrawerChange={event => setActiveDrawerId(event.detail.activeDrawerId)}
      activeDrawerId={activeDrawerId}
    />
  );
}

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

  const [query, setQuery] = React.useState<PropertyFilterProps.Query>({
    tokens: [],
    operation: 'and',
  });

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
          <PropertyFilter
            query={query}
            onChange={({ detail }) => setQuery(detail)}
            countText="5 matches"
            enableTokenGroups={true}
            expandToViewport={true}
            filteringAriaLabel="Find distributions"
            filteringOptions={[
              {
                propertyKey: 'instanceid',
                value: 'i-2dc5ce28a0328391',
              },
              {
                propertyKey: 'instanceid',
                value: 'i-d0312e022392efa0',
              },
              {
                propertyKey: 'instanceid',
                value: 'i-070eef935c1301e6',
              },
              {
                propertyKey: 'instanceid',
                value: 'i-3b44795b1fea36ac',
              },
              { propertyKey: 'state', value: 'Stopped' },
              { propertyKey: 'state', value: 'Stopping' },
              { propertyKey: 'state', value: 'Pending' },
              { propertyKey: 'state', value: 'Running' },
              {
                propertyKey: 'instancetype',
                value: 't3.small',
              },
              {
                propertyKey: 'instancetype',
                value: 't2.small',
              },
              { propertyKey: 'instancetype', value: 't3.nano' },
              {
                propertyKey: 'instancetype',
                value: 't2.medium',
              },
              {
                propertyKey: 'instancetype',
                value: 't3.medium',
              },
              {
                propertyKey: 'instancetype',
                value: 't2.large',
              },
              { propertyKey: 'instancetype', value: 't2.nano' },
              {
                propertyKey: 'instancetype',
                value: 't2.micro',
              },
              {
                propertyKey: 'instancetype',
                value: 't3.large',
              },
              {
                propertyKey: 'instancetype',
                value: 't3.micro',
              },
              { propertyKey: 'averagelatency', value: '17' },
              { propertyKey: 'averagelatency', value: '53' },
              { propertyKey: 'averagelatency', value: '73' },
              { propertyKey: 'averagelatency', value: '74' },
              { propertyKey: 'averagelatency', value: '107' },
              { propertyKey: 'averagelatency', value: '236' },
              { propertyKey: 'averagelatency', value: '242' },
              { propertyKey: 'averagelatency', value: '375' },
              { propertyKey: 'averagelatency', value: '402' },
              { propertyKey: 'averagelatency', value: '636' },
              { propertyKey: 'averagelatency', value: '639' },
              { propertyKey: 'averagelatency', value: '743' },
              { propertyKey: 'averagelatency', value: '835' },
              { propertyKey: 'averagelatency', value: '981' },
              { propertyKey: 'averagelatency', value: '995' },
            ]}
            filteringPlaceholder="Find distributions"
            filteringProperties={[
              {
                key: 'instanceid',
                operators: ['=', '!=', ':', '!:', '^', '!^'],
                propertyLabel: 'Instance ID',
                groupValuesLabel: 'Instance ID values',
              },
              {
                key: 'state',
                operators: [
                  { operator: '=', tokenType: 'enum' },
                  { operator: '!=', tokenType: 'enum' },
                  ':',
                  '!:',
                  '^',
                  '!^',
                ],
                propertyLabel: 'State',
                groupValuesLabel: 'State values',
              },
              {
                key: 'instancetype',
                operators: [
                  { operator: '=', tokenType: 'enum' },
                  { operator: '!=', tokenType: 'enum' },
                  ':',
                  '!:',
                  '^',
                  '!^',
                ],
                propertyLabel: 'Instance type',
                groupValuesLabel: 'Instance type values',
              },
              {
                key: 'averagelatency',
                operators: ['=', '!=', '>', '<', '<=', '>='],
                propertyLabel: 'Average latency',
                groupValuesLabel: 'Average latency values',
              },
            ]}
          />
        </SpaceBetween>

        <SpaceBetween size="xs">
          <StatusIndicator type="error">Error</StatusIndicator>
          <StatusIndicator type="success">Success</StatusIndicator>
          <StatusIndicator type="warning">Warning</StatusIndicator>
          <StatusIndicator type="info">Info</StatusIndicator>
        </SpaceBetween>

        <AppLayoutToolbarWithDrawers />
      </SpaceBetween>
    </div>
  );
}
