// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useState } from 'react';
import AppLayout from '~components/app-layout';
import Header from '~components/header';
import Link from '~components/link';
import ScreenshotArea from '../utils/screenshot-area';
import { Breadcrumbs, Navigation, Tools, Footer, Notifications } from './utils/content-blocks';
import * as toolsContent from './utils/tools-content';
import labels from './utils/labels';
import Table from '~components/table';
import { generateItems, Instance } from '../table/generate-data';
import { columnsConfig } from '../table/shared-configs';
import Button from '~components/button';
import AppContext, { AppContextType } from '../app/app-context';

type PageContext = React.Context<AppContextType<{ stickyNotifications: boolean }>>;

const items = generateItems(20);

export default function () {
  const [toolsOpen, setToolsOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState<keyof typeof toolsContent>('long');
  const { urlParams } = useContext(AppContext as PageContext);

  function openHelp(article: keyof typeof toolsContent) {
    setToolsOpen(true);
    setSelectedTool(article);
  }

  return (
    <ScreenshotArea gutters={false}>
      <AppLayout
        ariaLabels={labels}
        breadcrumbs={<Breadcrumbs />}
        navigation={<Navigation />}
        contentType="table"
        tools={<Tools>{toolsContent[selectedTool]}</Tools>}
        toolsOpen={toolsOpen}
        onToolsChange={({ detail }) => setToolsOpen(detail.open)}
        notifications={<Notifications />}
        stickyNotifications={urlParams.stickyNotifications}
        content={
          <Table<Instance>
            header={
              <Header
                variant="awsui-h1-sticky"
                description="Demo page with footer"
                info={
                  <Link variant="info" onFollow={() => openHelp('long')}>
                    Long help text
                  </Link>
                }
                actions={
                  <Button
                    onClick={() => {
                      document.body.setAttribute('data-user-settings-layout-notifications-position', 'bottom-right');
                      document.body.setAttribute('data-user-settings-layout-width', 'full-width');
                      document.body.setAttribute('data-user-settings-accessibility-links', 'no-underline');
                      document.body.setAttribute('data-user-settings-theme-high-contrast-header', 'disabled');
                      document.body.setAttribute('data-user-settings-customization-toggle-navigation-modifier', 'n');
                      document.body.setAttribute('data-user-settings-customization-toggle-tools-modifier', 't');
                      document.body.setAttribute(
                        'data-user-settings-customization-toggle-stacked-flashbar-modifier',
                        'f'
                      );
                      document.body.setAttribute('data-user-settings-customization-toggle-split-panel-modifier', 's');
                    }}
                    variant="primary"
                  >
                    This is wild
                  </Button>
                }
              >
                Sticky Scrollbar Example
              </Header>
            }
            stickyHeader={true}
            variant="full-page"
            columnDefinitions={columnsConfig}
            items={items}
          />
        }
      />
      <Footer legacyConsoleNav={false} />
    </ScreenshotArea>
  );
}
