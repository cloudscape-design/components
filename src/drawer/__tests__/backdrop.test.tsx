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

test('is not rendered by default', () => {
  const { backdrop } = renderDrawer(<NextDrawer>content</NextDrawer>);
  expect(backdrop).toBeNull();
});

test('is not rendered for static position', () => {
  const { backdrop } = renderDrawer(
    <NextDrawer backdrop={true} position="static">
      content
    </NextDrawer>
  );
  expect(backdrop).toBeNull();
  expect(warnOnceMock).toHaveBeenCalledWith('Drawer', expect.stringContaining('position="static"'));
});

test('is not rendered for sticky position', () => {
  const { backdrop } = renderDrawer(
    <NextDrawer backdrop={true} position="sticky" placement="top">
      content
    </NextDrawer>
  );
  expect(backdrop).toBeNull();
  expect(warnOnceMock).toHaveBeenCalledWith('Drawer', expect.stringContaining('position="sticky"'));
});

test('is rendered for fixed position', () => {
  const { backdrop } = renderDrawer(
    <NextDrawer backdrop={true} position="fixed">
      content
    </NextDrawer>
  );
  expect(backdrop).not.toBeNull();
});

test('is rendered for absolute position', () => {
  const { backdrop } = renderDrawer(
    <NextDrawer backdrop={true} position="absolute">
      content
    </NextDrawer>
  );
  expect(backdrop).not.toBeNull();
});

test('defaults to 830 when no zIndex is provided', () => {
  const { backdrop } = renderDrawer(
    <NextDrawer backdrop={true} position="fixed">
      content
    </NextDrawer>
  );
  expect(backdrop!.getElement()).toHaveStyle({ zIndex: 830 });
});

test('uses explicit drawer zIndex', () => {
  const { backdrop } = renderDrawer(
    <NextDrawer backdrop={true} position="fixed" zIndex={1000}>
      content
    </NextDrawer>
  );
  expect(backdrop!.getElement()).toHaveStyle({ zIndex: 1000 });
});

test('tab traps are disabled without backdrop', () => {
  const { container } = render(<NextDrawer>content</NextDrawer>);
  const traps = getTabTraps(container);
  expect(traps).toHaveLength(2);
  traps.forEach(trap => expect(trap).toHaveAttribute('tabindex', '-1'));
});

test('tab traps are enabled when backdrop=true with fixed position', () => {
  const { container } = render(
    <NextDrawer backdrop={true} position="fixed">
      content
    </NextDrawer>
  );
  const traps = getTabTraps(container);
  expect(traps).toHaveLength(2);
  traps.forEach(trap => expect(trap).toHaveAttribute('tabindex', '0'));
});

test('tab traps are disabled when backdrop=true with static position', () => {
  const { container } = render(
    <NextDrawer backdrop={true} position="static">
      content
    </NextDrawer>
  );
  const traps = getTabTraps(container);
  expect(traps).toHaveLength(2);
  traps.forEach(trap => expect(trap).toHaveAttribute('tabindex', '-1'));
});

test('fires onClose with method=backdrop-click when backdrop is clicked', () => {
  const onClose = jest.fn();
  const { backdrop } = renderDrawer(
    <NextDrawer backdrop={true} position="fixed" onClose={onClose}>
      content
    </NextDrawer>
  );
  backdrop!.click();
  expect(onClose).toHaveBeenCalledTimes(1);
  expect(onClose).toHaveBeenCalledWith(expect.objectContaining({ detail: { method: 'backdrop-click' } }));
});

test('keeps drawer open when onClose calls preventDefault', () => {
  const onClose = jest.fn(e => e.preventDefault());
  const { container } = render(
    <NextDrawer backdrop={true} position="fixed" defaultOpen={true} onClose={onClose}>
      content
    </NextDrawer>
  );
  createWrapper(container).findByClassName(testClasses.backdrop)!.click();
  expect(createWrapper(container).findDrawer()).not.toBeNull();
});

test('fires onClose with method=escape when Escape is pressed', () => {
  const onClose = jest.fn();
  renderDrawer(
    <NextDrawer backdrop={true} position="fixed" onClose={onClose}>
      content
    </NextDrawer>
  );
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  expect(onClose).toHaveBeenCalledTimes(1);
  expect(onClose).toHaveBeenCalledWith(expect.objectContaining({ detail: { method: 'escape' } }));
});

test('does not fire onClose on Escape without backdrop', () => {
  const onClose = jest.fn();
  renderDrawer(
    <NextDrawer position="fixed" onClose={onClose}>
      content
    </NextDrawer>
  );
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  expect(onClose).not.toHaveBeenCalled();
});

test('keeps drawer open when onClose calls preventDefault on Escape', () => {
  const onClose = jest.fn(e => e.preventDefault());
  const { container } = render(
    <NextDrawer backdrop={true} position="fixed" defaultOpen={true} onClose={onClose}>
      content
    </NextDrawer>
  );
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  expect(createWrapper(container).findDrawer()).not.toBeNull();
});
