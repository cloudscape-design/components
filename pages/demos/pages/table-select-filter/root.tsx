// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useLayoutEffect, useRef, useState } from 'react';

import { useCollection } from '@cloudscape-design/collection-hooks';
import { AppLayoutProps } from '@cloudscape-design/components/app-layout';
import Button from '@cloudscape-design/components/button';
import ButtonDropdown from '@cloudscape-design/components/button-dropdown';
import Input from '@cloudscape-design/components/input';
import LiveRegion from '@cloudscape-design/components/live-region';
import Pagination from '@cloudscape-design/components/pagination';
import Select from '@cloudscape-design/components/select';
import { SelectProps } from '@cloudscape-design/components/select';
import SpaceBetween from '@cloudscape-design/components/space-between';
import SplitPanel from '@cloudscape-design/components/split-panel';
import Table from '@cloudscape-design/components/table';

import { getHeaderCounterText, getTextFilterCounterText, renderAriaLive } from '../../i18n-strings';
import DATA, { Instance } from '../../resources/instances';
import { FullPageHeader } from '../commons';
import {
  CustomAppLayout,
  DemoTopNavigation,
  GlobalSplitPanelContent,
  Notifications,
  TableEmptyState,
  TableNoMatchState,
  useGlobalSplitPanel,
} from '../commons/common-components';
import { Preferences } from '../commons/table-config';
import { useColumnWidths } from '../commons/use-column-widths';
import { useLocalStorage } from '../commons/use-local-storage';
import { Breadcrumbs, Navigation, ToolsContent } from './table-select-filter-components';
import {
  COLUMN_DEFINITIONS,
  CONTENT_DISPLAY_OPTIONS,
  PREFERENCES,
  SEARCHABLE_COLUMNS,
} from './table-select-filter-config';

import '../../styles/table-select.scss';

function prepareSelectOptions(field: keyof Instance, defaultOption: SelectProps.Option): SelectProps.Options {
  const optionSet: string[] = [];
  // Building a non redundant list of the field passed as parameter.

  DATA.forEach(item => {
    const itemValue = String(item[field]);
    if (optionSet.indexOf(itemValue) === -1) {
      optionSet.push(itemValue);
    }
  });
  optionSet.sort();

  // The first element is the default one.
  const options: SelectProps.Option[] = [defaultOption];

  // Adding the other element of the list.
  optionSet.forEach((item, index) => options.push({ label: item, value: (index + 1).toString() }));
  return options;
}

const defaultEngine = { value: '0', label: 'Any Engine' };
const defaultClass = { value: '0', label: 'Any Class' };
const selectEngineOptions = prepareSelectOptions('engine', defaultEngine);
const selectClassOptions = prepareSelectOptions('class', defaultClass);

function matchesEngine(item: Instance, selectedEngine: SelectProps.Option) {
  return selectedEngine === defaultEngine || item.engine === selectedEngine.label;
}

function matchesClass(item: Instance, selectedClass: SelectProps.Option) {
  return selectedClass === defaultClass || item.class === selectedClass.label;
}

interface TableSelectFilter {
  loadHelpPanelContent: () => void;
}

function TableSelectFilter({ loadHelpPanelContent }: TableSelectFilter) {
  const [columnDefinitions, saveWidths] = useColumnWidths('React-TableSelectFilter-Widths', COLUMN_DEFINITIONS);
  const [engine, setEngine] = useState<SelectProps.Option>(defaultEngine);
  const [instanceClass, setInstanceClass] = useState<SelectProps.Option>(defaultClass);
  const [preferences, setPreferences] = useLocalStorage('React-TableSelectFilter-Preferences', PREFERENCES);
  const { items, actions, filteredItemsCount, collectionProps, filterProps, paginationProps } = useCollection(DATA, {
    filtering: {
      empty: <TableEmptyState resourceName="Instance" />,

      // ClearFilter also depends on setFiltering returned from this hook

      noMatch: <TableNoMatchState onClearFilter={clearFilter} />,
      filteringFunction: (item, filteringText) => {
        if (!matchesEngine(item, engine)) {
          return false;
        }
        if (!matchesClass(item, instanceClass)) {
          return false;
        }
        const filteringTextLowerCase = filteringText.toLowerCase();

        return SEARCHABLE_COLUMNS.map(key => item[key]).some(
          value => typeof value === 'string' && value.toLowerCase().indexOf(filteringTextLowerCase) > -1
        );
      },
    },
    pagination: { pageSize: preferences?.pageSize },
    sorting: { defaultState: { sortingColumn: columnDefinitions[0] } },
    selection: {},
  });
  useLayoutEffect(() => {
    collectionProps.ref.current?.scrollToTop();
  }, [instanceClass, engine, collectionProps.ref, filterProps.filteringText]);

  function clearFilter() {
    actions.setFiltering('');
    setEngine(defaultEngine);
    setInstanceClass(defaultClass);
  }

  return (
    <Table
      {...collectionProps}
      enableKeyboardNavigation={true}
      columnDefinitions={columnDefinitions}
      columnDisplay={preferences?.contentDisplay}
      items={items}
      variant="full-page"
      stickyHeader={true}
      resizableColumns={true}
      onColumnWidthsChange={saveWidths}
      wrapLines={preferences?.wrapLines}
      stripedRows={preferences?.stripedRows}
      contentDensity={preferences?.contentDensity}
      stickyColumns={preferences?.stickyColumns}
      selectionType="single"
      ariaLabels={{
        itemSelectionLabel: (data, row) => `Select DB instance ${row.id}`,
        allItemsSelectionLabel: () => 'Select all DB instances',
        selectionGroupLabel: 'Instances selection',
      }}
      renderAriaLive={renderAriaLive}
      header={
        <FullPageHeader
          title="Instances"
          selectedItemsCount={collectionProps.selectedItems?.length ?? 0}
          counter={getHeaderCounterText(DATA, collectionProps.selectedItems)}
          actions={
            <SpaceBetween size="xs" direction="horizontal">
              <ButtonDropdown
                disabled={!collectionProps.selectedItems?.length}
                items={[
                  {
                    id: 'terminate',
                    text: 'Terminate DB instance',
                    disabled: true,
                    disabledReason: 'No permission granted',
                  },
                  {
                    id: 'create-replica',
                    text: 'Create DB instance replica',
                    disabled: true,
                    disabledReason: 'No permission granted',
                  },
                ]}
              >
                Instance actions
              </ButtonDropdown>
              <Button>Restore from S3</Button>
              <Button variant="primary">Launch DB instance</Button>
            </SpaceBetween>
          }
          onInfoLinkClick={loadHelpPanelContent}
        />
      }
      filter={
        <div className="input-container">
          <div className="input-filter">
            <Input
              data-testid="input-filter"
              type="search"
              value={filterProps.filteringText}
              onChange={event => {
                actions.setFiltering(event.detail.value);
              }}
              ariaLabel="Find instances"
              placeholder="Find instances"
              clearAriaLabel="clear"
            />
          </div>
          <div className="select-filter">
            <Select
              data-testid="engine-filter"
              inlineLabelText="Filter engine"
              options={selectEngineOptions}
              selectedAriaLabel="Selected"
              selectedOption={engine}
              onChange={event => {
                setEngine(event.detail.selectedOption);
              }}
              expandToViewport={true}
            />
          </div>
          <div className="select-filter">
            <Select
              inlineLabelText="Filter class"
              data-testid="class-filter"
              options={selectClassOptions}
              selectedAriaLabel="Selected"
              selectedOption={instanceClass}
              onChange={event => {
                setInstanceClass(event.detail.selectedOption);
              }}
              expandToViewport={true}
            />
          </div>
          <LiveRegion>
            {(filterProps.filteringText || engine !== defaultEngine || instanceClass !== defaultClass) && (
              <span className="filtering-results">{getTextFilterCounterText(filteredItemsCount ?? 0)}</span>
            )}
          </LiveRegion>
        </div>
      }
      pagination={<Pagination {...paginationProps} />}
      preferences={
        <Preferences
          preferences={preferences}
          setPreferences={setPreferences}
          contentDisplayOptions={CONTENT_DISPLAY_OPTIONS}
        />
      }
    />
  );
}

export function App() {
  const [toolsOpen, setToolsOpen] = useState(false);
  const { splitPanelOpen, onSplitPanelToggle, splitPanelSize, onSplitPanelResize, splitPanelPreferences } =
    useGlobalSplitPanel();
  const appLayout = useRef<AppLayoutProps.Ref>(null);

  return (
    <>
      <DemoTopNavigation />
      <CustomAppLayout
        ref={appLayout}
        navigation={<Navigation activeHref="#/instances" />}
        notifications={<Notifications successNotification={true} />}
        breadcrumbs={<Breadcrumbs />}
        splitPanelOpen={splitPanelOpen}
        onSplitPanelToggle={onSplitPanelToggle}
        splitPanelSize={splitPanelSize}
        onSplitPanelResize={onSplitPanelResize}
        splitPanelPreferences={splitPanelPreferences}
        splitPanel={
          <SplitPanel header="Design exploration">
            <GlobalSplitPanelContent />
          </SplitPanel>
        }
        content={
          <TableSelectFilter
            loadHelpPanelContent={() => {
              setToolsOpen(true);
              appLayout.current?.focusToolsClose();
            }}
          />
        }
        contentType="table"
        tools={<ToolsContent />}
        toolsOpen={toolsOpen}
        onToolsChange={({ detail }) => setToolsOpen(detail.open)}
      />
    </>
  );
}
