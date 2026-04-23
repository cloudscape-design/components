// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { createRef } from 'react';
import { act, render } from '@testing-library/react';

import NextDrawer, { NextDrawerProps } from '../../../lib/components/drawer/next';

import drawerStyles from '../../../lib/components/drawer/styles.selectors.js';

function getSemanticDrawer(container: HTMLElement) {
  return container.querySelector<HTMLElement>(`.${drawerStyles.drawer}`)!;
}

test('defaults to presentation for static position', () => {
  const { container } = render(<NextDrawer position="static">content</NextDrawer>);
  expect(getSemanticDrawer(container)).not.toHaveAttribute('role');
});

test('defaults to region for non-static positions', () => {
  for (const position of ['fixed', 'absolute', 'sticky'] as const) {
    const { container } = render(
      <NextDrawer position={position} open={true} onClose={jest.fn()}>
        content
      </NextDrawer>
    );
    expect(getSemanticDrawer(container)).toHaveAttribute('role', 'region');
  }
});

describe('role="region"', () => {
  test('drawer has role=region', () => {
    const { container } = render(<NextDrawer role="region">content</NextDrawer>);
    expect(getSemanticDrawer(container)).toHaveAttribute('role', 'region');
  });

  test('drawer has tabIndex=-1', () => {
    const { container } = render(<NextDrawer role="region">content</NextDrawer>);
    expect(getSemanticDrawer(container)).toHaveAttribute('tabindex', '-1');
  });

  test('drawer is labelled by header by default', () => {
    const { container } = render(
      <NextDrawer role="region" header="My drawer">
        content
      </NextDrawer>
    );
    const drawer = getSemanticDrawer(container);
    const labelledById = drawer.getAttribute('aria-labelledby');
    expect(labelledById).toBeTruthy();
    expect(container.querySelector(`#${labelledById}`)?.textContent).toBe('My drawer');
  });

  test('ariaLabel is applied to drawer', () => {
    const { container } = render(
      <NextDrawer role="region" ariaLabel="Custom label">
        content
      </NextDrawer>
    );
    expect(getSemanticDrawer(container)).toHaveAttribute('aria-label', 'Custom label');
  });

  test('autoFocus moves focus into drawer on open', () => {
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

  test('ref.focus() moves focus to drawer', () => {
    const ref = createRef<NextDrawerProps.Ref>();
    const { container } = render(
      <NextDrawer role="region" ref={ref}>
        content
      </NextDrawer>
    );
    act(() => ref.current!.focus());
    expect(getSemanticDrawer(container)).toHaveFocus();
  });
});

describe('role="presentation"', () => {
  test('drawer has no role attribute', () => {
    const { container } = render(<NextDrawer role="presentation">content</NextDrawer>);
    expect(getSemanticDrawer(container)).not.toHaveAttribute('role');
  });

  test('drawer has no tabIndex', () => {
    const { container } = render(<NextDrawer role="presentation">content</NextDrawer>);
    expect(getSemanticDrawer(container)).not.toHaveAttribute('tabindex');
  });

  test('ariaLabel is not applied to drawer', () => {
    const { container } = render(
      <NextDrawer role="presentation" ariaLabel="ignored">
        content
      </NextDrawer>
    );
    expect(getSemanticDrawer(container)).not.toHaveAttribute('aria-label');
  });

  test('ariaLabelledby is not applied to drawer', () => {
    const { container } = render(
      <NextDrawer role="presentation" header="Header">
        content
      </NextDrawer>
    );
    expect(getSemanticDrawer(container)).not.toHaveAttribute('aria-labelledby');
  });

  test('autoFocus does not move focus into drawer on open', () => {
    const { container, rerender } = render(
      <NextDrawer role="presentation" open={false} onClose={jest.fn()}>
        content
      </NextDrawer>
    );
    rerender(
      <NextDrawer role="presentation" open={true} onClose={jest.fn()}>
        content
      </NextDrawer>
    );
    expect(getSemanticDrawer(container)).not.toHaveFocus();
  });
});
