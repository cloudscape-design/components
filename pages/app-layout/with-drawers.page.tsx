// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import {
  AppLayout,
  ContentLayout,
  Header,
  HelpPanel,
  NonCancelableCustomEvent,
  SpaceBetween,
  SplitPanel,
  Toggle,
} from '~components';
import { Breadcrumbs, Containers } from './utils/content-blocks';
import ScreenshotArea from '../utils/screenshot-area';

export default function WithDrawers() {
  const [activeDrawerId, setActiveDrawerId] = useState<string | null>(null);
  const [useDrawers, setUseDrawers] = useState(true);
  const [useTools, setUseTools] = useState(true);

  const drawers = !useDrawers
    ? null
    : {
        drawers: {
          activeDrawerId: activeDrawerId,
          items: [
            /*
            {
              content: <Security />,
              id: 'security',
              trigger: {
                ariaLabel: 'View Security content',
                iconName: 'security',
              },
            },
            */
            {
              content: <ProHelp />,
              id: 'pro-help',
              trigger: {
                ariaLabel: 'View ProHelp content',
                iconSvg: <IconBriefcase />,
              },
            },
          ],
          onChange: (event: NonCancelableCustomEvent<string>) => setActiveDrawerId(event.detail),
        },
      };

  return (
    <ScreenshotArea gutters={false}>
      <AppLayout
        breadcrumbs={<Breadcrumbs />}
        content={
          <ContentLayout
            header={
              <SpaceBetween size="m">
                <Header variant="h1" description="Sometimes you need custom drawers to get the job done.">
                  Testing Custom Drawers!
                </Header>

                <SpaceBetween size="xs">
                  <Toggle checked={useTools} onChange={({ detail }) => setUseTools(detail.checked)}>
                    Use Tools
                  </Toggle>

                  <Toggle checked={useDrawers} onChange={({ detail }) => setUseDrawers(detail.checked)}>
                    Use Drawers
                  </Toggle>
                </SpaceBetween>
              </SpaceBetween>
            }
          >
            <Containers />
          </ContentLayout>
        }
        contentType="form"
        maxContentWidth={999999999999999}
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
            This is the Split Panel!
          </SplitPanel>
        }
        tools={<Info />}
        toolsHide={!useTools}
        {...drawers}
      />
    </ScreenshotArea>
  );
}

function IconBriefcase() {
  return (
    <svg viewBox="0 0 16 16" fill="none">
      <path
        d="M8 15H1V5h14v3m-6.5 4.25H16M12.25 8.5V16M5 1h6v4H5V1Z"
        stroke="#fff"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Info() {
  return <HelpPanel header={<h2>Info</h2>}>Here is some info for you!</HelpPanel>;
}

/*
function Security() {
  return <HelpPanel header={<h2>Security</h2>}>Keep your passwords secret!</HelpPanel>;
}
*/

function ProHelp() {
  return <HelpPanel header={<h2>Pro Help</h2>}>Need some Pro Help? We got you.</HelpPanel>;
}
