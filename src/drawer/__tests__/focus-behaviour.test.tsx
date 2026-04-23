// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { createRef } from 'react';
import { act, render } from '@testing-library/react';

import NextDrawer, { NextDrawerProps } from '../../../lib/components/drawer/next';

import drawerStyles from '../../../lib/components/drawer/styles.selectors.js';

function getSemanticDrawer(container: HTMLElement) {
  return container.querySelector<HTMLElement>(`.${drawerStyles.drawer}`)!;
}

test('drawer body has role=region', () => {
  const { container } = render(<NextDrawer role="region">content</NextDrawer>);
  expect(getSemanticDrawer(container)).toHaveAttribute('role', 'region');
});

test('drawer body has tabIndex=-1 for programmatic focus', () => {
  const { container } = render(<NextDrawer role="region">content</NextDrawer>);
  expect(getSemanticDrawer(container)).toHaveAttribute('tabindex', '-1');
});

test('drawer body is labelled by header content by default', () => {
  const { container } = render(
    <NextDrawer role="region" header="My drawer">
      content
    </NextDrawer>
  );
  const body = getSemanticDrawer(container);
  const labelledById = body.getAttribute('aria-labelledby');
  expect(labelledById).toBeTruthy();
  expect(container.querySelector(`#${labelledById}`)?.textContent).toBe('My drawer');
});

test('drawer body has no aria-labelledby when header is not provided', () => {
  const { container } = render(<NextDrawer role="region">content</NextDrawer>);
  expect(getSemanticDrawer(container)).not.toHaveAttribute('aria-labelledby');
});

test('ariaLabel sets aria-label on drawer body', () => {
  const { container } = render(
    <NextDrawer role="region" ariaLabel="Custom label">
      content
    </NextDrawer>
  );
  expect(getSemanticDrawer(container)).toHaveAttribute('aria-label', 'Custom label');
});

test('ariaLabel suppresses default aria-labelledby', () => {
  const { container } = render(
    <NextDrawer role="region" header="Header" ariaLabel="Custom label">
      content
    </NextDrawer>
  );
  const body = getSemanticDrawer(container);
  expect(body).toHaveAttribute('aria-label', 'Custom label');
  expect(body).not.toHaveAttribute('aria-labelledby');
});

test('ariaLabelledby overrides default header labelling', () => {
  const { container } = render(
    <NextDrawer role="region" header="Header" ariaLabelledby="custom-id">
      content
    </NextDrawer>
  );
  expect(getSemanticDrawer(container)).toHaveAttribute('aria-labelledby', 'custom-id');
});

test('ref.focus() moves focus to drawer body', () => {
  const ref = createRef<NextDrawerProps.Ref>();
  const { container } = render(
    <NextDrawer role="region" ref={ref}>
      content
    </NextDrawer>
  );
  act(() => ref.current!.focus());
  expect(getSemanticDrawer(container)).toHaveFocus();
});

test('autoFocus moves focus into drawer when open changes to true', () => {
  const { container, rerender } = render(
    <NextDrawer role="region" open={false} onClose={jest.fn()}>
      content
    </NextDrawer>
  );
  rerender(
    <NextDrawer role="region" open={true} onClose={jest.fn()}>
      content
    </NextDrawer>
  );
  expect(getSemanticDrawer(container)).toHaveFocus();
});

test('autoFocus does not move focus on initial render with open=true', () => {
  const { container } = render(
    <NextDrawer open={true} onClose={jest.fn()}>
      content
    </NextDrawer>
  );
  expect(getSemanticDrawer(container)).not.toHaveFocus();
});

test('autoFocus=false prevents focus from moving into drawer on open', () => {
  const { container, rerender } = render(
    <NextDrawer open={false} onClose={jest.fn()} focusBehavior={{ autoFocus: false }}>
      content
    </NextDrawer>
  );
  rerender(
    <NextDrawer open={true} onClose={jest.fn()} focusBehavior={{ autoFocus: false }}>
      content
    </NextDrawer>
  );
  expect(getSemanticDrawer(container)).not.toHaveFocus();
});

test('focus returns to previously focused element when drawer closes', () => {
  const trigger = document.createElement('button');
  document.body.appendChild(trigger);
  trigger.focus();

  const { rerender } = render(
    <NextDrawer open={false} onClose={jest.fn()}>
      content
    </NextDrawer>
  );
  rerender(
    <NextDrawer open={true} onClose={jest.fn()}>
      content
    </NextDrawer>
  );
  rerender(
    <NextDrawer open={false} onClose={jest.fn()}>
      content
    </NextDrawer>
  );

  expect(trigger).toHaveFocus();
  document.body.removeChild(trigger);
});

test('focusBehavior.returnFocus is called instead of default return-focus', () => {
  const returnFocus = jest.fn();
  const trigger = document.createElement('button');
  document.body.appendChild(trigger);
  trigger.focus();

  const { rerender } = render(
    <NextDrawer open={false} onClose={jest.fn()} focusBehavior={{ returnFocus }}>
      content
    </NextDrawer>
  );
  rerender(
    <NextDrawer open={true} onClose={jest.fn()} focusBehavior={{ returnFocus }}>
      content
    </NextDrawer>
  );
  rerender(
    <NextDrawer open={false} onClose={jest.fn()} focusBehavior={{ returnFocus }}>
      content
    </NextDrawer>
  );

  expect(returnFocus).toHaveBeenCalledTimes(1);
  document.body.removeChild(trigger);
});

test('focusBehavior.returnFocus fires on close even when autoFocus=false', () => {
  const returnFocus = jest.fn();

  const { rerender } = render(
    <NextDrawer open={false} onClose={jest.fn()} focusBehavior={{ autoFocus: false, returnFocus }}>
      content
    </NextDrawer>
  );
  rerender(
    <NextDrawer open={true} onClose={jest.fn()} focusBehavior={{ autoFocus: false, returnFocus }}>
      content
    </NextDrawer>
  );
  rerender(
    <NextDrawer open={false} onClose={jest.fn()} focusBehavior={{ autoFocus: false, returnFocus }}>
      content
    </NextDrawer>
  );

  expect(returnFocus).toHaveBeenCalledTimes(1);
});

test('return-focus silently no-ops when previously focused element is removed from DOM', () => {
  const trigger = document.createElement('button');
  document.body.appendChild(trigger);
  trigger.focus();

  const { rerender } = render(
    <NextDrawer open={false} onClose={jest.fn()}>
      content
    </NextDrawer>
  );
  rerender(
    <NextDrawer open={true} onClose={jest.fn()}>
      content
    </NextDrawer>
  );
  document.body.removeChild(trigger);

  expect(() =>
    rerender(
      <NextDrawer open={false} onClose={jest.fn()}>
        content
      </NextDrawer>
    )
  ).not.toThrow();
});
