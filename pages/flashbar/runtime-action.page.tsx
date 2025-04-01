// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';

import Button from '~components/button';
import Flashbar, { FlashbarProps } from '~components/flashbar';
import awsuiPlugins from '~components/internal/plugins';
import SpaceBetween from '~components/space-between';

import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';

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

const multilinetext = (
  <>
    <p>Text on multiple lines</p>
    <p>Lorem ipsum dolor sit amet,consectetur adipisicing elit, sed do eiusmod tempor</p>
    <p>incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis</p>
    <p>nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
  </>
);

const longText = (
  <>
    One long line of text that should wrap. Lorem ipsum dolor sit amet,consectetur adipisicing elit, sed do eiusmod
    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
    laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit cillum dolore eu fugiat
    nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
    est laborum.
  </>
);

const longTextWithUnbreakableWord = (
  <>
    One long line of text that should wrap, with a very long word. Lorem ipsum dolor sit amet,consectetur adipisicing
    elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
    exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
    reprehenderitinvoluptatevelitessereprehenderitinvoluptatevelitessereprehenderitinvoluptatevelitessereprehenderitinvoluptatevelitesse
    cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
    deserunt mollit anim id est laborum.
  </>
);

/* eslint-disable react/jsx-key */
const permutations = createPermutations<FlashbarProps.MessageDefinition>([
  {
    dismissible: [true, false],
    header: ['Flash message'],
    content: ['Content', multilinetext, longText, longTextWithUnbreakableWord],
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
