// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import Box from '~components/box';
import ColumnLayout from '~components/column-layout';
import Container from '~components/container';
import Button from '~components/button';
import ExpandableSection from '~components/expandable-section';
import Header from '~components/header';
import Link from '~components/link';
import Modal from '~components/modal';
import SpaceBetween from '~components/space-between';
import Table, { TableProps } from '~components/table';
import Tabs, { TabsProps } from '~components/tabs';
import ScreenshotArea from '../utils/screenshot-area';

export default function () {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(true);
  return (
    <>
      <h1>Table Variants</h1>
      <ScreenshotArea disableAnimations={true}>
        <SpaceBetween size="m">
          <Button onClick={() => setVisible(true)}>Open Modal</Button>
          <Modal
            visible={visible}
            onDismiss={() => setVisible(false)}
            header={'Embedded Table'}
            closeAriaLabel="Close modal"
            footer={
              <span style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="link" onClick={() => setVisible(false)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={() => setVisible(false)}>
                  Delete
                </Button>
              </span>
            }
          >
            <EmbeddedTable />
          </Modal>
          <ExpandableSection
            onChange={({ detail }) => setExpanded(detail.expanded)}
            variant="container"
            headerText="Expandable Section"
            expanded={expanded}
          >
            <SpaceBetween direction="vertical" size="m">
              <KeyValuePairs />
              <EmbeddedTable />
            </SpaceBetween>
          </ExpandableSection>
          <div>
            <Container disableContentPaddings={true} header={<Header>Container with borderless table</Header>}>
              <BorderlessTable />
            </Container>
          </div>
          <div>
            <Container variant="stacked" header={<Header variant="h2">Stacked Container</Header>}>
              <KeyValuePairs />
            </Container>
            <BaseTabs variant="stacked" />
            <StackedTable />
            <StackedTableWithFooter />
          </div>
          <div>
            <Container header={<Header>Stacked Container (before migration)</Header>}>
              <KeyValuePairs />
            </Container>
            <DefaultTable />
            <BaseTabs variant="container" />
          </div>
          <div>
            <Container header={<Header>Stacked Container (after migration)</Header>} variant="stacked">
              <KeyValuePairs />
            </Container>
            <StackedTable />
            <BaseTabs variant="stacked" />
          </div>
        </SpaceBetween>
      </ScreenshotArea>
    </>
  );
}

const StackedTableWithFooter = () => (
  <BaseTable
    variant="stacked"
    header={<Header>Stacked</Header>}
    footer={
      <Box textAlign="center">
        <Link>View more</Link>
      </Box>
    }
  />
);
const StackedTable = () => <BaseTable variant="stacked" header={<Header>Stacked</Header>} />;
const EmbeddedTable = () => <BaseTable variant="embedded" />;
const BorderlessTable = () => <BaseTable variant="borderless" header={null} />;
const DefaultTable = () => <BaseTable variant="container" header={<Header>Default</Header>} />;

const ValueWithLabel = ({ label, children }: { label: string; children: string }) => (
  <div>
    <Box margin={{ bottom: 'xxxs' }} color="text-label" fontWeight="bold">
      {label}
    </Box>
    <div>{children}</div>
  </div>
);

function KeyValuePairs() {
  return (
    <ColumnLayout columns={4} variant="text-grid" borders="vertical">
      <ValueWithLabel label="Label for key">Value</ValueWithLabel>
      <ValueWithLabel label="Label for key">Value</ValueWithLabel>
      <ValueWithLabel label="Label for key">Value</ValueWithLabel>
      <ValueWithLabel label="Label for key">Value</ValueWithLabel>
    </ColumnLayout>
  );
}

const items = [
  { name: 'apple', color: 'red' },
  { name: 'banana', color: 'yellow' },
];

type ItemType = typeof items[number];

function BaseTable(props: Partial<TableProps>) {
  const [selectedItems, setSelectedItems] = useState<ItemType[]>([]);
  return (
    <Table<ItemType>
      header={<Header variant="h3">Embedded</Header>}
      trackBy={'name'}
      items={items}
      variant="embedded"
      selectionType="multi"
      onSelectionChange={({ detail }) => setSelectedItems(detail.selectedItems)}
      selectedItems={selectedItems}
      columnDefinitions={[
        {
          id: 'name',
          header: 'Name',
          cell: ({ name }) => name,
          sortingField: 'name',
        },
        {
          id: 'color',
          header: 'Color',
          cell: ({ color }) => color,
          sortingField: 'color',
        },
      ]}
      ariaLabels={{
        selectionGroupLabel: 'group label',
        allItemsSelectionLabel: ({ selectedItems }) => `${selectedItems.length} item selected`,
        itemSelectionLabel: ({ selectedItems }, item) =>
          `${item.name} is ${selectedItems.indexOf(item) < 0 ? 'not ' : ''}selected`,
      }}
      {...props}
    />
  );
}

const tabs: Array<TabsProps.Tab> = [
  {
    label: 'First tab',
    id: 'first',
    content:
      'Diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
  },
  {
    label: 'Second tab',
    id: 'second',
    content:
      'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
  },
  {
    label: 'Third tab',
    id: 'third',
    content: '',
  },
];

const BaseTabs = ({ variant }: { variant: TabsProps.Variant }) => {
  const [selectedTab, setSelectedTab] = useState(tabs[0].id);
  return (
    <Tabs
      tabs={tabs}
      variant={variant}
      activeTabId={selectedTab}
      onChange={event => setSelectedTab(event.detail.activeTabId)}
      i18nStrings={{ scrollLeftAriaLabel: 'Scroll left', scrollRightAriaLabel: 'Scroll right' }}
    />
  );
};
