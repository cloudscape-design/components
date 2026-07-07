// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { render } from '@testing-library/react';

import Drawer from '../../../lib/components/drawer';
import createWrapper from '../../../lib/components/test-utils/dom';
import { renderDrawer } from './shared';

import tabTrapStyles from '../../../lib/components/internal/components/tab-trap/styles.selectors.js';

const warnOnceMock = jest.fn();
jest.mock('@cloudscape-design/component-toolkit/internal', () => ({
  ...jest.requireActual('@cloudscape-design/component-toolkit/internal'),
  warnOnce: (...args: unknown[]) => warnOnceMock(...args),
}));

afterEach(() => warnOnceMock.mockReset());

function getTabTraps(container: HTMLElement) {
  return Array.from(container.querySelectorAll<HTMLElement>(`.${tabTrapStyles.root}`));
}

test('backdrop is not rendered by default', () => {
  const { drawer } = renderDrawer(<Drawer>content</Drawer>);
  expect(drawer.findBackdrop()).toBeNull();
});

test('backdrop is not rendered for static position and warns', () => {
  const { drawer } = renderDrawer(
    <Drawer backdrop={true} position="static">
      content
    </Drawer>
  );
  expect(drawer.findBackdrop()).toBeNull();
  expect(warnOnceMock).toHaveBeenCalledWith('Drawer', expect.stringContaining('position="static"'));
});

test('backdrop is not rendered for sticky position and warns', () => {
  const { drawer } = renderDrawer(
    <Drawer backdrop={true} position="sticky" placement="top">
      content
    </Drawer>
  );
  expect(drawer.findBackdrop()).toBeNull();
  expect(warnOnceMock).toHaveBeenCalledWith('Drawer', expect.stringContaining('position="sticky"'));
});

test('backdrop is rendered when position=fixed', () => {
  const { drawer } = renderDrawer(
    <Drawer backdrop={true} position="fixed">
      content
    </Drawer>
  );
  expect(drawer.findBackdrop()).not.toBeNull();
});

test('backdrop is rendered when position=absolute', () => {
  const { drawer } = renderDrawer(
    <Drawer backdrop={true} position="absolute">
      content
    </Drawer>
  );
  expect(drawer.findBackdrop()).not.toBeNull();
});

test('backdrop z-index defaults to 830 when zIndex is not provided', () => {
  const { drawer } = renderDrawer(
    <Drawer backdrop={true} position="fixed">
      content
    </Drawer>
  );
  expect(drawer.findBackdrop()!.getElement()).toHaveStyle({ zIndex: 830 });
});

test('backdrop z-index matches explicit zIndex prop', () => {
  const { drawer } = renderDrawer(
    <Drawer backdrop={true} position="fixed" zIndex={1000}>
      content
    </Drawer>
  );
  expect(drawer.findBackdrop()!.getElement()).toHaveStyle({ zIndex: 1000 });
});

test('focus trap is disabled when backdrop is not set', () => {
  const { container } = render(<Drawer>content</Drawer>);
  getTabTraps(container).forEach(trap => expect(trap).toHaveAttribute('tabindex', '-1'));
});

test('focus trap is enabled when backdrop=true with fixed position', () => {
  render(
    <Drawer backdrop={true} position="fixed">
      content
    </Drawer>
  );
  const traps = getTabTraps(document.body);
  expect(traps).toHaveLength(2);
  traps.forEach(trap => expect(trap).toHaveAttribute('tabindex', '0'));
});

test('focus trap is disabled when backdrop=true with unsupported position', () => {
  const { container } = render(
    <Drawer backdrop={true} position="static">
      content
    </Drawer>
  );
  getTabTraps(container).forEach(trap => expect(trap).toHaveAttribute('tabindex', '-1'));
});

test('focus trap can be disabled explicitly when backdrop is set', () => {
  render(
    <Drawer backdrop={true} position="fixed" focusBehavior={{ trapFocus: false }}>
      content
    </Drawer>
  );
  const drawerContainer = createWrapper(document.body).findDrawer()!.getElement().parentElement!;
  expect(drawerContainer.querySelectorAll('[tabindex="0"]')).toHaveLength(0);
});

test('focus trap can be enabled explicitly without backdrop', () => {
  const { container } = render(<Drawer focusBehavior={{ trapFocus: true }}>content</Drawer>);
  expect(container.querySelectorAll('[tabindex="0"]').length).toBeGreaterThan(0);
});

test('clicking backdrop fires onClose with method=backdrop-click', () => {
  const onClose = jest.fn();
  const { drawer } = renderDrawer(
    <Drawer backdrop={true} position="fixed" onClose={onClose}>
      content
    </Drawer>
  );
  drawer.findBackdrop()!.click();
  expect(onClose).toHaveBeenCalledWith(expect.objectContaining({ detail: { method: 'backdrop-click' } }));
});

test('pressing Escape fires onClose with method=escape when backdrop is set', () => {
  const onClose = jest.fn();
  renderDrawer(
    <Drawer backdrop={true} position="fixed" onClose={onClose}>
      content
    </Drawer>
  );
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  expect(onClose).toHaveBeenCalledWith(expect.objectContaining({ detail: { method: 'escape' } }));
});

test('pressing Escape does not fire onClose when backdrop is not set', () => {
  const onClose = jest.fn();
  renderDrawer(
    <Drawer position="fixed" onClose={onClose}>
      content
    </Drawer>
  );
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  expect(onClose).not.toHaveBeenCalled();
});
