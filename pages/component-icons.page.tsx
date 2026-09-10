// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useContext } from 'react';

import { useCollection } from '@cloudscape-design/collection-hooks';

import {
  Box,
  Checkbox,
  Container,
  ExpandableSection,
  Header,
  Icon,
  IconProvider,
  IconProviderProps,
  SpaceBetween,
  Table,
  TableProps,
  TreeView,
} from '~components';

import AppContext, { AppContextType } from './app/app-context';
import { SimplePage } from './app/templates';
import { ariaLabels } from './table/expandable-rows/common';
import { createColumns } from './table/expandable-rows/expandable-rows-configs';
import { allInstances } from './table/expandable-rows/expandable-rows-data';
import { items as treeItems } from './tree-view/items/basic-page-items';

type PageContext = React.Context<
  AppContextType<{
    overrideCarets?: boolean;
    overrideExpandToggles?: boolean;
    overrideSortingIndicators?: boolean;
  }>
>;

const caretIcons: IconProviderProps.Icons = {
  'caret-down': <Icon name="arrow-down" size="inherit" />, // sortable
  'caret-up': <Icon name="arrow-up" size="inherit" />, // not used in components
  'caret-up-filled': <Icon name="arrow-up" size="inherit" />, // ascending sort
  'caret-down-filled': <Icon name="arrow-down" size="inherit" />, // descending sort AND expand toggle (shared name)
};

const expandToggleIcon = ({ expanded }: { expanded: boolean }) => (
  <Icon name={expanded ? 'treeview-collapse' : 'treeview-expand'} size="inherit" />
);

const sortingIndicatorIcon: TableProps.Icons['sortingIndicator'] = ({ sortingState }) => {
  switch (sortingState) {
    case 'ascending':
      return <Icon name="arrow-up" size="inherit" />;
    case 'descending':
      return <Icon name="arrow-down" size="inherit" />;
    case 'sortable':
      return null; // default icon
  }
};

export default function Page() {
  const {
    urlParams: { overrideCarets = false, overrideExpandToggles = true, overrideSortingIndicators = true },
    setUrlParams,
  } = useContext(AppContext as PageContext);
  return (
    <SimplePage
      title="Component icons"
      subtitle={
        <span>
          Demonstrates the use of <Box variant="awsui-inline-code">icons</Box> property to override specific component
          icons. These take precedence over icon provider overrides.
        </span>
      }
      settings={
        <SpaceBetween size="xs" direction="horizontal">
          <Checkbox
            checked={overrideCarets}
            onChange={({ detail }) => setUrlParams({ overrideCarets: detail.checked })}
          >
            Override carets with icon provider
          </Checkbox>
          <Checkbox
            checked={overrideExpandToggles}
            onChange={({ detail }) => setUrlParams({ overrideExpandToggles: detail.checked })}
          >
            Override expand toggles
          </Checkbox>
          <Checkbox
            checked={overrideSortingIndicators}
            onChange={({ detail }) => setUrlParams({ overrideSortingIndicators: detail.checked })}
          >
            Override sorting indicators
          </Checkbox>
        </SpaceBetween>
      }
      i18n={{}}
      screenshotArea={{}}
    >
      <IconProvider icons={overrideCarets ? caretIcons : {}}>
        <DemoTable />
        <DemoTreeView />
        <DemoExpandableSection />
      </IconProvider>
    </SimplePage>
  );
}

function useIcons() {
  const { urlParams } = useContext(AppContext as PageContext);
  return {
    expandToggle: (urlParams.overrideExpandToggles ?? true) ? expandToggleIcon : undefined,
    sortingIndicator: (urlParams.overrideSortingIndicators ?? true) ? sortingIndicatorIcon : undefined,
  };
}

function DemoTable() {
  const icons = useIcons();
  const columnDefinitions = createColumns({ terminationReasons: new Map() });
  const { items, collectionProps } = useCollection(allInstances, {
    sorting: { defaultState: { sortingColumn: { sortingField: 'name' } } },
    pagination: { pageSize: 5 },
    expandableRows: { getId: item => item.name, getParentId: item => item.parentName },
  });
  return (
    <Table
      {...collectionProps}
      items={items}
      columnDefinitions={columnDefinitions}
      ariaLabels={ariaLabels}
      icons={icons}
      header={<Header variant="h2">Table (expand toggles + sorting indicators)</Header>}
      variant="stacked"
    />
  );
}

function DemoTreeView() {
  const icons = useIcons();
  return (
    <Container header={<Header variant="h2">Tree view (expand toggles)</Header>} variant="stacked">
      <TreeView
        ariaLabel="Demo tree view"
        items={treeItems}
        icons={icons}
        renderItem={item => ({ content: item.content })}
        getItemId={item => item.id}
        getItemChildren={item => item.children}
      />
    </Container>
  );
}

function DemoExpandableSection() {
  const icons = useIcons();
  return (
    <ExpandableSection
      variant="stacked"
      headerText="Expandable section (expand toggle)"
      defaultExpanded={true}
      icons={icons}
    >
      <SpaceBetween size="s" direction="horizontal">
        <Icon name="caret-down" size="medium" />
        <Icon name="caret-up" size="medium" />
        <Icon name="caret-down-filled" size="medium" />
        <Icon name="caret-up-filled" size="medium" />
      </SpaceBetween>
    </ExpandableSection>
  );
}
