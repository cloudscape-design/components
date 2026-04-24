// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { render } from '@testing-library/react';

import NextDrawer from '../../../lib/components/drawer/next';
import createWrapper from '../../../lib/components/test-utils/dom';

import drawerStyles from '../../../lib/components/drawer/styles.selectors.js';
import testClasses from '../../../lib/components/drawer/test-classes/styles.selectors.js';

function renderDrawer(jsx: React.ReactElement) {
  const { container } = render(jsx);
  const drawer = createWrapper(container).findDrawer()!;
  const closeAction = drawer.findByClassName(testClasses['close-action']);
  return { drawer, closeAction };
}

test('close button is not rendered when closeAction is not set', () => {
  const { closeAction } = renderDrawer(<NextDrawer header="Title">content</NextDrawer>);
  expect(closeAction).toBeNull();
});

test('close button is rendered when closeAction is set', () => {
  const { closeAction } = renderDrawer(
    <NextDrawer header="Title" closeAction={{ ariaLabel: 'Close' }}>
      content
    </NextDrawer>
  );
  expect(closeAction).not.toBeNull();
});

test('close button is not rendered when hideCloseAction=true', () => {
  const { closeAction } = renderDrawer(
    <NextDrawer header="Title" closeAction={{ ariaLabel: 'Close' }} hideCloseAction={true}>
      content
    </NextDrawer>
  );
  expect(closeAction).toBeNull();
});

test('close button is not rendered when header is not provided', () => {
  const { closeAction } = renderDrawer(<NextDrawer closeAction={{ ariaLabel: 'Close' }}>content</NextDrawer>);
  expect(closeAction).toBeNull();
});

test('clicking close button fires onClose with method=close-action', () => {
  const onClose = jest.fn();
  const { closeAction } = renderDrawer(
    <NextDrawer header="Title" closeAction={{ ariaLabel: 'Close' }} onClose={onClose}>
      content
    </NextDrawer>
  );
  closeAction!.click();
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
