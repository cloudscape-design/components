// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useEffect, useState } from 'react';

import { PropertyFilterProperty, useCollection } from '@cloudscape-design/collection-hooks';
import { CollectionPreferencesProps } from '@cloudscape-design/components/collection-preferences';
import Pagination from '@cloudscape-design/components/pagination';
import PropertyFilter from '@cloudscape-design/components/property-filter';
import Table, { TableProps } from '@cloudscape-design/components/table';

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
import { TableEmptyState, TableNoMatchState } from '../commons/common-components';
import DataProvider from '../commons/data-provider';
import { Preferences } from '../commons/table-config';

import '../../styles/base.scss';

const PROPERTY_FILTERS_QUERY_PARAM_KEY = 'propertyFilter';

export interface PropertyFilterTableProps {
  loadHelpPanelContent: () => void;
  columnDefinitions: TableProps.ColumnDefinition<Distribution>[];
  contentDisplayOptions?: CollectionPreferencesProps.ContentDisplayOption[];
  saveWidths: TableProps['onColumnWidthsChange'];
  preferences?: CollectionPreferencesProps.Preferences<Distribution>;
  setPreferences: (preferences: CollectionPreferencesProps<unknown>['preferences']) => void;
  filteringProperties: PropertyFilterProperty[];
}

export function PropertyFilterTable({
  loadHelpPanelContent,
  columnDefinitions,
  contentDisplayOptions,
  saveWidths,
  preferences,
  setPreferences,
  filteringProperties,
}: PropertyFilterTableProps) {
  const { getQueryParam, setQueryParam } = useQueryParams();
  const [distributions, setDistributions] = useState<Distribution[]>([]);
  const [loading, setLoading] = useState(false);

  const { items, actions, filteredItemsCount, collectionProps, paginationProps, propertyFilterProps } = useCollection(
    distributions,
    {
      propertyFiltering: {
        filteringProperties,
        empty: <TableEmptyState resourceName="Distribution" />,
        noMatch: (
          <TableNoMatchState
            onClearFilter={() => {
              actions.setPropertyFiltering({ tokens: [], operation: 'and' });
            }}
          />
        ),
        /**
         * Ensure that all raw data extracted from the URL is properly validated against your expected data format before it is processed by the rest of your application or passed to a Cloudscape component.
         * If invalid data is detected, default to a valid option to maintain a secure and seamless user experience.
         * Validate the data coming from the URL to mitigate risks from maliciously crafted URLs.
         * For further guidance, reach out to your organization’s security team.
         */
        defaultQuery: parsePropertyFilterQuery(getQueryParam(PROPERTY_FILTERS_QUERY_PARAM_KEY)),
      },
      pagination: { pageSize: preferences?.pageSize },
      sorting: { defaultState: { sortingColumn: columnDefinitions[0] } },
      selection: {},
    }
  );

  useEffect(() => {
    new DataProvider().getDataWithDates<Distribution>('distributions').then(distributions => {
      setDistributions(distributions);
      setLoading(false);
    });
  }, []);

  return (
    <Table
      {...collectionProps}
      enableKeyboardNavigation={true}
      items={items}
      columnDefinitions={columnDefinitions}
      columnDisplay={preferences?.contentDisplay}
      ariaLabels={distributionTableAriaLabels}
      renderAriaLive={renderAriaLive}
      selectionType="multi"
      variant="full-page"
      stickyHeader={true}
      resizableColumns={true}
      wrapLines={preferences?.wrapLines}
      stripedRows={preferences?.stripedRows}
      contentDensity={preferences?.contentDensity}
      stickyColumns={preferences?.stickyColumns}
      onColumnWidthsChange={saveWidths}
      header={
        <FullPageHeader
          selectedItemsCount={collectionProps.selectedItems?.length ?? 0}
          counter={!loading ? getHeaderCounterText(distributions, collectionProps.selectedItems) : undefined}
          onInfoLinkClick={loadHelpPanelContent}
        />
      }
      loading={loading}
      loadingText="Loading distributions"
      filter={
        <PropertyFilter
          {...propertyFilterProps}
          i18nStrings={propertyFilterI18nStrings}
          countText={filteredItemsCount !== undefined ? getTextFilterCounterText(filteredItemsCount) : undefined}
          expandToViewport={true}
          enableTokenGroups={true}
          onChange={event => {
            /**
             * Avoid including sensitive information to the URL to prevent potential data exposure.
             * https://owasp.org/www-community/vulnerabilities/Information_exposure_through_query_strings_in_url
             * For further guidance, reach out to your organization’s security team.
             */
            const query = event.detail;
            if (!query.tokens?.length && !query?.tokenGroups?.length) {
              setQueryParam(PROPERTY_FILTERS_QUERY_PARAM_KEY, null);
            } else {
              setQueryParam(PROPERTY_FILTERS_QUERY_PARAM_KEY, JSON.stringify(query));
            }

            propertyFilterProps.onChange(event);
          }}
        />
      }
      pagination={<Pagination {...paginationProps} />}
      preferences={
        <Preferences
          preferences={preferences}
          setPreferences={setPreferences}
          contentDisplayOptions={contentDisplayOptions}
        />
      }
    />
  );
}
