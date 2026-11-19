// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { createRef } from 'react';
import { act, render } from '@testing-library/react';

import Drawer, { DrawerProps } from '../../../lib/components/drawer';

import drawerStyles from '../../../lib/components/drawer/styles.selectors.js';

function getDrawerElement(container: HTMLElement) {
  return container.querySelector<HTMLElement>(`.${drawerStyles.drawer}`)!;
}

describe('autoFocus', () => {
  test('focuses drawer body when role=region and open changes to true', () => {
    const { container, rerender } = render(
      <Drawer role="region" open={false} onClose={jest.fn()}>
        content
      </Drawer>
    );
    rerender(
      <Drawer role="region" open={true} onClose={jest.fn()}>
        content
      </Drawer>
    );
    expect(getDrawerElement(container)).toHaveFocus();
  });

  test('focuses first interactive element when drawer is not semantic', () => {
    const { container, rerender } = render(
      <Drawer role="presentation" open={false} onClose={jest.fn()}>
        <button>action</button>
      </Drawer>
    );
    rerender(
      <Drawer role="presentation" open={true} onClose={jest.fn()}>
        <button>action</button>
      </Drawer>
    );
    expect(container.querySelector('button')).toHaveFocus();
  });

  test('does not move focus on initial render with open=true', () => {
    const { container } = render(
      <Drawer open={true} onClose={jest.fn()}>
        content
      </Drawer>
    );
    expect(getDrawerElement(container)).not.toHaveFocus();
  });

  test('autoFocus=false prevents focus from moving into drawer on open', () => {
    const { container, rerender } = render(
      <Drawer open={false} onClose={jest.fn()} focusBehavior={{ autoFocus: false }}>
        content
      </Drawer>
    );
    rerender(
      <Drawer open={true} onClose={jest.fn()} focusBehavior={{ autoFocus: false }}>
        content
      </Drawer>
    );
    expect(getDrawerElement(container)).not.toHaveFocus();
  });
});

describe('ref.focus()', () => {
  test('moves focus to drawer body', () => {
    const ref = createRef<DrawerProps.Ref>();
    const { container } = render(
      <Drawer role="region" ref={ref}>
        content
      </Drawer>
    );
    act(() => ref.current!.focus());
    expect(getDrawerElement(container)).toHaveFocus();
  });

  test('does not move focus to drawer body when role="presentation"', () => {
    const ref = createRef<DrawerProps.Ref>();
    const { container } = render(
      <Drawer role="presentation" ref={ref}>
        content
      </Drawer>
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

    const { container, rerender } = render(
      <Drawer role="region" open={false} onClose={jest.fn()}>
        content
      </Drawer>
    );
    expect(getDrawerElement(container)).not.toHaveFocus();

    rerender(
      <Drawer role="region" open={true} onClose={jest.fn()}>
        content
      </Drawer>
    );
    expect(getDrawerElement(container)).toHaveFocus();

    rerender(
      <Drawer role="region" open={false} onClose={jest.fn()}>
        content
      </Drawer>
    );
    expect(getDrawerElement(container)).not.toHaveFocus();

    expect(trigger).toHaveFocus();
    document.body.removeChild(trigger);
  });

  test('focusBehavior.returnFocus is called instead of default return-focus', () => {
    const returnFocus = jest.fn();
    const trigger = document.createElement('button');
    document.body.appendChild(trigger);
    trigger.focus();

    const { rerender } = render(
      <Drawer open={false} onClose={jest.fn()} focusBehavior={{ returnFocus }}>
        content
      </Drawer>
    );
    rerender(
      <Drawer open={true} onClose={jest.fn()} focusBehavior={{ returnFocus }}>
        content
      </Drawer>
    );
    rerender(
      <Drawer open={false} onClose={jest.fn()} focusBehavior={{ returnFocus }}>
        content
      </Drawer>
    );

    expect(returnFocus).toHaveBeenCalledTimes(1);
    document.body.removeChild(trigger);
  });

  test('focusBehavior.returnFocus fires on close even when autoFocus=false', () => {
    const returnFocus = jest.fn();

    const { rerender } = render(
      <Drawer open={false} onClose={jest.fn()} focusBehavior={{ autoFocus: false, returnFocus }}>
        content
      </Drawer>
    );
    rerender(
      <Drawer open={true} onClose={jest.fn()} focusBehavior={{ autoFocus: false, returnFocus }}>
        content
      </Drawer>
    );
    rerender(
      <Drawer open={false} onClose={jest.fn()} focusBehavior={{ autoFocus: false, returnFocus }}>
        content
      </Drawer>
    );

    expect(returnFocus).toHaveBeenCalledTimes(1);
  });

  test('silently no-ops when previously focused element is removed from DOM', () => {
    const trigger = document.createElement('button');
    document.body.appendChild(trigger);
    trigger.focus();

    const { rerender } = render(
      <Drawer open={false} onClose={jest.fn()}>
        content
      </Drawer>
    );
    rerender(
      <Drawer open={true} onClose={jest.fn()}>
        content
      </Drawer>
    );
    document.body.removeChild(trigger);

    expect(() =>
      rerender(
        <Drawer open={false} onClose={jest.fn()}>
          content
        </Drawer>
      )
    ).not.toThrow();
  });
});
