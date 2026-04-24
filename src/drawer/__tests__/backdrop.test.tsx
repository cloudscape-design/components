// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { render } from '@testing-library/react';

import NextDrawer from '../../../lib/components/drawer/next';
import createWrapper from '../../../lib/components/test-utils/dom';

import testClasses from '../../../lib/components/drawer/test-classes/styles.selectors.js';
import tabTrapStyles from '../../../lib/components/internal/components/tab-trap/styles.selectors.js';

const warnOnceMock = jest.fn();
jest.mock('@cloudscape-design/component-toolkit/internal', () => ({
  ...jest.requireActual('@cloudscape-design/component-toolkit/internal'),
  warnOnce: (...args: unknown[]) => warnOnceMock(...args),
}));

afterEach(() => warnOnceMock.mockReset());

function renderDrawer(jsx: React.ReactElement) {
  const { container } = render(jsx);
  const drawer = createWrapper(container).findDrawer()!;
  const backdrop = createWrapper(container).findByClassName(testClasses.backdrop);
  return { drawer, backdrop };
}

function getTabTraps(container: HTMLElement) {
  return Array.from(container.querySelectorAll<HTMLElement>(`.${tabTrapStyles.root}`));
}

test('backdrop is not rendered by default', () => {
  const { backdrop } = renderDrawer(<NextDrawer>content</NextDrawer>);
  expect(backdrop).toBeNull();
});

test('backdrop is not rendered for static position and warns', () => {
  const { backdrop } = renderDrawer(
    <NextDrawer backdrop={true} position="static">
      content
    </NextDrawer>
  );
  expect(backdrop).toBeNull();
  expect(warnOnceMock).toHaveBeenCalledWith('Drawer', expect.stringContaining('position="static"'));
});

test('backdrop is not rendered for sticky position and warns', () => {
  const { backdrop } = renderDrawer(
    <NextDrawer backdrop={true} position="sticky" placement="top">
      content
    </NextDrawer>
  );
  expect(backdrop).toBeNull();
  expect(warnOnceMock).toHaveBeenCalledWith('Drawer', expect.stringContaining('position="sticky"'));
});

test('backdrop is rendered when position=fixed', () => {
  const { backdrop } = renderDrawer(
    <NextDrawer backdrop={true} position="fixed">
      content
    </NextDrawer>
  );
  expect(backdrop).not.toBeNull();
});

test('backdrop is rendered when position=absolute', () => {
  const { backdrop } = renderDrawer(
    <NextDrawer backdrop={true} position="absolute">
      content
    </NextDrawer>
  );
  expect(backdrop).not.toBeNull();
});

test('backdrop z-index defaults to 830 when zIndex is not provided', () => {
  const { backdrop } = renderDrawer(
    <NextDrawer backdrop={true} position="fixed">
      content
    </NextDrawer>
  );
  expect(backdrop!.getElement()).toHaveStyle({ zIndex: 830 });
});

test('backdrop z-index matches explicit zIndex prop', () => {
  const { backdrop } = renderDrawer(
    <NextDrawer backdrop={true} position="fixed" zIndex={1000}>
      content
    </NextDrawer>
  );
  expect(backdrop!.getElement()).toHaveStyle({ zIndex: 1000 });
});

test('focus trap is disabled when backdrop is not set', () => {
  const { container } = render(<NextDrawer>content</NextDrawer>);
  getTabTraps(container).forEach(trap => expect(trap).toHaveAttribute('tabindex', '-1'));
});

test('focus trap is enabled when backdrop=true with fixed position', () => {
  const { container } = render(
    <NextDrawer backdrop={true} position="fixed">
      content
    </NextDrawer>
  );
  const traps = getTabTraps(container);
  expect(traps).toHaveLength(2);
  traps.forEach(trap => expect(trap).toHaveAttribute('tabindex', '0'));
});

test('focus trap is disabled when backdrop=true with unsupported position', () => {
  const { container } = render(
    <NextDrawer backdrop={true} position="static">
      content
    </NextDrawer>
  );
  getTabTraps(container).forEach(trap => expect(trap).toHaveAttribute('tabindex', '-1'));
});

test('focus trap can be disabled explicitly when backdrop is set', () => {
  const { container } = render(
    <NextDrawer backdrop={true} position="fixed" focusBehavior={{ trapFocus: false }}>
      content
    </NextDrawer>
  );
  const drawerContainer = createWrapper(container).findDrawer()!.getElement().parentElement!;
  expect(drawerContainer.querySelectorAll('[tabindex="0"]')).toHaveLength(0);
});

test('focus trap can be enabled explicitly without backdrop', () => {
  const { container } = render(<NextDrawer focusBehavior={{ trapFocus: true }}>content</NextDrawer>);
  expect(container.querySelectorAll('[tabindex="0"]').length).toBeGreaterThan(0);
});

test('clicking backdrop fires onClose with method=backdrop-click', () => {
  const onClose = jest.fn();
  const { backdrop } = renderDrawer(
    <NextDrawer backdrop={true} position="fixed" onClose={onClose}>
      content
    </NextDrawer>
  );
  backdrop!.click();
  expect(onClose).toHaveBeenCalledWith(expect.objectContaining({ detail: { method: 'backdrop-click' } }));
});

test('pressing Escape fires onClose with method=escape when backdrop is set', () => {
  const onClose = jest.fn();
  renderDrawer(
    <NextDrawer backdrop={true} position="fixed" onClose={onClose}>
      content
    </NextDrawer>
  );
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  expect(onClose).toHaveBeenCalledWith(expect.objectContaining({ detail: { method: 'escape' } }));
});

test('pressing Escape does not fire onClose when backdrop is not set', () => {
  const onClose = jest.fn();
  renderDrawer(
    <NextDrawer position="fixed" onClose={onClose}>
      content
    </NextDrawer>
  );
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  expect(onClose).not.toHaveBeenCalled();
});
