// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import range from 'lodash/range';

import { Toggle } from '~components';
import AppLayout from '~components/app-layout';
import SideNavigation from '~components/side-navigation';
import SplitPanel from '~components/split-panel';

import { Breadcrumbs, Footer, Tools } from './utils/content-blocks';
import labels from './utils/labels';
import * as toolsContent from './utils/tools-content';

const DEMO_CONTENT = (
  <div>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
    aliqua. Augue neque gravida in fermentum. Suspendisse sed nisi lacus sed viverra tellus in hac. Nec sagittis aliquam
    malesuada bibendum arcu vitae elementum. Lectus proin nibh nisl condimentum id venenatis. Penatibus et magnis dis
    parturient montes nascetur ridiculus mus mauris. Nisi porta lorem mollis aliquam ut porttitor leo a. Facilisi morbi
    tempus iaculis urna. Odio tempor orci dapibus ultrices in iaculis nunc. Ut diam quam nulla porttitor massa id neque.
    Duis at tellus at urna condimentum mattis pellentesque id nibh. Metus vulputate eu scelerisque felis imperdiet proin
    fermentum. Orci porta non pulvinar neque laoreet suspendisse interdum consectetur libero. Varius quam quisque id
    diam vel. Risus viverra adipiscing at in. Orci sagittis eu volutpat odio facilisis mauris. Mauris vitae ultricies
    leo integer malesuada nunc. Sem et tortor consequat id porta nibh. Semper auctor neque vitae tempus quam
    pellentesque. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
    dolore magna aliqua. Augue neque gravida in fermentum. Suspendisse sed nisi lacus sed viverra tellus in hac. Nec
    sagittis aliquam malesuada bibendum arcu vitae elementum. Lectus proin nibh nisl condimentum id venenatis. Penatibus
    et magnis dis parturient montes nascetur ridiculus mus mauris. Nisi porta lorem mollis aliquam ut porttitor leo a.
    Facilisi morbi tempus iaculis urna. Odio tempor orci dapibus ultrices in iaculis nunc. Ut diam quam nulla porttitor
    massa id neque. Duis at tellus at urna condimentum mattis pellentesque id nibh. Metus vulputate eu scelerisque felis
    imperdiet proin fermentum. Orci porta non pulvinar neque laoreet suspendisse interdum consectetur libero. Varius
    quam quisque id diam vel. Risus viverra adipiscing at in. Orci sagittis eu volutpat odio facilisis mauris. Mauris
    vitae ultricies leo integer malesuada nunc. Sem et tortor consequat id porta nibh. Semper auctor neque vitae tempus
    quam pellentesque.
  </div>
);

export default function () {
  const [splitPanelOpen, setSplitPanelOpen] = useState(false);
  const [withContent, setWithContent] = useState(false);

  return (
    <>
      <AppLayout
        ariaLabels={labels}
        breadcrumbs={<Breadcrumbs />}
        navigation={
          <SideNavigation
            header={{
              href: '#',
              text: 'Service name',
            }}
            items={range(3).map(i => ({ type: 'link', text: `Navigation #${i + 1}`, href: `#item-${i}` }))}
          />
        }
        tools={<Tools>{toolsContent.long}</Tools>}
        disableContentPaddings={true}
        splitPanelOpen={splitPanelOpen}
        onSplitPanelToggle={e => setSplitPanelOpen(e.detail.open)}
        splitPanelPreferences={{
          position: 'side',
        }}
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
            <Toggle checked={withContent} onChange={({ detail }) => setWithContent(detail.checked)}>
              With content
            </Toggle>
          </SplitPanel>
        }
        content={<div style={{ backgroundColor: 'pink', minHeight: 500 }}>{withContent && DEMO_CONTENT}</div>}
      />
      <Footer legacyConsoleNav={false} />
    </>
  );
}
