// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import AppLayoutToolbar from '~components/app-layout-toolbar';
import Badge from '~components/badge';
import BreadcrumbGroup from '~components/breadcrumb-group';
import Button from '~components/button';
import Container from '~components/container';
import DateRangePicker, { DateRangePickerProps } from '~components/date-range-picker';
import ExpandableSection from '~components/expandable-section';
import Header from '~components/header';
import { I18nProvider } from '~components/i18n';
import messages from '~components/i18n/messages/all.en';
import LineChart from '~components/line-chart';
import PropertyFilter, { PropertyFilterProps } from '~components/property-filter';
import SegmentedControl from '~components/segmented-control';
import Select, { SelectProps } from '~components/select';
import SideNavigation from '~components/side-navigation';
import SpaceBetween from '~components/space-between';
interface Operation {
  id: string;
  type: string;
  config: Record<string, any>;
}
interface Query {
  id: string;
  name: string;
  metric: SelectProps.Option | null;
  propertyFilter: PropertyFilterProps.Query;
  operations: Operation[];
  options: {
    legend: SelectProps.Option;
    format: SelectProps.Option;
    type: SelectProps.Option;
    step?: SelectProps.Option;
    exemplars: SelectProps.Option | string;
  };
  codePreview: string;
}
interface QueryOperationsProps {
  operations: Operation[];
  onOperationChange: (index: number, config: Record<string, any>) => void;
  onRemoveOperation: (index: number) => void;
  onAddOperation: () => void;
}
function QueryOperations({ operations, onOperationChange, onRemoveOperation, onAddOperation }: QueryOperationsProps) {
  return (
    <ExpandableSection defaultExpanded={true} headerText="Operations" variant="default" data-venue="true">
      <SpaceBetween alignItems="start" direction="horizontal" size="s">
        {operations.map((operation, index) => (
          <SpaceBetween key={operation.id} size="xxs">
            <Header
              actions={<Button iconName="close" variant="icon" onClick={() => onRemoveOperation(index)} />}
              variant="h3"
            >
              {operation.type}
            </Header>
            {operation.type === 'Rate' && (
              <Select
                inlineLabelText="Range"
                options={[
                  {
                    label: '$__rate_interval',
                    value: '$__rate_interval',
                  },
                  {
                    label: '1m',
                    value: '1m',
                  },
                  {
                    label: '5m',
                    value: '5m',
                  },
                  {
                    label: '10m',
                    value: '10m',
                  },
                  {
                    label: '30m',
                    value: '30m',
                  },
                ]}
                selectedOption={operation.config.range || null}
                onChange={({ detail }) =>
                  onOperationChange(index, {
                    ...operation.config,
                    range: detail.selectedOption,
                  })
                }
              />
            )}
            {operation.type === 'Avg by' && (
              <>
                {operation.config.labels?.map((label: SelectProps.Option | null, labelIndex: number) => (
                  <Select
                    key={labelIndex}
                    inlineLabelText="Label"
                    options={[
                      {
                        label: 'action_name',
                        value: 'action_name',
                      },
                      {
                        label: 'alertstate',
                        value: 'alertstate',
                      },
                      {
                        label: 'job',
                        value: 'job',
                      },
                      {
                        label: 'instance',
                        value: 'instance',
                      },
                    ]}
                    selectedOption={label}
                    onChange={({ detail }) => {
                      const newLabels = [...operation.config.labels];
                      newLabels[labelIndex] = detail.selectedOption;
                      onOperationChange(index, {
                        ...operation.config,
                        labels: newLabels,
                      });
                    }}
                  />
                ))}
                <Button iconName="add-plus" variant="link">
                  Add label
                </Button>
              </>
            )}
            {operation.type === 'Divide by scalar' && (
              <Select
                inlineLabelText="Value"
                options={[
                  {
                    label: '1',
                    value: '1',
                  },
                  {
                    label: '2',
                    value: '2',
                  },
                  {
                    label: '10',
                    value: '10',
                  },
                  {
                    label: '100',
                    value: '100',
                  },
                ]}
                selectedOption={operation.config.value || null}
                onChange={({ detail }) =>
                  onOperationChange(index, {
                    ...operation.config,
                    value: detail.selectedOption,
                  })
                }
              />
            )}
            {operation.type === 'Min by' && (
              <>
                {operation.config.labels?.map((label: SelectProps.Option | null, labelIndex: number) => (
                  <Select
                    key={labelIndex}
                    inlineLabelText="Label"
                    options={[
                      {
                        label: '__name__',
                        value: '__name__',
                      },
                      {
                        label: 'action_name',
                        value: 'action_name',
                      },
                      {
                        label: 'alertstate',
                        value: 'alertstate',
                      },
                    ]}
                    selectedOption={label}
                    onChange={({ detail }) => {
                      const newLabels = [...operation.config.labels];
                      newLabels[labelIndex] = detail.selectedOption;
                      onOperationChange(index, {
                        ...operation.config,
                        labels: newLabels,
                      });
                    }}
                  />
                ))}
                <Button iconName="add-plus" variant="link">
                  Add label
                </Button>
              </>
            )}
            {operation.type === 'Avg' && (
              <>
                <Select
                  inlineLabelText="Function"
                  options={[
                    {
                      label: 'Avg',
                      value: 'avg',
                    },
                    {
                      label: 'Sum',
                      value: 'sum',
                    },
                    {
                      label: 'Min',
                      value: 'min',
                    },
                    {
                      label: 'Max',
                      value: 'max',
                    },
                    {
                      label: 'Count',
                      value: 'count',
                    },
                  ]}
                  selectedOption={operation.config.function || null}
                  onChange={({ detail }) =>
                    onOperationChange(index, {
                      ...operation.config,
                      function: detail.selectedOption,
                    })
                  }
                />
                <Button iconName="add-plus" variant="link">
                  By label
                </Button>
              </>
            )}
          </SpaceBetween>
        ))}
        <Button iconName="add-plus" variant="normal" onClick={onAddOperation}>
          Add operation
        </Button>
      </SpaceBetween>
    </ExpandableSection>
  );
}
interface QueryOptionsProps {
  options: Query['options'];
  onOptionsChange: (options: Query['options']) => void;
  queryId: string;
}
function QueryOptions({ options, onOptionsChange, queryId }: QueryOptionsProps) {
  return (
    <ExpandableSection defaultExpanded={true} headerText="Query options" variant="default" data-venue="true">
      <SpaceBetween alignItems="start" direction="horizontal" size="s">
        <SpaceBetween size="xxs">
          <Header variant="h3">Auto</Header>
          <Select
            inlineLabelText="Legend"
            options={[
              {
                label: 'Auto',
                value: 'auto',
              },
              {
                label: 'Verbose',
                value: 'verbose',
              },
              {
                label: 'Custom',
                value: 'custom',
              },
            ]}
            selectedOption={options.legend}
            onChange={({ detail }) =>
              onOptionsChange({
                ...options,
                legend: detail.selectedOption,
              })
            }
          />
          {queryId === 'query-b' && (
            <Select
              inlineLabelText="Step"
              options={[
                {
                  label: 'Auto',
                  value: 'auto',
                },
                {
                  label: '1m',
                  value: '1m',
                },
                {
                  label: '5m',
                  value: '5m',
                },
                {
                  label: '10m',
                  value: '10m',
                },
              ]}
              selectedOption={options.step || null}
              onChange={({ detail }) =>
                onOptionsChange({
                  ...options,
                  step: detail.selectedOption,
                })
              }
            />
          )}
        </SpaceBetween>
        <SpaceBetween size="xxs">
          <Header variant="h3">Table</Header>
          <Select
            inlineLabelText="Format"
            options={[
              {
                label: 'Table',
                value: 'table',
              },
              {
                label: 'Time series',
                value: 'time_series',
              },
              {
                label: 'Heatmap',
                value: 'heatmap',
              },
            ]}
            selectedOption={options.format}
            onChange={({ detail }) =>
              onOptionsChange({
                ...options,
                format: detail.selectedOption,
              })
            }
          />
        </SpaceBetween>
        <SpaceBetween size="xxs">
          <Header variant="h3">Range</Header>
          <Select
            inlineLabelText="Type"
            options={[
              {
                label: 'Range',
                value: 'range',
              },
              {
                label: 'Instant',
                value: 'instant',
              },
              {
                label: 'Both',
                value: 'both',
              },
            ]}
            selectedOption={options.type}
            onChange={({ detail }) =>
              onOptionsChange({
                ...options,
                type: detail.selectedOption,
              })
            }
          />
          {queryId === 'query-a' ? (
            <SegmentedControl
              label="Exemplars"
              options={[
                {
                  id: 'exemplars-on',
                  text: 'On',
                },
                {
                  id: 'exemplars-off',
                  text: 'Off',
                },
              ]}
              selectedId={options.exemplars as string}
              onChange={({ detail }) =>
                onOptionsChange({
                  ...options,
                  exemplars: detail.selectedId,
                })
              }
            />
          ) : (
            <Select
              inlineLabelText="Exemplars"
              options={[
                {
                  label: 'True',
                  value: 'true',
                },
                {
                  label: 'False',
                  value: 'false',
                },
              ]}
              selectedOption={options.exemplars as SelectProps.Option}
              onChange={({ detail }) =>
                onOptionsChange({
                  ...options,
                  exemplars: detail.selectedOption,
                })
              }
            />
          )}
        </SpaceBetween>
      </SpaceBetween>
    </ExpandableSection>
  );
}
interface QueryContainerProps {
  query: Query;
  badge: string;
  onQueryChange: (query: Query) => void;
  onRemove: () => void;
}
function QueryContainer({ query, badge, onQueryChange, onRemove }: QueryContainerProps) {
  const metricOptions =
    query.id === 'query-a'
      ? [
          {
            label: 'ALERTS',
            value: 'ALERTS',
          },
          {
            label: 'ALERTS_FOR_STATE',
            value: 'ALERTS_FOR_STATE',
          },
          {
            label: 'up',
            value: 'up',
          },
          {
            label: 'scrape_duration_seconds',
            value: 'scrape_duration_seconds',
          },
          {
            label: 'http_requests_total',
            value: 'http_requests_total',
          },
        ]
      : [
          {
            label: 'ALERTS',
            value: 'ALERTS',
          },
          {
            label: 'ALERTS_FOR_STATE',
            value: 'ALERTS_FOR_STATE',
          },
          {
            label: 'up',
            value: 'up',
          },
          {
            label: 'scrape_duration_seconds',
            value: 'scrape_duration_seconds',
          },
          {
            label: 'http_requests_total',
            value: 'http_requests_total',
          },
        ];
  const filteringOptions =
    query.id === 'query-a'
      ? [
          {
            propertyKey: 'alertstate',
            value: 'pending',
          },
          {
            propertyKey: 'alertstate',
            value: 'firing',
          },
          {
            propertyKey: 'alertstate',
            value: 'inactive',
          },
          {
            propertyKey: 'action_name',
            value: 'getPizza',
          },
          {
            propertyKey: 'action_name',
            value: 'getOrder',
          },
          {
            propertyKey: 'severity',
            value: 'critical',
          },
          {
            propertyKey: 'severity',
            value: 'warning',
          },
          {
            propertyKey: 'severity',
            value: 'info',
          },
        ]
      : [
          {
            propertyKey: 'alertstate',
            value: 'pending',
          },
          {
            propertyKey: 'alertstate',
            value: 'firing',
          },
          {
            propertyKey: 'alertstate',
            value: 'inactive',
          },
          {
            propertyKey: 'alertname',
            value: 'HighErrorRate',
          },
          {
            propertyKey: 'alertname',
            value: 'HighLatency',
          },
          {
            propertyKey: 'severity',
            value: 'critical',
          },
          {
            propertyKey: 'severity',
            value: 'warning',
          },
          {
            propertyKey: 'severity',
            value: 'info',
          },
        ];
  const filteringProperties =
    query.id === 'query-a'
      ? [
          {
            groupValuesLabel: 'Alert state values',
            key: 'alertstate',
            operators: ['=', '!='],
            propertyLabel: 'alertstate',
          },
          {
            groupValuesLabel: 'Action name values',
            key: 'action_name',
            operators: ['=', '!=', ':', '!:'],
            propertyLabel: 'action_name',
          },
          {
            groupValuesLabel: 'Job values',
            key: 'job',
            operators: ['=', '!=', ':', '!:'],
            propertyLabel: 'job',
          },
          {
            groupValuesLabel: 'Instance values',
            key: 'instance',
            operators: ['=', '!=', ':', '!:'],
            propertyLabel: 'instance',
          },
          {
            groupValuesLabel: 'Severity values',
            key: 'severity',
            operators: ['=', '!='],
            propertyLabel: 'severity',
          },
        ]
      : [
          {
            groupValuesLabel: 'Alert state values',
            key: 'alertstate',
            operators: ['=', '!='],
            propertyLabel: 'alertstate',
          },
          {
            groupValuesLabel: 'Alert name values',
            key: 'alertname',
            operators: ['=', '!=', ':', '!:'],
            propertyLabel: 'alertname',
          },
          {
            groupValuesLabel: 'Job values',
            key: 'job',
            operators: ['=', '!=', ':', '!:'],
            propertyLabel: 'job',
          },
          {
            groupValuesLabel: 'Instance values',
            key: 'instance',
            operators: ['=', '!=', ':', '!:'],
            propertyLabel: 'instance',
          },
          {
            groupValuesLabel: 'Severity values',
            key: 'severity',
            operators: ['=', '!='],
            propertyLabel: 'severity',
          },
        ];
  return (
    <Container
      header={
        <Header
          actions={
            <SpaceBetween alignItems="center" direction="horizontal" size="xs">
              <Badge color="blue">{badge}</Badge>
              <Button iconName="star" variant="normal">
                Saved queries
              </Button>
              <Button iconName="remove" variant="icon" onClick={onRemove} />
            </SpaceBetween>
          }
          variant="h2"
        >
          {query.name}
        </Header>
      }
      data-venue="true"
    >
      <SpaceBetween size="m">
        <SpaceBetween alignItems="center" direction="horizontal" size="s">
          <Select
            filteringType="auto"
            inlineLabelText="Metric"
            options={metricOptions}
            selectedOption={query.metric}
            onChange={({ detail }) =>
              onQueryChange({
                ...query,
                metric: detail.selectedOption,
              })
            }
          />
          <PropertyFilter
            filteringOptions={filteringOptions}
            filteringPlaceholder="Filter by label"
            filteringProperties={filteringProperties}
            query={query.propertyFilter}
            onChange={({ detail }) =>
              onQueryChange({
                ...query,
                propertyFilter: detail,
              })
            }
          />
        </SpaceBetween>
        <QueryOperations
          operations={query.operations}
          onOperationChange={(index, config) => {
            const newOperations = [...query.operations];
            newOperations[index] = {
              ...newOperations[index],
              config,
            };
            onQueryChange({
              ...query,
              operations: newOperations,
            });
          }}
          onRemoveOperation={index => {
            const newOperations = query.operations.filter((_, i) => i !== index);
            onQueryChange({
              ...query,
              operations: newOperations,
            });
          }}
          onAddOperation={() => {
            // Add a new operation - default to Rate
            const newOperation: Operation = {
              id: `op-${Date.now()}`,
              type: 'Rate',
              config: {
                range: {
                  label: '$__rate_interval',
                  value: '$__rate_interval',
                },
              },
            };
            onQueryChange({
              ...query,
              operations: [...query.operations, newOperation],
            });
          }}
        />
        {/*<CodeView content={query.codePreview} wrapLines={true} />*/}
        <QueryOptions
          queryId={query.id}
          options={query.options}
          onOptionsChange={options =>
            onQueryChange({
              ...query,
              options,
            })
          }
        />
      </SpaceBetween>
    </Container>
  );
}
function MetricsExplorer() {
  const [dateRange, setDateRange] = useState<DateRangePickerProps.Value | null>({
    amount: 1,
    key: 'previous-1-hour',
    type: 'relative',
    unit: 'hour',
  });
  const [queries, setQueries] = useState<Query[]>([
    {
      id: 'query-a',
      name: 'Query A',
      metric: {
        label: 'ALERTS',
        value: 'ALERTS',
      },
      propertyFilter: {
        operation: 'and',
        tokens: [
          {
            operator: '=',
            propertyKey: 'alertstate',
            value: 'pending',
          },
          {
            operator: '!=',
            propertyKey: 'action_name',
            value: 'getPizza',
          },
        ],
      },
      operations: [
        {
          id: 'op-1',
          type: 'Rate',
          config: {
            range: {
              label: '$__rate_interval',
              value: '$__rate_interval',
            },
          },
        },
        {
          id: 'op-2',
          type: 'Avg by',
          config: {
            labels: [
              {
                label: 'action_name',
                value: 'action_name',
              },
              {
                label: 'action_name',
                value: 'action_name',
              },
              {
                label: 'alertstate',
                value: 'alertstate',
              },
            ],
          },
        },
        {
          id: 'op-3',
          type: 'Divide by scalar',
          config: {
            value: {
              label: '2',
              value: '2',
            },
          },
        },
        {
          id: 'op-4',
          type: 'Min by',
          config: {
            labels: [
              {
                label: '__name__',
                value: '__name__',
              },
            ],
          },
        },
        {
          id: 'op-5',
          type: 'Divide by scalar',
          config: {
            value: {
              label: '2',
              value: '2',
            },
          },
        },
      ],
      options: {
        legend: {
          label: 'Auto',
          value: 'auto',
        },
        format: {
          label: 'Table',
          value: 'table',
        },
        type: {
          label: 'Range',
          value: 'range',
        },
        exemplars: 'exemplars-off',
      },
      codePreview:
        'min by(__name__) (avg by(action_name, action_name, alertstate) (rate(ALERTS{alertstate="pending", action_name!="getPizza"}[$__rate_interval]))) / 2 / 2',
    },
    {
      id: 'query-b',
      name: 'Query B',
      metric: {
        label: 'ALERTS_FOR_STATE',
        value: 'ALERTS_FOR_STATE',
      },
      propertyFilter: {
        operation: 'and',
        tokens: [],
      },
      operations: [
        {
          id: 'op-1',
          type: 'Avg',
          config: {
            function: {
              label: 'Avg',
              value: 'avg',
            },
          },
        },
      ],
      options: {
        legend: {
          label: 'Auto',
          value: 'auto',
        },
        format: {
          label: 'Time series',
          value: 'time_series',
        },
        type: {
          label: 'Both',
          value: 'both',
        },
        step: {
          label: 'Auto',
          value: 'auto',
        },
        exemplars: {
          label: 'False',
          value: 'false',
        },
      },
      codePreview: 'avg(ALERTS_FOR_STATE)',
    },
  ]);
  const [chartType, setChartType] = useState<string>('lines');
  const handleQueryChange = (index: number, updatedQuery: Query) => {
    const newQueries = [...queries];
    newQueries[index] = updatedQuery;
    setQueries(newQueries);
  };
  const handleRemoveQuery = (index: number) => {
    const newQueries = queries.filter((_, i) => i !== index);
    setQueries(newQueries);
  };
  const handleAddQuery = () => {
    const newQuery: Query = {
      id: `query-${Date.now()}`,
      name: `Query ${String.fromCharCode(65 + queries.length)}`,
      metric: null,
      propertyFilter: {
        operation: 'and',
        tokens: [],
      },
      operations: [],
      options: {
        legend: {
          label: 'Auto',
          value: 'auto',
        },
        format: {
          label: 'Table',
          value: 'table',
        },
        type: {
          label: 'Range',
          value: 'range',
        },
        exemplars: 'exemplars-off',
      },
      codePreview: '',
    };
    setQueries([...queries, newQuery]);
  };
  return (
    <I18nProvider messages={[messages]} locale="en">
      <AppLayoutToolbar
        breadcrumbs={
          <BreadcrumbGroup
            items={[
              {
                href: '#metrics-explorer',
                text: 'Metrics explorer',
              },
              {
                href: '#metrics-explorer',
                text: 'Explore',
              },
            ]}
          />
        }
        content={
          <SpaceBetween size="m">
            <Header
              actions={
                <SpaceBetween alignItems="center" direction="horizontal" size="xs">
                  <DateRangePicker
                    absoluteFormat="long-localized"
                    placeholder="Filter by date and time range"
                    relativeOptions={[
                      {
                        amount: 15,
                        key: 'previous-15-minutes',
                        type: 'relative',
                        unit: 'minute',
                      },
                      {
                        amount: 30,
                        key: 'previous-30-minutes',
                        type: 'relative',
                        unit: 'minute',
                      },
                      {
                        amount: 1,
                        key: 'previous-1-hour',
                        type: 'relative',
                        unit: 'hour',
                      },
                      {
                        amount: 3,
                        key: 'previous-3-hours',
                        type: 'relative',
                        unit: 'hour',
                      },
                      {
                        amount: 6,
                        key: 'previous-6-hours',
                        type: 'relative',
                        unit: 'hour',
                      },
                      {
                        amount: 12,
                        key: 'previous-12-hours',
                        type: 'relative',
                        unit: 'hour',
                      },
                      {
                        amount: 24,
                        key: 'previous-24-hours',
                        type: 'relative',
                        unit: 'hour',
                      },
                      {
                        amount: 7,
                        key: 'previous-7-days',
                        type: 'relative',
                        unit: 'day',
                      },
                    ]}
                    value={dateRange}
                    onChange={({ detail }) => setDateRange(detail.value)}
                    isValidRange={() => ({
                      valid: true,
                    })}
                  />
                  <Button iconName="play" variant="primary">
                    Run query
                  </Button>
                </SpaceBetween>
              }
              description="Build and run queries to explore your metrics data."
              variant="h1"
            >
              Explore
            </Header>
            {queries.map((query, index) => (
              <QueryContainer
                key={query.id}
                query={query}
                badge={String.fromCharCode(65 + index)}
                onQueryChange={updatedQuery => handleQueryChange(index, updatedQuery)}
                onRemove={() => handleRemoveQuery(index)}
              />
            ))}
            <SpaceBetween direction="horizontal" size="xs">
              <Button iconName="add-plus" variant="normal" onClick={handleAddQuery}>
                Add query
              </Button>
              <Button iconName="star" variant="normal">
                Add from saved queries
              </Button>
              <Button iconName="history" variant="normal">
                Query history
              </Button>
              <Button iconName="search" variant="normal">
                Query inspector
              </Button>
            </SpaceBetween>
            <Container
              header={
                <Header
                  actions={
                    <SpaceBetween alignItems="center" direction="horizontal" size="xs">
                      <SegmentedControl
                        label="Chart type"
                        options={[
                          {
                            id: 'lines',
                            text: 'Lines',
                          },
                          {
                            id: 'bars',
                            text: 'Bars',
                          },
                          {
                            id: 'points',
                            text: 'Points',
                          },
                        ]}
                        selectedId={chartType}
                        onChange={({ detail }) => setChartType(detail.selectedId)}
                      />
                    </SpaceBetween>
                  }
                  variant="h2"
                >
                  Graph
                </Header>
              }
              data-venue="true"
            >
              <LineChart
                height={300}
                hideFilter={true}
                legendTitle="Queries"
                series={[
                  {
                    color: '#2ca02c',
                    data: [
                      {
                        x: new Date('2024-01-01T00:00:00Z'),
                        y: 1770000000,
                      },
                      {
                        x: new Date('2024-01-01T00:05:00Z'),
                        y: 1768500000,
                      },
                      {
                        x: new Date('2024-01-01T00:10:00Z'),
                        y: 1771000000,
                      },
                      {
                        x: new Date('2024-01-01T00:15:00Z'),
                        y: 1769000000,
                      },
                      {
                        x: new Date('2024-01-01T00:20:00Z'),
                        y: 1772500000,
                      },
                      {
                        x: new Date('2024-01-01T00:25:00Z'),
                        y: 1774000000,
                      },
                      {
                        x: new Date('2024-01-01T00:30:00Z'),
                        y: 1776000000,
                      },
                      {
                        x: new Date('2024-01-01T00:35:00Z'),
                        y: 1779500000,
                      },
                      {
                        x: new Date('2024-01-01T00:40:00Z'),
                        y: 1782000000,
                      },
                      {
                        x: new Date('2024-01-01T00:45:00Z'),
                        y: 1785000000,
                      },
                      {
                        x: new Date('2024-01-01T00:50:00Z'),
                        y: 1789000000,
                      },
                      {
                        x: new Date('2024-01-01T00:55:00Z'),
                        y: 1795000000,
                      },
                      {
                        x: new Date('2024-01-01T01:00:00Z'),
                        y: 1800000000,
                      },
                    ],
                    title: 'Query A – min by(__name__)',
                    type: 'line',
                  },
                  {
                    color: '#1f77b4',
                    data: [
                      {
                        x: new Date('2024-01-01T00:00:00Z'),
                        y: 1769000000,
                      },
                      {
                        x: new Date('2024-01-01T00:05:00Z'),
                        y: 1767000000,
                      },
                      {
                        x: new Date('2024-01-01T00:10:00Z'),
                        y: 1770500000,
                      },
                      {
                        x: new Date('2024-01-01T00:15:00Z'),
                        y: 1768000000,
                      },
                      {
                        x: new Date('2024-01-01T00:20:00Z'),
                        y: 1771000000,
                      },
                      {
                        x: new Date('2024-01-01T00:25:00Z'),
                        y: 1773000000,
                      },
                      {
                        x: new Date('2024-01-01T00:30:00Z'),
                        y: 1775500000,
                      },
                      {
                        x: new Date('2024-01-01T00:35:00Z'),
                        y: 1778000000,
                      },
                      {
                        x: new Date('2024-01-01T00:40:00Z'),
                        y: 1780500000,
                      },
                      {
                        x: new Date('2024-01-01T00:45:00Z'),
                        y: 1783000000,
                      },
                      {
                        x: new Date('2024-01-01T00:50:00Z'),
                        y: 1787000000,
                      },
                      {
                        x: new Date('2024-01-01T00:55:00Z'),
                        y: 1792000000,
                      },
                      {
                        x: new Date('2024-01-01T01:00:00Z'),
                        y: 1797000000,
                      },
                    ],
                    title: 'Query B – avg(ALERTS_FOR_STATE)',
                    type: 'line',
                  },
                ]}
                xScaleType="time"
                yScaleType="linear"
                yTitle="Value"
                i18nStrings={{
                  chartAriaRoleDescription: 'Line chart',
                  xAxisAriaRoleDescription: 'Time axis',
                  yAxisAriaRoleDescription: 'Value axis',
                }}
              />
            </Container>
          </SpaceBetween>
        }
        contentType="default"
        navigation={
          <SideNavigation
            activeHref="#metrics-explorer"
            header={{
              href: '#metrics-explorer',
              text: 'Metrics explorer',
            }}
            items={[
              {
                href: '#metrics-explorer',
                text: 'Explore',
                type: 'link',
              },
              {
                type: 'divider',
              },
              {
                defaultExpanded: true,
                items: [
                  {
                    href: '#saved-queries',
                    text: 'Saved queries',
                    type: 'link',
                  },
                  {
                    href: '#query-history',
                    text: 'Query history',
                    type: 'link',
                  },
                ],
                text: 'Queries',
                type: 'section',
              },
              {
                defaultExpanded: false,
                items: [
                  {
                    href: '#my-dashboards',
                    text: 'My dashboards',
                    type: 'link',
                  },
                  {
                    href: '#shared-dashboards',
                    text: 'Shared dashboards',
                    type: 'link',
                  },
                ],
                text: 'Dashboards',
                type: 'section',
              },
            ]}
          />
        }
      />
    </I18nProvider>
  );
}
export default MetricsExplorer;
