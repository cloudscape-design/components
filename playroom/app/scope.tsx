// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState, useCallback, useEffect, useLayoutEffect } from 'react';
import { useCollection } from '@cloudscape-design/collection-hooks';
import {
  AppLayout,
  SideNavigation,
  Flashbar,
  BreadcrumbGroup,
  HelpPanel,
  TableProps,
  Link,
  StatusIndicator,
  Box,
  SplitPanel,
} from '../../lib/components';
import TableItems from './distributions.json';

// so sorry for skipping i18nStrings, hackathon rules

function WithState({ children: Children }: { children: () => JSX.Element | null }) {
  return <Children />;
}

function PageLayout({ children, splitPanel }: { children: React.ReactNode; splitPanel?: boolean }) {
  return (
    <AppLayout
      navigation={
        <SideNavigation
          header={{ text: 'Service', href: '#' }}
          items={[
            {
              type: 'section',
              text: 'Reports and analytics',
              items: [
                { type: 'link', text: 'Distributions', href: '#/distributions' },
                { type: 'link', text: 'Cache statistics', href: '#/cache' },
                {
                  type: 'link',
                  text: 'Monitoring and alarms',
                  href: '#/monitoring',
                },
                { type: 'link', text: 'Popular objects', href: '#/popular' },
                { type: 'link', text: 'Top referrers', href: '#/referrers' },
                { type: 'link', text: 'Usage', href: '#/usage' },
                { type: 'link', text: 'Viewers', href: '#/viewers' },
              ],
            },
            {
              type: 'section',
              text: 'Private content',
              items: [
                { type: 'link', text: 'How-to guide', href: '#/howto' },
                { type: 'link', text: 'Origin access identity', href: '#/origin' },
              ],
            },
          ]}
        />
      }
      notifications={
        <Flashbar
          items={[
            {
              type: 'success',
              content: 'Resource created successfully',
              dismissible: true,
            },
          ]}
        />
      }
      breadcrumbs={
        <BreadcrumbGroup
          items={[
            { text: 'Service', href: '#' },
            { text: 'Distributions', href: '#' },
          ]}
          expandAriaLabel="Show path"
          ariaLabel="Breadcrumbs"
        />
      }
      tools={<HelpPanel header="Help panel"></HelpPanel>}
      content={children}
      splitPanel={
        splitPanel && (
          <SplitPanel header="Split panel" i18nStrings={{} as any}>
            Split panel content
          </SplitPanel>
        )
      }
    />
  );
}

const TableColumnDefinitions: TableProps.ColumnDefinition<typeof TableItems[number]>[] = [
  {
    id: 'id',
    sortingField: 'id',
    header: 'Distribution ID',
    cell: item => (
      <div>
        <Link href="#">{item.id}</Link>
      </div>
    ),
    minWidth: 180,
  },
  {
    id: 'state',
    sortingField: 'state',
    header: 'State',
    cell: item => (
      <StatusIndicator type={item.state === 'Deactivated' ? 'error' : 'success'}>{item.state}</StatusIndicator>
    ),
    minWidth: 120,
  },
  {
    id: 'domainName',
    sortingField: 'domainName',
    cell: item => item.domainName,
    header: 'Domain name',
    minWidth: 160,
    isRowHeader: true,
  },
  {
    id: 'deliveryMethod',
    sortingField: 'deliveryMethod',
    header: 'Delivery method',
    cell: item => item.deliveryMethod,
    minWidth: 100,
  },
  {
    id: 'sslCertificate',
    sortingField: 'sslCertificate',
    header: 'SSL certificate',
    cell: item => item.sslCertificate,
    minWidth: 100,
  },
  {
    id: 'priceClass',
    sortingField: 'priceClass',
    header: 'Price class',
    cell: item => item.priceClass,
    minWidth: 100,
  },
  {
    id: 'logging',
    sortingField: 'logging',
    header: 'Logging',
    cell: item => item.logging,
    minWidth: 100,
  },
  {
    id: 'origin',
    sortingField: 'origin',
    header: 'Origin',
    cell: item => item.origin,
    minWidth: 100,
  },
];

function TableEmptyState({
  title,
  subtitle,
  action,
}: {
  title: React.ReactNode;
  subtitle: React.ReactNode;
  action: React.ReactNode;
}) {
  return (
    <Box textAlign="center" color="inherit">
      <Box variant="strong" textAlign="center" color="inherit">
        {title}
      </Box>
      <Box variant="p" padding={{ bottom: 's' }} color="inherit">
        {subtitle}
      </Box>
      {action}
    </Box>
  );
}

export default function useScope() {
  return {
    useState,
    useCallback,
    useEffect,
    useLayoutEffect,
    useCollection,

    WithState,
    PageLayout,

    TableColumnDefinitions,
    TableEmptyState,
    TableItems,
  };
}
