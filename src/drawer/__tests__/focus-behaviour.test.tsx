// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { createRef } from 'react';
import { act, render } from '@testing-library/react';

import NextDrawer, { NextDrawerProps } from '../../../lib/components/drawer/next';

import drawerStyles from '../../../lib/components/drawer/styles.selectors.js';

function getDrawerElement(container: HTMLElement) {
  return container.querySelector<HTMLElement>(`.${drawerStyles.drawer}`)!;
}

describe('autoFocus', () => {
  test('focuses drawer body when role=region and open changes to true', () => {
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
    expect(getDrawerElement(container)).toHaveFocus();
  });

  test('focuses first interactive element when drawer is not semantic', () => {
    const { container, rerender } = render(
      <NextDrawer role="presentation" open={false} onClose={jest.fn()}>
        <button>action</button>
      </NextDrawer>
    );
    rerender(
      <NextDrawer role="presentation" open={true} onClose={jest.fn()}>
        <button>action</button>
      </NextDrawer>
    );
    expect(container.querySelector('button')).toHaveFocus();
  });

  test('does not move focus on initial render with open=true', () => {
    const { container } = render(
      <NextDrawer open={true} onClose={jest.fn()}>
        content
      </NextDrawer>
    );
    expect(getDrawerElement(container)).not.toHaveFocus();
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
    expect(getDrawerElement(container)).not.toHaveFocus();
  });
});

describe('ref.focus()', () => {
  test('moves focus to drawer body', () => {
    const ref = createRef<NextDrawerProps.Ref>();
    const { container } = render(
      <NextDrawer role="region" ref={ref}>
        content
      </NextDrawer>
    );
    act(() => ref.current!.focus());
    expect(getDrawerElement(container)).toHaveFocus();
  });

  test('does not move focus to drawer body when role="presentation"', () => {
    const ref = createRef<NextDrawerProps.Ref>();
    const { container } = render(
      <NextDrawer role="presentation" ref={ref}>
        content
      </NextDrawer>
    );
    act(() => ref.current!.focus());
    expect(getDrawerElement(container)).not.toHaveFocus();
  });
});

describe('return focus', () => {
  test('returns focus to previously focused element when drawer closes', () => {
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

  test('silently no-ops when previously focused element is removed from DOM', () => {
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
});
