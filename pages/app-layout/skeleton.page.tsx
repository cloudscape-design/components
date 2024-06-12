// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext } from 'react';

import BreadcrumbGroup from '~components/breadcrumb-group';
import Container from '~components/container';
import Drawer from '~components/drawer';
import Header from '~components/header';
import Toggle from '~components/toggle';

import SpaceBetween from '~components/space-between';
import { SkeletonLayout } from './utils/skeleton-layout';
import AppContext, { AppContextType } from '../app/app-context';
import { Notifications } from './utils/content-blocks';

type PageConfigurationContext = React.Context<
  AppContextType<{
    navigationOpen?: boolean;
    toolsOpen?: boolean;
    hideContentHeader?: boolean;
    maxContentWidth?: boolean;
    disableContentPaddings?: boolean;
  }>
>;

export default function () {
  const { urlParams } = useContext(AppContext as PageConfigurationContext);
  return (
    <SkeletonLayout
      navigationOpen={urlParams.navigationOpen}
      navigation={<Drawer header={<h2>Navigation</h2>}>Nav content</Drawer>}
      toolsOpen={urlParams.toolsOpen}
      tools={<Drawer header={<h2>Tools</h2>}>Tools content</Drawer>}
      breadcrumbs={
        <BreadcrumbGroup
          items={[
            { text: 'Home', href: '#' },
            { text: 'Skeleton page', href: '' },
          ]}
        />
      }
      maxContentWidth={urlParams.maxContentWidth ? Number.MAX_VALUE : undefined}
      notifications={<Notifications />}
      disableContentPaddings={urlParams.disableContentPaddings}
      contentHeader={
        !urlParams.hideContentHeader && (
          <Header variant="h1" description="Basic demo">
            Demo page
          </Header>
        )
      }
      content={<Configurator />}
    />
  );
}

function Configurator() {
  const { urlParams, setUrlParams } = useContext(AppContext as PageConfigurationContext);

  return (
    <Container header={<Header description="Skeleton can only be controlled programmatically">Configurator</Header>}>
      <SpaceBetween size="m">
        <Toggle
          checked={urlParams.navigationOpen ?? false}
          onChange={event => setUrlParams({ navigationOpen: event.detail.checked })}
        >
          Navigation open
        </Toggle>
        <Toggle
          checked={urlParams.toolsOpen ?? false}
          onChange={event => setUrlParams({ toolsOpen: event.detail.checked })}
        >
          Tools open
        </Toggle>
        <Toggle
          checked={urlParams.hideContentHeader ?? false}
          onChange={event => setUrlParams({ hideContentHeader: event.detail.checked })}
        >
          Hide content header
        </Toggle>
        <Toggle
          checked={urlParams.maxContentWidth ?? false}
          onChange={event => setUrlParams({ maxContentWidth: event.detail.checked })}
        >
          Activate max content width
        </Toggle>
        <Toggle
          checked={urlParams.disableContentPaddings ?? false}
          onChange={event => setUrlParams({ disableContentPaddings: event.detail.checked })}
        >
          Disable content paddings
        </Toggle>
      </SpaceBetween>
    </Container>
  );
}
