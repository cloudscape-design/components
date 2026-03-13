// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import AppLayoutToolbar from '~components/app-layout-toolbar';
import Box from '~components/box';
import BreadcrumbGroup from '~components/breadcrumb-group';
import Button from '~components/button';
import Container from '~components/container';
import FormField from '~components/form-field';
import Header from '~components/header';
import Input from '~components/input';
import Multiselect, { MultiselectProps } from '~components/multiselect';
import SegmentedControl from '~components/segmented-control';
import SideNavigation from '~components/side-navigation';
import SpaceBetween from '~components/space-between';
import TokenGroup from '~components/token-group';
interface MetricToken {
  iconName: string;
  label: string;
}
interface LabelOption {
  label: string;
  value: string;
}
interface LabelValueOption {
  label: string;
  value: string;
}
interface GroupedLabelValueOption {
  label: string;
  options: LabelValueOption[];
}
interface ActiveValueFilter {
  description: string;
  iconName: string;
  label: string;
}
interface QueryInputSectionProps {
  queryMode: string;
  onQueryModeChange: (mode: string) => void;
  queryText: string;
  onQueryTextChange: (text: string) => void;
  onKickstartClick: () => void;
}
const QueryInputSection: React.FC<QueryInputSectionProps> = ({
  queryMode,
  onQueryModeChange,
  queryText,
  onQueryTextChange,
  onKickstartClick,
}) => {
  return (
    <Container data-venue="true">
      <SpaceBetween size="s">
        <SpaceBetween alignItems="center" direction="horizontal" size="xs">
          <Button iconName="suggestions" variant="normal" onClick={onKickstartClick}>
            Kick start your query
          </Button>
          <SegmentedControl
            label="Query mode"
            options={[
              {
                id: 'builder',
                text: 'Builder',
              },
              {
                id: 'code',
                text: 'Code',
              },
            ]}
            selectedId={queryMode}
            onChange={({ detail }) => onQueryModeChange(detail.selectedId)}
          />
        </SpaceBetween>
        <Input
          placeholder="Enter a PromQL query"
          type="search"
          value={queryText}
          onChange={({ detail }) => onQueryTextChange(detail.value)}
        />
      </SpaceBetween>
    </Container>
  );
};
interface MetricSelectionSectionProps {
  metricSearchText: string;
  onMetricSearchChange: (text: string) => void;
  selectedMetrics?: MetricToken[];
  onMetricDismiss: (index: number) => void;
  seriesLimit: string;
  onSeriesLimitChange: (limit: string) => void;
}
const MetricSelectionSection: React.FC<MetricSelectionSectionProps> = ({
  metricSearchText,
  onMetricSearchChange,
  selectedMetrics,
  onMetricDismiss,
  seriesLimit,
  onSeriesLimitChange,
}) => {
  return (
    <Container
      header={
        <Header
          description="Once a metric is selected, only possible labels are shown. Labels are limited by the series limit below."
          variant="h2"
        >
          1. Select a metric
        </Header>
      }
      data-venue="true"
    >
      <SpaceBetween size="m">
        <FormField label="Metric name">
          <Input
            placeholder="Search metrics"
            type="search"
            value={metricSearchText}
            onChange={({ detail }) => onMetricSearchChange(detail.value)}
          />
        </FormField>
        <TokenGroup
          alignment="horizontal"
          disableOuterPadding={true}
          items={selectedMetrics as any}
          onDismiss={({ detail }) => onMetricDismiss(detail.itemIndex)}
        />
        <FormField
          description="The limit applies to all metrics, labels, and values. Leave the field empty to use the default limit. Set to 0 to disable the limit and fetch everything — this may cause performance issues."
          label="Series limit"
        >
          <Input
            inputMode="numeric"
            type="number"
            value={seriesLimit}
            onChange={({ detail }) => onSeriesLimitChange(detail.value)}
          />
        </FormField>
      </SpaceBetween>
    </Container>
  );
};
interface LabelSearchSectionProps {
  labelOptions: LabelOption[];
  selectedLabels: MultiselectProps.Option[];
  onLabelsChange: (labels: MultiselectProps.Option[]) => void;
  onLabelDismiss: (index: number) => void;
}
const LabelSearchSection: React.FC<LabelSearchSectionProps> = ({
  labelOptions,
  selectedLabels,
  onLabelsChange,
  onLabelDismiss,
}) => {
  const tokenItems = selectedLabels.map(label => ({
    iconName: 'filter',
    label: label.label || '',
  }));
  return (
    <Container
      header={
        <Header description="Once label values are selected, only possible label combinations are shown." variant="h2">
          2. Select labels to search in
        </Header>
      }
      data-venue="true"
    >
      <SpaceBetween size="m">
        <FormField label="Search labels" stretch={true}>
          <Multiselect
            filteringPlaceholder="Search labels"
            filteringType="auto"
            hideTokens={true}
            options={labelOptions}
            placeholder="Search or choose labels"
            selectedOptions={selectedLabels}
            onChange={({ detail }) => onLabelsChange(detail.selectedOptions as any)}
          />
        </FormField>
        <Box color="text-label" fontSize="body-s" variant="h3">
          Active label filters
        </Box>
        <TokenGroup
          alignment="horizontal"
          disableOuterPadding={true}
          items={tokenItems as any}
          onDismiss={({ detail }) => onLabelDismiss(detail.itemIndex)}
        />
      </SpaceBetween>
    </Container>
  );
};
interface LabelValuesSectionProps {
  labelValueOptions: GroupedLabelValueOption[];
  selectedLabelValues: MultiselectProps.Option[];
  onLabelValuesChange: (values: MultiselectProps.Option[]) => void;
  activeValueFilters: ActiveValueFilter[];
  onValueFilterDismiss: (index: number) => void;
}
const LabelValuesSection: React.FC<LabelValuesSectionProps> = ({
  labelValueOptions,
  selectedLabelValues,
  onLabelValuesChange,
  activeValueFilters,
  onValueFilterDismiss,
}) => {
  return (
    <Container
      header={
        <Header description="Use the search field to find values across selected labels." variant="h2">
          3. Select (multiple) values for your labels
        </Header>
      }
      data-venue="true"
    >
      <SpaceBetween size="m">
        <FormField label="Search label values" stretch={true}>
          <Multiselect
            enableSelectAll={true}
            filteringPlaceholder="Search values"
            filteringType="auto"
            hideTokens={true}
            options={labelValueOptions}
            placeholder="Search or choose label values"
            selectedOptions={selectedLabelValues}
            onChange={({ detail }) => onLabelValuesChange(detail.selectedOptions as any)}
          />
        </FormField>
        <Box color="text-label" fontSize="body-s" variant="h3">
          Active value filters
        </Box>
        <TokenGroup
          alignment="horizontal"
          disableOuterPadding={true}
          items={activeValueFilters as any}
          onDismiss={({ detail }) => onValueFilterDismiss(detail.itemIndex)}
        />
      </SpaceBetween>
    </Container>
  );
};
function MetricsQueryBuilder() {
  // Query input state
  const [queryMode, setQueryMode] = useState<string>('code');
  const [queryText, setQueryText] = useState<string>('');

  // Metric selection state
  const [metricSearchText, setMetricSearchText] = useState<string>('');
  const [selectedMetrics, setSelectedMetrics] = useState<MetricToken[]>([
    {
      iconName: 'status-info',
      label: 'GRAFANA_ALERTS',
    },
    {
      iconName: 'status-info',
      label: 'aws_ec2_cpuutilization_average',
    },
  ]);
  const [seriesLimit, setSeriesLimit] = useState<string>('40000');

  // Label search state
  const labelOptions: LabelOption[] = [
    {
      label: 'Browser',
      value: 'browser',
    },
    {
      label: 'Oh_no',
      value: 'oh_no',
    },
    {
      label: 'alertname',
      value: 'alertname',
    },
    {
      label: 'alertstate',
      value: 'alertstate',
    },
    {
      label: 'app',
      value: 'app',
    },
    {
      label: 'asserts_env',
      value: 'asserts_env',
    },
    {
      label: 'asserts_site',
      value: 'asserts_site',
    },
    {
      label: 'cloud_region',
      value: 'cloud_region',
    },
    {
      label: 'cluster',
      value: 'cluster',
    },
    {
      label: 'component',
      value: 'component',
    },
    {
      label: 'container',
      value: 'container',
    },
    {
      label: 'cpu',
      value: 'cpu',
    },
    {
      label: 'datasource_uid',
      value: 'datasource_uid',
    },
    {
      label: 'demo',
      value: 'demo',
    },
    {
      label: 'disk',
      value: 'disk',
    },
    {
      label: 'email_test',
      value: 'email_test',
    },
    {
      label: 'faroappid',
      value: 'faroappid',
    },
    {
      label: 'forecast_type',
      value: 'forecast_type',
    },
    {
      label: 'grafana_alertstate',
      value: 'grafana_alertstate',
    },
    {
      label: 'grafana_folder',
      value: 'grafana_folder',
    },
    {
      label: 'grafana_rule_uid',
      value: 'grafana_rule_uid',
    },
    {
      label: 'grafana_slo_severity',
      value: 'grafana_slo_severity',
    },
    {
      label: 'grafana_slo_uuid',
      value: 'grafana_slo_uuid',
    },
    {
      label: 'hash',
      value: 'hash',
    },
    {
      label: 'host',
      value: 'host',
    },
    {
      label: 'instance',
      value: 'instance',
    },
    {
      label: 'job',
      value: 'job',
    },
    {
      label: 'k8s_cluster_name',
      value: 'k8s_cluster_name',
    },
    {
      label: 'k8s_namespace_name',
      value: 'k8s_namespace_name',
    },
  ];
  const [selectedLabels, setSelectedLabels] = useState<MultiselectProps.Option[]>([
    {
      label: 'Browser',
      value: 'browser',
    },
    {
      label: 'Oh_no',
      value: 'oh_no',
    },
    {
      label: 'alertname',
      value: 'alertname',
    },
    {
      label: 'alertstate',
      value: 'alertstate',
    },
    {
      label: 'app',
      value: 'app',
    },
  ]);

  // Label values state
  const labelValueOptions: GroupedLabelValueOption[] = [
    {
      label: 'alertstate values',
      options: [
        {
          label: 'firing',
          value: 'firing',
        },
        {
          label: 'pending',
          value: 'pending',
        },
        {
          label: 'resolved',
          value: 'resolved',
        },
      ],
    },
    {
      label: 'app values',
      options: [
        {
          label: 'cloudwatch-agent',
          value: 'cloudwatch-agent',
        },
        {
          label: 'prometheus',
          value: 'prometheus',
        },
        {
          label: 'grafana',
          value: 'grafana',
        },
        {
          label: 'alertmanager',
          value: 'alertmanager',
        },
      ],
    },
    {
      label: 'asserts_env values',
      options: [
        {
          label: 'production',
          value: 'production',
        },
        {
          label: 'staging',
          value: 'staging',
        },
        {
          label: 'development',
          value: 'development',
        },
      ],
    },
    {
      label: 'cluster values',
      options: [
        {
          label: 'prod-us-east-1',
          value: 'prod-us-east-1',
        },
        {
          label: 'prod-eu-west-1',
          value: 'prod-eu-west-1',
        },
        {
          label: 'staging-us-east-1',
          value: 'staging-us-east-1',
        },
      ],
    },
    {
      label: 'host values',
      options: [
        {
          label: 'ip-10-0-1-100',
          value: 'ip-10-0-1-100',
        },
        {
          label: 'ip-10-0-1-101',
          value: 'ip-10-0-1-101',
        },
        {
          label: 'ip-10-0-2-50',
          value: 'ip-10-0-2-50',
        },
      ],
    },
    {
      label: 'job values',
      options: [
        {
          label: 'integrations/node_exporter',
          value: 'integrations/node_exporter',
        },
        {
          label: 'integrations/kubernetes',
          value: 'integrations/kubernetes',
        },
        {
          label: 'integrations/mysql',
          value: 'integrations/mysql',
        },
      ],
    },
  ];
  const [selectedLabelValues, setSelectedLabelValues] = useState<MultiselectProps.Option[]>([
    {
      label: 'firing',
      value: 'firing',
    },
    {
      label: 'production',
      value: 'production',
    },
    {
      label: 'cloudwatch-agent',
      value: 'cloudwatch-agent',
    },
  ]);
  const [activeValueFilters, setActiveValueFilters] = useState<ActiveValueFilter[]>([
    {
      description: 'alertstate',
      iconName: 'filter',
      label: 'firing',
    },
    {
      description: 'asserts_env',
      iconName: 'filter',
      label: 'production',
    },
    {
      description: 'app',
      iconName: 'filter',
      label: 'cloudwatch-agent',
    },
  ]);

  // Navigation state
  const [activeHref, setActiveHref] = useState<string>('#metrics-query-builder');

  // Event handlers
  const handleKickstartClick = () => {
    console.log('Kick start query clicked');
    // Logic to generate a starter query
  };
  const handleMetricDismiss = (index: number) => {
    const newMetrics = [...selectedMetrics];
    newMetrics.splice(index, 1);
    setSelectedMetrics(newMetrics);
    console.log('Metric dismissed at index:', index);
  };
  const handleLabelDismiss = (index: number) => {
    const newLabels = [...selectedLabels];
    newLabels.splice(index, 1);
    setSelectedLabels(newLabels);
    console.log('Label dismissed at index:', index);
  };
  const handleValueFilterDismiss = (index: number) => {
    const newFilters = [...activeValueFilters];
    const dismissedFilter = newFilters.splice(index, 1)[0];
    setActiveValueFilters(newFilters);

    // Also remove from selectedLabelValues
    const newSelectedValues = selectedLabelValues.filter(option => option.label !== dismissedFilter.label);
    setSelectedLabelValues(newSelectedValues);
    console.log('Value filter dismissed at index:', index);
  };
  const handleLabelValuesChange = (values: MultiselectProps.Option[]) => {
    setSelectedLabelValues(values);

    // Update active value filters based on selected values
    // This is a simplified mapping - in a real app, you'd track the relationship between values and their labels
    const filters: ActiveValueFilter[] = values.map(val => {
      // Determine which label group this value belongs to
      let labelDescription = '';
      for (const group of labelValueOptions) {
        if (group.options.some(opt => opt.value === val.value)) {
          labelDescription = group.label.replace(' values', '');
          break;
        }
      }
      return {
        description: labelDescription,
        iconName: 'filter',
        label: val.label || '',
      };
    });
    setActiveValueFilters(filters);
  };
  const handleNavigationFollow = (event: any) => {
    event.preventDefault();
    setActiveHref(event.detail.href);
    console.log('Navigation to:', event.detail.href);
  };
  return (
    <AppLayoutToolbar
      breadcrumbs={
        <BreadcrumbGroup
          items={[
            {
              href: '#',
              text: 'CloudWatch',
            },
            {
              href: '#',
              text: 'Metrics',
            },
            {
              href: '#',
              text: 'Query builder',
            },
          ]}
        />
      }
      content={
        <SpaceBetween size="l">
          <QueryInputSection
            queryMode={queryMode}
            onQueryModeChange={setQueryMode}
            queryText={queryText}
            onQueryTextChange={setQueryText}
            onKickstartClick={handleKickstartClick}
          />

          <MetricSelectionSection
            metricSearchText={metricSearchText}
            onMetricSearchChange={setMetricSearchText}
            selectedMetrics={selectedMetrics}
            onMetricDismiss={handleMetricDismiss}
            seriesLimit={seriesLimit}
            onSeriesLimitChange={setSeriesLimit}
          />

          <LabelSearchSection
            labelOptions={labelOptions}
            selectedLabels={selectedLabels}
            onLabelsChange={setSelectedLabels}
            onLabelDismiss={handleLabelDismiss}
          />

          <LabelValuesSection
            labelValueOptions={labelValueOptions}
            selectedLabelValues={selectedLabelValues}
            onLabelValuesChange={handleLabelValuesChange}
            activeValueFilters={activeValueFilters}
            onValueFilterDismiss={handleValueFilterDismiss}
          />
        </SpaceBetween>
      }
      contentType="default"
      navigation={
        <SideNavigation
          activeHref={activeHref}
          header={{
            href: '#',
            text: 'CloudWatch',
          }}
          items={[
            {
              href: '#overview',
              text: 'Overview',
              type: 'link',
            },
            {
              defaultExpanded: true,
              items: [
                {
                  href: '#all-metrics',
                  text: 'All metrics',
                  type: 'link',
                },
                {
                  href: '#metrics-query-builder',
                  text: 'Query builder',
                  type: 'link',
                },
                {
                  href: '#saved-queries',
                  text: 'Saved queries',
                  type: 'link',
                },
              ],
              text: 'Metrics',
              type: 'section',
            },
            {
              defaultExpanded: false,
              items: [
                {
                  href: '#all-alarms',
                  text: 'All alarms',
                  type: 'link',
                },
                {
                  href: '#in-alarm',
                  text: 'In alarm',
                  type: 'link',
                },
              ],
              text: 'Alarms',
              type: 'section',
            },
            {
              defaultExpanded: false,
              items: [
                {
                  href: '#log-groups',
                  text: 'Log groups',
                  type: 'link',
                },
                {
                  href: '#log-insights',
                  text: 'Log insights',
                  type: 'link',
                },
              ],
              text: 'Logs',
              type: 'section',
            },
            {
              defaultExpanded: false,
              items: [
                {
                  href: '#all-dashboards',
                  text: 'All dashboards',
                  type: 'link',
                },
              ],
              text: 'Dashboards',
              type: 'section',
            },
          ]}
          onFollow={handleNavigationFollow}
        />
      }
      toolsHide={true}
    />
  );
}
export default MetricsQueryBuilder;
