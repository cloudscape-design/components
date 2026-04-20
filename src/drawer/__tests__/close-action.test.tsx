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

test('is not rendered when closeAction is not set', () => {
  const { closeAction } = renderDrawer(<NextDrawer header="Title">content</NextDrawer>);
  expect(closeAction).toBeNull();
});

test('is rendered when closeAction is set', () => {
  const { closeAction } = renderDrawer(
    <NextDrawer header="Title" closeAction={{ ariaLabel: 'Close' }}>
      content
    </NextDrawer>
  );
  expect(closeAction).not.toBeNull();
});

test('is not rendered when hideCloseAction is true', () => {
  const { closeAction } = renderDrawer(
    <NextDrawer header="Title" closeAction={{ ariaLabel: 'Close' }} hideCloseAction={true}>
      content
    </NextDrawer>
  );
  expect(closeAction).toBeNull();
});

test('is not rendered when header is not set', () => {
  const { closeAction } = renderDrawer(<NextDrawer closeAction={{ ariaLabel: 'Close' }}>content</NextDrawer>);
  expect(closeAction).toBeNull();
});

test('fires when close button is clicked', () => {
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

test('removes reserved header padding when true', () => {
  const { drawer } = renderDrawer(
    <NextDrawer header="Title" hideCloseAction={true}>
      content
    </NextDrawer>
  );
  expect(drawer.findHeader()!.getElement()).toHaveClass(drawerStyles['hide-close-action']);
});

test('does not add hide-close-action class by default', () => {
  const { drawer } = renderDrawer(<NextDrawer header="Title">content</NextDrawer>);
  expect(drawer.findHeader()!.getElement()).not.toHaveClass(drawerStyles['hide-close-action']);
});
