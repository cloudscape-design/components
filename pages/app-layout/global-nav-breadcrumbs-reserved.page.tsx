// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useState } from 'react';

import AppLayout from '~components/app-layout';
import BreadcrumbGroup, { BreadcrumbGroupProps } from '~components/breadcrumb-group';
import Button from '~components/button';
import Container from '~components/container';
import Header from '~components/header';
import { registerBreadcrumbsConsumer } from '~components/plugins';
import SpaceBetween from '~components/space-between';

import labels from './utils/labels';

const externalOwnedBreadcrumbsKey = Symbol.for('awsui-widget-api-external-owned-breadcrumbs');

function setBreadcrumbsOwnedExternally(value: boolean | undefined) {
  const flagHolder = window as unknown as Record<symbol, boolean | undefined>;
  if (value === undefined) {
    delete flagHolder[externalOwnedBreadcrumbsKey];
  } else {
    flagHolder[externalOwnedBreadcrumbsKey] = value;
  }
}

function GlobalNavigationHeader() {
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbGroupProps | null>(null);

  useEffect(() => registerBreadcrumbsConsumer({ onBreadcrumbsChange: setBreadcrumbs }).unregister, []);

  if (!breadcrumbs) {
    return null;
  }

  const sinkProps = { ...breadcrumbs, __disableGlobalization: true } as React.ComponentProps<typeof BreadcrumbGroup>;

  return (
    <div data-testid="global-nav-header">
      <BreadcrumbGroup {...sinkProps} />
    </div>
  );
}

export default function GlobalNavBreadcrumbsReservedPage() {
  setBreadcrumbsOwnedExternally(true);

  const [navHeaderMounted, setNavHeaderMounted] = useState(false);
  const items: BreadcrumbGroupProps['items'] = [
    { text: 'Home', href: '#home' },
    { text: 'Service', href: '#service' },
    { text: 'Resource', href: '#resource' },
  ];

  useEffect(() => () => setBreadcrumbsOwnedExternally(undefined), []);

  return (
    <>
      {navHeaderMounted && <GlobalNavigationHeader />}
      <AppLayout
        ariaLabels={labels}
        breadcrumbs={<BreadcrumbGroup items={items} ariaLabel="Breadcrumbs" />}
        content={
          <Container header={<Header variant="h1">Reserved external breadcrumbs ownership</Header>}>
            <SpaceBetween size="s">
              <p>AppLayout starts with toolbar breadcrumbs hidden while the external consumer is still loading.</p>
              <Button data-testid="toggle-nav-header" onClick={() => setNavHeaderMounted(mounted => !mounted)}>
                {navHeaderMounted ? 'Unmount' : 'Mount'} global nav header
              </Button>
            </SpaceBetween>
          </Container>
        }
      />
    </>
  );
}
