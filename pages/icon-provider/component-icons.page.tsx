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
  SideNavigation,
  SpaceBetween,
  Table,
  TreeView,
} from '~components';

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
  'caret-down': <Icon name="arrow-down" size="inherit" />, // sortable
  'caret-up': <Icon name="arrow-up" size="inherit" />, // not used in components
  'caret-up-filled': <Icon name="arrow-up" size="inherit" />, // ascending sort
  'caret-down-filled': <Icon name="arrow-down" size="inherit" />, // descending sort AND expand toggle (shared name)
};

const expandToggleIcon = ({ expanded }: { expanded: boolean }) => (
  <Icon name={expanded ? 'treeview-collapse' : 'treeview-expand'} size="inherit" />
);

const sortingIndicatorIcon: IconProviderProps.TableIcons['sortingIndicator'] = ({ sortingState }) => {
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

  const expandToggle = overrideExpandToggles ? expandToggleIcon : undefined;
  const sortingIndicator = overrideSortingIndicators ? sortingIndicatorIcon : undefined;
  const componentIcons: IconProviderProps.ComponentIcons = {
    table: { expandToggle, sortingIndicator },
    'tree-view': { expandToggle },
    'expandable-section': { expandToggle },
  };

  return (
    <SimplePage
      title="Icon provider: Component icons"
      subtitle={
        <span>
          Demonstrates the use of the <Box variant="awsui-inline-code">componentIcons</Box> property to override
          specific component icons, including nested usage (like expandable sections inside side navigation).
        </span>
      }
      settings={
        <SpaceBetween size="xs" direction="horizontal">
          <Checkbox
            checked={overrideCarets}
            onChange={({ detail }) => setUrlParams({ overrideCarets: detail.checked })}
          >
            Override carets with icons
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
      <IconProvider icons={overrideCarets ? caretIcons : {}} componentIcons={componentIcons}>
        <DemoTable />
        <DemoTreeView />
        <DemoExpandableSection />
        <DemoSideNavigation />
      </IconProvider>
    </SimplePage>
  );
}

function DemoTable() {
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
      header={<Header variant="h2">Table (expand toggles + sorting indicators)</Header>}
      variant="stacked"
    />
  );
}

function DemoTreeView() {
  return (
    <Container header={<Header variant="h2">Tree view (expand toggles)</Header>} variant="stacked">
      <TreeView
        ariaLabel="Demo tree view"
        items={treeItems}
        renderItem={item => ({ content: item.content })}
        getItemId={item => item.id}
        getItemChildren={item => item.children}
      />
    </Container>
  );
}

function DemoExpandableSection() {
  return (
    <ExpandableSection variant="stacked" headerText="Expandable section (expand toggle)" defaultExpanded={true}>
      <SpaceBetween size="s" direction="horizontal">
        <Icon name="caret-down" size="medium" />
        <Icon name="caret-up" size="medium" />
        <Icon name="caret-down-filled" size="medium" />
        <Icon name="caret-up-filled" size="medium" />
      </SpaceBetween>
    </ExpandableSection>
  );
}

function DemoSideNavigation() {
  return (
    <Container
      header={<Header variant="h2">Side navigation (nested expandable section expand toggles)</Header>}
      variant="stacked"
    >
      <SideNavigation
        items={[
          {
            type: 'section',
            text: 'Section 1',
            items: [
              { type: 'link', text: 'Page 1', href: '#/page1' },
              { type: 'link', text: 'Page 2', href: '#/page2' },
            ],
          },
          {
            type: 'section',
            text: 'Section 2',
            defaultExpanded: false,
            items: [{ type: 'link', text: 'Page 3', href: '#/page3' }],
          },
        ]}
      />
    </Container>
  );
}
