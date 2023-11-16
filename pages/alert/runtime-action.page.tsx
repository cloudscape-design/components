// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import Alert, { AlertProps } from '~components/alert';
import Button from '~components/button';
import SpaceBetween from '~components/space-between';
import awsuiPlugins from '~components/internal/plugins';
import ScreenshotArea from '../utils/screenshot-area';
import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';

awsuiPlugins.alert.registerAction({
  id: 'awsui/alert-test-action',
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
const permutations = createPermutations<AlertProps>([
  {
    dismissible: [true, false],
    header: ['Alert'],
    children: ['Content'],
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
      <h1>Alert runtime actions</h1>
      <ScreenshotArea>
        <PermutationsView
          permutations={permutations}
          render={permutation => (
            <Alert statusIconAriaLabel={permutation.type} dismissAriaLabel="Dismiss" {...permutation} />
          )}
        />
      </ScreenshotArea>
    </>
  );
}
