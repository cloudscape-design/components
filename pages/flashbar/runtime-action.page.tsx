// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import Flashbar, { FlashbarProps } from '~components/flashbar';
import Button from '~components/button';
import SpaceBetween from '~components/space-between';
import awsuiPlugins from '~components/internal/plugins';
import ScreenshotArea from '../utils/screenshot-area';
import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';

awsuiPlugins.flashbar.registerAction({
  id: 'awsui/flashbar-test-action',
  mountContent: (container, context) => {
    if (context.type !== 'error') {
      return;
    }
    render(
      <Button
        iconName="status-info"
        onClick={() => {
          alert(
            [
              'Content',
              `Type: ${context.type}`,
              `Header: ${context.headerRef.current?.textContent}`,
              `Content: ${context.contentRef.current?.textContent}`,
            ].join('\n')
          );
        }}
      >
        Runtime button
      </Button>,
      container
    );
  },
  unmountContent: container => unmountComponentAtNode(container),
});

/* eslint-disable react/jsx-key */
const permutations = createPermutations<FlashbarProps.MessageDefinition>([
  {
    dismissible: [true, false],
    header: ['Flash message'],
    content: ['Content'],
    type: ['success', 'error'],
    action: [
      null,
      <Button>Action</Button>,
      <SpaceBetween direction="horizontal" size="xs">
        <Button>Action 1</Button>
        <Button>Action 2</Button>
      </SpaceBetween>,
    ],
  },
]);
/* eslint-enable react/jsx-key */

export default function () {
  return (
    <>
      <h1>Flashbar runtime actions</h1>
      <ScreenshotArea>
        <PermutationsView
          permutations={permutations}
          render={permutation => (
            <Flashbar items={[{ ...permutation, statusIconAriaLabel: permutation.type, dismissLabel: 'Dismiss' }]} />
          )}
        />
      </ScreenshotArea>
    </>
  );
}
