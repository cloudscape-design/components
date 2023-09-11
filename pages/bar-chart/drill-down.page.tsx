// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useEffect, useMemo, useState } from 'react';
import AppLayout from '~components/app-layout';
import BreadCrumbGroup from '~components/breadcrumb-group';
import Header from '~components/header';
import Container from '~components/container';
import ColumnLayout from '~components/column-layout';
import Link from '~components/link';
import Box from '~components/box';
import SideNavigation from '~components/side-navigation';
import BarChart from '~components/bar-chart';
import labels from '../app-layout/utils/labels';
import React from 'react';
import SpaceBetween from '~components/space-between';
import SplitPanel from '~components/split-panel';
import ExpandableSection from '~components/expandable-section';
import FormField from '~components/form-field';
import DateRangePicker, { DateRangePickerProps } from '~components/date-range-picker';
import Select, { SelectProps } from '~components/select';
import Button from '~components/button';
import Icon from '~components/icon';
import MultiSelect from '~components/multiselect';
import {
  dailyMaySeries,
  dailySeriesByService,
  days,
  dollarFormatter,
  monthlySeries,
  monthlySeriesByService,
  months,
} from './drill-down.data';
import { I18nProvider, I18nProviderProps, importMessages } from '~components/i18n';
import styles from './drill-down.scss';

const LOCALE = 'en';

const granularityOptions = {
  monthly: { value: 'monthly', label: 'Monthly' },
  daily: { value: 'daily', label: 'Daily' },
};

const serviceOptions = Object.entries(monthlySeriesByService).map(([key, value]) => ({
  value: key,
  label: value.title,
}));

export default function () {
  const currentPath = window.location.hash;

  const [dateRange, setDateRange] = useState<DateRangePickerProps.Value | null>({
    type: 'absolute',
    startDate: months[0] + '-01',
    endDate: months[months.length - 1] + '-31',
  });
  const [granularity, setGranularity] = useState<SelectProps.Option>(granularityOptions.monthly);
  const [splitPanelOpen, setSplitPanelOpen] = useState(true);
  const [services, setServices] = useState<ReadonlyArray<SelectProps.Option>>([]);
  const [selectedService, setSelectedService] = useState<SelectProps.Option | null>(null);
  const [splitPanelSize, setSplitPanelSize] = useState(400);
  const [messages, setMessages] = useState<ReadonlyArray<I18nProviderProps.Messages> | null>(null);
  useEffect(() => {
    importMessages(LOCALE).then(setMessages);
  }, []);

  const appliedFilters = services.length ? 1 : 0;

  const filteredSeries = useMemo(() => {
    const allSeriesByService = granularity.value === 'monthly' ? monthlySeriesByService : dailySeriesByService;
    const allSeries = granularity.value === 'monthly' ? monthlySeries : dailyMaySeries;
    const filteredByService = services.length ? [] : [...allSeries];
    if (services.length) {
      for (const service of services) {
        if (service.value) {
          filteredByService.push(allSeriesByService[service.value]);
        }
      }
    }
    return dateRange?.type === 'absolute'
      ? filteredByService.map(entry => ({
          ...entry,
          data: entry.data.filter(
            entry =>
              Date.parse(entry.x) >= Date.parse(dateRange.startDate) &&
              Date.parse(entry.x) <= Date.parse(dateRange.endDate)
          ),
        }))
      : filteredByService;
  }, [dateRange, granularity.value, services]);

  const totalCost = useMemo(
    () => dollarFormatter(granularity.value === 'monthly' ? 26375.19 : 2200),
    [granularity.value]
  );
  const averageCost = useMemo(
    () => dollarFormatter(granularity.value === 'monthly' ? 26375.19 / 12 : 2200 / 31),
    [granularity.value]
  );

  const xDomain = useMemo(() => {
    return granularity.value === 'monthly' ? months : days;
  }, [granularity.value]);

  return messages ? (
    <I18nProvider locale={LOCALE} messages={messages}>
      <AppLayout
        ariaLabels={labels}
        breadcrumbs={
          <BreadCrumbGroup
            items={[
              { text: 'AWS Cost Management', href: '#' },
              { text: 'Cost Explorer', href: '#' },
              { text: 'Monthly costs by linked account', href: '' },
            ]}
          />
        }
        navigation={
          <SideNavigation
            activeHref={currentPath}
            header={{ text: 'AWS Cost Management', href: '#' }}
            items={[
              { type: 'link', text: 'Home', href: '#' },
              {
                type: 'link',
                text: 'Cost Explorer',
                href: currentPath,
              },
            ]}
          />
        }
        splitPanelPreferences={{ position: 'side' }}
        splitPanelSize={splitPanelSize}
        onSplitPanelResize={({ detail }) => setSplitPanelSize(detail.size)}
        splitPanel={
          <SplitPanel header="Report parameters">
            <SpaceBetween direction="vertical" size="m">
              <ExpandableSection variant="footer" headerText="Time" defaultExpanded={true}>
                <SpaceBetween direction="vertical" size="m">
                  <FormField label="Date Range">
                    <DateRangePicker
                      value={dateRange}
                      onChange={({ detail }) => setDateRange(detail.value)}
                      dateOnly={true}
                      isValidRange={range => {
                        if (!range) {
                          return {
                            valid: false,
                            errorMessage: 'No range selected',
                          };
                        }
                        if (range.type === 'absolute') {
                          const { startDate, endDate } = range;
                          const start = new Date(startDate);
                          const end = new Date(endDate);
                          if (start > end) {
                            return {
                              valid: false,
                              errorMessage: 'End date must be greater than start date',
                            };
                          }
                          const firstMonthWithData = new Date(months[0]);
                          const lastMonthWithData = new Date(months[months.length - 1]);
                          const hasData = !(
                            (start < firstMonthWithData && end < firstMonthWithData) ||
                            (start > lastMonthWithData && end > lastMonthWithData)
                          );
                          if (hasData) {
                            return { valid: true };
                          } else {
                            return {
                              valid: false,
                              errorMessage: 'No data for the selected dates.',
                            };
                          }
                        } else {
                          return { valid: false, errorMessage: 'Range should be absolute' };
                        }
                      }}
                      relativeOptions={[]}
                    />
                    {granularity.value === 'monthly' && <div className={styles.small}>Displaying last 1 year</div>}
                  </FormField>
                  <FormField label="Granularity">
                    <Select
                      selectedOption={granularity}
                      options={[granularityOptions.daily, granularityOptions.monthly]}
                      onChange={({ detail }) => setGranularity(detail.selectedOption)}
                    />
                  </FormField>
                </SpaceBetween>
              </ExpandableSection>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Applied filters ({appliedFilters})</span>
                <span>
                  <Link onFollow={() => setServices([])}>Clear all</Link>
                </span>
              </div>
              <FormField label="Service" info={<Link onFollow={() => setServices([])}>Clear</Link>}>
                <MultiSelect
                  selectedOptions={services}
                  options={serviceOptions}
                  onChange={({ detail }) => setServices(detail.selectedOptions)}
                  placeholder={'Services included' + (services.length ? ` (${services.length})` : '')}
                />
              </FormField>
            </SpaceBetween>
          </SplitPanel>
        }
        splitPanelOpen={splitPanelOpen}
        onSplitPanelToggle={({ detail }) => setSplitPanelOpen(detail.open)}
        content={
          <SpaceBetween direction="vertical" size="s">
            <SpaceBetween direction="horizontal" size="xs" alignItems="center">
              <Icon name="lock-private" size="medium" />
              <Header variant="h1">Monthly costs by linked account</Header>
            </SpaceBetween>
            <Container
              header={
                <Header variant="h2">
                  Cost and usage graph <Link variant="info">Info</Link>
                </Header>
              }
            >
              <SpaceBetween direction="vertical" size="m">
                <ColumnLayout columns={3}>
                  <div>
                    <div className={styles.small}>Total cost</div>
                    <Box variant="h1">{totalCost}</Box>
                  </div>
                  <div className={styles.column}>
                    <div className={styles.small}>
                      {granularity.value === 'monthly' ? 'Average monthly cost' : 'Average daily cost'}
                    </div>
                    <Box variant="h1">{averageCost}</Box>
                  </div>
                  <div className={styles.column}>
                    <div className={styles.small}>Service count</div>
                    <Box variant="h1">{filteredSeries.length}</Box>
                  </div>
                </ColumnLayout>
                <BarChart
                  hideFilter={true}
                  stackedBars={true}
                  emphasizeBaselineAxis={true}
                  series={filteredSeries}
                  xDomain={xDomain}
                  i18nStrings={{
                    xTickFormatter: e =>
                      granularity.value === 'months'
                        ? new Date(e).toLocaleDateString('en-US', {
                            month: 'short',
                            year: 'numeric',
                          })
                        : new Date(e).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                    yTickFormatter: e =>
                      Math.abs(e) >= 1e3 ? (e / 1e3).toFixed(1).replace(/\.0$/, '') + 'K' : e.toFixed(2),
                  }}
                  yTitle={'Costs ($)'}
                  detailPopoverFooter={xValue => {
                    if (granularity.value !== 'monthly') {
                      return null;
                    }
                    let sum = 0;
                    for (const { data } of monthlySeries) {
                      for (const point of data) {
                        if (point.x === xValue) {
                          sum += point.y;
                          break;
                        }
                      }
                    }

                    const label = `Filter page by ${new Date(xValue).toLocaleString('en-US', {
                      month: 'long',
                    })} and by a service:`;

                    const options = [];
                    const entries = Object.entries(monthlySeriesByService);
                    for (const [key, dataSeries] of entries) {
                      if (dataSeries.data.some(({ x }) => x === xValue)) {
                        options.push({
                          value: key,
                          label: dataSeries.title,
                        });
                      }
                    }

                    return (
                      <SpaceBetween direction="vertical" size="xl">
                        <div className={styles.total}>
                          <span className={styles.key}>Total cost</span>
                          <span>{dollarFormatter(sum)}</span>
                        </div>
                        <FormField label={label} description="Select a service to view the account spend by month.">
                          <SpaceBetween direction="vertical" size="xs">
                            <Select
                              selectedOption={selectedService}
                              options={serviceOptions}
                              onChange={({ detail }) => setSelectedService(detail.selectedOption)}
                            />
                            <Button
                              onClick={() => {
                                if (selectedService) {
                                  setServices([selectedService]);
                                  setGranularity(granularityOptions.daily);
                                  setDateRange({
                                    type: 'absolute',
                                    startDate: months[8] + '-01',
                                    endDate: months[8] + '-31',
                                  });
                                }
                              }}
                            >
                              Apply filter
                            </Button>
                          </SpaceBetween>
                        </FormField>
                      </SpaceBetween>
                    );
                  }}
                  detailPopoverHeader={xValue =>
                    (services.length === 1 ? `${services[0].label}: ` : '') +
                    new Date(xValue).toLocaleDateString('en-US', {
                      day: granularity.value === 'daily' ? 'numeric' : undefined,
                      month: 'short',
                      year: 'numeric',
                    })
                  }
                />
              </SpaceBetween>
            </Container>
          </SpaceBetween>
        }
      />
    </I18nProvider>
  ) : (
    'Loading...'
  );
}
