// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { createRef } from 'react';
import { act, render } from '@testing-library/react';

import NextDrawer, { NextDrawerProps } from '../../../lib/components/drawer/next';
import createWrapper from '../../../lib/components/test-utils/dom';

const warnOnceMock = jest.fn();
jest.mock('@cloudscape-design/component-toolkit/internal', () => ({
  ...jest.requireActual('@cloudscape-design/component-toolkit/internal'),
  warnOnce: (...args: unknown[]) => warnOnceMock(...args),
}));

function renderDrawer(jsx: React.ReactElement) {
  const { container } = render(jsx);
  return createWrapper(container).findDrawer();
}

afterEach(() => {
  warnOnceMock.mockReset();
});

describe('open (controlled mode)', () => {
  test('renders when open=true', () => {
    expect(renderDrawer(<NextDrawer open={true}>content</NextDrawer>)).not.toBeNull();
  });

  test('does not render when open=false', () => {
    expect(renderDrawer(<NextDrawer open={false}>content</NextDrawer>)).toBeNull();
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
});

describe('defaultOpen (uncontrolled mode)', () => {
  test('renders by default when neither open nor defaultOpen is set', () => {
    expect(renderDrawer(<NextDrawer>content</NextDrawer>)).not.toBeNull();
  });

  test('renders when defaultOpen=true', () => {
    expect(renderDrawer(<NextDrawer defaultOpen={true}>content</NextDrawer>)).not.toBeNull();
  });

  test('does not render when defaultOpen=false', () => {
    expect(renderDrawer(<NextDrawer defaultOpen={false}>content</NextDrawer>)).toBeNull();
  });
});

describe('ref API (uncontrolled mode)', () => {
  test('ref.open() shows the drawer', () => {
    const ref = createRef<NextDrawerProps.Ref>();
    const { container } = render(
      <NextDrawer ref={ref} defaultOpen={false}>
        content
      </NextDrawer>
    );
    act(() => ref.current!.open());
    expect(createWrapper(container).findDrawer()).not.toBeNull();
  });

  test('ref.close() hides the drawer', () => {
    const ref = createRef<NextDrawerProps.Ref>();
    const { container } = render(
      <NextDrawer ref={ref} defaultOpen={true}>
        content
      </NextDrawer>
    );
    act(() => ref.current!.close());
    expect(createWrapper(container).findDrawer()).toBeNull();
  });

  test('ref.toggle() closes an open drawer', () => {
    const ref = createRef<NextDrawerProps.Ref>();
    const { container } = render(
      <NextDrawer ref={ref} defaultOpen={true}>
        content
      </NextDrawer>
    );
    act(() => ref.current!.toggle());
    expect(createWrapper(container).findDrawer()).toBeNull();
  });

  test('ref.toggle() opens a closed drawer', () => {
    const ref = createRef<NextDrawerProps.Ref>();
    const { container } = render(
      <NextDrawer ref={ref} defaultOpen={false}>
        content
      </NextDrawer>
    );
    act(() => ref.current!.toggle());
    expect(createWrapper(container).findDrawer()).not.toBeNull();
  });

  test('ref methods are no-ops in controlled mode', () => {
    const ref = createRef<NextDrawerProps.Ref>();
    const onClose = jest.fn();
    const { container } = render(
      <NextDrawer ref={ref} open={true} onClose={onClose}>
        content
      </NextDrawer>
    );
    act(() => ref.current!.open());
    act(() => ref.current!.close());
    act(() => ref.current!.toggle());
    expect(createWrapper(container).findDrawer()).not.toBeNull();
    expect(onClose).not.toHaveBeenCalled();
  });
});
