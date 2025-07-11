// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { getIsRtl } from '@cloudscape-design/component-toolkit/internal';

import AppLayout from '~components/app-layout';
import Box from '~components/box';
import Header from '~components/header';

import ScreenshotArea from '../utils/screenshot-area';
import { Breadcrumbs, Navigation, Tools } from './utils/content-blocks';
import labels from './utils/labels';
import * as toolsContent from './utils/tools-content';

export default function () {
  return (
    <ScreenshotArea gutters={false}>
      <AppLayout
        ariaLabels={labels}
        breadcrumbs={<Breadcrumbs />}
        navigation={<Navigation />}
        tools={<Tools>{toolsContent.long}</Tools>}
        contentHeader={<Header variant="h1">Demo page - Full content area height - Visual Refresh only</Header>}
        disableContentHeaderOverlap={true}
        disableContentPaddings={true}
        content={<ContentFilling />}
      />
    </ScreenshotArea>
  );
}

function ContentFilling() {
  return (
    <div style={{ minBlockSize: '100%', position: 'relative' }}>
      <div
        style={{
          position: 'absolute',
          insetBlockStart: '50%',
          insetInlineStart: '50%',
          transform: getIsRtl(document.body) ? 'translate(50%, -50%)' : 'translate(-50%, -50%)',
        }}
      >
        <Box fontSize="heading-m">
          In Visual Refresh, there should be a cross exactly in each corner of <br />
          the content area, without any scrollbars.
        </Box>
      </div>
      <CornerMarker insetBlockStart={0} insetInlineStart={0} />
      <CornerMarker insetBlockEnd={0} insetInlineStart={0} />
      <CornerMarker insetBlockStart={0} insetInlineEnd={0} />
      <CornerMarker insetBlockEnd={0} insetInlineEnd={0} />
    </div>
  );
}

function CornerMarker(props: {
  insetBlockStart?: number;
  insetInlineEnd?: number;
  insetInlineStart?: number;
  insetBlockEnd?: number;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 10 10"
      style={{ inlineSize: '50px', blockSize: '50px', position: 'absolute', ...props }}
      focusable="false"
    >
      <line x1="0" y1="0" x2="10" y2="10" stroke="currentColor" strokeWidth="1" />
      <line x1="0" y1="10" x2="10" y2="0" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}
