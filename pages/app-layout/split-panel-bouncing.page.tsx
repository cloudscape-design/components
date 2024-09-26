// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';

import { Box } from '~components';
import AppLayout from '~components/app-layout';
import SplitPanel from '~components/split-panel';

import ScreenshotArea from '../utils/screenshot-area';
import { Breadcrumbs, Navigation } from './utils/content-blocks';
import labels from './utils/labels';
import { splitPaneli18nStrings } from './utils/strings';

export default function () {
  const [splitPanelPosition, setSplitPanelPosition] = useState<'side' | 'bottom'>('bottom');
  return (
    <ScreenshotArea gutters={false}>
      <AppLayout
        ariaLabels={labels}
        breadcrumbs={<Breadcrumbs />}
        navigation={<Navigation />}
        toolsHide={true}
        splitPanelPreferences={{ position: splitPanelPosition }}
        onSplitPanelPreferencesChange={event => setSplitPanelPosition(event.detail.position)}
        splitPanel={
          <SplitPanel
            header="Split panel header withlongwordthatshouldbesplitinsteadofmakingthepanelscroll"
            i18nStrings={splitPaneli18nStrings}
          >
            {''}
          </SplitPanel>
        }
        content={
          <div>
            <Box variant="h1">Split panel bouncing page</Box>
            <Box fontSize="heading-xl">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Augue neque gravida in fermentum. Suspendisse sed nisi lacus sed viverra tellus in
              hac. Nec sagittis aliquam malesuada bibendum arcu vitae elementum. Lectus proin nibh nisl condimentum id
              venenatis. Penatibus et magnis dis parturient montes nascetur ridiculus mus mauris. Nisi porta lorem
              mollis aliquam ut porttitor leo a. Facilisi morbi tempus iaculis urna. Odio tempor orci dapibus ultrices
              in iaculis nunc. The end Ut diam quam nulla porttitor massa id neque. Duis at tellus at urna condimentum
              mattis pellentesque id nibh. Metus vulputate eu scelerisque felis imperdiet proin fermentum. Orci porta
              non pulvinar neque laoreet suspendisse interdum consectetur libero. Varius quam quisque id diam vel. Risus
              viverra adipiscing at in. Orci sagittis eu volutpat odio facilisis mauris. Mauris vitae ultricies leo
              integer malesuada nunc. Orci sagittis eu volutpat odio facilisis mauris. Mauris vitae ultricies leo
              integer malesuada nunc.
            </Box>
          </div>
        }
      />
    </ScreenshotArea>
  );
}
