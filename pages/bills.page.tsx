// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useState } from 'react';
import AppLayout from '~components/app-layout';
import BreadCrumbGroup from '~components/breadcrumb-group';
import Header from '~components/header';
import Link from '~components/link';
import SideNavigation from '~components/side-navigation';
import labels from './app-layout/utils/labels';
import React from 'react';
import SpaceBetween from '~components/space-between';
import Table from '~components/table';
import TextFilter from '~components/text-filter';
import Pagination from '~components/pagination';
import TokenGroup from '~components/token-group';
import Flashbar, { FlashbarProps } from '~components/flashbar';
import { dailySeriesByService, dollarFormatter } from './drill-down.data';

export default function () {
  const currentPath = window.location.hash;
  const [notifications, setNotifications] = useState<ReadonlyArray<FlashbarProps.MessageDefinition>>([
    {
      type: 'info',
      header: 'Customize your view experience',
      content: (
        <>
          You can now customize the level of content density for the Bills page.{' '}
          <Link href={currentPath} color="inverted">
            Open density settings
          </Link>
        </>
      ),
      dismissible: true,
      id: '0',
      onDismiss: () => setNotifications([]),
    },
  ]);
  const dataSet = dailySeriesByService.lambda.data[12];
  const date = new Date(dataSet.x).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
    day: 'numeric',
  });

  return (
    <AppLayout
      ariaLabels={labels}
      breadcrumbs={
        <BreadCrumbGroup
          items={[
            { text: 'AWS Billing', href: currentPath },
            { text: 'Bills', href: '' },
          ]}
        />
      }
      navigation={
        <SideNavigation
          activeHref={currentPath}
          header={{ text: 'Home', href: currentPath }}
          items={[
            { type: 'link', text: 'Home', href: currentPath },
            {
              type: 'section',
              text: 'Bills',
              items: [
                {
                  type: 'link',
                  text: 'Bills',
                  href: currentPath,
                },
              ],
            },
          ]}
        />
      }
      notifications={<Flashbar items={notifications} />}
      content={
        <SpaceBetween direction="vertical" size="s">
          <Table
            header={
              <Header variant="h2" headingTagOverride="h1" info={<Link variant="info">Info</Link>} counter={'(4/4)'}>
                Bills
              </Header>
            }
            columnDefinitions={[
              {
                id: 'accountId',
                header: 'Account Id',
                cell: ({ accountId }) => <Link href={currentPath}>{accountId}</Link>,
              },
              {
                id: 'serviceName',
                header: 'Service name',
                cell: () => 'Lambda',
              },
              {
                id: 'cost',
                header: 'Cost',
                cell: ({ cost }) => dollarFormatter(cost),
              },
              {
                id: 'date',
                header: 'Date',
                cell: () => date,
              },
            ]}
            items={[
              {
                accountId: 'FEJIHWPCAEHW',
                cost: 10,
              },
              {
                accountId: 'LKMSQWOCAWOP',
                cost: 60,
              },
              {
                accountId: 'OQWRIJXCKJVN',
                cost: 393,
              },
              {
                accountId: 'SPFOAIEWJFAS',
                cost: 30,
              },
            ]}
            filter={
              <>
                <TextFilter filteringPlaceholder="Find resources" filteringText="" />
                <TokenGroup items={[{ label: 'Lambda' }, { label: date }]} />
              </>
            }
            pagination={<Pagination currentPageIndex={1} pagesCount={1} />}
          />
        </SpaceBetween>
      }
    />
  );
}
