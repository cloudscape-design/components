// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext } from 'react';

import { Button, Container, Header, SpaceBetween, Toggle } from '~components';
import ContentLayout from '~components/content-layout';

import AppContext, { AppContextType } from '../app/app-context';
import ScreenshotArea from '../utils/screenshot-area';

type DemoContext = React.Context<
  AppContextType<{
    fullBleedHeader: boolean | undefined;
    disableOverlap: boolean | undefined;
    hasContent: boolean | undefined;
    useCustomBackground: boolean | undefined;
  }>
>;

export default function ContentLayoutFullBleedHeaderPage() {
  const { urlParams, setUrlParams } = useContext(AppContext as DemoContext);

  return (
    <ScreenshotArea gutters={false}>
      <main>
        <ContentLayout
          fullBleedHeader={urlParams.fullBleedHeader}
          disableOverlap={urlParams.disableOverlap}
          headerBackgroundStyle={
            urlParams.useCustomBackground
              ? 'linear-gradient(135deg, rgba(71, 17, 118, 1) 3%, rgba(131, 57, 157, 1) 44%, rgba(149, 85, 182, 1) 69%, rgba(145, 134, 215, 1) 94%)'
              : undefined
          }
          header={
            <Header
              variant="h1"
              description="The header slot spans edge-to-edge when fullBleedHeader is enabled."
              actions={<Button variant="primary">Action</Button>}
            >
              Full-bleed header demo
            </Header>
          }
        >
          {urlParams.hasContent && (
            <SpaceBetween size="l">
              <Container header={<Header variant="h2">Content area</Header>}>
                <p>Page content goes here. The header above spans the full width when fullBleedHeader is true.</p>
              </Container>
              <Container>
                <p>Another content block.</p>
              </Container>
            </SpaceBetween>
          )}
        </ContentLayout>

        <div style={{ marginBlockStart: '16px' }}>
          <Container>
            <SpaceBetween size="s" direction="horizontal">
              <Toggle
                checked={!!urlParams.fullBleedHeader}
                onChange={({ detail }) => setUrlParams({ fullBleedHeader: detail.checked })}
              >
                fullBleedHeader
              </Toggle>
              <Toggle
                checked={!!urlParams.disableOverlap}
                onChange={({ detail }) => setUrlParams({ disableOverlap: detail.checked })}
              >
                disableOverlap
              </Toggle>
              <Toggle
                checked={!!urlParams.hasContent}
                onChange={({ detail }) => setUrlParams({ hasContent: detail.checked })}
              >
                Has content
              </Toggle>
              <Toggle
                checked={!!urlParams.useCustomBackground}
                onChange={({ detail }) => setUrlParams({ useCustomBackground: detail.checked })}
              >
                Custom background
              </Toggle>
            </SpaceBetween>
          </Container>
        </div>
      </main>
    </ScreenshotArea>
  );
}
