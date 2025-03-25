// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useState } from 'react';

import { AppLayoutToolbar, Button, Header, Link, Table } from '~components';

import AppContext, { AppContextType } from '../app/app-context';
import { Breadcrumbs, Footer, Navigation, Notifications, Tools } from '../app-layout/utils/content-blocks';
import labels from '../app-layout/utils/labels';
import * as toolsContent from '../app-layout/utils/tools-content';
import { generateItems, Instance } from '../table/generate-data';
import { columnsConfig } from '../table/shared-configs';
import ScreenshotArea from '../utils/screenshot-area';

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
      <AppLayoutToolbar
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
                actions={<Button variant="primary">Create</Button>}
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
