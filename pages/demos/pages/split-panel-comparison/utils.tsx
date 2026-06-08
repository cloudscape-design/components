// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useEffect, useState } from 'react';

import { AppLayoutProps } from '@cloudscape-design/components/app-layout';
import Box from '@cloudscape-design/components/box';
import BreadcrumbGroup from '@cloudscape-design/components/breadcrumb-group';
import Header from '@cloudscape-design/components/header';
import KeyValuePairs from '@cloudscape-design/components/key-value-pairs';
import Link from '@cloudscape-design/components/link';
import Table from '@cloudscape-design/components/table';
import { TableProps } from '@cloudscape-design/components/table';

import { isVisualRefresh } from '../../common/apply-mode';
import { EC2Instance } from '../../resources/types';
import { COLUMN_DEFINITIONS_PANEL_CONTENT_SINGLE } from './table-config';

const EMPTY_PANEL_CONTENT = {
  header: '0 instances selected',
  body: 'Select an instance to see its details.',
};

export const getPanelContentSingle = (items: Readonly<EC2Instance[]>) => {
  if (!items.length) {
    return EMPTY_PANEL_CONTENT;
  }

  const item = items[0];

  return {
    header: item.id,
    body: (
      <Table
        enableKeyboardNavigation={true}
        header={
          <Header variant="h2" counter={`(${item.inboundRules.length})`}>
            Inbound rules
          </Header>
        }
        columnDefinitions={COLUMN_DEFINITIONS_PANEL_CONTENT_SINGLE}
        items={item.inboundRules}
        variant={isVisualRefresh ? 'borderless' : 'container'}
      ></Table>
    ),
  };
};

export const getPanelContentMultiple = (items: Readonly<EC2Instance[]>) => {
  if (!items.length) {
    return EMPTY_PANEL_CONTENT;
  }

  if (items.length === 1) {
    return getPanelContentSingle(items);
  }

  const enabled = items.filter(({ state }) => state === 'Deactivated').length;
  const volumes = items.reduce((volumes, { volume }) => {
    volumes += volume;
    return volumes;
  }, 0);
  const securityGroups = items.reduce((numOfSecurityGroups, { securityGroups }) => {
    numOfSecurityGroups += securityGroups.length;
    return numOfSecurityGroups;
  }, 0);
  const loadBalancers = items.reduce((numOfLoadBalancers, { loadBalancers }) => {
    numOfLoadBalancers += loadBalancers.length;
    return numOfLoadBalancers;
  }, 0);

  return {
    header: `${items.length} instances selected`,
    body: (
      <KeyValuePairs
        columns={4}
        items={[
          {
            label: 'Running instances',
            value: (
              <Link variant="awsui-value-large" href="#" ariaLabel={`Running instances (${enabled})`}>
                {enabled}
              </Link>
            ),
          },
          {
            label: 'Volumes',
            value: (
              <Link variant="awsui-value-large" href="#" ariaLabel={`Volumes (${volumes})`}>
                {volumes}
              </Link>
            ),
          },
          {
            label: 'Security groups',
            value: (
              <Link variant="awsui-value-large" href="#" ariaLabel={`Security groups (${securityGroups})`}>
                {securityGroups}
              </Link>
            ),
          },
          {
            label: 'Load balancers',
            value: (
              <Link variant="awsui-value-large" href="#" ariaLabel={`Load balancers (${loadBalancers})`}>
                {loadBalancers}
              </Link>
            ),
          },
        ]}
      />
    ),
  };
};

export const getPanelContentComparison = (items: Readonly<EC2Instance[]>) => {
  if (!items.length) {
    return {
      header: '0 instances selected',
      body: 'Select an instance to see its details. Select multiple instances to compare.',
    };
  }

  if (items.length === 1) {
    return getPanelContentSingle(items);
  }
  const keyHeaderMap = {
    platformDetails: 'Platform details',
    numOfvCpu: 'Number of vCPUs',
    launchTime: 'Launch time',
    availabilityZone: 'Availability zone',
    monitoring: 'Monitoring',
    securityGroups: 'Security groups',
  };
  const properties = [
    'platformDetails',
    'numOfvCpu',
    'launchTime',
    'availabilityZone',
    'monitoring',
    'securityGroups',
  ] as const;

  interface TransformedData extends Record<string, string | number | string[]> {
    comparisonType: string;
  }

  const transformedData: TransformedData[] = properties.map(key => {
    const data: TransformedData = { comparisonType: keyHeaderMap[key] };

    for (const item of items) {
      data[item.id] = item[key];
    }

    return data;
  });

  const columnDefinitions: TableProps.ColumnDefinition<TransformedData>[] = [
    {
      id: 'comparisonType',
      header: '',
      cell: ({ comparisonType }) => <b>{comparisonType}</b>,
    },
    ...items.map(({ id }) => ({
      id,
      header: id,
      cell: (item: TransformedData) => {
        if (Array.isArray(item[id])) {
          const arrayItem = item[id] as string[];
          return arrayItem.join(', ');
        }

        return item[id];
      },
    })),
  ];

  return {
    header: `${items.length} instances selected`,
    body: (
      <Box padding={{ bottom: 'l' }}>
        <Table
          enableKeyboardNavigation={true}
          header={<Header variant="h2">Compare details</Header>}
          items={transformedData}
          columnDefinitions={columnDefinitions}
          variant={isVisualRefresh ? 'borderless' : 'container'}
        />
      </Box>
    ),
  };
};

export const getPanelContent = (items: Readonly<EC2Instance[]> | undefined = [], type: string) => {
  if (type === 'single') {
    return getPanelContentSingle(items);
  } else if (type === 'multiple') {
    return getPanelContentMultiple(items);
  } else {
    return getPanelContentComparison(items);
  }
};

export const Breadcrumbs = () => (
  <BreadcrumbGroup
    expandAriaLabel="Show path"
    ariaLabel="Breadcrumbs"
    items={[
      { text: 'Service', href: '#/ec2' },
      { text: 'Instances', href: '#/ec2/instances' },
    ]}
  />
);

export const useSplitPanel = (selectedItems: Readonly<EC2Instance[]> = []) => {
  const [splitPanelSize, setSplitPanelSize] = useState(300);
  const [splitPanelOpen, setSplitPanelOpen] = useState(false);
  const [hasManuallyClosedOnce, setHasManuallyClosedOnce] = useState(false);

  const onSplitPanelResize: AppLayoutProps['onSplitPanelResize'] = ({ detail: { size } }) => {
    setSplitPanelSize(size);
  };

  const onSplitPanelToggle: AppLayoutProps['onSplitPanelToggle'] = ({ detail: { open } }) => {
    setSplitPanelOpen(open);

    if (!open) {
      setHasManuallyClosedOnce(true);
    }
  };

  useEffect(() => {
    if (selectedItems.length && !hasManuallyClosedOnce) {
      setSplitPanelOpen(true);
    }
  }, [selectedItems.length, hasManuallyClosedOnce]);

  return {
    splitPanelOpen,
    onSplitPanelToggle,
    splitPanelSize,
    onSplitPanelResize,
  };
};
