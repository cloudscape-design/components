// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import {
  AppLayout,
  ContentLayout,
  Form,
  FormField,
  Header,
  HelpPanel,
  Input,
  NonCancelableCustomEvent,
  SpaceBetween,
  SplitPanel,
  Toggle,
} from '~components';
import appLayoutLabels from './utils/labels';
import { Breadcrumbs, Containers } from './utils/content-blocks';
import ScreenshotArea from '../utils/screenshot-area';

export default function WithDrawers() {
  const [activeDrawerId, setActiveDrawerId] = useState<string | null>(null);
  const [hasDrawers, setHasDrawers] = useState(true);
  const [hasTools, setHasTools] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);

  const [widths, setWidths] = useState<{ [id: string]: number }>({
    'cloudscape-help': 600,
  });

  const drawers = !hasDrawers
    ? null
    : {
        drawers: {
          ariaLabel: 'Drawers',
          activeDrawerId: activeDrawerId,
          onResize: (event: NonCancelableCustomEvent<{ size: number; id: string }>) => {
            setWidths({ ...widths, [event.detail.id]: event.detail.size });
          },
          items: [
            {
              ariaLabels: {
                closeButton: 'Cloudscape Assistant close button',
                content: 'Cloudscape Assistant drawer content',
                triggerButton: 'Cloudscape Assistant trigger button',
                resizeHandle: 'Cloudscape Assistant resize handle',
              },
              content: <CloudscapeAssistant />,
              id: 'cloudscape-help',
              trigger: {
                iconName: 'contact',
              },
            },
          ],
          onChange: (event: NonCancelableCustomEvent<string>) => {
            setActiveDrawerId(event.detail);
          },
        },
      };

  return (
    <ScreenshotArea gutters={false}>
      <AppLayout
        ariaLabels={appLayoutLabels}
        breadcrumbs={<Breadcrumbs />}
        content={
          <ContentLayout
            header={
              <SpaceBetween size="m">
                <Header variant="h1" description="Sometimes you need custom drawers to get the job done.">
                  Testing Custom Drawers!
                </Header>

                <SpaceBetween size="xs">
                  <Toggle
                    checked={hasTools}
                    onChange={({ detail }) => setHasTools(detail.checked)}
                    data-id="toggle-tools"
                  >
                    Has Tools
                  </Toggle>

                  <Toggle
                    checked={hasDrawers}
                    onChange={({ detail }) => setHasDrawers(detail.checked)}
                    data-id="toggle-drawers"
                  >
                    Has Drawers
                  </Toggle>
                </SpaceBetween>
              </SpaceBetween>
            }
          >
            <Containers />
          </ContentLayout>
        }
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
        onToolsChange={event => {
          setIsToolsOpen(event.detail.open);
        }}
        tools={<Info />}
        toolsOpen={isToolsOpen}
        toolsHide={!hasTools}
        {...drawers}
      />
    </ScreenshotArea>
  );
}

function Info() {
  return <HelpPanel header={<h2>Info</h2>}>Here is some info for you!</HelpPanel>;
}

function CloudscapeAssistant() {
  const [value, setValue] = useState('');

  return (
    <HelpPanel header={<h2>My Assistant</h2>}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1 }}></div>
        <div style={{ position: 'absolute', bottom: '24px' }}>
          <Form>
            <FormField stretch={true}>
              <Input
                placeholder="Ask me anything"
                value={value}
                onChange={event => setValue(event.detail.value)}
                type="search"
              />
            </FormField>
          </Form>
        </div>
      </div>
    </HelpPanel>
  );
}
