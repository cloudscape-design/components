// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { createRef } from 'react';
import { act, render } from '@testing-library/react';

import NextDrawer, { NextDrawerProps } from '../../../lib/components/drawer/next';
import createWrapper from '../../../lib/components/test-utils/dom';

function getBody(container: HTMLElement) {
  return container.querySelector<HTMLElement>('[role="region"]')!;
}

test('body has role=region', () => {
  const { container } = render(<NextDrawer>content</NextDrawer>);
  expect(getBody(container)).toHaveAttribute('role', 'region');
});

test('body is labelled by header by default', () => {
  const { container } = render(<NextDrawer header="My drawer">content</NextDrawer>);
  const body = getBody(container);
  const labelledById = body.getAttribute('aria-labelledby');
  expect(labelledById).toBeTruthy();
  expect(container.querySelector(`#${labelledById}`)?.textContent).toBe('My drawer');
});

test('no aria-labelledby when no header', () => {
  const { container } = render(<NextDrawer>content</NextDrawer>);
  expect(getBody(container)).not.toHaveAttribute('aria-labelledby');
});

test('ariaLabel sets aria-label on body', () => {
  const { container } = render(<NextDrawer ariaLabel="Custom label">content</NextDrawer>);
  expect(getBody(container)).toHaveAttribute('aria-label', 'Custom label');
});

test('ariaLabel takes precedence over default aria-labelledby', () => {
  const { container } = render(
    <NextDrawer header="Header" ariaLabel="Custom label">
      content
    </NextDrawer>
  );
  const body = getBody(container);
  expect(body).toHaveAttribute('aria-label', 'Custom label');
  expect(body).not.toHaveAttribute('aria-labelledby');
});

test('ariaLabelledby overrides default header labelling', () => {
  const { container } = render(
    <NextDrawer header="Header" ariaLabelledby="custom-id">
      content
    </NextDrawer>
  );
  expect(getBody(container)).toHaveAttribute('aria-labelledby', 'custom-id');
});

test('body has tabIndex=-1 for programmatic focus', () => {
  const { container } = render(<NextDrawer>content</NextDrawer>);
  expect(getBody(container)).toHaveAttribute('tabindex', '-1');
});

test('trapFocus defaults to false without backdrop', () => {
  const { container } = render(<NextDrawer>content</NextDrawer>);
  const traps = container.querySelectorAll('[tabindex="0"]');
  expect(traps).toHaveLength(0);
});

test('trapFocus can be enabled without backdrop', () => {
  const { container } = render(<NextDrawer focusBehavior={{ trapFocus: true }}>content</NextDrawer>);
  const traps = container.querySelectorAll('[tabindex="0"]');
  expect(traps.length).toBeGreaterThan(0);
});

test('trapFocus can be disabled with backdrop', () => {
  const { container } = render(
    <NextDrawer backdrop={true} position="fixed" focusBehavior={{ trapFocus: false }}>
      content
    </NextDrawer>
  );
  // backdrop is rendered as sibling — find drawer container
  const drawerContainer = createWrapper(container).findDrawer()!.getElement().parentElement!;
  const traps = drawerContainer.querySelectorAll('[tabindex="0"]');
  expect(traps).toHaveLength(0);
});

test('ref.focus() moves focus to drawer body', () => {
  const ref = createRef<NextDrawerProps.Ref>();
  const { container } = render(<NextDrawer ref={ref}>content</NextDrawer>);
  act(() => ref.current!.focus());
  expect(getBody(container)).toHaveFocus();
});

test('ref.focus() is a no-op when drawer is closed', () => {
  const ref = createRef<NextDrawerProps.Ref>();
  render(
    <NextDrawer ref={ref} defaultOpen={false}>
      content
    </NextDrawer>
  );
  // should not throw
  expect(() => act(() => ref.current!.focus())).not.toThrow();
});

test('ref.open() moves focus to drawer body', () => {
  const ref = createRef<NextDrawerProps.Ref>();
  const { container } = render(
    <NextDrawer ref={ref} defaultOpen={false}>
      content
    </NextDrawer>
  );
  act(() => ref.current!.open());
  expect(getBody(container)).toHaveFocus();
});

test('ref.toggle() moves focus to body when opening', () => {
  const ref = createRef<NextDrawerProps.Ref>();
  const { container } = render(
    <NextDrawer ref={ref} defaultOpen={false}>
      content
    </NextDrawer>
  );
  act(() => ref.current!.toggle());
  expect(getBody(container)).toHaveFocus();
});

test('controlled open does not auto-focus', () => {
  const { container } = render(<NextDrawer open={true}>content</NextDrawer>);
  expect(getBody(container)).not.toHaveFocus();
});

test('returns focus to element focused before ref.open()', () => {
  const trigger = document.createElement('button');
  document.body.appendChild(trigger);
  trigger.focus();

  const ref = createRef<NextDrawerProps.Ref>();
  render(
    <NextDrawer ref={ref} defaultOpen={false}>
      content
    </NextDrawer>
  );
  act(() => ref.current!.open());
  act(() => ref.current!.close());

  expect(trigger).toHaveFocus();
  document.body.removeChild(trigger);
});

test('calls focusBehavior.returnFocus instead of default', () => {
  const returnFocus = jest.fn();
  const trigger = document.createElement('button');
  document.body.appendChild(trigger);
  trigger.focus();

  const ref = createRef<NextDrawerProps.Ref>();
  render(
    <NextDrawer ref={ref} defaultOpen={false} focusBehavior={{ returnFocus }}>
      content
    </NextDrawer>
  );
  act(() => ref.current!.open());
  act(() => ref.current!.close());

  expect(returnFocus).toHaveBeenCalledTimes(1);
  expect(trigger).not.toHaveFocus();
  document.body.removeChild(trigger);
});
