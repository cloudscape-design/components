// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { fireEvent, render } from '@testing-library/react';

import FocusLock, { FocusLockProps } from '../../../../../lib/components/internal/components/focus-lock';

type TestFixtureProps = Omit<FocusLockProps, 'children'> & { unmount?: boolean };
function TestFixture({ unmount = false, ...props }: TestFixtureProps) {
  return (
    <>
      <button id="before" />
      {!unmount && (
        <FocusLock {...props}>
          <button id="first" />
          <button id="last" />
        </FocusLock>
      )}
      <button id="after" />
    </>
  );
}

function renderFocusLock(props: TestFixtureProps = {}) {
  const { rerender } = render(<TestFixture {...props} />);
  return {
    focusInitial() {
      document.querySelector<HTMLButtonElement>('#before')!.focus();
    },
    getInitial() {
      return document.querySelector<HTMLButtonElement>('#before');
    },
    getInner() {
      return document.querySelector<HTMLButtonElement>('#first');
    },
    getBefore() {
      return document.querySelector<HTMLButtonElement>('#before')!;
    },
    getAfter() {
      return document.querySelector<HTMLButtonElement>('#after')!;
    },
    getFirst() {
      return document.querySelector<HTMLButtonElement>('#first')!;
    },
    getLast() {
      return document.querySelector<HTMLButtonElement>('#last')!;
    },
    getTabTraps() {
      return document.querySelectorAll<HTMLDivElement>('[tabindex="0"]:not(button)');
    },
    rerender(props: TestFixtureProps = {}) {
      rerender(<TestFixture {...props} />);
    },
  };
}

describe('Focus lock', () => {
  describe('autoFocus', () => {
    it('does nothing if autoFocus=false', () => {
      renderFocusLock();
      expect(document.body).toHaveFocus();
    });

    it('moves focus to the first focusable element on mount', () => {
      const { getInner } = renderFocusLock({ autoFocus: true });
      expect(getInner()).toHaveFocus();
    });

    it('does not move focus if lock is disabled', () => {
      renderFocusLock({ autoFocus: true, disabled: true });
      expect(document.body).toHaveFocus();
    });

    it('moves focus to the first focusable element when lock moves from disabled to enabled', () => {
      const { rerender, getInner } = renderFocusLock({ autoFocus: true, disabled: true });
      expect(document.body).toHaveFocus();
      rerender({ autoFocus: true, disabled: false });
      expect(getInner()).toHaveFocus();
    });
  });

  describe('restoreFocus', () => {
    it('returns focus to the previously focused element when disabled', () => {
      // Focus the initial element.
      const { rerender, focusInitial, getInner, getInitial } = renderFocusLock({
        autoFocus: true,
        restoreFocus: true,
        disabled: true,
      });
      focusInitial();

      // Move focus into the lock.
      rerender({ autoFocus: true, restoreFocus: true, disabled: false });
      expect(getInner()).toHaveFocus();

      // Disable the focus lock, returning focus back to the initial element.
      rerender({ autoFocus: true, restoreFocus: true, disabled: true });
      expect(getInitial()).toHaveFocus();
    });

    it('returns focus to the previously focused element when removed from DOM', () => {
      // Focus the initial element.
      const { rerender, focusInitial, getInner, getInitial } = renderFocusLock({
        autoFocus: true,
        restoreFocus: true,
        unmount: true,
      });
      focusInitial();

      // Move focus into the lock.
      rerender({ autoFocus: true, restoreFocus: true, unmount: false });
      expect(getInner()).toHaveFocus();

      // Remove the focus lock, returning focus back to the initial element.
      rerender({ autoFocus: true, restoreFocus: true, unmount: true });
      expect(getInitial()).toHaveFocus();
    });
  });
});

describe('Focus lock — tab trap direction', () => {
  function focusTrap(trap: HTMLElement, relatedTarget: HTMLElement | null) {
    fireEvent.focus(trap, { relatedTarget });
  }

  it('wraps to last element when tabbing backward from first element (hits first trap)', () => {
    const { getFirst, getLast, getTabTraps } = renderFocusLock();
    const firstTrap = getTabTraps()[0];

    // Simulate: focus was on first inner element, user tabs backward → hits first trap
    focusTrap(firstTrap, getFirst());

    expect(getLast()).toHaveFocus();
  });

  it('wraps to first element when tabbing forward from last element (hits last trap)', () => {
    const { getFirst, getLast, getTabTraps } = renderFocusLock();
    const traps = getTabTraps();
    const lastTrap = traps[traps.length - 1];

    // Simulate: focus was on last inner element, user tabs forward → hits last trap
    focusTrap(lastTrap, getLast());

    expect(getFirst()).toHaveFocus();
  });

  it('focuses first element when entering from before (hits first trap from outside)', () => {
    const { getBefore, getFirst, getTabTraps } = renderFocusLock();
    const firstTrap = getTabTraps()[0];

    // Simulate: focus was on element before the lock, user tabs forward → hits first trap
    focusTrap(firstTrap, getBefore());

    expect(getFirst()).toHaveFocus();
  });

  it('focuses last element when entering from after (hits last trap from outside)', () => {
    const { getAfter, getLast, getTabTraps } = renderFocusLock();
    const traps = getTabTraps();
    const lastTrap = traps[traps.length - 1];

    // Simulate: focus was on element after the lock, user tabs backward → hits last trap
    focusTrap(lastTrap, getAfter());

    expect(getLast()).toHaveFocus();
  });

  it('does not trap focus when disabled', () => {
    const { getFirst, getLast } = renderFocusLock({ disabled: true });
    // When disabled, tab traps have tabIndex=-1 and won't receive focus naturally.
    // Verify that inner elements are not affected.
    getFirst().focus();
    expect(getFirst()).toHaveFocus();
    getLast().focus();
    expect(getLast()).toHaveFocus();
  });
});
