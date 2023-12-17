// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
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
import SplitPanel from '~components/split-panel';
import SpaceBetween from '~components/space-between';

const maxItemCount = 30;
const defaultItems = generateItems(maxItemCount);

const DEMO_CONTENT = (
  <div>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
      magna aliqua. Augue neque gravida in fermentum. Suspendisse sed nisi lacus sed viverra tellus in hac. Nec sagittis
      aliquam malesuada bibendum arcu vitae elementum. Lectus proin nibh nisl condimentum id venenatis. Penatibus et
      magnis dis parturient montes nascetur ridiculus mus mauris. Nisi porta lorem mollis aliquam ut porttitor leo a.
      Facilisi morbi tempus iaculis urna. Odio tempor orci dapibus ultrices in iaculis nunc.
    </p>
    <Table<Instance>
      header={
        <Header headingTagOverride="h1" counter="10">
          Table Example In Split panel
        </Header>
      }
      columnDefinitions={columnsConfig}
      items={defaultItems.slice(0, 10)}
      variant="embedded"
    />
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
  const [toolsOpen, setToolsOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState<keyof typeof toolsContent>('long');
  const [itemSizeToDisplay, setItemSizeToDisplay] = useState(maxItemCount);
  const [splitPanelOpen, setSplitPanelOpen] = useState(false);

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
                  <SpaceBetween size="xs" direction="horizontal">
                    <Button data-testid="set-item-count-to-1" onClick={() => setItemSizeToDisplay(1)}>
                      Set item count to 1
                    </Button>
                    <Button data-testid="set-item-count-to-30" onClick={() => setItemSizeToDisplay(maxItemCount)}>
                      Set item count to {maxItemCount}
                    </Button>
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
                      Ludicrous mode
                    </Button>
                  </SpaceBetween>
                }
              >
                Sticky scrollbar example
              </Header>
            }
            stickyHeader={true}
            variant="full-page"
            columnDefinitions={columnsConfig}
            items={defaultItems.slice(0, itemSizeToDisplay)}
          />
        }
        splitPanelOpen={splitPanelOpen}
        onSplitPanelToggle={({ detail }) => {
          setSplitPanelOpen(detail.open);
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
            {splitPanelOpen && DEMO_CONTENT}
          </SplitPanel>
        }
      />
      <Footer legacyConsoleNav={false} />
    </ScreenshotArea>
  );
}
