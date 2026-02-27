// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ReactNode, useContext } from 'react';
import React from 'react';

import { Box, Button } from '~components';
import ButtonGroup from '~components/button-group';
import FormField from '~components/form-field';
import Icon from '~components/icon';
import Input from '~components/input';
import SpaceBetween from '~components/space-between';

import AppContext, { AppContextType } from '../app/app-context';
import ScreenshotArea from '../utils/screenshot-area';

type PageContext = React.Context<
  AppContextType<{
    containerWidth?: string;
  }>
>;

export function CardPage({ title, children }: { title: string; children: ReactNode; settings?: ReactNode }) {
  const { urlParams, setUrlParams } = useContext(AppContext as PageContext);
  const containerWidth = urlParams.containerWidth || '400';
  return (
    <article>
      <h1>{title}</h1>
      <SpaceBetween size="s">
        <div style={{ maxInlineSize: 500 }}>
          <FormField label="Container width (px)">
            <Input
              value={containerWidth}
              onChange={({ detail }) => setUrlParams({ containerWidth: detail.value })}
              type="number"
              inputMode="numeric"
            />
          </FormField>
        </div>
        <hr />
      </SpaceBetween>
      <div style={{ maxInlineSize: parseInt(containerWidth) }}>
        <ScreenshotArea>{children}</ScreenshotArea>
      </div>
    </article>
  );
}

export const shortHeader = 'Card Header';
export const longHeader = 'This is a very long card header that might wrap to multiple lines on smaller viewports';

export const shortDescription = 'Short description';
export const longDescription =
  'This is a long description that provides more context and details about the card content.';

export const longContent =
  'This is long card content with multiple sentences. It provides more detailed information and might wrap across several lines.';

export const longFooter =
  'Long card footer with multiple sentences. It provides more detailed information and might wrap across several lines.';

export const shortFooter = 'Short card footer';

export const reactNodeContent = (
  <Box padding="xs">
    <div>This is a React Node</div>
    <Button>Test Button</Button>
  </Box>
);

export const actions = (
  <ButtonGroup
    variant="icon"
    items={[
      { type: 'icon-button', id: 'edit', iconName: 'edit', text: 'Edit' },
      { type: 'icon-button', id: 'delete', iconName: 'remove', text: 'Delete' },
    ]}
  />
);

export const icon = <Icon name="settings" />;
