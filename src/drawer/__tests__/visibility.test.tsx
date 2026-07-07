// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { render } from '@testing-library/react';

import Drawer from '../../../lib/components/drawer';
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
        <Drawer open={true} onClose={jest.fn()}>
          content
        </Drawer>
      )
    )
  ).toBe(false);
});

test('drawer is hidden when open=false', () => {
  expect(
    isHidden(
      renderDrawer(
        <Drawer open={false} onClose={jest.fn()}>
          content
        </Drawer>
      )
    )
  ).toBe(true);
});

test('drawer is always visible when open is not provided', () => {
  expect(isHidden(renderDrawer(<Drawer>content</Drawer>))).toBe(false);
});

test('re-renders without open prop do not trigger focus transitions', () => {
  const { container, rerender } = render(
    <Drawer open={false} onClose={jest.fn()}>
      content
    </Drawer>
  );
  const drawer = container.querySelector<HTMLElement>(`.${drawerStyles.drawer}`)!;
  rerender(<Drawer>content</Drawer>);
  expect(drawer).not.toHaveFocus();
});

test('warns when open is provided without onClose', () => {
  render(<Drawer open={true}>content</Drawer>);
  expect(warnOnceMock).toHaveBeenCalledWith('Drawer', expect.stringContaining('`open`'));
  expect(warnOnceMock).toHaveBeenCalledWith('Drawer', expect.stringContaining('`onClose`'));
});
