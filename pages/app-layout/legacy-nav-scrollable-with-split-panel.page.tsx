// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import AppLayout from '~components/app-layout';
import SplitPanel from '~components/split-panel';
import Header from '~components/header';
import ScreenshotArea from '../utils/screenshot-area';
import { Containers, Navigation, Tools, Breadcrumbs, Footer } from './utils/content-blocks';
import * as toolsContent from './utils/tools-content';
import labels from './utils/labels';

const DEMO_CONTENT = (
  <div>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
      magna aliqua. Augue neque gravida in fermentum. Suspendisse sed nisi lacus sed viverra tellus in hac. Nec sagittis
      aliquam malesuada bibendum arcu vitae elementum. Lectus proin nibh nisl condimentum id venenatis. Penatibus et
      magnis dis parturient montes nascetur ridiculus mus mauris. Nisi porta lorem mollis aliquam ut porttitor leo a.
      Facilisi morbi tempus iaculis urna. Odio tempor orci dapibus ultrices in iaculis nunc.
    </p>
    <p>
      Ut diam quam nulla porttitor massa id neque. Duis at tellus at urna condimentum mattis pellentesque id nibh. Metus
      vulputate eu scelerisque felis imperdiet proin fermentum.
    </p>
    <p>
      Orci porta non pulvinar neque laoreet suspendisse interdum consectetur libero. Varius quam quisque id diam vel.
      Risus viverra adipiscing at in. Orci sagittis eu volutpat odio facilisis mauris. Mauris vitae ultricies leo
      integer malesuada nunc. Sem et tortor consequat id porta nibh. Semper auctor neque vitae tempus quam pellentesque.
    </p>
    <p>Ante in nibh mauris cursus mattis molestie.</p>
    <p>
      Pharetra et ultrices neque ornare. Bibendum neque egestas congue quisque egestas diam in arcu cursus. Porttitor
      eget dolor morbi non arcu risus quis. Integer quis auctor elit sed vulputate mi sit. Mauris nunc congue nisi vitae
      suscipit tellus mauris a diam. Diam donec adipiscing tristique risus nec feugiat in. Arcu felis bibendum ut
      tristique et egestas quis. Nulla porttitor massa id neque aliquam vestibulum morbi blandit. In hac habitasse
      platea dictumst quisque sagittis. Sollicitudin tempor id eu nisl nunc mi ipsum. Ornare aenean euismod elementum
      nisi quis. Elementum curabitur vitae nunc sed velit dignissim sodales. Amet tellus cras adipiscing enim eu. Id
      interdum velit laoreet id donec ultrices tincidunt. Ullamcorper eget nulla facilisi etiam. Sodales neque sodales
      ut etiam sit amet nisl purus. Auctor urna nunc id cursus metus aliquam eleifend mi in. Urna condimentum mattis
      pellentesque id. Porta lorem mollis aliquam ut porttitor leo a. Lectus quam id leo in vitae turpis massa sed.
      Pharetra pharetra massa massa ultricies mi.
    </p>
  </div>
);

export default function () {
  const [splitPanelOpen, setSplitPanelOpen] = useState(true);

  return (
    <ScreenshotArea gutters={false}>
      <AppLayout
        disableBodyScroll={true}
        ariaLabels={labels}
        breadcrumbs={<Breadcrumbs />}
        navigation={<Navigation />}
        tools={<Tools>{toolsContent.long}</Tools>}
        splitPanelOpen={splitPanelOpen}
        onSplitPanelToggle={event => setSplitPanelOpen(event.detail.open)}
        splitPanel={
          <SplitPanel
            header="Split panel header"
            i18nStrings={{
              preferencesTitle: 'Preferences',
              preferencesPositionLabel: 'Split panel position',
              preferencesPositionDescription: 'Choose the default split panel position for the service.',
              preferencesPositionSide: 'Side',
              preferencesPositionBottom: 'Bottom',
              preferencesConfirm: 'Confirm',
              preferencesCancel: 'Cancel',
              closeButtonAriaLabel: 'Close panel',
              openButtonAriaLabel: 'Open panel',
              resizeHandleAriaLabel: 'Slider',
            }}
          >
            {DEMO_CONTENT}
          </SplitPanel>
        }
        content={
          <>
            <div style={{ marginBlockEnd: '1rem' }}>
              <Header variant="h1" description="Basic demo with split panel">
                Demo page
              </Header>
            </div>
            <Containers />
          </>
        }
      />
      <Footer legacyConsoleNav={true} />
    </ScreenshotArea>
  );
}
