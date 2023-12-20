// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import ScreenshotArea from '../utils/screenshot-area';
import Flashbar, { FlashbarProps } from '~components/flashbar';

const noop = () => void 0;

const items: FlashbarProps.MessageDefinition[] = [
  {
    header: 'This is the header',
    content: (
      <>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore
        magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
        consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
        pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
        laborum.
      </>
    ),

    dismissible: true,
    onDismiss: noop,
    statusIconAriaLabel: 'Info',
    dismissLabel: 'Dismiss',
  },
  {
    header: 'This is the second header',
    content: (
      <>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore
        magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
        consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
        pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
        laborum.
      </>
    ),

    dismissible: true,
    onDismiss: noop,
    dismissLabel: 'Dismiss',
    statusIconAriaLabel: 'Info',
    buttonText: 'Button text',
    onButtonClick: noop,
  },
];

export default function FlashbarSmallScreen() {
  return (
    <>
      <h1>Action button inside flash should stack on small screen</h1>
      <ScreenshotArea>
        <Flashbar items={items} />
      </ScreenshotArea>
    </>
  );
}
