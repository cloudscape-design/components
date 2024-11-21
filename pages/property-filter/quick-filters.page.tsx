// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useState } from 'react';
import { format, startOfDay, startOfWeek, subWeeks } from 'date-fns';
import { isEqual } from 'lodash';

import { useCollection } from '@cloudscape-design/collection-hooks';

import {
  AppLayout,
  Badge,
  Box,
  Button,
  Checkbox,
  ExpandableSection,
  FormField,
  Header,
  PropertyFilter,
  PropertyFilterProps,
  Slider,
  SpaceBetween,
  SplitPanel,
  Table,
} from '~components';
import I18nProvider from '~components/i18n';
import messages from '~components/i18n/messages/all.en';
import { useDebounceCallback } from '~components/internal/hooks/use-debounce-callback';

import AppContext, { AppContextType } from '../app/app-context';
import { Breadcrumbs, Navigation, Tools } from '../app-layout/utils/content-blocks';
import appLayoutLabels from '../app-layout/utils/labels';
import * as toolsContent from '../app-layout/utils/tools-content';
import { useOptionsLoader } from '../common/options-loader';
import ScreenshotArea from '../utils/screenshot-area';
import { columnDefinitions, filteringProperties, labels } from './common-props';
import { allItems, states, TableItem } from './table.data';

import styles from './quick-filters.scss';

type PageContext = React.Context<
  AppContextType<{
    virtualScroll?: boolean;
    expandToViewport?: boolean;
    enableTokenGroups?: boolean;
    disableFreeTextFiltering?: boolean;
    hideOperations?: boolean;
    asyncOptions?: boolean;
    emptyOptions?: boolean;
  }>
>;

export default function () {
  const {
    urlParams: {
      virtualScroll = true,
      expandToViewport = true,
      enableTokenGroups = true,
      disableFreeTextFiltering = false,
      hideOperations = false,
      asyncOptions = false,
      emptyOptions = false,
    },
    setUrlParams,
  } = useContext(AppContext as PageContext);

  const defaultQuery: PropertyFilterProps.Query = enableTokenGroups
    ? { operation: 'and', tokens: [], tokenGroups: [{ propertyKey: 'averagelatency', operator: '!=', value: '30' }] }
    : { operation: 'and', tokens: [{ propertyKey: 'averagelatency', operator: '!=', value: '30' }] };

  const { items, collectionProps, actions, propertyFilterProps } = useCollection(allItems, {
    propertyFiltering: {
      empty: 'empty',
      noMatch: (
        <Box textAlign="center" color="inherit">
          <Box variant="strong" textAlign="center" color="inherit">
            No matches
          </Box>
          <Box variant="p" padding={{ bottom: 's' }} color="inherit">
            We can’t find a match.
          </Box>
          <Button
            onClick={() => actions.setPropertyFiltering({ tokens: [], operation: propertyFilterProps.query.operation })}
          >
            Clear filter
          </Button>
        </Box>
      ),
      filteringProperties,
      defaultQuery,
    },
    sorting: {},
  });

  let filteringOptions = propertyFilterProps.filteringOptions
    .map(option => {
      if (option.propertyKey === 'state') {
        option.label = states[option.value];
      }
      return option;
    })
    .filter(option => option.propertyKey !== 'tags')
    .filter(option => option.propertyKey !== 'averagelatency');

  const allTags = new Set<string>();
  for (const item of allItems) {
    for (const tag of item.tags ?? []) {
      allTags.add(tag);
    }
  }
  for (const tag of allTags) {
    filteringOptions.push({ propertyKey: 'tags', value: tag });
  }

  if (emptyOptions) {
    filteringOptions = [];
  }

  const [splitPanelOpen, setSplitPanelOpen] = useState(true);
  const [filteringText, setFilteringText] = useState('');
  const optionsLoader = useOptionsLoader<PropertyFilterProps.FilteringOption>({ pageSize: 15, timeout: 1000 });
  const handleLoadItems = ({
    detail: { filteringProperty, filteringText, firstPage },
  }: {
    detail: PropertyFilterProps.LoadItemsDetail;
  }) => {
    if (filteringProperty) {
      const sourceItems = filteringOptions.filter(option => option.propertyKey === filteringProperty.key);
      optionsLoader.fetchItems({ sourceItems, filteringText, firstPage });
      setFilteringText(filteringText);
    } else {
      setFilteringText('');
    }
  };
  const asyncProps = asyncOptions
    ? {
        asyncProperties: false,
        filteringStatusType: optionsLoader.status,
        onLoadItems: handleLoadItems,
        filteringFinishedText: filteringText ? `End of "${filteringText}" results` : 'End of all results',
      }
    : {};

  const onAddQuickFilter = (
    token: PropertyFilterProps.Token | PropertyFilterProps.TokenGroup,
    onAdd: (
      prev: any,
      next: PropertyFilterProps.Token | PropertyFilterProps.TokenGroup
    ) => null | PropertyFilterProps.Token | PropertyFilterProps.TokenGroup
  ) => {
    const query = propertyFilterProps.query;
    const matchToken = (
      source: PropertyFilterProps.Token | PropertyFilterProps.TokenGroup,
      target: PropertyFilterProps.Token | PropertyFilterProps.TokenGroup
    ): boolean => {
      const sourceTokens = 'operator' in source ? [source] : (source.tokens as PropertyFilterProps.Token[]);
      const sourceKeys = sourceTokens.map(t => t.propertyKey ?? '');
      const targetTokens = 'operator' in target ? [target] : (target.tokens as PropertyFilterProps.Token[]);
      const targetKeys = targetTokens.map(t => t.propertyKey ?? '');
      return sourceKeys.some(key => targetKeys.includes(key));
    };
    const matched = (query.secondaryTokens ?? []).find(source => matchToken(source, token));
    const secondaryTokens = [...(query.secondaryTokens ?? [])];
    const matchedIndex = matched ? secondaryTokens.indexOf(matched) : secondaryTokens.length;
    const tokenToAdd = matched ? onAdd(matched, token) : token;
    if (tokenToAdd) {
      secondaryTokens.splice(matchedIndex, 1, tokenToAdd);
    } else {
      secondaryTokens.splice(matchedIndex, 1);
    }
    actions.setPropertyFiltering({ ...query, secondaryTokens });
  };

  const onAddStateQuickFilter = (value: string) => {
    onAddQuickFilter({ propertyKey: 'state', operator: '=', value: [value] }, (prev, next) => {
      let nextValue = prev.value.includes(value)
        ? prev.value.filter((v: string) => v !== value)
        : [...prev.value, value];
      nextValue = 'operator' in next && prev.operator === next.operator ? nextValue : [value];
      return nextValue.length === 0 ? null : { ...next, value: nextValue };
    });
  };

  const onAddTagsQuickFilter = (value: string) => {
    onAddQuickFilter({ propertyKey: 'tags', operator: ':', value: [value] }, (prev, next) => {
      let nextValue = prev.value.includes(value)
        ? prev.value.filter((v: string) => v !== value)
        : [...prev.value, value];
      nextValue = 'operator' in next && prev.operator === next.operator ? nextValue : [value];
      return nextValue.length === 0 ? null : { ...next, value: nextValue };
    });
  };

  const onAddLastOccurrenceQuickFilter = (value: string) => {
    const onAddNext = (prev: any, next: any): any => (isEqual(prev, next) ? null : next);
    switch (value) {
      case 'TODAY':
        return onAddQuickFilter(
          {
            propertyKey: 'lasteventat',
            operator: '>=',
            value: format(startOfDay(new Date()), 'yyyy-MM-dd'),
          },
          onAddNext
        );
      case 'THIS_WEEK':
        return onAddQuickFilter(
          {
            propertyKey: 'lasteventat',
            operator: '>=',
            value: format(startOfWeek(new Date()), 'yyyy-MM-dd'),
          },
          onAddNext
        );
      case 'LAST_WEEK':
        return onAddQuickFilter(
          {
            operation: 'and',
            tokens: [
              {
                propertyKey: 'lasteventat',
                operator: '>=',
                value: format(startOfWeek(subWeeks(new Date(), 1)), 'yyyy-MM-dd'),
              },
              { propertyKey: 'lasteventat', operator: '<', value: format(startOfWeek(new Date()), 'yyyy-MM-dd') },
            ],
          },
          onAddNext
        );
      default:
        throw new Error('Invariant violation: unsupported filter.');
    }
  };

  const [latencyFilter, setLatencyFilter] = useState({ min: 0, max: 0 });
  const onLatencyChange = useDebounceCallback((latency: { min: number; max: number }) => {
    onAddQuickFilter(
      {
        operation: 'and',
        tokens: [
          { propertyKey: 'averagelatency', operator: '>=', value: latency.min },
          { propertyKey: 'averagelatency', operator: '<=', value: latency.max },
        ],
      },
      (prev, next) => next
    );
  }, 1000);

  return (
    <ScreenshotArea gutters={false}>
      <I18nProvider messages={[messages]} locale="en">
        <AppLayout
          ariaLabels={appLayoutLabels}
          breadcrumbs={<Breadcrumbs />}
          navigation={<Navigation />}
          tools={<Tools>{toolsContent.long}</Tools>}
          splitPanelOpen={splitPanelOpen}
          onSplitPanelToggle={({ detail }) => setSplitPanelOpen(detail.open)}
          splitPanel={
            <SplitPanel
              header="Split panel header"
              i18nStrings={{
                preferencesTitle: 'Preferences',
                preferencesPositionLabel: 'Split panel position',
                preferencesPositionDescription: 'Choose the default split panel position for the service.',
                preferencesPositionSide: 'Side',
                preferencesPositionBottom: 'Bottom',
                preferencesConfirm: 'Confirm',
                preferencesCancel: 'Cancel',
                closeButtonAriaLabel: 'Close panel',
                openButtonAriaLabel: 'Open panel',
                resizeHandleAriaLabel: 'Slider',
              }}
            >
              <SpaceBetween size="m">
                <ExpandableSection headerText="Quick filters" defaultExpanded={true}>
                  <SpaceBetween size="s">
                    <FormField label="State">
                      <SpaceBetween size="s" direction="horizontal">
                        <Button variant="inline-link" onClick={() => onAddStateQuickFilter('STOPPED')}>
                          stopped
                        </Button>
                        <Button variant="inline-link" onClick={() => onAddStateQuickFilter('STOPPING')}>
                          stopping
                        </Button>
                        <Button variant="inline-link" onClick={() => onAddStateQuickFilter('PENDING')}>
                          pending
                        </Button>
                      </SpaceBetween>
                    </FormField>

                    <FormField label="Tags (used frequently)">
                      <SpaceBetween size="s" direction="horizontal">
                        {['A', 'B', 'C', 'AA', 'AAA'].map(tag => (
                          <Badge key={tag}>
                            <span className={styles['badge-button']} onClick={() => onAddTagsQuickFilter(tag)}>
                              {tag}
                            </span>
                          </Badge>
                        ))}
                      </SpaceBetween>
                    </FormField>

                    <FormField label="Last event occurrence">
                      <SpaceBetween size="s" direction="horizontal">
                        <Button variant="inline-link" onClick={() => onAddLastOccurrenceQuickFilter('TODAY')}>
                          today
                        </Button>
                        <Button variant="inline-link" onClick={() => onAddLastOccurrenceQuickFilter('THIS_WEEK')}>
                          this week
                        </Button>
                        <Button variant="inline-link" onClick={() => onAddLastOccurrenceQuickFilter('LAST_WEEK')}>
                          last week
                        </Button>
                      </SpaceBetween>
                    </FormField>

                    <FormField label="Average latency, ms">
                      <SpaceBetween size="s" direction="horizontal" alignItems="center">
                        <FormField description="min">
                          <div style={{ minWidth: 150 }}>
                            <Slider
                              value={latencyFilter.min}
                              onChange={({ detail }) => {
                                setLatencyFilter(prev => {
                                  const next = {
                                    min: detail.value,
                                    max: Math.max(prev.max, detail.value),
                                  };
                                  onLatencyChange(next);
                                  return next;
                                });
                              }}
                              min={0}
                              max={1000}
                            />
                          </div>
                        </FormField>
                        <FormField description="max">
                          <div style={{ minWidth: 150 }}>
                            <Slider
                              value={latencyFilter.max}
                              onChange={({ detail }) => {
                                setLatencyFilter(prev => {
                                  const next = {
                                    max: detail.value,
                                    min: Math.min(prev.min, detail.value),
                                  };
                                  onLatencyChange(next);
                                  return next;
                                });
                              }}
                              min={0}
                              max={1000}
                            />
                          </div>
                        </FormField>
                        <Button
                          variant="link"
                          onClick={() => {
                            setLatencyFilter({ min: 0, max: 0 });
                            onAddQuickFilter(
                              {
                                operation: 'and',
                                tokens: [
                                  { propertyKey: 'averagelatency', operator: '>=', value: 0 },
                                  { propertyKey: 'averagelatency', operator: '<=', value: 0 },
                                ],
                              },
                              () => null
                            );
                          }}
                        >
                          reset
                        </Button>
                      </SpaceBetween>
                    </FormField>
                  </SpaceBetween>
                </ExpandableSection>

                <ExpandableSection headerText="Settings" defaultExpanded={false}>
                  <SpaceBetween size="s">
                    <Checkbox
                      checked={virtualScroll}
                      onChange={({ detail }) => setUrlParams({ virtualScroll: detail.checked })}
                    >
                      virtualScroll
                    </Checkbox>
                    <Checkbox
                      checked={expandToViewport}
                      onChange={({ detail }) => setUrlParams({ expandToViewport: detail.checked })}
                    >
                      expandToViewport
                    </Checkbox>
                    <Checkbox
                      checked={enableTokenGroups}
                      onChange={({ detail }) => setUrlParams({ enableTokenGroups: detail.checked })}
                    >
                      enableTokenGroups
                    </Checkbox>
                    <Checkbox
                      checked={disableFreeTextFiltering}
                      onChange={({ detail }) => setUrlParams({ disableFreeTextFiltering: detail.checked })}
                    >
                      disableFreeTextFiltering
                    </Checkbox>
                    <Checkbox
                      checked={hideOperations}
                      onChange={({ detail }) => setUrlParams({ hideOperations: detail.checked })}
                    >
                      hideOperations
                    </Checkbox>
                    <Checkbox
                      checked={asyncOptions}
                      onChange={({ detail }) => setUrlParams({ asyncOptions: detail.checked })}
                    >
                      asyncOptions
                    </Checkbox>
                    <Checkbox
                      checked={emptyOptions}
                      onChange={({ detail }) => setUrlParams({ emptyOptions: detail.checked })}
                    >
                      Empty options
                    </Checkbox>
                  </SpaceBetween>
                </ExpandableSection>
              </SpaceBetween>
            </SplitPanel>
          }
          content={
            <Table<TableItem>
              className="main-content"
              stickyHeader={true}
              header={<Header headingTagOverride={'h1'}>Instances</Header>}
              items={items}
              {...collectionProps}
              filter={
                <PropertyFilter
                  {...labels}
                  {...propertyFilterProps}
                  {...asyncProps}
                  filteringOptions={asyncOptions ? optionsLoader.items : filteringOptions}
                  enableTokenGroups={enableTokenGroups}
                  disableFreeTextFiltering={disableFreeTextFiltering}
                  hideOperations={hideOperations}
                  virtualScroll={virtualScroll}
                  expandToViewport={expandToViewport}
                  countText={`${items.length} matches`}
                  tokenLimit={3}
                />
              }
              columnDefinitions={columnDefinitions}
            />
          }
        />
      </I18nProvider>
    </ScreenshotArea>
  );
}
