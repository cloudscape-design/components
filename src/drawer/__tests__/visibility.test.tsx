// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { createRef } from 'react';
import { act, render } from '@testing-library/react';

import NextDrawer, { NextDrawerProps } from '../../../lib/components/drawer/next';
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

afterEach(() => {
  warnOnceMock.mockReset();
});

test('renders when open=true', () => {
  expect(isHidden(renderDrawer(<NextDrawer open={true}>content</NextDrawer>))).toBe(false);
});

test('is hidden when open=false', () => {
  expect(isHidden(renderDrawer(<NextDrawer open={false}>content</NextDrawer>))).toBe(true);
});

test('warns when open is provided without onClose', () => {
  render(<NextDrawer open={true}>content</NextDrawer>);
  expect(warnOnceMock).toHaveBeenCalledWith('Drawer', expect.stringContaining('`open`'));
  expect(warnOnceMock).toHaveBeenCalledWith('Drawer', expect.stringContaining('`onClose`'));
});

test('warns when both open and defaultOpen are provided', () => {
  render(
    <NextDrawer open={true} defaultOpen={false}>
      content
    </NextDrawer>
  );
  expect(warnOnceMock).toHaveBeenCalledWith('Drawer', expect.stringContaining('`open`'));
  expect(warnOnceMock).toHaveBeenCalledWith('Drawer', expect.stringContaining('`defaultOpen`'));
});

test('renders by default when neither open nor defaultOpen is set', () => {
  expect(isHidden(renderDrawer(<NextDrawer>content</NextDrawer>))).toBe(false);
});

test('renders when defaultOpen=true', () => {
  expect(isHidden(renderDrawer(<NextDrawer defaultOpen={true}>content</NextDrawer>))).toBe(false);
});

test('is hidden when defaultOpen=false', () => {
  expect(isHidden(renderDrawer(<NextDrawer defaultOpen={false}>content</NextDrawer>))).toBe(true);
});

test('ref.open() shows the drawer', () => {
  const ref = createRef<NextDrawerProps.Ref>();
  const wrapper = renderDrawer(
    <NextDrawer ref={ref} defaultOpen={false}>
      content
    </NextDrawer>
  );
  act(() => ref.current!.open());
  expect(isHidden(wrapper)).toBe(false);
});

test('ref.close() hides the drawer', () => {
  const ref = createRef<NextDrawerProps.Ref>();
  const wrapper = renderDrawer(
    <NextDrawer ref={ref} defaultOpen={true}>
      content
    </NextDrawer>
  );
  act(() => ref.current!.close());
  expect(isHidden(wrapper)).toBe(true);
});

test('ref.toggle() closes an open drawer', () => {
  const ref = createRef<NextDrawerProps.Ref>();
  const wrapper = renderDrawer(
    <NextDrawer ref={ref} defaultOpen={true}>
      content
    </NextDrawer>
  );
  act(() => ref.current!.toggle());
  expect(isHidden(wrapper)).toBe(true);
});

test('ref.toggle() opens a closed drawer', () => {
  const ref = createRef<NextDrawerProps.Ref>();
  const wrapper = renderDrawer(
    <NextDrawer ref={ref} defaultOpen={false}>
      content
    </NextDrawer>
  );
  act(() => ref.current!.toggle());
  expect(isHidden(wrapper)).toBe(false);
});

test('ref methods are no-ops in controlled mode', () => {
  const ref = createRef<NextDrawerProps.Ref>();
  const onClose = jest.fn();
  const wrapper = renderDrawer(
    <NextDrawer ref={ref} open={true} onClose={onClose}>
      content
    </NextDrawer>
  );
  act(() => ref.current!.open());
  act(() => ref.current!.close());
  act(() => ref.current!.toggle());
  expect(isHidden(wrapper)).toBe(false);
  expect(onClose).not.toHaveBeenCalled();
});
