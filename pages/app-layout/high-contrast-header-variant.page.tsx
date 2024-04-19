// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext } from 'react';
import { AppLayout, ContentLayout, Header, Toggle, ColumnLayout, Box, Container } from '~components';

import { Breadcrumbs, Notifications } from '../app-layout/utils/content-blocks';
import ScreenshotArea from '../utils/screenshot-area';
import appLayoutLabels from '../app-layout/utils/labels';
import AppContext, { AppContextType } from '../app/app-context';

type DemoContext = React.Context<
  AppContextType<{
    hasNotifications: boolean | undefined;
    hasBreadcrumbs: boolean | undefined;
    hasContentLayout: boolean | undefined;
    disableOverlap: boolean | undefined;
    hasContainer: boolean | undefined;
  }>
>;

const DemoHeader = () => <Header variant="h1">Header</Header>;

const DemoContent = () => {
  const { urlParams } = useContext(AppContext as DemoContext);
  return urlParams.hasContainer ? (
    <Container>
      <Controls />
    </Container>
  ) : (
    <Controls />
  );
};

const ContentLayoutWrapper = () => {
  const { urlParams } = useContext(AppContext as DemoContext);

  return (
    <ContentLayout disableOverlap={urlParams.disableOverlap} header={<DemoHeader />}>
      <DemoContent />
    </ContentLayout>
  );
};

export default function ContentLayoutPermutations() {
  const { urlParams } = useContext(AppContext as DemoContext);

  return (
    <ScreenshotArea gutters={false}>
      <AppLayout
        breadcrumbs={urlParams.hasBreadcrumbs && <Breadcrumbs />}
        notifications={urlParams.hasNotifications && <Notifications />}
        ariaLabels={appLayoutLabels}
        contentHeader={!urlParams.hasContentLayout && <DemoHeader />}
        disableContentHeaderOverlap={!urlParams.hasContentLayout && urlParams.disableOverlap}
        content={urlParams.hasContentLayout ? <ContentLayoutWrapper /> : <DemoContent />}
        headerVariant="high-contrast"
      />
    </ScreenshotArea>
  );
}

const Controls = () => {
  const { urlParams, setUrlParams } = useContext(AppContext as DemoContext);

  return (
    <Box padding={{ top: 'xxxl' }}>
      <ColumnLayout columns={4}>
        <Toggle
          checked={!!urlParams.hasContentLayout}
          onChange={({ detail }) => setUrlParams({ hasContentLayout: detail.checked })}
        >
          {' '}
          Has ContentLayout{' '}
        </Toggle>
        <Toggle
          checked={!!urlParams.hasContainer}
          onChange={({ detail }) => setUrlParams({ hasContainer: detail.checked })}
        >
          {' '}
          Has container{' '}
        </Toggle>
        <Toggle
          checked={!!urlParams.hasBreadcrumbs}
          onChange={({ detail }) => setUrlParams({ hasBreadcrumbs: detail.checked })}
        >
          {' '}
          Has breadcrumbs{' '}
        </Toggle>
        <Toggle
          checked={!!urlParams.hasNotifications}
          onChange={({ detail }) => setUrlParams({ hasNotifications: detail.checked })}
        >
          {' '}
          Has notifications{' '}
        </Toggle>
        <Toggle
          checked={!!urlParams.disableOverlap}
          onChange={({ detail }) => setUrlParams({ disableOverlap: detail.checked })}
        >
          {' '}
          disableOverlap{' '}
        </Toggle>
      </ColumnLayout>
    </Box>
  );
};
