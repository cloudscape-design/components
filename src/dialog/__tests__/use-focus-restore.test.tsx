// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import { useFocusRestore } from '../../../lib/components/dialog/use-focus-restore';

function Container() {
  const ref = useFocusRestore();
  return (
    <div ref={ref}>
      <button id="first" />
      <button id="last" />
    </div>
  );
}

function TestFixture({ unmounted }: { unmounted: boolean }) {
  return (
    <>
      <button id="before" />
      {!unmounted && <Container />}
      <button id="outside" />
    </>
  );
}

function renderFocusRestore() {
  const { rerender } = render(<TestFixture unmounted={true} />);
  return {
    mount: () => rerender(<TestFixture unmounted={false} />),
    unmount: () => rerender(<TestFixture unmounted={true} />),
    focusBefore: () => document.querySelector<HTMLButtonElement>('#before')!.focus(),
    focusOutside: () => document.querySelector<HTMLButtonElement>('#outside')!.focus(),
    before: () => document.querySelector<HTMLButtonElement>('#before'),
    first: () => document.querySelector<HTMLButtonElement>('#first'),
    outside: () => document.querySelector<HTMLButtonElement>('#outside'),
  };
}

describe('useFocusRestore', () => {
  it('moves focus to the first focusable element on mount', () => {
    const { mount, first } = renderFocusRestore();
    mount();
    expect(first()).toHaveFocus();
  });

  it('returns focus to the previously focused element when removed from DOM', () => {
    const { mount, unmount, focusBefore, before, first } = renderFocusRestore();

    focusBefore();
    mount();
    expect(first()).toHaveFocus();

    unmount();
    expect(before()).toHaveFocus();
  });

  it('preserves focus moved outside the container before it is removed from DOM', () => {
    const { mount, unmount, focusBefore, focusOutside, outside } = renderFocusRestore();

    focusBefore();
    mount();
    focusOutside();
    unmount();

    expect(outside()).toHaveFocus();
  });
});
