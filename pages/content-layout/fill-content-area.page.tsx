// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import AppLayout from '~components/app-layout';
import Header from '~components/header';
import ContentLayout from '~components/content-layout';
import ScreenshotArea from '../utils/screenshot-area';
import { Navigation, Tools, Breadcrumbs } from '../app-layout/utils/content-blocks';
import * as toolsContent from '../app-layout/utils/tools-content';
import labels from '../app-layout/utils/labels';
import Box from '~components/box';

export default function () {
  return (
    <ScreenshotArea gutters={false}>
      <AppLayout
        ariaLabels={labels}
        breadcrumbs={<Breadcrumbs />}
        navigation={<Navigation />}
        tools={<Tools>{toolsContent.long}</Tools>}
        disableContentPaddings={true}
        content={
          <ContentLayout
            disableOverlap={true}
            header={<Header variant="h1">Demo page - Full content area height - Visual Refresh only</Header>}
          >
            <ContentFilling />
          </ContentLayout>
        }
      />
    </ScreenshotArea>
  );
}

function ContentFilling() {
  return (
    <div style={{ minHeight: '100%', position: 'relative' }}>
      <div
        style={{
          position: 'absolute',
          insetBlockStart: '50%',
          insetInlineStart: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <Box fontSize="heading-m">
          In Visual Refresh, there should be a cross exactly in each corner of <br />
          the content area, without any scrollbars.
        </Box>
      </div>
      <CornerMarker top={0} left={0} />
      <CornerMarker bottom={0} left={0} />
      <CornerMarker top={0} right={0} />
      <CornerMarker bottom={0} right={0} />
    </div>
  );
}

function CornerMarker(props: { top?: number; right?: number; left?: number; bottom?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 10 10"
      style={{ width: '50px', height: '50px', position: 'absolute', ...props }}
    >
      <line x1="0" y1="0" x2="10" y2="10" stroke="currentColor" strokeWidth="1" />
      <line x1="0" y1="10" x2="10" y2="0" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}
