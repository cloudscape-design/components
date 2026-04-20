// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { render } from '@testing-library/react';

import NextDrawer from '../../../lib/components/drawer/next';
import createWrapper from '../../../lib/components/test-utils/dom';

import drawerStyles from '../../../lib/components/drawer/styles.selectors.js';

function renderDrawer(jsx: React.ReactElement) {
  const { container } = render(jsx);
  return createWrapper(container).findDrawer()!;
}

test('is not rendered when closeAction is not set', () => {
  const wrapper = renderDrawer(<NextDrawer header="Title">content</NextDrawer>);
  expect(wrapper.findCloseAction()).toBeNull();
});

test('is rendered when closeAction is set', () => {
  const wrapper = renderDrawer(
    <NextDrawer header="Title" closeAction={{ ariaLabel: 'Close' }}>
      content
    </NextDrawer>
  );
  expect(wrapper.findCloseAction()).not.toBeNull();
});

test('is not rendered when hideCloseAction is true', () => {
  const wrapper = renderDrawer(
    <NextDrawer header="Title" closeAction={{ ariaLabel: 'Close' }} hideCloseAction={true}>
      content
    </NextDrawer>
  );
  expect(wrapper.findCloseAction()).toBeNull();
});

test('is not rendered when header is not set', () => {
  const wrapper = renderDrawer(<NextDrawer closeAction={{ ariaLabel: 'Close' }}>content</NextDrawer>);
  expect(wrapper.findCloseAction()).toBeNull();
});

test('fires when close button is clicked', () => {
  const onClose = jest.fn();
  const wrapper = renderDrawer(
    <NextDrawer header="Title" closeAction={{ ariaLabel: 'Close' }} onClose={onClose}>
      content
    </NextDrawer>
  );
  wrapper.findCloseAction()!.click();
  expect(onClose).toHaveBeenCalledTimes(1);
  expect(onClose).toHaveBeenCalledWith(expect.objectContaining({ detail: { method: 'close-action' } }));
});

test('removes reserved header padding when true', () => {
  const wrapper = renderDrawer(
    <NextDrawer header="Title" hideCloseAction={true}>
      content
    </NextDrawer>
  );
  expect(wrapper.findHeader()!.getElement()).toHaveClass(drawerStyles['hide-close-action']);
});

test('does not add hide-close-action class by default', () => {
  const wrapper = renderDrawer(<NextDrawer header="Title">content</NextDrawer>);
  expect(wrapper.findHeader()!.getElement()).not.toHaveClass(drawerStyles['hide-close-action']);
});
