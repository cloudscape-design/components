// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import AppLayout, { AppLayoutProps } from '~components/app-layout';
import Box from '~components/box';
import Button from '~components/button';
import SpaceBetween from '~components/space-between';

import { Breadcrumbs, Navigation, Tools } from './utils/content-blocks';
import labels from './utils/labels';
import * as toolsContent from './utils/tools-content';
import ContentType = AppLayoutProps.ContentType;
import ScreenshotArea from '../utils/screenshot-area';

import styles from './styles.scss';

export default function () {
  const [maxContentWidth, setMaxContentWidth] = useState<number | undefined>(undefined);
  const [contentType, setContentType] = useState<ContentType | undefined>(undefined);
  const [drawersOpen, setDrawersOpen] = useState<boolean>(false);

  return (
    <ScreenshotArea gutters={false}>
      <AppLayout
        ariaLabels={labels}
        navigation={<Navigation />}
        tools={<Tools>{toolsContent.long}</Tools>}
        contentType={contentType}
        navigationOpen={drawersOpen}
        toolsOpen={drawersOpen}
        breadcrumbs={<Breadcrumbs />}
        maxContentWidth={maxContentWidth}
        content={
          <div className={styles.highlightBorder} data-test-id="content">
            <Box variant="h1">Demo page for layout types in visual refresh</Box>
            <SpaceBetween size={'l'}>
              <Button
                data-test-id="button_width-400"
                onClick={() => {
                  setMaxContentWidth(400);
                }}
              >
                Set content width to 400
              </Button>
              <Button
                data-test-id="button_width-number-max_value"
                onClick={() => {
                  setMaxContentWidth(Number.MAX_VALUE);
                }}
              >
                Set content width to Number.MAX_VALUE
              </Button>
              <Button
                data-test-id="button_width-undef"
                onClick={() => {
                  setMaxContentWidth(undefined);
                }}
              >
                Set content width to undef
              </Button>
              <Button
                data-test-id="button_type-default"
                onClick={() => {
                  setContentType('default');
                }}
              >
                Set content type to default
              </Button>
              <Button
                data-test-id="button_type-cards"
                onClick={() => {
                  setContentType('cards');
                }}
              >
                Set content type to cards
              </Button>
              <Button
                data-test-id="button_type-table"
                onClick={() => {
                  setContentType('table');
                }}
              >
                Set content type to table
              </Button>
              <Button
                data-test-id="button_type-form"
                onClick={() => {
                  setContentType('form');
                }}
              >
                Set content type to form
              </Button>
              <Button
                data-test-id="button_type-wizard"
                onClick={() => {
                  setContentType('wizard');
                }}
              >
                Set content type to wizard
              </Button>
              <Button
                data-test-id="button_set-drawers-open"
                onClick={() => {
                  setDrawersOpen(true);
                }}
              >
                Set drawers open
              </Button>
            </SpaceBetween>
          </div>
        }
      />
    </ScreenshotArea>
  );
}
