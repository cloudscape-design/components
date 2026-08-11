// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { fireEvent, render } from '@testing-library/react';

import Dialog from '../../../lib/components/dialog';

function renderDialog(jsx: React.ReactElement) {
  const { container } = render(jsx);
  const dialog = container.querySelector<HTMLElement>('[role="dialog"]')!;
  return { container, dialog };
}

test('renders a role="dialog" element', () => {
  const { dialog } = renderDialog(<Dialog header="Title">content</Dialog>);
  expect(dialog).not.toBeNull();
  expect(dialog).toHaveTextContent('content');
});

test('uses the header as the accessible name via aria-labelledby', () => {
  const { dialog } = renderDialog(<Dialog header="What's your goal?">body</Dialog>);
  const labelledBy = dialog.getAttribute('aria-labelledby');
  expect(labelledBy).toBeTruthy();
  const header = document.getElementById(labelledBy!);
  expect(header).toHaveTextContent("What's your goal?");
});

test('does not set aria-modal', () => {
  const { dialog } = renderDialog(<Dialog header="Title">content</Dialog>);
  expect(dialog.getAttribute('aria-modal')).toBeNull();
});

test('always renders a dismiss button and fires onDismiss when clicked', () => {
  const onDismiss = jest.fn();
  const { dialog } = renderDialog(
    <Dialog header="Title" i18nStrings={{ dismissAriaLabel: 'Close' }} onDismiss={onDismiss}>
      content
    </Dialog>
  );
  const dismissButton = dialog.querySelector<HTMLButtonElement>('[aria-label="Close"]')!;
  expect(dismissButton).not.toBeNull();
  fireEvent.click(dismissButton);
  expect(onDismiss).toHaveBeenCalledTimes(1);
});

test('fires onDismiss when Escape is pressed inside the dialog', () => {
  const onDismiss = jest.fn();
  const { dialog } = renderDialog(
    <Dialog header="Title" onDismiss={onDismiss}>
      content
    </Dialog>
  );
  fireEvent.keyDown(dialog, { key: 'Escape' });
  expect(onDismiss).toHaveBeenCalledTimes(1);
});

test('moves focus to the header on mount by default', () => {
  const { dialog } = renderDialog(<Dialog header="Title">content</Dialog>);
  const labelledBy = dialog.getAttribute('aria-labelledby')!;
  expect(document.activeElement).toBe(document.getElementById(labelledBy));
});

test('does not move focus when initialFocus is none', () => {
  const { dialog } = renderDialog(
    <Dialog header="Title" initialFocus="none">
      content
    </Dialog>
  );
  const labelledBy = dialog.getAttribute('aria-labelledby')!;
  expect(document.activeElement).not.toBe(document.getElementById(labelledBy));
});
