// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useContext } from 'react';

import {
  Alert,
  BarChart,
  Box,
  Checkbox,
  ColumnLayout,
  Container,
  ContainerProps,
  FormField,
  Header,
  KeyValuePairs,
  Link,
  Slider,
  SpaceBetween,
  Table,
} from '~components';

import AppContext, { AppContextType } from '../app/app-context';
import {
  barChartInstructions,
  commonProps as barChartCommonProps,
  data3 as barChartData,
} from '../mixed-line-bar-chart/common';
import { generateItems } from '../table/generate-data';
import { ARIA_LABELS, columnsConfig } from '../table/shared-configs';
import ScreenshotArea from '../utils/screenshot-area';

type DemoContext = React.Context<
  AppContextType<{
    hideHeaders: boolean;
    hideFooters: boolean;
    customSpacing: boolean;
    height: string;
    columns: string;
  }>
>;

const instances = generateItems(10);

function useSettings() {
  const { urlParams, setUrlParams } = useContext(AppContext as DemoContext);
  const hideHeaders = urlParams.hideHeaders ?? false;
  const hideFooters = urlParams.hideFooters ?? false;
  const customSpacing = urlParams.customSpacing ?? false;
  const height = parseInt(urlParams.height ?? '') || 225;
  const columns = parseInt(urlParams.columns ?? '') || 4;
  return { hideHeaders, hideFooters, customSpacing, height, columns, setUrlParams };
}

function ContainerPlayground(props: ContainerProps) {
  const settings = useSettings();
  return (
    <div style={{ blockSize: settings.height }}>
      <Container
        {...props}
        fitHeight={true}
        header={settings.hideHeaders ? null : <Header headingTagOverride="h2">{props.header}</Header>}
        footer={settings.hideFooters ? null : 'Footer'}
        disableContentPaddings={settings.customSpacing}
      >
        {settings.customSpacing ? (
          <Box padding={{ horizontal: 'l', top: 'xxs', bottom: 'l' }}>{props.children}</Box>
        ) : (
          props.children
        )}
      </Container>
    </div>
  );
}

export default function () {
  const { urlParams, setUrlParams } = useContext(AppContext as DemoContext);
  const columns = parseInt(urlParams.columns ?? '') || 3;
  const blockSize = parseInt(urlParams.height ?? '') || 225;
  return (
    <Box margin="m">
      <h1>Container content overflow demo</h1>

      <Box margin={{ bottom: 'm' }}>
        <SpaceBetween size="s">
          <SpaceBetween size="s" direction="horizontal">
            <Checkbox
              checked={urlParams.hideHeaders ?? false}
              onChange={event => setUrlParams({ hideHeaders: event.detail.checked })}
            >
              Hide headers
            </Checkbox>

            <Checkbox
              checked={urlParams.hideFooters ?? false}
              onChange={event => setUrlParams({ hideFooters: event.detail.checked })}
            >
              Hide footers
            </Checkbox>

            <Checkbox
              checked={urlParams.customSpacing ?? false}
              onChange={event => setUrlParams({ customSpacing: event.detail.checked })}
            >
              Custom spacing
            </Checkbox>
          </SpaceBetween>

          <FormField label="Height">
            <Slider
              value={blockSize}
              onChange={({ detail }) => setUrlParams({ height: detail.value.toString() })}
              min={50}
              max={700}
            />
          </FormField>

          <FormField label="Columns">
            <Slider
              value={columns}
              onChange={({ detail }) => setUrlParams({ columns: detail.value.toString() })}
              min={1}
              max={4}
            />
          </FormField>
        </SpaceBetween>
      </Box>

      <ScreenshotArea gutters={false}>
        <ColumnLayout columns={columns}>
          <ContainerPlayground header="Paragraph">
            <p>
              Lorem ipsum dolor sit amet,consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
              ea commodo consequat. Duis aute irure dolor in
              reprehenderitinvoluptatevelitessereprehenderitinvoluptatevelitessereprehenderitinvoluptatevelitessereprehenderitinvoluptatevelitesse
              cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
              officia deserunt mollit anim id est <Link>laborum</Link>.
            </p>
          </ContainerPlayground>

          <ContainerPlayground header="Key-value pairs">
            <ServiceOverview />
          </ContainerPlayground>

          <ContainerPlayground header="Alert">
            <Alert statusIconAriaLabel="Info">
              Lorem ipsum dolor sit amet,consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
              ea commodo consequat. Duis aute irure dolor in
              reprehenderitinvoluptatevelitessereprehenderitinvoluptatevelitessereprehenderitinvoluptatevelitessereprehenderitinvoluptatevelitesse
              cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
              officia deserunt mollit anim id est <Link>laborum</Link>.
            </Alert>
          </ContainerPlayground>

          <ContainerPlayground header="Table">
            <InstancesTable label="Instances 1" />
          </ContainerPlayground>

          <ContainerPlayground header="Bar chart">
            <CaloriesBarChart />
          </ContainerPlayground>
        </ColumnLayout>
      </ScreenshotArea>
    </Box>
  );
}

function ServiceOverview() {
  return (
    <KeyValuePairs
      columns={4}
      items={[
        {
          label: 'Running instances',
          value: (
            <Link variant="awsui-value-large" href="#" ariaLabel="Running instances (14)">
              14
            </Link>
          ),
        },
        {
          label: 'Volumes',
          value: (
            <Link variant="awsui-value-large" href="#" ariaLabel="Volumes (126)">
              126
            </Link>
          ),
        },
        {
          label: 'Security groups',
          value: (
            <Link variant="awsui-value-large" href="#" ariaLabel="Security groups (116)">
              116
            </Link>
          ),
        },
        {
          label: 'Load balancers',
          value: (
            <Link variant="awsui-value-large" href="#" ariaLabel="Load balancers (28)">
              28
            </Link>
          ),
        },
      ]}
    />
  );
}

function InstancesTable({ label }: { label: string }) {
  return (
    <Table
      ariaLabels={{ ...ARIA_LABELS, tableLabel: label }}
      variant="borderless"
      columnDefinitions={columnsConfig}
      items={instances}
    />
  );
}

function CaloriesBarChart() {
  return (
    <BarChart
      {...barChartCommonProps}
      height={200}
      fitHeight={true}
      hideFilter={true}
      hideLegend={true}
      series={[
        { title: 'Calories', type: 'bar', data: barChartData },
        { title: 'Threshold', type: 'threshold', y: 400 },
      ]}
      xDomain={['Potatoes', 'Tangerines', 'Chocolate', 'Apples', 'Oranges']}
      yDomain={[0, 700]}
      xTitle="Food"
      yTitle="Calories (kcal)"
      xScaleType="categorical"
      ariaLabel="Bar chart"
      ariaDescription={barChartInstructions}
    />
  );
}
