// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import FocusLock, { FocusLockProps } from '../../../../../lib/components/internal/components/focus-lock';

type TestFixtureProps = Omit<FocusLockProps, 'children'> & { unmount?: boolean };
function TestFixture({ unmount = false, ...props }: TestFixtureProps) {
  return (
    <>
      <button id="initial" />
      {!unmount && (
        <FocusLock {...props}>
          <button id="inner" />
        </FocusLock>
      )}
    </>
  );
}

function renderFocusLock(props: TestFixtureProps = {}) {
  const { rerender } = render(<TestFixture {...props} />);
  return {
    focusInitial() {
      document.querySelector<HTMLButtonElement>('#initial')!.focus();
    },
    getInitial() {
      return document.querySelector<HTMLButtonElement>('#initial');
    },
    getInner() {
      return document.querySelector<HTMLButtonElement>('#inner');
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
