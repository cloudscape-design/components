// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import {
  useFocusRestore,
  UseFocusRestoreOptions,
} from '../../../../../lib/components/internal/components/focus-lock/use-focus-restore';

function Container(options: UseFocusRestoreOptions) {
  const ref = useFocusRestore(options);
  return (
    <div ref={ref}>
      <button id="first" />
      <button id="last" />
    </div>
  );
}

function TestFixture({ unmounted, ...options }: UseFocusRestoreOptions & { unmounted: boolean }) {
  return (
    <>
      <button id="before" />
      {!unmounted && <Container {...options} />}
    </>
  );
}

function renderFocusRestore(options: UseFocusRestoreOptions = {}) {
  const { rerender } = render(<TestFixture unmounted={true} {...options} />);
  return {
    mount: () => rerender(<TestFixture unmounted={false} {...options} />),
    unmount: () => rerender(<TestFixture unmounted={true} {...options} />),
    focusBefore: () => document.querySelector<HTMLButtonElement>('#before')!.focus(),
    before: () => document.querySelector<HTMLButtonElement>('#before'),
    first: () => document.querySelector<HTMLButtonElement>('#first'),
  };
}

describe('useFocusRestore', () => {
  it('does nothing if autoFocus=false', () => {
    const { mount } = renderFocusRestore({ autoFocus: false });
    mount();
    expect(document.body).toHaveFocus();
  });

  it('moves focus to the first focusable element on mount', () => {
    const { mount, first } = renderFocusRestore({ autoFocus: true });
    mount();
    expect(first()).toHaveFocus();
  });

  it('returns focus to the previously focused element when removed from DOM', () => {
    const { mount, unmount, focusBefore, before, first } = renderFocusRestore({
      autoFocus: true,
      restoreFocus: true,
    });

    focusBefore();
    mount();
    expect(first()).toHaveFocus();

    unmount();
    expect(before()).toHaveFocus();
  });

  it('does not restore focus when restoreFocus=false', () => {
    const { mount, unmount, focusBefore, before, first } = renderFocusRestore({
      autoFocus: true,
      restoreFocus: false,
    });

    focusBefore();
    mount();
    expect(first()).toHaveFocus();

    unmount();
    expect(before()).not.toHaveFocus();
  });
});
