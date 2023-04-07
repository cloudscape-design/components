// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useState } from 'react';
import AppLayout, { AppLayoutProps } from '~components/app-layout';
import SplitPanel from '~components/split-panel';
import Header from '~components/header';
import SpaceBetween from '~components/space-between';
import Toggle from '~components/toggle';
import HelpPanel from '~components/help-panel';
import { NonCancelableCustomEvent } from '~components';
import AppContext, { AppContextType } from '../app/app-context';
import ScreenshotArea from '../utils/screenshot-area';
import { Containers, Navigation, Breadcrumbs } from './utils/content-blocks';
import labels from './utils/labels';

type SplitPanelDemoContext = React.Context<
  AppContextType<{
    splitPanelPosition: AppLayoutProps.SplitPanelPreferences['position'];
    splitPanelEnabled: boolean;
    toolsEnabled: boolean;
  }>
>;

const DEMO_CONTENT = (
  <div>
    <p>
      Lorem asdasdfipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
      dolore magna aliqua. Augue neque gravida in fermentum. Suspendisse sed nisi lacus sed viverra tellus in hac. Nec
      sagittis aliquam malesuada bibendum arcu vitae elementum. Lectus proin nibh nisl condimentum id venenatis.
      Penatibus et magnis dis parturient montes nascetur ridiculus mus mauris. Nisi porta lorem mollis aliquam ut
      porttitor leo a. Facilisi morbi tempus iaculis urna. Odio tempor orci dapibus ultrices in iaculis nunc.
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
  const { urlParams, setUrlParams } = useContext(AppContext as SplitPanelDemoContext);
  const [splitPanelEnabled, setSplitPanelEnabled] = useState(urlParams.splitPanelEnabled ?? true);
  const [drawersEnabled, setDrawersEnabled] = useState(true);
  const [toolsEnabled, setToolsEnabled] = useState(true);

  const [activeDrawerId, setActiveDrawerId] = useState('security-info');

  const drawersConfig = drawersEnabled && {
    drawers: {
      items: [
        {
          trigger: {
            iconName: 'security',
          },
          ariaLabels: {
            content: 'Security information',
            closeButton: 'Close security information',
            triggerButton: 'View security information',
          },
          id: 'security-info',
          resizable: true,
          content: <HelpPanel header={<h2>Security information</h2>}></HelpPanel>,
        },
        {
          trigger: {
            iconName: 'contact',
            iconSvg: (
              <span>
                <svg id="Layer_2" data-name="Layer 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                  <path
                    fill="currentColor"
                    d="m14,.55H2c-.55,0-1,.45-1,1v10.29c0,.55.45,1,1,1h5.73l1.42,2.25c.18.29.5.47.85.47s.66-.18.85-.47l1.42-2.25h1.74c.55,0,1-.45,1-1V1.55c0-.55-.45-1-1-1ZM5,7.56v-2s1.99,0,1.99,0v2.01s-1.99,0-1.99,0Zm4,0v-2s1.99,0,1.99,0v2.01s-1.99,0-1.99,0Z"
                  />
                </svg>
              </span>
            ),
          },
          ariaLabels: {
            content: 'Ask AWS',
            closeButton: 'Close Ask AWS',
            triggerButton: 'View Ask AWS panel',
          },

          id: 'contact',
          content: <HelpPanel header={<h2>Ask AWS</h2>}></HelpPanel>,
          resizable: true,
        },
      ],
      activeDrawerId,
      onChange: (event: NonCancelableCustomEvent<string>) => setActiveDrawerId(event.detail),
    },
  };

  const toolsConfig = toolsEnabled && {
    tools: <HelpPanel header={<h2>Just tools</h2>}></HelpPanel>,
  };

  return (
    <ScreenshotArea gutters={false}>
      <AppLayout
        ariaLabels={labels}
        breadcrumbs={<Breadcrumbs />}
        navigation={<Navigation />}
        splitPanelPreferences={{
          position: urlParams.splitPanelPosition,
        }}
        onSplitPanelPreferencesChange={event => {
          const { position } = event.detail;
          setUrlParams({ splitPanelPosition: position === 'side' ? position : undefined });
        }}
        splitPanel={
          splitPanelEnabled && (
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
          )
        }
        content={
          <>
            <div style={{ marginBottom: '1rem' }}>
              <Header variant="h1" description="Basic demo with split panel">
                Demo page
              </Header>
            </div>
            <SpaceBetween size="l">
              <Toggle
                id="enable-split-panel"
                checked={splitPanelEnabled}
                onChange={e => {
                  setSplitPanelEnabled(e.detail.checked);
                  setUrlParams({ splitPanelEnabled: e.detail.checked });
                }}
              >
                Enable split panel
              </Toggle>
              <Toggle
                id="enable-drawers"
                checked={drawersEnabled}
                onChange={e => {
                  setDrawersEnabled(e.detail.checked);
                }}
              >
                Drawers
              </Toggle>
              <Toggle
                id="enable-tools"
                checked={toolsEnabled}
                onChange={e => {
                  setToolsEnabled(e.detail.checked);
                }}
              >
                Tools
              </Toggle>
              <Containers />
            </SpaceBetween>
          </>
        }
        toolsHide={!toolsEnabled}
        {...drawersConfig}
        {...toolsConfig}
      />
    </ScreenshotArea>
  );
}
