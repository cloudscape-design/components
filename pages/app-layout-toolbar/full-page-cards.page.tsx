// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import range from 'lodash/range';

import { AppLayoutToolbar } from '~components';
import Button from '~components/button';
import Cards, { CardsProps } from '~components/cards';
import Header from '~components/header';
import Link from '~components/link';

import * as toolsContent from '../app-layout//utils/tools-content';
import { Breadcrumbs, Navigation, Notifications, Tools } from '../app-layout/utils/content-blocks';
import labels from '../app-layout/utils/labels';
import ScreenshotArea from '../utils/screenshot-area';

interface Item {
  number: number;
  text: string;
}

function createSimpleItems(count: number) {
  const texts = ['One', 'Two', 'Three', 'Four', 'Five'];
  return range(count).map(number => ({ number, text: texts[number % texts.length] }));
}

const cardDefinition: CardsProps.CardDefinition<Item> = {
  header: item => item.text,
  sections: [
    {
      id: 'description',
      header: 'Number',
      content: item => item.number,
    },
    {
      id: 'type',
      header: 'Text',
      content: item => item.text,
    },
  ],
};

const config: CardsProps['cardsPerRow'] = [
  {
    cards: 1,
  },
  {
    minWidth: 400,
    cards: 2,
  },
  {
    cards: 3,
    minWidth: 700,
  },
  {
    cards: 4,
    minWidth: 1000,
  },
];

const items = createSimpleItems(16);

export default function () {
  const [toolsOpen, setToolsOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState<keyof typeof toolsContent>('long');

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
        contentType="cards"
        tools={<Tools>{toolsContent[selectedTool]}</Tools>}
        toolsOpen={toolsOpen}
        onToolsChange={({ detail }) => setToolsOpen(detail.open)}
        notifications={<Notifications />}
        content={
          <Cards<Item>
            items={items}
            cardDefinition={cardDefinition}
            stickyHeader={true}
            variant="full-page"
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
            cardsPerRow={config}
          />
        }
      />
    </ScreenshotArea>
  );
}
