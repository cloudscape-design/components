// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import NextDrawer from '../../../lib/components/drawer/next';
import { renderDrawer } from './shared';

import drawerStyles from '../../../lib/components/drawer/styles.selectors.js';

test('close button is not rendered when closeAction is not set', () => {
  const { drawer } = renderDrawer(<NextDrawer header="Title">content</NextDrawer>);
  expect(drawer.findCloseAction()).toBeNull();
});

test('close button is rendered when closeAction is set', () => {
  const { drawer } = renderDrawer(
    <NextDrawer header="Title" closeAction={{ ariaLabel: 'Close' }}>
      content
    </NextDrawer>
  );
  expect(drawer.findCloseAction()).not.toBeNull();
});

test('close button is not rendered when hideCloseAction=true', () => {
  const { drawer } = renderDrawer(
    <NextDrawer header="Title" closeAction={{ ariaLabel: 'Close' }} hideCloseAction={true}>
      content
    </NextDrawer>
  );
  expect(drawer.findCloseAction()).toBeNull();
});

test('close button is not rendered when header is not provided', () => {
  const { drawer } = renderDrawer(<NextDrawer closeAction={{ ariaLabel: 'Close' }}>content</NextDrawer>);
  expect(drawer.findCloseAction()).toBeNull();
});

test('clicking close button fires onClose with method=close-action', () => {
  const onClose = jest.fn();
  const { drawer } = renderDrawer(
    <NextDrawer header="Title" closeAction={{ ariaLabel: 'Close' }} onClose={onClose}>
      content
    </NextDrawer>
  );
  drawer.findCloseAction()!.click();
  expect(onClose).toHaveBeenCalledTimes(1);
  expect(onClose).toHaveBeenCalledWith(expect.objectContaining({ detail: { method: 'close-action' } }));
});

test('hideCloseAction=true removes reserved header padding', () => {
  const { drawer } = renderDrawer(
    <NextDrawer header="Title" hideCloseAction={true}>
      content
    </NextDrawer>
  );
  expect(drawer.findHeader()!.getElement()).toHaveClass(drawerStyles['hide-close-action']);
});

test('header padding is not removed when hideCloseAction is not set', () => {
  const { drawer } = renderDrawer(<NextDrawer header="Title">content</NextDrawer>);
  expect(drawer.findHeader()!.getElement()).not.toHaveClass(drawerStyles['hide-close-action']);
});
