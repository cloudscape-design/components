// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext } from 'react';
import {
  AppLayout,
  ContentLayout,
  Header,
  Toggle,
  ColumnLayout,
  FormField,
  Select,
  Container,
  Input,
} from '~components';
import { ContentLayoutProps } from '~components/content-layout';

import { Breadcrumbs, Notifications } from '../app-layout/utils/content-blocks';
import ScreenshotArea from '../utils/screenshot-area';
import appLayoutLabels from '../app-layout/utils/labels';
import AppContext, { AppContextType } from '../app/app-context';
import heroHeaderImgLight from './hero-header-light.png';
import heroHeaderImgDark from './hero-header-dark.png';

type DemoContext = React.Context<
  AppContextType<{
    hasNotifications: boolean | undefined;
    hasBreadcrumbs: boolean | undefined;
    hasAppLayout: boolean | undefined;
    hasAppLayoutWithOpenNavigation: boolean | undefined;
    hasAppLayoutWithOpenTools: boolean | undefined;
    hasSecondaryHeader: boolean | undefined;
    defaultPadding: boolean | undefined;
    disableOverlap: boolean | undefined;
    headerVariant: ContentLayoutProps['headerVariant'];
    maxContentWidth: number | undefined;
    headerBackgroundStyle: 'none' | 'gradient' | 'image';
    hasContainer: boolean | undefined;
    removeHeader: boolean | undefined;
  }>
>;

const ContentLayoutWrapper = () => {
  const { urlParams } = useContext(AppContext as DemoContext);

  return (
    <ContentLayout
      breadcrumbs={urlParams.hasBreadcrumbs && <Breadcrumbs />}
      notifications={urlParams.hasNotifications && <Notifications />}
      defaultPadding={urlParams.defaultPadding}
      disableOverlap={urlParams.disableOverlap}
      header={
        !urlParams.removeHeader && (
          <Header variant="h1" description="Description">
            Header
          </Header>
        )
      }
      headerVariant={urlParams.headerVariant}
      maxContentWidth={urlParams.maxContentWidth}
      secondaryHeader={urlParams.hasSecondaryHeader && <Container>secondary header</Container>}
      headerBackgroundStyle={
        urlParams.headerBackgroundStyle === 'gradient'
          ? 'linear-gradient(135deg, rgba(71, 17, 118, 1) 3%, rgba(131, 57, 157, 1) 44%, rgba(149, 85, 182, 1) 69%, rgba(145, 134, 215, 1) 94%)'
          : urlParams.headerBackgroundStyle === 'image'
            ? mode => `url(${mode === 'light' ? heroHeaderImgLight : heroHeaderImgDark})`
            : undefined
      }
    >
      {urlParams.hasContainer ? (
        <Container>
          <Controls />
        </Container>
      ) : (
        <Controls />
      )}
    </ContentLayout>
  );
};

export default function ContentLayoutPermutations() {
  const { urlParams, setUrlParams } = useContext(AppContext as DemoContext);

  return (
    <ScreenshotArea gutters={false}>
      {urlParams.hasAppLayout ? (
        <AppLayout
          ariaLabels={appLayoutLabels}
          navigationOpen={!!urlParams.hasAppLayoutWithOpenNavigation}
          onNavigationChange={({ detail }) => setUrlParams({ hasAppLayoutWithOpenNavigation: detail.open })}
          toolsOpen={!!urlParams.hasAppLayoutWithOpenTools}
          onToolsChange={({ detail }) => setUrlParams({ hasAppLayoutWithOpenTools: detail.open })}
          disableContentPaddings={true}
          headerVariant={urlParams.headerVariant === 'high-contrast' ? 'high-contrast' : 'default'}
          content={<ContentLayoutWrapper />}
        />
      ) : (
        <main>
          <ContentLayoutWrapper />
        </main>
      )}
    </ScreenshotArea>
  );
}

const Controls = () => {
  const { urlParams, setUrlParams } = useContext(AppContext as DemoContext);

  return (
    <ColumnLayout columns={4}>
      <Toggle
        checked={!!urlParams.hasAppLayout}
        onChange={({ detail }) => setUrlParams({ hasAppLayout: detail.checked })}
      >
        Has AppLayout
      </Toggle>
      <Toggle
        checked={!!urlParams.hasAppLayoutWithOpenNavigation}
        onChange={({ detail }) => setUrlParams({ hasAppLayoutWithOpenNavigation: detail.checked })}
      >
        Has open navigation
      </Toggle>
      <Toggle
        checked={!!urlParams.hasAppLayoutWithOpenTools}
        onChange={({ detail }) => setUrlParams({ hasAppLayoutWithOpenTools: detail.checked })}
      >
        Has open tools
      </Toggle>
      <Toggle
        checked={!!urlParams.removeHeader}
        onChange={({ detail }) => setUrlParams({ removeHeader: detail.checked })}
      >
        Remove header
      </Toggle>
      <Toggle
        checked={!!urlParams.hasContainer}
        onChange={({ detail }) => setUrlParams({ hasContainer: detail.checked })}
      >
        Has container
      </Toggle>
      <Toggle
        checked={!!urlParams.hasBreadcrumbs}
        onChange={({ detail }) => setUrlParams({ hasBreadcrumbs: detail.checked })}
      >
        Has breadcrumbs
      </Toggle>
      <Toggle
        checked={!!urlParams.hasNotifications}
        onChange={({ detail }) => setUrlParams({ hasNotifications: detail.checked })}
      >
        Has notifications
      </Toggle>
      <Toggle
        checked={!!urlParams.hasSecondaryHeader}
        onChange={({ detail }) => setUrlParams({ hasSecondaryHeader: detail.checked })}
      >
        Has secondary header
      </Toggle>
      <Toggle
        checked={!!urlParams.defaultPadding}
        onChange={({ detail }) => setUrlParams({ defaultPadding: detail.checked })}
      >
        defaultPadding
      </Toggle>
      <Toggle
        checked={!!urlParams.disableOverlap}
        onChange={({ detail }) => setUrlParams({ disableOverlap: detail.checked })}
      >
        disableOverlap
      </Toggle>
      <FormField label="headerVariant">
        <Select
          selectedOption={{ value: urlParams.headerVariant || 'default' }}
          onChange={({ detail }) =>
            setUrlParams({
              headerVariant: detail.selectedOption.value as unknown as ContentLayoutProps['headerVariant'],
            })
          }
          options={[{ value: 'default' }, { value: 'high-contrast' }, { value: 'divider' }]}
        />
      </FormField>
      <FormField label="header background style">
        <Select
          selectedOption={{ value: urlParams.headerBackgroundStyle || 'none' }}
          onChange={({ detail }) =>
            setUrlParams({
              headerBackgroundStyle: detail.selectedOption.value as unknown as 'none' | 'gradient' | 'image',
            })
          }
          options={[{ value: 'none' }, { value: 'gradient' }, { value: 'image' }]}
        />
      </FormField>
      <FormField label="maxContentWidth">
        <Input
          type="number"
          value={`${urlParams.maxContentWidth || ''}`}
          onChange={({ detail }) =>
            setUrlParams({ maxContentWidth: detail.value ? parseInt(detail.value, 10) : undefined })
          }
        />
      </FormField>
    </ColumnLayout>
  );
};
