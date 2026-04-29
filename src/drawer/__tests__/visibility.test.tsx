// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { render } from '@testing-library/react';

import NextDrawer from '../../../lib/components/drawer/next';
import createWrapper from '../../../lib/components/test-utils/dom';

import drawerStyles from '../../../lib/components/drawer/styles.selectors.js';

const warnOnceMock = jest.fn();
jest.mock('@cloudscape-design/component-toolkit/internal', () => ({
  ...jest.requireActual('@cloudscape-design/component-toolkit/internal'),
  warnOnce: (...args: unknown[]) => warnOnceMock(...args),
}));

function renderDrawer(jsx: React.ReactElement) {
  const { container } = render(jsx);
  return createWrapper(container).findDrawer()!;
}

function isHidden(wrapper: ReturnType<typeof renderDrawer>) {
  return wrapper.getElement().classList.contains(drawerStyles.hidden);
}

afterEach(() => warnOnceMock.mockReset());

test('drawer is visible when open=true', () => {
  expect(
    isHidden(
      renderDrawer(
        <NextDrawer open={true} onClose={jest.fn()}>
          content
        </NextDrawer>
      )
    )
  ).toBe(false);
});

test('drawer is hidden when open=false', () => {
  expect(
    isHidden(
      renderDrawer(
        <NextDrawer open={false} onClose={jest.fn()}>
          content
        </NextDrawer>
      )
    )
  ).toBe(true);
});

test('drawer is always visible when open is not provided', () => {
  expect(isHidden(renderDrawer(<NextDrawer>content</NextDrawer>))).toBe(false);
});

test('re-renders without open prop do not trigger focus transitions', () => {
  const { container, rerender } = render(
    <NextDrawer open={false} onClose={jest.fn()}>
      content
    </NextDrawer>
  );
  const drawer = container.querySelector<HTMLElement>(`.${drawerStyles.drawer}`)!;
  rerender(<NextDrawer>content</NextDrawer>);
  expect(drawer).not.toHaveFocus();
});

test('warns when open is provided without onClose', () => {
  render(<NextDrawer open={true}>content</NextDrawer>);
  expect(warnOnceMock).toHaveBeenCalledWith('Drawer', expect.stringContaining('`open`'));
  expect(warnOnceMock).toHaveBeenCalledWith('Drawer', expect.stringContaining('`onClose`'));
});
