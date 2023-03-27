// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { Button } from '~components';
import Alert from '~components/alert';
import AppLayout from '~components/app-layout';
import appLayoutLabels from './utils/labels';
import { Breadcrumbs, Containers } from './utils/content-blocks';
import Header from '~components/header';
import HelpPanel from '~components/help-panel';
import Link from '~components/link';
import ScreenshotArea from '../utils/screenshot-area';
import SpaceBetween from '~components/space-between';
import SplitPanel from '~components/split-panel';

export default function () {
  const [alertVisible, setVisible] = useState(true);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [toolsContent, setToolsContent] = useState('info');

  return (
    <ScreenshotArea gutters={false}>
      <AppLayout
        contentType="form"
        ariaLabels={appLayoutLabels}
        breadcrumbs={<Breadcrumbs />}
        contentHeader={
          <SpaceBetween size="m">
            <Header
              actions={<Button variant="primary">Create distribution</Button>}
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
              description="When you create an Amazon CloudFront distribution."
              variant="h1"
            >
              Create distribution
            </Header>

            {alertVisible && (
              <Alert
                dismissAriaLabel="Close alert"
                dismissible={true}
                onDismiss={() => setVisible(false)}
                statusIconAriaLabel="Info"
              >
                Demo alert
              </Alert>
            )}
          </SpaceBetween>
        }
        content={<Containers />}
        onToolsChange={({ detail }) => {
          setIsToolsOpen(detail.open);
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
            This is the Split Panel!
          </SplitPanel>
        }
        tools={
          <>
            {toolsContent === 'info' && <Info />}
            {toolsContent === 'proHelp' && <ProHelp />}
          </>
        }
        toolsOpen={isToolsOpen}
        {...{
          toolsTriggers: [
            {
              ariaExpanded: isToolsOpen,
              ariaLabel: 'View Info content',
              iconName: 'status-info',
              onClick: () => {
                setToolsContent('info');
                setIsToolsOpen(true);
              },
              selected: isToolsOpen && toolsContent === 'info',
            },
            {
              ariaExpanded: isToolsOpen,
              ariaLabel: 'View Pro Help content',
              iconSvg: <IconBriefcase />,
              onClick: () => {
                setToolsContent('proHelp');
                setIsToolsOpen(true);
              },
              selected: isToolsOpen && toolsContent === 'proHelp',
            },
          ],
        }}
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
