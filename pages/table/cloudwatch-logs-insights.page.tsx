// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import AppLayout from '~components/app-layout';
import Box from '~components/box';
import Button from '~components/button';
import ButtonDropdown from '~components/button-dropdown';
import Container from '~components/container';
import DateRangePicker, { DateRangePickerProps } from '~components/date-range-picker';
import Drawer from '~components/drawer';
import FormField from '~components/form-field';
import Header from '~components/header';
import Input from '~components/input';
import Link from '~components/link';
import Modal from '~components/modal';
import Pagination from '~components/pagination';
import Popover from '~components/popover';
import ProgressBar from '~components/progress-bar';
import PropertyFilter, { PropertyFilterProps } from '~components/property-filter';
import RadioGroup from '~components/radio-group';
import Select from '~components/select';
import SideNavigation, { SideNavigationProps } from '~components/side-navigation';
import SpaceBetween from '~components/space-between';
import StatusIndicator from '~components/status-indicator';
import Table, { TableProps } from '~components/table';
import Tabs from '~components/tabs';
import TextContent from '~components/text-content';
import Toggle from '~components/toggle';
import ToggleButton from '~components/toggle-button';

// ─── Mock log data ────────────────────────────────────────────────────────────

interface LogEntry {
  timestamp: string;
  message: string;
}

const LOG_ENTRIES: LogEntry[] = [
  {
    timestamp: '2026-09-07T13:43:25.133Z',
    message:
      '{"SinkName":"awsui-widget-app-layout","CallerAccountId":"812642122877","CallerSessionArn":"arn:aws:iam::812642122877:root","CallerCategory":"customer","PrismModeEnabled":false,"IsDualstackDomain":false}',
  },
  {
    timestamp: '2026-09-07T13:43:25.034Z',
    message:
      '{"LotusMetadataError":0,"LotusMajorVersion":"3","LotusPackageName":"@amzn/awsui-widget-app-layout","_aws":{"Timestamp":1788788605034,"CloudWatchMetrics":[{"Namespace":"TangerineBoxClientSideTelemetry"}]}}',
  },
  {
    timestamp: '2026-09-07T13:43:25.033Z',
    message:
      '{"LotusMetadataError":0,"LotusMajorVersion":"3","LotusPackageName":"@amzn/awsui-widget-app-layout","_aws":{"Timestamp":1788788605033,"CloudWatchMetrics":[{"Namespace":"TangerineBoxClientSideTelemetry"}]}}',
  },
  {
    timestamp: '2026-09-07T13:43:24.009Z',
    message:
      '{"SinkName":"awsui-widget-app-layout","CallerAccountId":"812642122877","CallerSessionArn":"arn:aws:iam::812642122877:root","CallerCategory":"customer","PrismModeEnabled":false,"IsDualstackDomain":false}',
  },
  {
    timestamp: '2026-09-07T13:43:23.874Z',
    message:
      '{"SinkName":"awsui-widget-app-layout","CallerAccountId":"812642122877","CallerSessionArn":"arn:aws:iam::812642122877:root","CallerCategory":"customer","PrismModeEnabled":false,"IsDualstackDomain":false}',
  },
  {
    timestamp: '2026-09-07T13:43:23.812Z',
    message:
      '{"LotusMetadataError":0,"LotusMajorVersion":"3","LotusPackageName":"@amzn/awsui-widget-app-layout","_aws":{"Timestamp":1788788603812,"CloudWatchMetrics":[{"Namespace":"TangerineBoxClientSideTelemetry"}]}}',
  },
  {
    timestamp: '2026-09-07T13:43:23.807Z',
    message:
      '{"LotusMetadataError":0,"LotusMajorVersion":"3","LotusPackageName":"@amzn/awsui-widget-app-layout","_aws":{"Timestamp":1788788603807,"CloudWatchMetrics":[{"Namespace":"TangerineBoxClientSideTelemetry"}]}}',
  },
  {
    timestamp: '2026-09-07T13:43:23.806Z',
    message:
      '{"LotusMetadataError":0,"LotusMajorVersion":"3","LotusPackageName":"@amzn/awsui-widget-app-layout","_aws":{"Timestamp":1788788603806,"CloudWatchMetrics":[{"Namespace":"TangerineBoxClientSideTelemetry"}]}}',
  },
  {
    timestamp: '2026-09-07T13:43:23.325Z',
    message:
      '{"SinkName":"awsui-widget-app-layout","CallerAccountId":"944103138524","CallerSessionArn":"arn:aws:sts::944103138524:assumed-role/AWSReservedSSO_Billing_c269b5c82e91f243/chara.kimmins","CallerCategory":"c"}',
  },
  {
    timestamp: '2026-09-07T13:43:23.324Z',
    message:
      '{"SinkName":"awsui-widget-app-layout","CallerAccountId":"944103138524","CallerSessionArn":"arn:aws:sts::944103138524:assumed-role/AWSReservedSSO_Billing_c269b5c82e91f243/chara.kimmins","CallerCategory":"c"}',
  },
];

// ─── Histogram data ───────────────────────────────────────────────────────────
// Simplified bar chart data representing the log volume over time
const HISTOGRAM_DATES = ['Sep 1', 'Sep 2', 'Sep 3', 'Sep 4', 'Sep 5', 'Sep 6', 'Sep 7'];

// ─── Parsed fields for expanded row ──────────────────────────────────────────

interface ParsedField {
  key: string;
  value: string;
  isLink?: boolean;
}

const PARSED_FIELDS: ParsedField[] = [
  { key: '@timestamp', value: '1788788605133' },
  { key: '@log', value: '024848450036:ProdTelemetry-eu-north-1-TelemetrySinkLogGroup0E47EDFE-FXcZaVMDajcd' },
  { key: '@logStream', value: 'awsui-widget-app-layout-v1', isLink: true },
  { key: '@message', value: '' },
  { key: '@aws.account', value: '024848450036' },
  { key: '@aws.region', value: 'eu-north-1' },
  { key: '@data_format', value: 'Default' },
  { key: '@data_source_name', value: 'Unknown' },
  { key: '@data_source_type', value: 'Unknown' },
  { key: '@ingestionTime', value: '1788785022406' },
  { key: '@logGroupId', value: '395bab22-96ae-452f-a45c-54d2fcec0e50' },
  {
    key: '@logStreamId',
    value:
      '395bab22-96ae-452f-a45c-54d2fcec0e50::d6c7e64810d9b488bfacf3cd5e660c2aeee5c78a186b0e7f4a13f6dc741969b8::1780914751401',
  },
  { key: 'CallerAccountId', value: '812642122877' },
  { key: 'CallerCategory', value: 'customer' },
  { key: 'CallerSessionArn', value: 'arn:aws:iam::812642122877:root' },
  { key: 'ClientCountry', value: 'GB' },
  { key: 'ClientIp', value: '80.192.196.43' },
  { key: 'Content.payload.count', value: '1' },
  { key: 'Content.payload.loadTime', value: '115' },
  { key: 'Content.payload.metadataTime', value: '638' },
  { key: 'Content.payload.metricName', value: 'appLayoutWidgetJsLoaded' },
  { key: 'Content.payload.totalTime', value: '753' },
  { key: 'Headers.Referer.0', value: 'https://eu-north-1.console.aws.amazon.com/' },
  {
    key: 'Headers.User-Agent.0',
    value: 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:154.0) Gecko/20100101 Firefox/154.0',
  },
  { key: 'IsDualstackDomain', value: 'false' },
];

// ─── Time range buttons ───────────────────────────────────────────────────────

function TimeRangeSelector() {
  const RANGE_OPTIONS: Array<{ id: string; label: string; value: DateRangePickerProps.RelativeValue }> = [
    { id: '5m', label: '5m', value: { type: 'relative', amount: 5, unit: 'minute' } },
    { id: '30m', label: '30m', value: { type: 'relative', amount: 30, unit: 'minute' } },
    { id: '1h', label: '1h', value: { type: 'relative', amount: 1, unit: 'hour' } },
    { id: '3h', label: '3h', value: { type: 'relative', amount: 3, unit: 'hour' } },
    { id: '12h', label: '12h', value: { type: 'relative', amount: 12, unit: 'hour' } },
  ];

  const [selected, setSelected] = useState('1w');
  const [dateRange, setDateRange] = useState<DateRangePickerProps.Value>({
    type: 'relative',
    amount: 1,
    unit: 'week',
  });

  function selectToggle(id: string, value: DateRangePickerProps.RelativeValue) {
    setSelected(id);
    setDateRange(value);
  }

  return (
    <SpaceBetween direction="horizontal" size="xxxs">
      {RANGE_OPTIONS.map(({ id, label, value }) => (
        <ToggleButton
          key={id}
          onChange={({ detail }) => {
            if (detail.pressed) {
              selectToggle(id, value);
            }
          }}
          pressed={selected === id}
        >
          {label}
        </ToggleButton>
      ))}
      <DateRangePicker
        value={dateRange}
        onChange={({ detail }) => {
          setDateRange(detail.value!);
          setSelected('custom');
        }}
        renderTriggerContent={({ formattedDate }) => (dateRange?.type === 'absolute' ? <>Custom</> : formattedDate)}
        relativeOptions={[
          { key: '5m', type: 'relative' as const, amount: 5, unit: 'minute' as const },
          { key: '30m', type: 'relative' as const, amount: 30, unit: 'minute' as const },
          { key: '1h', type: 'relative' as const, amount: 1, unit: 'hour' as const },
          { key: '3h', type: 'relative' as const, amount: 3, unit: 'hour' as const },
          { key: '12h', type: 'relative' as const, amount: 12, unit: 'hour' as const },
          { key: 'previous-1-week', type: 'relative' as const, amount: 1, unit: 'week' as const },
          { key: 'previous-2-weeks', type: 'relative' as const, amount: 2, unit: 'week' as const },
          { key: 'previous-1-month', type: 'relative' as const, amount: 1, unit: 'month' as const },
          { key: 'previous-3-months', type: 'relative' as const, amount: 3, unit: 'month' as const },
        ]}
        isValidRange={value => {
          if (!value) {
            return { valid: false, errorMessage: 'Select a range' };
          }
          return { valid: true };
        }}
        placeholder="Last 1 week"
        ariaLabel="Date range"
        i18nStrings={{
          absoluteModeTitle: 'Absolute range',
          relativeModeTitle: 'Relative range',
          applyButtonLabel: 'Apply',
          cancelButtonLabel: 'Cancel',
          clearButtonLabel: 'Clear',
          startDateLabel: 'Start date',
          endDateLabel: 'End date',
          startTimeLabel: 'Start time',
          endTimeLabel: 'End time',
          relativeRangeSelectionHeading: 'Choose a range',
          customRelativeRangeOptionLabel: 'Custom range',
          customRelativeRangeOptionDescription: 'Set a custom range',
          customRelativeRangeDurationLabel: 'Duration',
          customRelativeRangeDurationPlaceholder: 'Enter duration',
          customRelativeRangeUnitLabel: 'Unit of time',
          formatRelativeRange: v => `Last ${v.amount} ${v.unit}${v.amount > 1 ? 's' : ''}`,
          formatUnit: (unit, value) => (value === 1 ? unit : `${unit}s`),
          dateConstraintText: 'Range must be between 6 and 30 days.',
          dateTimeConstraintText: 'Range must be between 6 and 30 days.',
          modeSelectionLabel: 'Range type',
          previousMonthAriaLabel: 'Previous month',
          nextMonthAriaLabel: 'Next month',
          todayAriaLabel: 'Today',
        }}
      />
    </SpaceBetween>
  );
}

// ─── Histogram (simplified with a bar chart placeholder) ─────────────────────

function Histogram() {
  // Simplified visual representation using inline divs since we're not loading Ace
  const bars = Array.from({ length: 56 }, (_, i) => {
    const height = 20 + Math.sin(i * 0.4) * 10 + Math.random() * 40;
    return height;
  });

  return (
    <Box padding={{ vertical: 's' }}>
      <div style={{ position: 'relative', height: 120, background: 'var(--color-background-container-content)' }}>
        {/* Y axis labels */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 20,
            width: 40,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            paddingRight: 4,
          }}
        >
          <Box variant="small" color="text-body-secondary">
            800k
          </Box>
          <Box variant="small" color="text-body-secondary">
            400k
          </Box>
          <Box variant="small" color="text-body-secondary">
            0
          </Box>
        </div>
        {/* Bars */}
        <div
          style={{
            position: 'absolute',
            left: 44,
            right: 8,
            top: 0,
            bottom: 20,
            display: 'flex',
            alignItems: 'flex-end',
            gap: 1,
          }}
        >
          {bars.map((h, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: `${h}%`,
                background: '#0972d3',
                opacity: 0.8,
                minWidth: 2,
              }}
            />
          ))}
        </div>
        {/* X axis labels */}
        <div
          style={{
            position: 'absolute',
            left: 44,
            right: 8,
            bottom: 0,
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          {HISTOGRAM_DATES.map((d, i) => (
            <Box key={i} variant="small" color="text-body-secondary">
              {d}
            </Box>
          ))}
        </div>
      </div>
    </Box>
  );
}

// ─── Query history mock data ─────────────────────────────────────────────────

interface HistoryItem {
  id: string;
  status: string;
  query: React.ReactNode;
  timeExecuted: string;
  queryLanguage: string;
  userIdentity: string;
  queryDuration: string;
  bytesScanned: string;
}

const QUERY_PREVIEW = (
  <div style={{ fontFamily: 'monospace', fontSize: 12, lineHeight: '18px', whiteSpace: 'pre-wrap' }}>
    <span style={{ color: '#0972d3' }}>SOURCE </span>
    <span>logGroups(namePrefix: [], class: </span>
    <span style={{ color: '#037f0c' }}>&quot;STANDARD&quot;</span>
    <span>{') START=-1w END=0s\n'}</span>
    <span>{'| '}</span>
    <span style={{ color: '#0972d3' }}>fields </span>
    <span>@timestamp, @message{'\n'}</span>
    <span>{'| '}</span>
    <span style={{ color: '#0972d3' }}>sort </span>
    <span>@timestamp</span>
  </div>
);

const HISTORY_ITEMS: HistoryItem[] = [
  {
    id: '1',
    status: 'Complete',
    query: QUERY_PREVIEW,
    timeExecuted: '2026-09-09 15:51 CEST',
    queryLanguage: 'CWLI',
    userIdentity: 'Admin',
    queryDuration: '4.82 s',
    bytesScanned: '243.5 MB',
  },
  {
    id: '2',
    status: 'Complete',
    query: QUERY_PREVIEW,
    timeExecuted: '2026-09-09 14:37 CEST',
    queryLanguage: 'CWLI',
    userIdentity: 'Admin',
    queryDuration: '3.60 s',
    bytesScanned: '258 MB',
  },
  {
    id: '3',
    status: 'Complete',
    query: QUERY_PREVIEW,
    timeExecuted: '2026-09-09 11:16 CEST',
    queryLanguage: 'CWLI',
    userIdentity: 'Admin',
    queryDuration: '4.38 s',
    bytesScanned: '265 MB',
  },
  {
    id: '4',
    status: 'Complete',
    query: QUERY_PREVIEW,
    timeExecuted: '2026-09-08 11:17 CEST',
    queryLanguage: 'CWLI',
    userIdentity: 'Admin',
    queryDuration: '4.78 s',
    bytesScanned: '331.4 MB',
  },
  {
    id: '5',
    status: 'Complete',
    query: QUERY_PREVIEW,
    timeExecuted: '2026-09-07 16:59 CEST',
    queryLanguage: 'CWLI',
    userIdentity: 'Admin',
    queryDuration: '4.70 s',
    bytesScanned: '320.2 MB',
  },
  {
    id: '6',
    status: 'Complete',
    query: QUERY_PREVIEW,
    timeExecuted: '2026-09-07 13:43 CEST',
    queryLanguage: 'CWLI',
    userIdentity: 'Admin',
    queryDuration: '4.55 s',
    bytesScanned: '298.1 MB',
  },
];

const HISTORY_COLUMNS: TableProps.ColumnDefinition<HistoryItem>[] = [
  {
    id: 'copy',
    header: '',
    width: 36,
    cell: () => <Button iconName="copy" variant="icon" ariaLabel="Copy query" />,
  },
  {
    id: 'id',
    header: 'ID',
    width: 50,
    cell: item => <Box color="text-body-secondary">{item.id}</Box>,
  },
  {
    id: 'status',
    header: 'Status',
    width: 110,
    cell: item => <StatusIndicator type="success">{item.status}</StatusIndicator>,
  },
  {
    id: 'query',
    header: 'Query',
    cell: item => item.query,
  },
  {
    id: 'timeExecuted',
    header: 'Time executed',
    width: 180,
    cell: item => <Box>{item.timeExecuted}</Box>,
  },
  {
    id: 'queryLanguage',
    header: 'Query language',
    width: 120,
    cell: item => <Box>{item.queryLanguage}</Box>,
  },
  {
    id: 'userIdentity',
    header: 'User identity',
    width: 120,
    cell: item => <Link href="#">{item.userIdentity}</Link>,
  },
  {
    id: 'queryDuration',
    header: 'Query duration',
    width: 120,
    cell: item => <Box>{item.queryDuration}</Box>,
  },
  {
    id: 'bytesScanned',
    header: 'Bytes scanned',
    width: 120,
    cell: item => <Link href="#">{item.bytesScanned}</Link>,
  },
];

// ─── Side navigation ─────────────────────────────────────────────────────────

const NAV_ITEMS: SideNavigationProps.Item[] = [
  { type: 'link', text: 'Log groups', href: '#log-groups' },
  { type: 'link', text: 'Log streams', href: '#log-streams' },
  { type: 'divider' },
  {
    type: 'section',
    text: 'Logs Insights',
    defaultExpanded: true,
    items: [
      { type: 'link', text: 'Logs Insights', href: '#logs-insights' },
      { type: 'link', text: 'Anomaly detection', href: '#anomaly-detection' },
    ],
  },
  {
    type: 'section',
    text: 'Metrics',
    items: [
      { type: 'link', text: 'All metrics', href: '#all-metrics' },
      { type: 'link', text: 'Metric Explorer', href: '#metric-explorer' },
      { type: 'link', text: 'Metric Streams', href: '#metric-streams' },
    ],
  },
  {
    type: 'section',
    text: 'Alarms',
    items: [
      { type: 'link', text: 'All alarms', href: '#all-alarms' },
      { type: 'link', text: 'Composite alarms', href: '#composite-alarms' },
    ],
  },
  { type: 'divider' },
  { type: 'link', text: 'Dashboards', href: '#dashboards' },
  { type: 'link', text: 'X-Ray traces', href: '#xray' },
  { type: 'link', text: 'ServiceLens', href: '#servicelens' },
  { type: 'link', text: 'Synthetics Canaries', href: '#synthetics' },
  { type: 'link', text: 'Evidently', href: '#evidently' },
  { type: 'link', text: 'RUM', href: '#rum' },
];

// ─── Main page ────────────────────────────────────────────────────────────────

function isParsedField(item: LogEntry | ParsedField): item is ParsedField {
  return Object.prototype.hasOwnProperty.call(item, 'key');
}

export default function App() {
  const [expandedItems, setExpandedItems] = useState<LogEntry[]>([LOG_ENTRIES[0]]);
  const [activeTab, setActiveTab] = useState('discovered-fields');
  const [savedQueriesOpen, setSavedQueriesOpen] = useState(false);
  const [showQueryHistoryModal, setShowQueryHistoryModal] = useState(false);
  const [queryHistoryTab, setQueryHistoryTab] = useState('query-history');
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<string[]>([]);
  const [toggleChecked, setToggleChecked] = useState(true);
  const [timezone, setTimezone] = useState<{ label: string; value: string }>({
    label: 'Local timezone',
    value: 'local',
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTableName, setNewTableName] = useState('');
  const [newTableSource, setNewTableSource] = useState('query-results');
  const [newTableDescription, setNewTableDescription] = useState('');
  const [newTableKmsKey, setNewTableKmsKey] = useState('');
  const [filterText, setFilterText] = useState('');
  const [scopeQuery, setScopeQuery] = useState<PropertyFilterProps.Query>({
    operation: 'and',
    tokens: [
      { propertyKey: 'logGroup', operator: '=', value: 'All' },
      { propertyKey: 'logClass', operator: '=', value: 'Standard' },
      { propertyKey: 'tag', operator: '=', value: 'All values' },
    ],
  });

  const filteredItems = LOG_ENTRIES.filter(
    item =>
      !filterText ||
      item.timestamp.toLowerCase().includes(filterText.toLowerCase()) ||
      item.message.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <>
      <Box padding="l">
        <AppLayout
          ariaLabels={{
            navigation: 'Side navigation',
            navigationToggle: 'Open navigation',
            navigationClose: 'Close navigation',
            notifications: 'Notifications',
            tools: 'Help',
            toolsToggle: 'Open help',
            toolsClose: 'Close help',
          }}
          disableContentPaddings={true}
          navigation={
            <SideNavigation header={{ text: 'CloudWatch', href: '#' }} activeHref="#logs-insights" items={NAV_ITEMS} />
          }
          toolsHide={true}
          content={
            <SpaceBetween size="s">
              {/* ── Query tabs ── */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ flex: 1 }}>
                  <Tabs
                    activeTabId="query-1"
                    onChange={() => {}}
                    actions={
                      <SpaceBetween direction="horizontal" size="xs">
                        <Button iconName="add-plus" variant="normal">
                          Query
                        </Button>
                        <Button iconName="add-plus" variant="normal">
                          Top N
                        </Button>
                      </SpaceBetween>
                    }
                    tabs={[
                      {
                        id: 'query-1',
                        label: (
                          <SpaceBetween direction="horizontal" size="xxs" alignItems="center">
                            <span>Query 1</span>
                            <ButtonDropdown
                              variant="icon"
                              ariaLabel="Query 1 options"
                              expandToViewport={true}
                              items={[
                                { id: 'rename', text: 'Rename' },
                                { id: 'duplicate', text: 'Duplicate' },
                                { id: 'close', text: 'Close' },
                                { id: 'copy-id', text: 'Copy query ID' },
                              ]}
                            />
                          </SpaceBetween>
                        ) as unknown as string,
                        dismissible: false,
                        content: (
                          <SpaceBetween size="s">
                            {/* ── AI query bar ── */}
                            <Container>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ flex: 1 }}>
                                  <Input
                                    value=""
                                    onChange={() => {}}
                                    placeholder="Ask AI to write a query..."
                                    type="search"
                                  />
                                </div>
                                <SpaceBetween direction="horizontal" size="s">
                                  <Button iconName="send" variant="icon" ariaLabel="Submit AI query" />
                                  <ButtonDropdown
                                    items={[{ id: 'save', text: 'Save' }]}
                                    onItemClick={() => setSavedQueriesOpen(true)}
                                    mainAction={{
                                      text: 'Saved queries',
                                      iconName: 'file',
                                      onClick: () => setSavedQueriesOpen(true),
                                    }}
                                  />
                                  <ButtonDropdown
                                    items={[{ id: 'scheduled', text: 'Scheduled queries' }]}
                                    mainAction={{
                                      text: 'Query history',
                                      iconName: 'history',
                                      onClick: () => setShowQueryHistoryModal(true),
                                    }}
                                  />
                                </SpaceBetween>
                              </div>
                            </Container>

                            {/* ── Query scope + filters ── */}
                            <Container header={<Header variant="h3">Query scope</Header>}>
                              <SpaceBetween size="s">
                                <div style={{ display: 'flex', gap: '6px' }}>
                                  <div style={{ flex: 1 }}>
                                    <PropertyFilter
                                      query={scopeQuery}
                                      onChange={({ detail }) => setScopeQuery(detail)}
                                      filteringProperties={[
                                        {
                                          key: 'logGroup',
                                          propertyLabel: 'Log group',
                                          groupValuesLabel: 'Log group values',
                                          operators: ['=', '!='],
                                        },
                                        {
                                          key: 'logStream',
                                          propertyLabel: 'Log stream',
                                          groupValuesLabel: 'Log stream values',
                                          operators: ['=', '!='],
                                        },
                                        {
                                          key: 'logClass',
                                          propertyLabel: 'Log class',
                                          groupValuesLabel: 'Log class values',
                                          operators: ['=', '!='],
                                        },
                                        {
                                          key: 'tag',
                                          propertyLabel: 'Tag',
                                          groupValuesLabel: 'Tag values',
                                          operators: ['=', '!='],
                                        },
                                      ]}
                                      filteringOptions={[
                                        { propertyKey: 'logGroup', value: 'All' },
                                        { propertyKey: 'logClass', value: 'Standard' },
                                        { propertyKey: 'logClass', value: 'Infrequent Access' },
                                        { propertyKey: 'tag', value: 'aws:cloudformation:logical-id' },
                                        { propertyKey: 'tag', value: 'aws:cloudformation:stack-name' },
                                      ]}
                                      filteringPlaceholder="Search to add a filter..."
                                      disableFreeTextFiltering={true}
                                      hideOperations={true}
                                      i18nStrings={{
                                        filteringAriaLabel: 'Filter log groups',
                                        filteringPlaceholder: 'Search to add a filter...',
                                        groupPropertiesText: 'Properties',
                                        groupValuesText: 'Values',
                                        operatorText: 'Operator',
                                        operatorsText: 'Operators',
                                        operatorLessText: 'Less than',
                                        operatorLessOrEqualText: 'Less than or equal',
                                        operatorGreaterText: 'Greater than',
                                        operatorGreaterOrEqualText: 'Greater than or equal',
                                        operatorContainsText: 'Contains',
                                        operatorDoesNotContainText: 'Does not contain',
                                        operatorEqualsText: 'Equals',
                                        operatorDoesNotEqualText: 'Does not equal',
                                        operatorStartsWithText: 'Starts with',
                                        operatorDoesNotStartWithText: 'Does not start with',
                                        operationAndText: 'and',
                                        operationOrText: 'or',
                                        propertyText: 'Property',
                                        valueText: 'Value',
                                        clearFiltersText: 'Clear filters',
                                        applyActionText: 'Apply',
                                        cancelActionText: 'Cancel',
                                        allPropertiesLabel: 'All properties',
                                        tokenLimitShowMore: 'Show more',
                                        tokenLimitShowFewer: 'Show fewer',
                                        removeTokenButtonAriaLabel: token =>
                                          `Remove filter: ${token.propertyLabel} ${token.operator} ${token.value}`,
                                        enteredTextLabel: text => `Use: "${text}"`,
                                      }}
                                    />
                                  </div>
                                  <TimeRangeSelector />
                                  <Select
                                    selectedOption={timezone}
                                    onChange={({ detail }) =>
                                      setTimezone(detail.selectedOption as { label: string; value: string })
                                    }
                                    options={[
                                      { label: 'UTC timezone', value: 'utc' },
                                      { label: 'Local timezone', value: 'local' },
                                    ]}
                                  />
                                </div>

                                <SpaceBetween direction="horizontal" size="s" alignItems="center">
                                  <Button variant="link" iconName="angle-up">
                                    Collapse filters
                                  </Button>
                                  <Button variant="link" iconName="refresh">
                                    Reset to default
                                  </Button>
                                  <Button variant="link">View matched log groups (1)</Button>
                                </SpaceBetween>
                              </SpaceBetween>
                            </Container>

                            {/* ── Query editor ── */}
                            <Container>
                              <SpaceBetween size="s">
                                {/* Code area */}
                                <div
                                  style={{
                                    fontFamily: 'monospace',
                                    fontSize: 14,
                                    lineHeight: '22px',
                                    padding: '8px 12px',
                                    background: 'var(--color-background-layout-main)',
                                    border: '1px solid var(--color-border-divider-default)',
                                    borderRadius: 4,
                                    whiteSpace: 'pre',
                                  }}
                                >
                                  <div>
                                    <Box color="text-body-secondary" display="inline">
                                      {'1  '}
                                    </Box>
                                    <span style={{ color: '#0972d3' }}>SOURCE </span>
                                    <span>logGroups(namePrefix: [], class: </span>
                                    <span style={{ color: '#037f0c' }}>&quot;STANDARD&quot;</span>
                                    <span>{`) logGroupTags([{'key':'aws:cloudformation:logical-id','values':[]}]) START=-1w END=0s |`}</span>
                                  </div>
                                  <div>
                                    <Box color="text-body-secondary" display="inline">
                                      {'2  '}
                                    </Box>
                                    <span style={{ color: '#0972d3' }}>fields </span>
                                    <span>@timestamp, @message</span>
                                  </div>
                                  <div>
                                    <Box color="text-body-secondary" display="inline">
                                      {'3  '}
                                    </Box>
                                    <span>{'  | '}</span>
                                    <span style={{ color: '#0972d3' }}>sort </span>
                                    <span>@timestamp desc</span>
                                  </div>
                                  <div>
                                    <Box color="text-body-secondary" display="inline">
                                      {'4  '}
                                    </Box>
                                    <span>{'  | '}</span>
                                    <span style={{ color: '#0972d3' }}>limit </span>
                                    <span style={{ color: '#8d6605' }}>10000</span>
                                  </div>
                                  <div>
                                    <Box color="text-body-secondary" display="inline">
                                      {'5  '}
                                    </Box>
                                    <span>{'  | '}</span>
                                    <span style={{ color: '#0972d3' }}>stats </span>
                                    <span>count(</span>
                                    <span style={{ color: '#8d6605' }}>*</span>
                                    <span>) by bin(15m)</span>
                                  </div>
                                </div>

                                {/* Editor action bar */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <SpaceBetween direction="horizontal" size="xxs">
                                    <Button iconName="undo" variant="icon" ariaLabel="Undo" />
                                    <Button iconName="redo" variant="icon" ariaLabel="Redo" />
                                  </SpaceBetween>
                                  <SpaceBetween direction="horizontal" size="xs">
                                    <Button iconName="add-plus">Add stats to visualize</Button>
                                    <Button iconName="search">Analyze patterns</Button>
                                    <Button iconName="status-in-progress">Live tail</Button>
                                    <ButtonDropdown
                                      variant="primary"
                                      items={[
                                        { id: 'run-new-tab', text: 'Run in a new tab', iconName: 'add-plus' },
                                        { id: 'schedule', text: 'Schedule query', iconName: 'history' },
                                        { id: 'log-alarm', text: 'Create log alarm', iconName: 'notification' },
                                        { id: 'dashboard', text: 'Add to dashboard', iconName: 'grid-view' },
                                      ]}
                                      mainAction={{ text: 'Run', onClick: () => {} }}
                                    />
                                  </SpaceBetween>
                                </div>
                              </SpaceBetween>
                            </Container>

                            {/* ── Discovered fields / Lookup tables tabs ── */}
                            <Container disableContentPaddings={false}>
                              <Tabs
                                activeTabId={activeTab}
                                onChange={({ detail }) => setActiveTab(detail.activeTabId)}
                                tabs={[
                                  {
                                    id: 'discovered-fields',
                                    label: 'Discovered fields (71)',
                                    content: (
                                      <SpaceBetween size="s">
                                        {/* Filter pills row */}
                                        <SpaceBetween direction="horizontal" size="xs" alignItems="center">
                                          <Box color="text-body-secondary">Filters:</Box>
                                          {[
                                            { label: 'System', color: '#d91515' },
                                            { label: 'General', color: '#037f0c' },
                                            { label: 'Indexed', color: '#0972d3' },
                                          ].map(({ label, color }) => (
                                            <span
                                              key={label}
                                              style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: 4,
                                                padding: '2px 8px',
                                                border: '1px solid var(--color-border-divider-default)',
                                                borderRadius: 12,
                                                fontSize: 12,
                                              }}
                                            >
                                              <span
                                                style={{
                                                  width: 8,
                                                  height: 8,
                                                  borderRadius: '50%',
                                                  background: color,
                                                  display: 'inline-block',
                                                }}
                                              />
                                              {label}
                                            </span>
                                          ))}
                                        </SpaceBetween>

                                        {/* Field token pills */}
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                          {[
                                            { name: '@aws.account', pct: '100%', color: '#d91515', indexed: true },
                                            { name: '@aws.region', pct: '100%', color: '#d91515', indexed: false },
                                            { name: '@data_format', pct: '100%', color: '#d91515', indexed: false },
                                            {
                                              name: '@data_source_name',
                                              pct: '100%',
                                              color: '#d91515',
                                              indexed: false,
                                            },
                                            {
                                              name: '@data_source_type',
                                              pct: '100%',
                                              color: '#d91515',
                                              indexed: false,
                                            },
                                            { name: '@ingestionTime', pct: '100%', color: '#d91515', indexed: false },
                                            { name: '@log', pct: '100%', color: '#d91515', indexed: false },
                                            { name: '@logStream', pct: '100%', color: '#d91515', indexed: false },
                                            { name: '@message', pct: '100%', color: '#d91515', indexed: false },
                                            { name: '@timestamp', pct: '100%', color: '#d91515', indexed: false },
                                            { name: 'CallerAccountId', pct: '100%', color: '#037f0c', indexed: false },
                                            { name: 'CallerCategory', pct: '100%', color: '#037f0c', indexed: false },
                                            { name: 'CallerSessionArn', pct: '100%', color: '#037f0c', indexed: false },
                                            { name: 'ClientCountry', pct: '100%', color: '#037f0c', indexed: false },
                                            { name: 'ClientIp', pct: '100%', color: '#037f0c', indexed: false },
                                            {
                                              name: 'Headers.Referer.0',
                                              pct: '100%',
                                              color: '#037f0c',
                                              indexed: false,
                                            },
                                            {
                                              name: 'Headers.User-Agent.0',
                                              pct: '100%',
                                              color: '#037f0c',
                                              indexed: false,
                                            },
                                            {
                                              name: 'IsDualstackDomain',
                                              pct: '100%',
                                              color: '#037f0c',
                                              indexed: false,
                                            },
                                            { name: 'Location', pct: '100%', color: '#037f0c', indexed: false },
                                            { name: '+52 more', pct: null, color: '#037f0c', indexed: false },
                                          ].map(({ name, pct, color, indexed }) => (
                                            <Popover
                                              key={name}
                                              triggerType="custom"
                                              position="bottom"
                                              size="medium"
                                              dismissButton={false}
                                              renderWithPortal={true}
                                              content={
                                                <SpaceBetween size="s">
                                                  {/* Header row */}
                                                  <div
                                                    style={{
                                                      display: 'flex',
                                                      alignItems: 'center',
                                                      justifyContent: 'space-between',
                                                      gap: 8,
                                                    }}
                                                  >
                                                    <SpaceBetween direction="horizontal" size="xxs" alignItems="center">
                                                      <Box fontWeight="bold">{name}</Box>
                                                      <Button
                                                        iconName="copy"
                                                        variant="icon"
                                                        ariaLabel={`Copy ${name}`}
                                                      />
                                                    </SpaceBetween>
                                                    {indexed && (
                                                      <span
                                                        style={{
                                                          display: 'inline-flex',
                                                          alignItems: 'center',
                                                          gap: 4,
                                                          padding: '2px 8px',
                                                          border: '1px solid #0972d3',
                                                          borderRadius: 12,
                                                          fontSize: 12,
                                                          color: '#0972d3',
                                                        }}
                                                      >
                                                        <span
                                                          style={{
                                                            width: 8,
                                                            height: 8,
                                                            borderRadius: '50%',
                                                            background: '#0972d3',
                                                            display: 'inline-block',
                                                          }}
                                                        />
                                                        Indexed field
                                                      </span>
                                                    )}
                                                  </div>

                                                  {/* Coverage */}
                                                  <SpaceBetween size="xxs">
                                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                      <Box variant="small" color="text-body-secondary">
                                                        Coverage
                                                      </Box>
                                                      <Box variant="small">{pct ?? '—'}</Box>
                                                    </div>
                                                    <ProgressBar
                                                      value={pct ? parseInt(pct) : 0}
                                                      variant="standalone"
                                                      ariaLabel="Coverage"
                                                    />
                                                  </SpaceBetween>

                                                  {/* Log Groups */}
                                                  <SpaceBetween size="xxs">
                                                    <div
                                                      style={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                      }}
                                                    >
                                                      <Button variant="inline-link" iconName="caret-right-filled">
                                                        <Box variant="small" fontWeight="bold">
                                                          LOG GROUPS
                                                        </Box>
                                                      </Button>
                                                      <Box variant="small" color="text-body-secondary">
                                                        2/2 ⚡ 2
                                                      </Box>
                                                    </div>
                                                  </SpaceBetween>

                                                  {/* Query Actions */}
                                                  <SpaceBetween size="xxs">
                                                    <Box variant="small" fontWeight="bold" color="text-body-secondary">
                                                      QUERY ACTIONS
                                                    </Box>
                                                    {[
                                                      { label: 'Filter', icon: 'filter' as const },
                                                      { label: 'Aggregate & Sort', icon: 'menu' as const },
                                                      { label: 'Transform', icon: 'multiscreen' as const },
                                                    ].map(({ label, icon }) => (
                                                      <div
                                                        key={label}
                                                        style={{
                                                          display: 'flex',
                                                          justifyContent: 'space-between',
                                                          alignItems: 'center',
                                                          padding: '2px 0',
                                                        }}
                                                      >
                                                        <Button variant="inline-link" iconName={icon}>
                                                          {label}
                                                        </Button>
                                                        <Button
                                                          iconName="angle-right"
                                                          variant="icon"
                                                          ariaLabel={`Expand ${label}`}
                                                        />
                                                      </div>
                                                    ))}
                                                  </SpaceBetween>
                                                </SpaceBetween>
                                              }
                                            >
                                              <Button variant="inline-link">
                                                <span
                                                  style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: 4,
                                                    fontSize: 13,
                                                  }}
                                                >
                                                  <span
                                                    style={{
                                                      width: 8,
                                                      height: 8,
                                                      borderRadius: '50%',
                                                      background: color,
                                                      flexShrink: 0,
                                                      display: 'inline-block',
                                                    }}
                                                  />
                                                  {name}
                                                  {pct && (
                                                    <Box color="text-body-secondary" display="inline">
                                                      {' '}
                                                      {pct}
                                                    </Box>
                                                  )}
                                                </span>
                                              </Button>
                                            </Popover>
                                          ))}
                                        </div>
                                      </SpaceBetween>
                                    ),
                                  },
                                  {
                                    id: 'lookup-tables',
                                    label: 'Lookup tables',
                                    content: (
                                      <SpaceBetween size="s">
                                        <SpaceBetween direction="horizontal" size="xs">
                                          <Button onClick={() => setShowCreateModal(true)}>Create</Button>
                                          <Button>Insert</Button>
                                          <Button>Update</Button>
                                          <Button disabled={true}>Delete</Button>
                                        </SpaceBetween>
                                        <Table
                                          columnDefinitions={[
                                            { id: 'name', header: 'Name', cell: () => '' },
                                            { id: 'description', header: 'Description', cell: () => '' },
                                            { id: 'fields', header: 'Fields', cell: () => '' },
                                          ]}
                                          items={[]}
                                          variant="embedded"
                                          // contentDensity="compact"
                                          ariaLabels={{ tableLabel: 'Lookup tables' }}
                                          empty={null}
                                        />
                                      </SpaceBetween>
                                    ),
                                  },
                                ]}
                              />
                            </Container>

                            {/* ── Status bar ── */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <TextContent>
                                <Box color="text-status-success" display="inline">
                                  Complete.{' '}
                                </Box>
                                Showing 10,000 of 196,246,820 matched. Query executed for{' '}
                                <Button variant="inline-link">1 log group</Button>.
                              </TextContent>
                              <Box variant="small" color="text-body-secondary">
                                196,279,972 records (285.5 GB) scanned in 14.8s @ 13,229,088 records/s (19.2 GB/s)
                              </Box>
                            </div>

                            {/* ── Histogram ── */}
                            <Container>
                              <Histogram />
                            </Container>

                            {/* ── Results table ── */}
                            <Container
                              header={
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <Input
                                    value={filterText}
                                    onChange={({ detail }) => setFilterText(detail.value)}
                                    placeholder="Filter table results..."
                                    type="search"
                                  />
                                  <SpaceBetween direction="horizontal" size="xs">
                                    <Button>Filter</Button>
                                    <Button>Highlight</Button>
                                    <div style={{ flex: 1 }} />
                                    <ButtonDropdown
                                      items={[
                                        { id: 'download-csv', text: 'Download as CSV' },
                                        { id: 'copy', text: 'Copy results' },
                                      ]}
                                    >
                                      Actions
                                    </ButtonDropdown>
                                    <Button iconName="settings" variant="icon" ariaLabel="Table settings" />
                                  </SpaceBetween>
                                </div>
                              }
                            >
                              <Table<LogEntry>
                                // contentDensity="compact"
                                items={filteredItems}
                                variant="embedded"
                                wrapLines={false}
                                expandableRows={{
                                  getItemChildren: () => PARSED_FIELDS as unknown as LogEntry[],
                                  isItemExpandable: () => true,
                                  expandedItems,
                                  onExpandableItemToggle: ({ detail }) =>
                                    setExpandedItems(prev =>
                                      detail.expanded
                                        ? [...prev, detail.item]
                                        : prev.filter(i => i.timestamp !== detail.item.timestamp)
                                    ),
                                }}
                                columnDefinitions={[
                                  {
                                    id: 'timestamp',
                                    header: '@timestamp',
                                    width: 220,
                                    cell: (item: LogEntry) => {
                                      const field = item as unknown as ParsedField;
                                      if (isParsedField(item as unknown as LogEntry | ParsedField)) {
                                        return (
                                          <Box padding={{ left: 'xl' }}>
                                            <Link href="#">{field.key}</Link>
                                          </Box>
                                        );
                                      }
                                      return <Link href="#">{item.timestamp}</Link>;
                                    },
                                  },
                                  {
                                    id: 'message',
                                    header: '@message',
                                    cell: (item: LogEntry) => {
                                      const field = item as unknown as ParsedField;
                                      if (isParsedField(item as unknown as LogEntry | ParsedField)) {
                                        return field.isLink ? (
                                          <Link href="#" external={true}>
                                            {field.value}
                                          </Link>
                                        ) : (
                                          field.value
                                        );
                                      }
                                      return item.message;
                                      // return <Box variant="code">{item.message}</Box>;
                                    },
                                  },
                                ]}
                                footer={
                                  <Box color="text-body-secondary">
                                    {filteredItems.length.toLocaleString()},000 log(s)
                                  </Box>
                                }
                                ariaLabels={{ tableLabel: 'Log results' }}
                                empty={
                                  <Box textAlign="center" color="inherit">
                                    No log entries match your filter
                                  </Box>
                                }
                              />
                            </Container>
                          </SpaceBetween>
                        ),
                      },
                    ]}
                    i18nStrings={{ scrollLeftAriaLabel: 'Scroll left', scrollRightAriaLabel: 'Scroll right' }}
                  />
                </div>
                <SpaceBetween direction="horizontal" size="xs">
                  <Button iconName="status-info">Help</Button>
                  <Button iconName="external">Feedback</Button>
                  <Button iconName="settings">Preferences</Button>
                </SpaceBetween>
              </div>
            </SpaceBetween>
          }
        />
      </Box>
      <Drawer
        open={savedQueriesOpen}
        onClose={() => setSavedQueriesOpen(false)}
        placement="start"
        position="fixed"
        ariaLabel="Saved queries"
        closeAction={{ ariaLabel: 'Close saved queries' }}
        header={
          <SpaceBetween direction="horizontal" size="xs" alignItems="center">
            <Box variant="h3">Saved Queries</Box>
            <Button iconName="download" variant="normal">
              Save
            </Button>
          </SpaceBetween>
        }
      >
        <SpaceBetween size="m">
          <Toggle checked={toggleChecked} onChange={({ detail }) => setToggleChecked(detail.checked)} />

          {/* Saved query item */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '4px 0',
            }}
          >
            <Popover
              triggerType="custom"
              position="right"
              size="medium"
              content={
                <SpaceBetween size="xs">
                  <Box fontWeight="bold">Test</Box>
                  <div
                    style={{
                      fontFamily: 'monospace',
                      fontSize: 12,
                      lineHeight: '18px',
                      padding: '8px',
                      background: 'var(--color-background-layout-main)',
                      borderRadius: 4,
                    }}
                  >
                    <div>
                      <span style={{ color: '#0972d3' }}>SOURCE </span>
                      <span>logGroups(namePrefix: [], class: </span>
                      <span style={{ color: '#037f0c' }}>&quot;STANDARD&quot;</span>
                      <span>) START=-1w END=0s |</span>
                    </div>
                    <div>
                      <span>{'  | '}</span>
                      <span style={{ color: '#0972d3' }}>fields </span>
                      <span>@timestamp, @message</span>
                    </div>
                    <div>
                      <span>{'  | '}</span>
                      <span style={{ color: '#0972d3' }}>sort </span>
                      <span>@timestamp desc</span>
                    </div>
                    <div>
                      <span>{'  | '}</span>
                      <span style={{ color: '#0972d3' }}>limit </span>
                      <span style={{ color: '#8d6605' }}>10000</span>
                    </div>
                  </div>
                </SpaceBetween>
              }
            >
              <SpaceBetween direction="horizontal" size="xs" alignItems="center">
                <Box>Test</Box>
                <Box color="text-body-secondary">CWLI</Box>
              </SpaceBetween>
            </Popover>
            <ButtonDropdown
              variant="icon"
              ariaLabel="Query options"
              items={[
                { id: 'open', text: 'Open' },
                { id: 'rename', text: 'Rename' },
                { id: 'delete', text: 'Delete' },
              ]}
            />
          </div>
        </SpaceBetween>
      </Drawer>

      {/* ── Create lookup table modal ── */}
      <Modal
        visible={showCreateModal}
        onDismiss={() => setShowCreateModal(false)}
        header="Create lookup table"
        closeAriaLabel="Close"
        footer={
          <SpaceBetween direction="horizontal" size="xs">
            <Button variant="link" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setShowCreateModal(false)}>
              Create lookup table
            </Button>
          </SpaceBetween>
        }
      >
        <SpaceBetween size="m">
          <FormField
            label={
              <>
                Table name{' '}
                <Box display="inline" color="text-status-error">
                  *
                </Box>
              </>
            }
            stretch={true}
          >
            <Input
              value={newTableName}
              onChange={({ detail }) => setNewTableName(detail.value)}
              placeholder="Enter a name for the lookup table"
            />
          </FormField>

          <FormField label="Source" stretch={true}>
            <RadioGroup
              value={newTableSource}
              onChange={({ detail }) => setNewTableSource(detail.value)}
              direction="horizontal"
              items={[
                { value: 'query-results', label: 'Query results' },
                { value: 'csv-file', label: 'CSV file' },
              ]}
            />
          </FormField>

          <FormField label="Query ID" stretch={true}>
            <Input value="5568ef82-0e54-4c73-9742-834cad83d7db" onChange={() => {}} readOnly={true} />
          </FormField>

          <FormField label="Description" stretch={true}>
            <Input
              value={newTableDescription}
              onChange={({ detail }) => setNewTableDescription(detail.value)}
              placeholder="Optional description"
            />
          </FormField>

          <FormField label="KMS key ID" stretch={true}>
            <Input
              value={newTableKmsKey}
              onChange={({ detail }) => setNewTableKmsKey(detail.value)}
              placeholder="Optional KMS key ARN for encryption"
            />
          </FormField>
        </SpaceBetween>
      </Modal>

      {/* ── Query History modal ── */}
      <Modal
        visible={showQueryHistoryModal}
        onDismiss={() => setShowQueryHistoryModal(false)}
        closeAriaLabel="Close"
        size="max"
        header={
          <SpaceBetween direction="horizontal" size="xs" alignItems="center">
            <Box variant="h2">Query History (6)</Box>
          </SpaceBetween>
        }
      >
        <SpaceBetween size="m">
          <Tabs
            activeTabId={queryHistoryTab}
            onChange={({ detail }) => setQueryHistoryTab(detail.activeTabId)}
            tabs={[
              {
                id: 'query-history',
                label: 'Query History',
                content: (
                  <SpaceBetween size="m">
                    <Box color="text-body-secondary">
                      Showing query history for this account over the last 30 days. Currently running queries are listed
                      first.
                    </Box>

                    {/* Toolbar */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <Button iconName="filter" variant="normal">
                        Property
                      </Button>
                      <Input value="" onChange={() => {}} placeholder="Search queries..." type="search" />
                      <Box color="text-body-secondary">Actions:</Box>
                      <Button iconName="caret-right-filled" variant="inline-link">
                        Rerun in tab
                      </Button>
                      <Button iconName="search" variant="inline-link">
                        See results
                      </Button>
                      <Button iconName="copy" variant="inline-link">
                        Share results link
                      </Button>
                      <Button iconName="status-stopped" variant="inline-link">
                        Stop query
                      </Button>
                      <Button iconName="refresh" variant="icon" ariaLabel="Refresh" />
                    </div>

                    <Table
                      selectionType="single"
                      selectedItems={selectedHistoryItem
                        .map(id => HISTORY_ITEMS.find(i => i.id === id)!)
                        .filter(Boolean)}
                      onSelectionChange={({ detail }) => setSelectedHistoryItem(detail.selectedItems.map(i => i.id))}
                      columnDefinitions={HISTORY_COLUMNS}
                      items={HISTORY_ITEMS}
                      // contentDensity="compact"
                      variant="embedded"
                      wrapLines={true}
                      ariaLabels={{
                        tableLabel: 'Query history',
                        selectionGroupLabel: 'Query selection',
                        itemSelectionLabel: (_, item) => item.id,
                      }}
                      getLoadingStatus={() => 'pending'}
                      renderLoaderPending={() => (
                        <Button variant="inline-link" iconName="add-plus">
                          Load more
                        </Button>
                      )}
                      empty={<Box textAlign="center">No query history</Box>}
                      pagination={<Pagination currentPageIndex={1} pagesCount={1} />}
                    />
                  </SpaceBetween>
                ),
              },
              {
                id: 'scheduled',
                label: 'Scheduled Queries',
                content: (
                  <Table
                    columnDefinitions={[
                      { id: 'name', header: 'Name', cell: () => '' },
                      { id: 'type', header: 'Type', cell: () => '' },
                      { id: 'last-run', header: 'Last run', cell: () => '' },
                      { id: 'last-run-time', header: 'Last run time', cell: () => '' },
                      { id: 'schedule', header: 'Schedule', cell: () => '' },
                      { id: 'created', header: 'Created', cell: () => '' },
                      { id: 'enabled', header: 'Enabled', cell: () => '' },
                    ]}
                    items={[]}
                    // contentDensity="compact"
                    variant="embedded"
                    ariaLabels={{ tableLabel: 'Scheduled queries' }}
                    empty={
                      <Box textAlign="center" color="inherit">
                        No scheduled queries
                      </Box>
                    }
                  />
                ),
              },
            ]}
          />
        </SpaceBetween>
      </Modal>
    </>
  );
}
