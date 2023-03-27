// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { AppLayout, Header, HelpPanel, Link, SegmentedControl, SpaceBetween, SplitPanel } from '~components';
import appLayoutLabels from './utils/labels';
import { Breadcrumbs, Containers } from './utils/content-blocks';
import ScreenshotArea from '../utils/screenshot-area';

export default function () {
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [toolsContent, setToolsContent] = useState('info');
  const [triggerStatus, setTriggerStatus] = useState('custom-triggers');
  const [splitPanelStatus, setSplitPanelStatus] = useState('show-split-panel');

  const customTriggers =
    triggerStatus !== 'custom-triggers'
      ? null
      : {
          toolsTriggers: [
            {
              ariaExpanded: isToolsOpen,
              ariaLabel: 'View Info content',
              iconName: 'status-info',

              onClick: () => {
                if (isToolsOpen && toolsContent === 'info') {
                  setIsToolsOpen(false);
                } else {
                  setToolsContent('info');
                  setIsToolsOpen(true);
                }
              },
              selected: isToolsOpen && toolsContent === 'info',
            },
            {
              ariaExpanded: isToolsOpen,
              ariaLabel: 'View Pro Help content',
              iconSvg: <IconBriefcase />,
              onClick: () => {
                if (isToolsOpen && toolsContent === 'proHelp') {
                  setIsToolsOpen(false);
                } else {
                  setToolsContent('proHelp');
                  setIsToolsOpen(true);
                }
              },
              selected: isToolsOpen && toolsContent === 'proHelp',
            },
          ],
        };

  return (
    <ScreenshotArea gutters={false}>
      <AppLayout
        contentType="form"
        ariaLabels={appLayoutLabels}
        breadcrumbs={<Breadcrumbs />}
        contentHeader={
          <SpaceBetween size="m">
            <Header
              info={
                <Link
                  onFollow={() => {
                    setToolsContent('info');
                    setIsToolsOpen(true);
                  }}
                >
                  Info
                </Link>
              }
              description="Sometimes you need custom triggers to get the job done."
              variant="h1"
            >
              Custom Trigger Testing!
            </Header>

            <SegmentedControl
              label="Trigger Status"
              onChange={({ detail }) => setTriggerStatus(detail.selectedId)}
              options={[
                { text: 'Custom Triggers', id: 'custom-triggers' },
                { text: 'Default Trigger', id: 'default-trigger' },
                { text: 'Hide Tools', id: 'hide-tools' },
              ]}
              selectedId={triggerStatus}
            />

            <SegmentedControl
              label="Split Panel Status"
              onChange={({ detail }) => setSplitPanelStatus(detail.selectedId)}
              options={[
                { text: 'Show SplitPanel', id: 'show-split-panel' },
                { text: 'Hide SplitPanel', id: 'hide-split-panel' },
              ]}
              selectedId={splitPanelStatus}
            />
          </SpaceBetween>
        }
        content={<Containers />}
        onToolsChange={({ detail }) => {
          setIsToolsOpen(detail.open);
        }}
        splitPanelPreferences={{
          position: 'side',
        }}
        splitPanel={
          splitPanelStatus === 'show-split-panel' && (
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
          )
        }
        tools={
          <>
            {toolsContent === 'info' && <Info />}
            {toolsContent === 'proHelp' && <ProHelp />}
          </>
        }
        toolsHide={triggerStatus === 'hide-tools' ? true : false}
        toolsOpen={isToolsOpen}
        {...customTriggers}
      />
    </ScreenshotArea>
  );
}

function Info() {
  return <HelpPanel header={<h2>Info</h2>}>Here is some info for you!</HelpPanel>;
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

function ProHelp() {
  return <HelpPanel header={<h2>Pro Help</h2>}>Need some Pro Help? We got you.</HelpPanel>;
}
