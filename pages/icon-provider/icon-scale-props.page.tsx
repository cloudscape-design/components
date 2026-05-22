// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { useCollection } from '@cloudscape-design/collection-hooks';

import { PromptInput } from '~components';
import Alert from '~components/alert';
import AppLayoutToolbar from '~components/app-layout-toolbar';
import Box from '~components/box';
import BreadcrumbGroup from '~components/breadcrumb-group';
import Button from '~components/button';
import ButtonDropdown from '~components/button-dropdown';
import ButtonGroup from '~components/button-group';
import ColumnLayout from '~components/column-layout';
import Container from '~components/container';
import CopyToClipboard from '~components/copy-to-clipboard';
import DatePicker from '~components/date-picker';
import Flashbar, { FlashbarProps } from '~components/flashbar';
import FormField from '~components/form-field';
import Header from '~components/header';
import Icon from '~components/icon';
import IconProvider from '~components/icon-provider';
import Input, { InputProps } from '~components/input';
import { NonCancelableCustomEvent } from '~components/internal/events';
import Link from '~components/link';
import Multiselect, { MultiselectProps } from '~components/multiselect';
import PropertyFilter, { PropertyFilterProps } from '~components/property-filter';
import SegmentedControl from '~components/segmented-control';
import Select from '~components/select';
import SideNavigation from '~components/side-navigation';
import SpaceBetween from '~components/space-between';
import SplitPanel from '~components/split-panel';
import StatusIndicator from '~components/status-indicator';
import Table from '~components/table';
import Tabs from '~components/tabs';
import TextContent from '~components/text-content';
import TextFilter from '~components/text-filter';
import ToggleButton from '~components/toggle-button';
import TreeView from '~components/tree-view';

import { filteringProperties, i18nStrings as propertyFilterI18nStrings } from '../property-filter/common-props';
import { generateItems } from '../table/generate-data';
import { columnsConfig } from '../table/shared-configs';

const createNumericHandler = (setter: (value: string) => void, min?: number, max?: number) => {
  return (evt: NonCancelableCustomEvent<InputProps.ChangeDetail>) => {
    const val = evt.detail.value;
    if (val === '') {
      setter(val);
      return;
    }
    const numValue = parseFloat(val);
    if (!isNaN(numValue)) {
      if (min !== undefined && numValue < min) {
        return;
      }
      if (max !== undefined && numValue > max) {
        return;
      }
      setter(val);
    }
  };
};

function Typography() {
  return (
    <Container header={<Header variant="h2">Typography</Header>}>
      <Box padding={{ top: 'm' }}>
        <TextContent>
          <h1>
            <Icon name="settings" size="big" /> Heading 1 (icon size big)
          </h1>
          <h2>
            <Icon name="settings" size="medium" /> Heading 2 (icon size medium)
          </h2>
          <h3>
            <Icon name="settings" /> Heading 3 (icon size normal)
          </h3>
          <h4>
            <Icon name="settings" /> Heading 4 (icon size normal)
          </h4>
          <h5>
            <Icon name="settings" /> Heading 5 (icon size normal)
          </h5>
          <p>
            <Icon name="settings" /> Paragraph (icon size normal)
          </p>
          <small>
            <Icon name="settings" size="x-small" /> Small (icon size x-small)
          </small>
          <small style={{ display: 'block', paddingBlockStart: '6px' }}>
            <Icon name="settings" size="inherit" /> Inherit (icon size: x-small to match the wrapped text size)
          </small>
        </TextContent>
      </Box>
      <Box variant="p" padding={{ top: 'm' }}>
        Paragraph –{' '}
        <Link variant="primary" href="#" external={true}>
          Amazon EC2
        </Link>{' '}
        provides each instance with a consistent and predictable amount of CPU capacity, regardless of its{' '}
        <Link variant="primary" external={true} href="#">
          underlying hardware
        </Link>
        .
      </Box>
      <Box variant="small" color="text-body-secondary" padding={{ top: 's' }}>
        Small text with external icon with inherit size –{' '}
        <Link variant="primary" href="#" external={true} fontSize="inherit">
          Amazon EC2
        </Link>{' '}
        provides each instance with a consistent and predictable amount of CPU capacity, regardless of its{' '}
        <Link variant="primary" href="#" external={true} fontSize="inherit">
          underlying hardware
        </Link>
        .
      </Box>
    </Container>
  );
}

const iconNames: Array<React.ComponentProps<typeof Icon>['name']> = [
  'add-plus',
  'settings',
  'close',
  'check',
  'star',
  'send',
  'refresh',
  'edit',
  'remove',
  'copy',
  'share',
  'lock-private',
  'folder',
  'file',
  'notification',
  'search',
];

function IconSizes() {
  return (
    <Container header={<Header variant="h2">Icon sizes</Header>}>
      <SpaceBetween size="m">
        <Box>
          <Box padding={{ vertical: 'xs' }} fontWeight="bold">
            X-Small (New size variant. Currently this variant is not used in any existing components)
          </Box>
          <SpaceBetween size="xs" direction="horizontal">
            {iconNames.map(name => (
              <Icon key={name} name={name} size="x-small" />
            ))}
          </SpaceBetween>
        </Box>
        <Box>
          <Box padding={{ vertical: 'xs' }} fontWeight="bold">
            Small
          </Box>
          <SpaceBetween size="xs" direction="horizontal">
            {iconNames.map(name => (
              <Icon key={name} name={name} size="small" />
            ))}
          </SpaceBetween>
        </Box>
        <Box>
          <Box padding={{ vertical: 'xs' }} fontWeight="bold">
            Normal
          </Box>
          <SpaceBetween size="xs" direction="horizontal">
            {iconNames.map(name => (
              <Icon key={name} name={name} />
            ))}
          </SpaceBetween>
        </Box>
        <Box>
          <Box padding={{ vertical: 'xs' }} fontWeight="bold">
            Medium
          </Box>
          <SpaceBetween size="xs" direction="horizontal">
            {iconNames.map(name => (
              <Icon key={name} name={name} size="medium" />
            ))}
          </SpaceBetween>
        </Box>
        <Box>
          <Box padding={{ vertical: 'xs' }} fontWeight="bold">
            Big
          </Box>
          <SpaceBetween size="xs" direction="horizontal">
            {iconNames.map(name => (
              <Icon key={name} name={name} size="big" />
            ))}
          </SpaceBetween>
        </Box>
        <Box>
          <Box padding={{ vertical: 'xs' }} fontWeight="bold">
            Large
          </Box>
          <SpaceBetween size="xs" direction="horizontal">
            {iconNames.map(name => (
              <Icon key={name} name={name} size="large" />
            ))}
          </SpaceBetween>
        </Box>
      </SpaceBetween>
    </Container>
  );
}

function ButtonsInputsDropdowns() {
  const [selectedSegment, setSelectedSegment] = useState('seg-1');
  const [toggle1, setToggle1] = useState(true);
  const [toggle2, setToggle2] = useState(false);
  const [dateValue, setDateValue] = useState('2024-01-15');
  const [filteringText, setFilteringText] = useState('instance');
  const multiSelectOptions: MultiselectProps.Options = [
    {
      label: 'Option 1',
      value: '1',
      description: 'This is a description',
    },
    {
      label: 'Option 2',
      value: '2',
      iconName: 'unlocked',
      labelTag: 'This is a label tag',
    },
    {
      label: 'Option 3 (disabled)',
      value: '3',
      iconName: 'share',
      tags: ['Tags go here', 'Tag1', 'Tag2'],
    },
    {
      label: 'Option 4',
      value: '4',
      filteringTags: ['filtering', 'tags', 'these are filtering tags'],
    },
    { label: 'Option 5', value: '5' },
  ];
  const [selectedItems, setSelectedItems] = useState<MultiselectProps.Options>([
    multiSelectOptions[1],
    multiSelectOptions[3],
  ]);

  const [query, setQuery] = React.useState<PropertyFilterProps.Query>({
    tokens: [
      { propertyKey: 'state', operator: '=', value: 'Running' },
      { propertyKey: 'instancetype', operator: '=', value: 't3.small' },
    ],
    operation: 'and',
  });
  const [value, setValue] = React.useState('');

  return (
    <Container header={<Header variant="h2">Buttons, inputs, and dropdowns</Header>}>
      <SpaceBetween size="l">
        <SpaceBetween direction="horizontal" size="m" alignItems="center">
          <Button variant="primary" iconName="add-plus">
            Primary
          </Button>
          <Button variant="normal" iconName="add-plus">
            Secondary
          </Button>
          <Button iconName="refresh" ariaLabel="Refresh" />
          <Button variant="link">Tertiary</Button>
          <ButtonDropdown
            items={[
              { id: 'start', text: 'Start' },
              { id: 'stop', text: 'Stop' },
              { id: 'terminate', text: 'Terminate' },
            ]}
          >
            Actions
          </ButtonDropdown>
        </SpaceBetween>
        <SpaceBetween direction="horizontal" size="m" alignItems="center">
          <Button variant="icon" iconName="add-plus" ariaLabel="Add" />
          <ButtonGroup
            ariaLabel="Actions"
            variant="icon"
            items={[
              { type: 'icon-button', id: 'upload', iconName: 'upload', text: 'Upload' },
              { type: 'icon-button', id: 'expand', iconName: 'expand', text: 'Expand' },
            ]}
          />
          <CopyToClipboard
            copyButtonAriaLabel="Copy ARN"
            copyErrorText="Failed to copy"
            copySuccessText="ARN copied"
            textToCopy="arn:aws:cloudfront::111122223333:distribution/SLCCSMWOHOFUY0"
            variant="inline"
          />
        </SpaceBetween>
        <SpaceBetween direction="horizontal" size="m" alignItems="center">
          <ToggleButton
            onChange={({ detail }) => setToggle1(detail.pressed)}
            pressed={toggle1}
            iconName="star"
            pressedIconName="star-filled"
          >
            Toggle
          </ToggleButton>
          <ToggleButton
            onChange={({ detail }) => setToggle2(detail.pressed)}
            pressed={toggle2}
            iconName="star"
            pressedIconName="star-filled"
          >
            Toggle
          </ToggleButton>
        </SpaceBetween>
        <SegmentedControl
          selectedId={selectedSegment}
          onChange={({ detail }) => setSelectedSegment(detail.selectedId)}
          label="View mode"
          options={[
            { text: 'Segment 1', id: 'seg-1', iconName: 'view-full' },
            { text: 'Segment 2', id: 'seg-2', iconName: 'view-horizontal' },
            { text: 'Segment 3', id: 'seg-3', iconName: 'view-vertical' },
          ]}
        />
        <SpaceBetween direction="horizontal" size="l">
          <Multiselect
            options={multiSelectOptions}
            placeholder="Multiselect"
            selectedOptions={selectedItems}
            onChange={({ detail }) => setSelectedItems(detail.selectedOptions)}
            deselectAriaLabel={option => `Remove ${option.label}`}
          />
          <DatePicker
            value={dateValue}
            placeholder="Date picker"
            openCalendarAriaLabel={() => 'Open calendar'}
            onChange={({ detail }) => setDateValue(detail.value)}
          />
        </SpaceBetween>
        <TextFilter
          filteringText={filteringText}
          filteringAriaLabel="Filter items"
          filteringClearAriaLabel="Clear filter"
          onChange={({ detail }) => setFilteringText(detail.filteringText)}
        />
        <PropertyFilter
          query={query}
          onChange={({ detail }) => setQuery(detail)}
          countText="5 matches"
          enableTokenGroups={true}
          expandToViewport={true}
          filteringAriaLabel="Find distributions"
          filteringPlaceholder="Find distributions"
          filteringProperties={filteringProperties}
          i18nStrings={propertyFilterI18nStrings}
        />
        <FormField label="Delivery method">
          <Select
            selectedOption={{ label: 'Web', value: 'web' }}
            options={[
              { label: 'Web', value: 'web' },
              { label: 'RTMP', value: 'rtmp' },
            ]}
            ariaLabel="Delivery method"
          />
        </FormField>
        <PromptInput
          onChange={({ detail }) => setValue(detail.value)}
          value={value}
          actionButtonAriaLabel="Send message"
          actionButtonIconName="send"
          ariaLabel="Prompt input with action button"
          disableSecondaryActionsPaddings={true}
          placeholder="Ask a question"
          secondaryActions={
            <Box padding={{ left: 'xxs', top: 'xs' }}>
              <ButtonGroup
                ariaLabel="Chat actions"
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
            </Box>
          }
        />
      </SpaceBetween>
    </Container>
  );
}

function NavigationComponents() {
  const [activeTabId, setActiveTabId] = useState('tab1');
  const [activeHref, setActiveHref] = useState('#/parent-page/child-page1');

  return (
    <Container header={<Header variant="h2">Navigation components</Header>}>
      <Tabs
        activeTabId={activeTabId}
        onChange={({ detail }) => setActiveTabId(detail.activeTabId)}
        tabs={[
          { id: 'tab1', label: 'Tab 1', content: 'Tab 1 content', dismissible: true, dismissLabel: 'Dismiss Tab 1' },
          { id: 'tab2', label: 'Tab 2', content: 'Tab 2 content', dismissible: true, dismissLabel: 'Dismiss Tab 2' },
          { id: 'tab3', label: 'Tab 3', content: 'Tab 3 content', dismissible: true, dismissLabel: 'Dismiss Tab 3' },
        ]}
      />
      <ColumnLayout columns={4}>
        <SideNavigation
          activeHref={activeHref}
          header={{ href: '#/', text: 'Side navigation' }}
          onFollow={event => {
            event.preventDefault();
            setActiveHref(event.detail.href);
          }}
          items={[
            { type: 'link', text: 'Page 1', href: '#/page1' },
            {
              type: 'expandable-link-group',
              text: 'Parent page',
              href: '#/parent-page',
              items: [
                { type: 'link', text: 'Child page 1', href: '#/parent-page/child-page1' },
                { type: 'link', text: 'Child page 2', href: '#/parent-page/child-page2' },
              ],
            },
            { type: 'link', text: 'Page 2', href: '#/page2' },
          ]}
        />
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
            {
              type: 'section',
              text: 'Section 1',
              items: [
                {
                  type: 'link',
                  text: 'Page 4',
                  href: '#/page4',
                },
                {
                  type: 'link',
                  text: 'Page 5',
                  href: '#/page5',
                },
                {
                  type: 'link',
                  text: 'Page 6',
                  href: '#/page6',
                },
              ],
            },
            {
              type: 'section',
              text: 'Section 2',
              items: [
                {
                  type: 'link',
                  text: 'Page 7',
                  href: '#/page7',
                },
                {
                  type: 'link',
                  text: 'Page 8',
                  href: '#/page8',
                },
                {
                  type: 'link',
                  text: 'Page 9',
                  href: '#/page9',
                },
              ],
            },
          ]}
        />
        <SpaceBetween size="s">
          <BreadcrumbGroup
            items={[
              { text: 'Home', href: '#' },
              { text: 'Another page', href: '#' },
              { text: 'Current', href: '#' },
            ]}
          />
          <Link href="#" variant="primary">
            Primary link
          </Link>
          <div>
            <Link href="#" external={true}>
              External link
            </Link>
          </div>
        </SpaceBetween>
      </ColumnLayout>
    </Container>
  );
}

const allItems = generateItems(5);

function TableAndCards() {
  const { items, collectionProps } = useCollection(allItems, { sorting: {} });

  return (
    <SpaceBetween size="l">
      <Table
        {...collectionProps}
        items={items}
        header={<Header description="Description">Table with selection</Header>}
        columnDefinitions={columnsConfig}
      />
    </SpaceBetween>
  );
}

interface TreeItem {
  id: string;
  label: string;
  children?: TreeItem[];
}

const treeItems: TreeItem[] = [
  {
    id: '1',
    label: 'Root',
    children: [
      {
        id: '1.1',
        label: 'Documents',
        children: [
          { id: '1.1.1', label: 'report.pdf' },
          { id: '1.1.2', label: 'notes.txt' },
        ],
      },
      {
        id: '1.2',
        label: 'Images',
        children: [
          { id: '1.2.1', label: 'photo.png' },
          { id: '1.2.2', label: 'diagram.svg' },
        ],
      },
      { id: '1.3', label: 'readme.md' },
    ],
  },
];

function TreeViewWithConnectorLines() {
  const expandedItems = ['1', '1.1', '1.2'];

  return (
    <TreeView
      ariaLabel="Tree view with connector lines"
      items={treeItems}
      expandedItems={expandedItems}
      connectorLines="vertical"
      renderItem={item => ({
        icon: (
          <Icon
            name={expandedItems.includes(item.id) && item.children ? 'folder-open' : item.children ? 'folder' : 'file'}
          />
        ),
        content: item.label,
      })}
      getItemId={item => item.id}
      getItemChildren={item => item.children}
      i18nStrings={{
        expandButtonLabel: () => 'Expand item',
        collapseButtonLabel: () => 'Collapse item',
      }}
    />
  );
}

interface ActionTreeItem {
  id: string;
  label: string;
  relatedNode?: string;
  type?: 'success' | 'warning' | 'error' | 'info';
  hasActions?: boolean;
  children?: ActionTreeItem[];
}

const actionTreeItems: ActionTreeItem[] = [
  {
    id: 'action-1',
    label: 'Evaluated',
    type: 'success',
    hasActions: true,
  },
  {
    id: 'action-2',
    label: 'node-20',
    relatedNode: 'eksclu-node-wx456',
    type: 'success',
    hasActions: true,
    children: [
      { id: 'action-2.1', label: 'node-17', type: 'warning' },
      { id: 'action-2.2', label: 'node-18', type: 'success' },
    ],
  },
  {
    id: 'action-3',
    label: 'node 21',
    relatedNode: 'eksclu-node-wx457',
    hasActions: true,
    children: [
      {
        id: 'action-3.1',
        label: 'node 19',
        relatedNode: 'eksclu-node-wx457',
        type: 'success',
        hasActions: true,
        children: [
          { id: 'action-3.1.1', label: 'node-22', type: 'success' },
          { id: 'action-3.1.2', label: 'node-23', type: 'success' },
        ],
      },
    ],
  },
];

function TreeViewWithActions() {
  const [expandedItems, setExpandedItems] = useState(['action-2', 'action-3', 'action-3.1']);

  return (
    <TreeView
      ariaLabel="Tree view with actions"
      items={actionTreeItems}
      expandedItems={expandedItems}
      renderItem={item => ({
        content: (
          <StatusIndicator type={item.type ?? 'info'} iconAriaLabel={item.type ?? 'info'}>
            {item.label}{' '}
            {item.relatedNode && (
              <>
                (
                <Link href="#" variant="primary">
                  {item.relatedNode}
                </Link>
                )
              </>
            )}
          </StatusIndicator>
        ),
        actions: item.hasActions ? (
          <ButtonDropdown
            items={[
              { id: 'start', text: 'Start' },
              { id: 'stop', text: 'Stop' },
              { id: 'terminate', text: 'Terminate' },
            ]}
            ariaLabel={`Actions menu for ${item.label}`}
            variant="inline-icon"
          />
        ) : undefined,
        announcementLabel: `${item.label} ${item.relatedNode ?? ''}`,
      })}
      getItemId={item => item.id}
      getItemChildren={item => item.children}
      onItemToggle={({ detail }) =>
        setExpandedItems(prev =>
          detail.expanded ? [...prev, detail.item.id] : prev.filter(id => id !== detail.item.id)
        )
      }
      i18nStrings={{
        expandButtonLabel: () => 'Expand item',
        collapseButtonLabel: () => 'Collapse item',
      }}
    />
  );
}

function StatusComponents() {
  const flashbarItems: FlashbarProps.MessageDefinition[] = [
    {
      type: 'success',
      header: 'Success',
      content: 'Operation completed successfully.',
      dismissible: true,
      dismissLabel: 'Dismiss',
      id: 'success',
    },
    {
      type: 'warning',
      header: 'Warning',
      content: 'This is a warning message.',
      dismissible: true,
      dismissLabel: 'Dismiss',
      id: 'warning',
    },
    {
      type: 'error',
      header: 'Error',
      content: 'Something went wrong.',
      dismissible: true,
      dismissLabel: 'Dismiss',
      id: 'error',
    },
    {
      type: 'info',
      header: 'Info',
      content: 'Informational message.',
      dismissible: true,
      dismissLabel: 'Dismiss',
      id: 'info',
    },
  ];

  return (
    <Container header={<Header variant="h2">Status components</Header>}>
      <SpaceBetween size="l">
        <Flashbar items={flashbarItems} />
        <ColumnLayout columns={2}>
          <SpaceBetween size="xs">
            <Alert type="error" dismissible={true} dismissAriaLabel="Dismiss error" header="Error">
              This is an error alert.
            </Alert>
            <Alert type="warning" dismissible={true} dismissAriaLabel="Dismiss warning" header="Warning">
              This is a warning alert.
            </Alert>
            <Alert type="success" dismissible={true} dismissAriaLabel="Dismiss success" header="Success">
              This is a success alert.
            </Alert>
            <Alert type="info" dismissible={true} dismissAriaLabel="Dismiss info" header="Info">
              This is an info alert.
            </Alert>
          </SpaceBetween>
          <SpaceBetween size="s">
            <SpaceBetween size="xs">
              <StatusIndicator type="error">Error</StatusIndicator>
              <StatusIndicator type="warning">Warning</StatusIndicator>
              <StatusIndicator type="success">Success</StatusIndicator>
              <StatusIndicator type="info">Info</StatusIndicator>
              <StatusIndicator type="stopped">Stopped</StatusIndicator>
              <StatusIndicator type="pending">Pending</StatusIndicator>
              <StatusIndicator type="in-progress">In progress</StatusIndicator>
            </SpaceBetween>
            <FormField label="Form field" errorText="This is an error message.">
              <Input value="Invalid" invalid={true} ariaLabel="Invalid input" readOnly={true} />
            </FormField>
            <TreeViewWithConnectorLines />
            <IconProvider
              icons={{
                'status-positive': (
                  <svg
                    viewBox="0 0 16 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    focusable="false"
                    aria-hidden="true"
                  >
                    <path d="M5 9L7 11L11 7" />
                    <path d="M8 2C6.29 3.53 4.13 4.32 2 4.48V7.96C2 10.01 2.76 11.84 3.71 13.1C4.63 14.32 6.03 15.31 8 16C9.97 15.31 11.37 14.32 12.29 13.1C13.3935 11.6128 13.9926 9.81183 14 7.96V4.48C11.87 4.32 9.71 3.52 8 2Z" />
                  </svg>
                ),
              }}
            >
              <Box padding={{ top: 's' }} fontSize="heading-s" fontWeight="bold">
                TreeView component with custom icon
              </Box>
              <TreeViewWithActions />
            </IconProvider>
          </SpaceBetween>
        </ColumnLayout>
      </SpaceBetween>
    </Container>
  );
}

export default function IconScaleProviderScenario() {
  // Icon size state
  const [iconSizeXSmall, setIconSizeXSmall] = useState('12');
  const [iconSizeSmall, setIconSizeSmall] = useState('16');
  const [iconSize, setIconSize] = useState('16');
  const [iconSizeMedium, setIconSizeMedium] = useState('20');
  const [iconSizeBig, setIconSizeBig] = useState('24');
  const [iconSizeLarge, setIconSizeLarge] = useState('48');

  // Stroke width state (per icon size)
  const [strokeWidthXSmall, setStrokeWidthXSmall] = useState('1.5');
  const [strokeWidthSmall, setStrokeWidthSmall] = useState('2');
  const [strokeWidthNormal, setStrokeWidthNormal] = useState('2');
  const [strokeWidthMedium, setStrokeWidthMedium] = useState('2');
  const [strokeWidthBig, setStrokeWidthBig] = useState('3');
  const [strokeWidthLarge, setStrokeWidthLarge] = useState('4');

  // Split panel state
  const [splitPanelOpen, setSplitPanelOpen] = useState(true);

  const splitPanelContent = (
    <ColumnLayout borders="horizontal">
      <Box padding={{ bottom: 'l' }}>
        <Box variant="h3">IconProvider size prop configuration</Box>
        <SpaceBetween size="s">
          <FormField label="Icon size x-small (px)">
            <Input
              type="number"
              value={iconSizeXSmall}
              onChange={createNumericHandler(setIconSizeXSmall, 4, 64)}
              inputMode="numeric"
            />
          </FormField>
          <FormField label="Icon size small (px)">
            <Input
              type="number"
              value={iconSizeSmall}
              onChange={createNumericHandler(setIconSizeSmall, 4, 64)}
              inputMode="numeric"
            />
          </FormField>
          <FormField label="Icon size normal (px)">
            <Input
              type="number"
              value={iconSize}
              onChange={createNumericHandler(setIconSize, 4, 64)}
              inputMode="numeric"
            />
          </FormField>
          <FormField label="Icon size medium (px)">
            <Input
              type="number"
              value={iconSizeMedium}
              onChange={createNumericHandler(setIconSizeMedium, 4, 64)}
              inputMode="numeric"
            />
          </FormField>
          <FormField label="Icon size big (px)">
            <Input
              type="number"
              value={iconSizeBig}
              onChange={createNumericHandler(setIconSizeBig, 4, 64)}
              inputMode="numeric"
            />
          </FormField>
          <FormField label="Icon size large (px)">
            <Input
              type="number"
              value={iconSizeLarge}
              onChange={createNumericHandler(setIconSizeLarge, 4, 96)}
              inputMode="numeric"
            />
          </FormField>
        </SpaceBetween>
      </Box>

      <Box padding={{ vertical: 'l' }}>
        <Box variant="h3">IconProvider strokeWidths prop configuration</Box>
        <SpaceBetween size="s">
          <FormField label="Stroke width x-small (px)">
            <Input
              type="number"
              value={strokeWidthXSmall}
              onChange={createNumericHandler(setStrokeWidthXSmall, 0.5, 10)}
              step={0.5}
              inputMode="decimal"
            />
          </FormField>
          <FormField label="Stroke width small (px)">
            <Input
              type="number"
              value={strokeWidthSmall}
              onChange={createNumericHandler(setStrokeWidthSmall, 0.5, 10)}
              step={0.5}
              inputMode="decimal"
            />
          </FormField>
          <FormField label="Stroke width normal (px)">
            <Input
              type="number"
              value={strokeWidthNormal}
              onChange={createNumericHandler(setStrokeWidthNormal, 0.5, 10)}
              step={0.5}
              inputMode="decimal"
            />
          </FormField>
          <FormField label="Stroke width medium (px)">
            <Input
              type="number"
              value={strokeWidthMedium}
              onChange={createNumericHandler(setStrokeWidthMedium, 0.5, 10)}
              step={0.5}
              inputMode="decimal"
            />
          </FormField>
          <FormField label="Stroke width big (px)">
            <Input
              type="number"
              value={strokeWidthBig}
              onChange={createNumericHandler(setStrokeWidthBig, 0.5, 10)}
              step={0.5}
              inputMode="decimal"
            />
          </FormField>
          <FormField label="Stroke width large (px)">
            <Input
              type="number"
              value={strokeWidthLarge}
              onChange={createNumericHandler(setStrokeWidthLarge, 0.5, 10)}
              step={0.5}
              inputMode="decimal"
            />
          </FormField>
        </SpaceBetween>
      </Box>
    </ColumnLayout>
  );

  return (
    <AppLayoutToolbar
      ariaLabels={{
        navigation: 'Navigation',
        navigationToggle: 'Open navigation',
        navigationClose: 'Close navigation',
        notifications: 'Notifications',
        tools: 'Tools',
        toolsToggle: 'Open tools',
        toolsClose: 'Close tools',
      }}
      navigationHide={true}
      toolsHide={true}
      splitPanelOpen={splitPanelOpen}
      onSplitPanelToggle={({ detail }) => setSplitPanelOpen(detail.open)}
      splitPanelPreferences={{ position: 'side' }}
      splitPanel={
        <SplitPanel
          header="Design configuration"
          i18nStrings={{
            closeButtonAriaLabel: 'Close panel',
            openButtonAriaLabel: 'Open panel',
            resizeHandleAriaLabel: 'Resize split panel',
            resizeHandleTooltipText: 'Drag or select to resize',
            preferencesTitle: 'Preferences',
            preferencesPositionLabel: 'Split panel position',
            preferencesPositionDescription: 'Choose the default split panel position for the service.',
            preferencesPositionSide: 'Side',
            preferencesPositionBottom: 'Bottom',
            preferencesConfirm: 'Confirm',
            preferencesCancel: 'Cancel',
          }}
        >
          {splitPanelContent}
        </SplitPanel>
      }
      content={
        <IconProvider
          icons={null}
          sizes={{
            'x-small': parseFloat(iconSizeXSmall),
            small: parseFloat(iconSizeSmall),
            normal: parseFloat(iconSize),
            medium: parseFloat(iconSizeMedium),
            big: parseFloat(iconSizeBig),
            large: parseFloat(iconSizeLarge),
          }}
          strokeWidths={{
            'x-small': parseFloat(strokeWidthXSmall),
            small: parseFloat(strokeWidthSmall),
            normal: parseFloat(strokeWidthNormal),
            medium: parseFloat(strokeWidthMedium),
            big: parseFloat(strokeWidthBig),
            large: parseFloat(strokeWidthLarge),
          }}
        >
          <SpaceBetween size="l">
            <Header variant="h1">Icon scale overview</Header>
            <IconSizes />
            <Typography />
            <ButtonsInputsDropdowns />
            <NavigationComponents />
            <TableAndCards />
            <StatusComponents />
          </SpaceBetween>
        </IconProvider>
      }
    />
  );
}
