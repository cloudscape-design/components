// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import AppLayout from '~components/app-layout';
import Header from '~components/header';
import Link from '~components/link';
import Container from '~components/container';
import SpaceBetween from '~components/space-between';
import ScreenshotArea from '../utils/screenshot-area';
import { Breadcrumbs, Containers, Navigation, Tools, Footer } from './utils/content-blocks';
import * as toolsContent from './utils/tools-content';
import labels from './utils/labels';

export default function () {
  const [toolsOpen, setToolsOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState<keyof typeof toolsContent>('long');

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
        tools={<Tools>{toolsContent[selectedTool]}</Tools>}
        toolsOpen={toolsOpen}
        onToolsChange={({ detail }) => setToolsOpen(detail.open)}
        content={
          <>
            <div style={{ marginBottom: '1rem' }}>
              <Header
                variant="h1"
                description="Demo page with footer"
                info={
                  <Link variant="info" onFollow={() => openHelp('long')}>
                    Long help text
                  </Link>
                }
              >
                Demo page
              </Header>
            </div>
            <SpaceBetween size="l">
              <Container
                header={
                  <Header
                    variant="h2"
                    info={
                      <Link variant="info" onFollow={() => openHelp('small')}>
                        Short info text
                      </Link>
                    }
                  >
                    General details
                  </Header>
                }
              >
                <p>No general details :(</p>
              </Container>
              <Containers />
            </SpaceBetween>
          </>
        }
      />
      <Footer legacyConsoleNav={false} />
    </ScreenshotArea>
  );
}
