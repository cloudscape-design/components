// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useContext, useState } from 'react';

import { useCollection } from '@cloudscape-design/collection-hooks';

import {
  Box,
  Checkbox,
  ColumnLayout,
  Container,
  ExpandableSection,
  Header,
  Icon,
  IconProvider,
  IconProviderProps,
  SpaceBetween,
  Table,
  TreeView,
} from '~components';
import { colorTextStatusSuccess } from '~design-tokens';

import AppContext, { AppContextType } from '../app/app-context';
import { SimplePage } from '../app/templates';
import { ariaLabels } from '../table/expandable-rows/common';
import { createColumns } from '../table/expandable-rows/expandable-rows-configs';
import { allInstances } from '../table/expandable-rows/expandable-rows-data';
import { items as treeItems } from '../tree-view/items/basic-page-items';

type PageContext = React.Context<
  AppContextType<{
    overrideCarets?: boolean;
    overrideExpandToggles?: boolean;
    overrideSortingIndicators?: boolean;
  }>
>;

const caretIcons: IconProviderProps.Icons = {
  'caret-down': <Icon name="angle-down" size="inherit" />, // sortable
  'caret-up-filled': <Icon name="angle-up" size="inherit" />, // ascending sort
  'caret-down-filled': <Icon name="angle-down" size="inherit" />, // descending sort AND expand toggle (shared name)
};

const expandToggleOverrides: IconProviderProps.Overrides = {
  // Shared across Table (expandable rows), Tree View, and Expandable Section.
  'expand-toggle': ({ expanded }) => <Icon name={expanded ? 'treeview-collapse' : 'treeview-expand'} size="inherit" />,
};

const sortingIndicatorOverrides: IconProviderProps.Overrides = {
  'sorting-indicator': ({ sortingState }) => {
    if (sortingState === 'ascending') {
      return <Icon name="angle-up" size="inherit" />;
    }
    if (sortingState === 'descending') {
      return <Icon name="angle-down" size="inherit" />;
    }
    return <Icon name="angle-down" size="inherit" />;
  },
};

export default function Page() {
  const {
    urlParams: { overrideCarets = false, overrideExpandToggles = true, overrideSortingIndicators = true },
    setUrlParams,
  } = useContext(AppContext as PageContext);

  // Resolve the provider configuration for the selected mode.
  const providerProps: Pick<IconProviderProps, 'icons' | 'overrides'> = {
    icons: overrideCarets ? caretIcons : {},
    overrides: {
      ...(overrideExpandToggles ? expandToggleOverrides : {}),
      ...(overrideSortingIndicators ? sortingIndicatorOverrides : {}),
    },
  };

  return (
    <SimplePage
      title="Icon Provider: contextual"
      settings={
        <SpaceBetween size="xs" direction="horizontal">
          <Checkbox
            checked={overrideCarets}
            onChange={({ detail }) => setUrlParams({ overrideCarets: detail.checked })}
          >
            Override caret icons (caret-down, caret-up-filled, caret-down-filled)
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
      <IconProvider {...providerProps}>
        <ColumnLayout columns={3}>
          <DemoTable />
          <DemoTreeView />
          <DemoExpandableSection />
        </ColumnLayout>
      </IconProvider>
    </SimplePage>
  );
}

function DemoTable() {
  // Reuse the shared expandable-rows column definitions; no editable termination reasons needed here.
  const columnDefinitions = createColumns({ terminationReasons: new Map() });

  const { items, collectionProps } = useCollection(allInstances, {
    sorting: {},
    pagination: { pageSize: 6 },
    expandableRows: { getId: item => item.name, getParentId: item => item.parentName },
  });

  return (
    <Table
      {...collectionProps}
      items={items}
      columnDefinitions={columnDefinitions}
      ariaLabels={ariaLabels}
      header={<Header variant="h2">Table (expand toggles + sorting indicators)</Header>}
    />
  );
}

function DemoTreeView() {
  const [expandedItems, setExpandedItems] = useState<Array<string>>(['1', '4']);
  return (
    <Container header={<Header variant="h2">Tree view (expand toggles)</Header>}>
      <TreeView
        ariaLabel="Demo tree view"
        items={treeItems}
        renderItem={item => ({
          icon: item.hideIcon ? undefined : (
            <Icon name={expandedItems.includes(item.id) ? 'folder-open' : 'folder'} ariaLabel="folder" />
          ),
          content: item.content,
        })}
        getItemId={item => item.id}
        getItemChildren={item => item.children}
        expandedItems={expandedItems}
        onItemToggle={({ detail }) =>
          setExpandedItems(prev =>
            detail.expanded ? [...prev, detail.item.id] : prev.filter(id => id !== detail.item.id)
          )
        }
      />
    </Container>
  );
}

function DemoExpandableSection() {
  return (
    <ExpandableSection variant="container" headerText="Expandable section (expand toggle)" defaultExpanded={true}>
      <SpaceBetween size="s">
        <Box>Expandable section content with direct use of caret icons</Box>
        <SpaceBetween size="s" direction="horizontal">
          <Icon name="caret-down" />
          <Icon name="caret-up" />
          <Icon name="caret-down-filled" variant="success" />
          <span style={{ color: colorTextStatusSuccess }}>
            <Icon name="caret-up-filled" />
          </span>
        </SpaceBetween>
      </SpaceBetween>
    </ExpandableSection>
  );
}
