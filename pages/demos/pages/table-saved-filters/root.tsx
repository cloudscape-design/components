// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useEffect, useRef, useState } from 'react';

import { useCollection } from '@cloudscape-design/collection-hooks';
import { AppLayoutProps } from '@cloudscape-design/components/app-layout';
import ButtonDropdown from '@cloudscape-design/components/button-dropdown';
import Flashbar, { FlashbarProps } from '@cloudscape-design/components/flashbar';
import Pagination from '@cloudscape-design/components/pagination';
import PropertyFilter from '@cloudscape-design/components/property-filter';
import Select from '@cloudscape-design/components/select';
import SplitPanel from '@cloudscape-design/components/split-panel';
import Table from '@cloudscape-design/components/table';

import { parsePropertyFilterQuery } from '../../common/parse-property-filter';
import { useQueryParams } from '../../common/use-query-params';
import { Distribution } from '../../fake-server/types';
import {
  distributionTableAriaLabels,
  getHeaderCounterText,
  getTextFilterCounterText,
  propertyFilterI18nStrings,
  renderAriaLive,
} from '../../i18n-strings';
import { FullPageHeader } from '../commons';
import {
  CustomAppLayout,
  DemoTopNavigation,
  GlobalSplitPanelContent,
  Navigation,
  TableEmptyState,
  TableNoMatchState,
  useGlobalSplitPanel,
} from '../commons/common-components';
import DataProvider from '../commons/data-provider';
import { COLUMN_DEFINITIONS, DEFAULT_PREFERENCES } from '../commons/table-config';
import { Preferences } from '../commons/table-config';
import { useColumnWidths } from '../commons/use-column-widths';
import { useLocalStorage } from '../commons/use-local-storage';
import { Breadcrumbs, ToolsContent } from '../table/common-components';
import { FILTERING_PROPERTIES } from '../table-property-filter/table-property-filter-config';
import { FilterSet, useFilterSets } from './use-filter-sets';

import '../../styles/table-select.scss';

const defaultFilterSets: FilterSet[] = [
  {
    name: 'Active web distributions',
    query: {
      operation: 'and',
      tokenGroups: [
        { propertyKey: 'deliveryMethod', operator: '=', value: ['Web'] },
        { propertyKey: 'state', operator: '=', value: ['Activated'] },
      ],
      tokens: [],
    },
    default: true,
  },
  {
    name: 'Distributions with buckets',
    query: {
      operation: 'and',
      tokenGroups: [{ propertyKey: 'origin', operator: ':', value: ['BUCKET'] }],
      tokens: [],
    },
  },
  {
    name: 'Best performance in buckets 1,2',
    query: {
      operation: 'and',
      tokenGroups: [
        {
          operation: 'or',
          tokens: [
            { propertyKey: 'origin', operator: '=', value: ['EXAMPLE-BUCKET-1.s3.amazon'] },
            { propertyKey: 'origin', operator: '=', value: ['EXAMPLE-BUCKET-2.s3.amazon'] },
          ],
        },
        { propertyKey: 'priceClass', operator: '=', value: ['Use all edge locations (best performance)'] },
      ],
      tokens: [],
    },
  },
];

const SELECTED_FILTER_SET_QUERY_PARAM_KEY = 'filterSet';
const PROPERTY_FILTERS_QUERY_PARAM_KEY = 'propertyFilter';

export function App() {
  const [toolsOpen, setToolsOpen] = useState(false);
  const { splitPanelOpen, onSplitPanelToggle, splitPanelSize, onSplitPanelResize, splitPanelPreferences } =
    useGlobalSplitPanel();
  const appLayout = useRef<AppLayoutProps.Ref>(null);

  const [columnDefinitions, saveWidths] = useColumnWidths('React-TableSavedFilters-Widths', COLUMN_DEFINITIONS);
  const [preferences, setPreferences] = useLocalStorage('React-TableSavedFilters-Preferences', DEFAULT_PREFERENCES);

  const [flashNotifications, setFlashNotifications] = useState<FlashbarProps.MessageDefinition[]>([]);

  const [savedFilterSets, setSavedFilterSets] = useState<FilterSet[]>(defaultFilterSets);
  const selectRef = useRef(null);

  const [distributions, setDistributions] = useState<Distribution[]>([]);
  const [loading, setLoading] = useState(false);
  const { getQueryParam, setQueryParam } = useQueryParams();

  const { items, actions, filteredItemsCount, collectionProps, propertyFilterProps, paginationProps } = useCollection(
    distributions,
    {
      propertyFiltering: {
        filteringProperties: FILTERING_PROPERTIES,
        empty: <TableEmptyState resourceName="Distribution" />,
        noMatch: (
          <TableNoMatchState
            onClearFilter={() =>
              actions.setPropertyFiltering({ tokens: [], operation: propertyFilterProps.query.operation })
            }
          />
        ),
        /**
         * Ensure that all raw data extracted from the URL is properly validated against your expected data format before it is processed by the rest of your application or passed to a Cloudscape component.
         * If invalid data is detected, default to a valid option to maintain a secure and seamless user experience.
         * Validate the data coming from the URL to mitigate risks from maliciously crafted URLs.
         * For further guidance, reach out to your organization’s security team.
         */
        defaultQuery: getQueryParam(PROPERTY_FILTERS_QUERY_PARAM_KEY)
          ? parsePropertyFilterQuery(getQueryParam(PROPERTY_FILTERS_QUERY_PARAM_KEY))
          : savedFilterSets.find(fs => fs.default)?.query,
      },
      pagination: { pageSize: preferences?.pageSize },
      sorting: { defaultState: { sortingColumn: columnDefinitions[0] } },
      selection: {},
    }
  );

  const { buttonDropdownProps, selectProps, actionModal } = useFilterSets({
    filterSets: savedFilterSets,
    query: propertyFilterProps.query,
    filteringProperties: propertyFilterProps.filteringProperties,
    selectRef,
    updateFilters: query => {
      /**
       * Avoid including sensitive information to the URL to prevent potential data exposure.
       * https://owasp.org/www-community/vulnerabilities/Information_exposure_through_query_strings_in_url
       * For further guidance, reach out to your organization’s security team.
       */
      if (!query.tokens?.length && !query?.tokenGroups?.length) {
        setQueryParam(PROPERTY_FILTERS_QUERY_PARAM_KEY, null);
        setQueryParam(SELECTED_FILTER_SET_QUERY_PARAM_KEY, null);
      } else {
        setQueryParam(PROPERTY_FILTERS_QUERY_PARAM_KEY, JSON.stringify(query));
      }
      actions.setPropertyFiltering(query);
    },
    updateSavedFilterSets: newFilterSets => {
      setSavedFilterSets(newFilterSets);

      // Persist the new filters here
    },
    showNotification: notification => {
      setFlashNotifications([
        {
          ...notification,
          onDismiss: () => {
            setFlashNotifications(currentNotifications =>
              currentNotifications.filter(item => item.id !== notification.id)
            );
          },
        },
        ...flashNotifications,
      ]);
    },
    defaultSelectedFilterSetValue:
      getQueryParam(SELECTED_FILTER_SET_QUERY_PARAM_KEY) ?? savedFilterSets.find(fs => fs.default)?.name,
    updateSelectedFilterValue: value => {
      /**
       * Avoid including sensitive information to the URL to prevent potential data exposure.
       * https://owasp.org/www-community/vulnerabilities/Information_exposure_through_query_strings_in_url
       * For further guidance, reach out to your organization’s security team.
       */
      setQueryParam(SELECTED_FILTER_SET_QUERY_PARAM_KEY, value);
    },
  });

  useEffect(() => {
    // If there are no URL filters, apply the default filter set to the URL filters
    if (!getQueryParam(PROPERTY_FILTERS_QUERY_PARAM_KEY)) {
      setQueryParam(PROPERTY_FILTERS_QUERY_PARAM_KEY, JSON.stringify(savedFilterSets.find(fs => fs.default)?.query));
    }

    new DataProvider().getDataWithDates<Distribution>('distributions').then(distributions => {
      setDistributions(distributions);
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run this hook on initial load

  return (
    <>
      <DemoTopNavigation />
      <CustomAppLayout
        ref={appLayout}
        navigation={<Navigation activeHref="#/distributions" />}
        notifications={<Flashbar stackItems={true} items={flashNotifications} />}
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
          <>
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
              selectionType="multi"
              ariaLabels={distributionTableAriaLabels}
              renderAriaLive={renderAriaLive}
              header={
                <FullPageHeader
                  selectedItemsCount={collectionProps.selectedItems?.length ?? 0}
                  counter={!loading ? getHeaderCounterText(distributions, collectionProps.selectedItems) : undefined}
                  onInfoLinkClick={() => {
                    setToolsOpen(true);
                    appLayout.current?.focusToolsClose();
                  }}
                />
              }
              loading={loading}
              loadingText="Loading distributions"
              filter={
                <PropertyFilter
                  {...propertyFilterProps}
                  filteringAriaLabel="Find resources"
                  filteringPlaceholder="Find resources"
                  i18nStrings={propertyFilterI18nStrings}
                  countText={getTextFilterCounterText(filteredItemsCount)}
                  expandToViewport={true}
                  enableTokenGroups={true}
                  customControl={
                    <Select
                      {...selectProps}
                      inlineLabelText="Saved filter sets"
                      data-testid="saved-filters"
                      ref={selectRef}
                    />
                  }
                  customFilterActions={<ButtonDropdown {...buttonDropdownProps} data-testid="filter-actions" />}
                  onChange={event => {
                    /**
                     * Avoid including sensitive information to the URL to prevent potential data exposure.
                     * https://owasp.org/www-community/vulnerabilities/Information_exposure_through_query_strings_in_url
                     * For further guidance, reach out to your organization’s security team.
                     */
                    const query = event.detail;
                    if (!query.tokens?.length && !query?.tokenGroups?.length) {
                      setQueryParam(PROPERTY_FILTERS_QUERY_PARAM_KEY, null);
                      setQueryParam(SELECTED_FILTER_SET_QUERY_PARAM_KEY, null);
                    } else {
                      setQueryParam(PROPERTY_FILTERS_QUERY_PARAM_KEY, JSON.stringify(query));
                    }

                    propertyFilterProps.onChange(event);
                  }}
                />
              }
              pagination={<Pagination {...paginationProps} />}
              preferences={<Preferences preferences={preferences} setPreferences={setPreferences} />}
            />
            {actionModal}
          </>
        }
        contentType="table"
        tools={<ToolsContent />}
        toolsOpen={toolsOpen}
        onToolsChange={({ detail }) => setToolsOpen(detail.open)}
      />
    </>
  );
}
