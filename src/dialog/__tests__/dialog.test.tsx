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
  const { dialog } = renderDialog(
    <Dialog header="Title" onDismiss={() => {}}>
      content
    </Dialog>
  );
  expect(dialog).not.toBeNull();
  expect(dialog).toHaveTextContent('content');
});

test('uses the header as the accessible name via aria-labelledby', () => {
  const { dialog } = renderDialog(
    <Dialog header="What's your goal?" onDismiss={() => {}}>
      body
    </Dialog>
  );
  const labelledBy = dialog.getAttribute('aria-labelledby');
  expect(labelledBy).toBeTruthy();
  const header = document.getElementById(labelledBy!);
  expect(header).toHaveTextContent("What's your goal?");
});

test('does not set aria-modal', () => {
  const { dialog } = renderDialog(
    <Dialog header="Title" onDismiss={() => {}}>
      content
    </Dialog>
  );
  expect(dialog.getAttribute('aria-modal')).toBeNull();
});

test('always renders a dismiss button and fires onDismiss with the close button reason', () => {
  const onDismiss = jest.fn();
  const { dialog } = renderDialog(
    <Dialog header="Title" i18nStrings={{ dismissAriaLabel: 'Close' }} onDismiss={onDismiss}>
      content
    </Dialog>
  );
  const dismissButton = dialog.querySelector<HTMLButtonElement>('[aria-label="Close"]')!;
  expect(dismissButton).not.toBeNull();
  fireEvent.click(dismissButton);
  expect(onDismiss).toHaveBeenCalledWith(expect.objectContaining({ detail: { reason: 'closeButton' } }));
});

test('fires onDismiss with the keyboard reason and restores focus when Escape is pressed', () => {
  const onDismiss = jest.fn();

  function Harness() {
    const [open, setOpen] = React.useState(false);
    return (
      <>
        <button data-testid="trigger" onClick={() => setOpen(true)}>
          Open
        </button>
        {open && (
          <Dialog
            header="Title"
            i18nStrings={{ dismissAriaLabel: 'Close' }}
            onDismiss={event => {
              onDismiss(event);
              setOpen(false);
            }}
          >
            content
          </Dialog>
        )}
      </>
    );
  }

  const { container } = render(<Harness />);
  const trigger = container.querySelector<HTMLButtonElement>('[data-testid="trigger"]')!;
  trigger.focus();
  fireEvent.click(trigger);

  const dialog = container.querySelector<HTMLElement>('[role="dialog"]')!;
  expect(dialog.contains(document.activeElement)).toBe(true);
  fireEvent.keyDown(dialog, { key: 'Escape' });

  expect(onDismiss).toHaveBeenCalledWith(expect.objectContaining({ detail: { reason: 'keyboard' } }));
  expect(document.activeElement).toBe(trigger);
});

test('moves focus to the close button when it mounts', () => {
  const { dialog } = renderDialog(
    <Dialog header="Title" i18nStrings={{ dismissAriaLabel: 'Close' }} onDismiss={() => {}}>
      content
    </Dialog>
  );
  expect(document.activeElement).toBe(dialog.querySelector('[aria-label="Close"]'));
});

test('moves focus to the first headerActions control when present', () => {
  const { dialog } = renderDialog(
    <Dialog
      header="Title"
      headerActions={<button data-testid="header-action">Prev</button>}
      i18nStrings={{ dismissAriaLabel: 'Close' }}
      onDismiss={() => {}}
    >
      content
    </Dialog>
  );
  expect(document.activeElement).toBe(dialog.querySelector('[data-testid="header-action"]'));
});

test('moves focus in on mount and restores focus on unmount', () => {
  const view = (open: boolean) => (
    <>
      <button data-testid="trigger">Open</button>
      {open && (
        <Dialog header="Title" i18nStrings={{ dismissAriaLabel: 'Close' }} onDismiss={() => {}}>
          content
        </Dialog>
      )}
    </>
  );
  const { container, rerender } = render(view(false));
  const trigger = container.querySelector<HTMLButtonElement>('[data-testid="trigger"]')!;
  trigger.focus();
  expect(document.activeElement).toBe(trigger);

  rerender(view(true));
  const dialog = container.querySelector<HTMLElement>('[role="dialog"]')!;
  expect(document.activeElement).toBe(dialog.querySelector('[aria-label="Close"]'));

  rerender(view(false));
  expect(document.activeElement).toBe(trigger);
});

test('does not override focus moved by the consumer while dismissing', () => {
  function Harness() {
    const [open, setOpen] = React.useState(false);
    const focusTargetRef = React.useRef<HTMLButtonElement>(null);
    return (
      <>
        <button data-testid="trigger" onClick={() => setOpen(true)}>
          Open
        </button>
        <button ref={focusTargetRef} data-testid="consumer-focus-target">
          Consumer focus target
        </button>
        {open && (
          <Dialog
            header="Title"
            i18nStrings={{ dismissAriaLabel: 'Close' }}
            onDismiss={() => {
              setOpen(false);
              focusTargetRef.current?.focus();
            }}
          >
            content
          </Dialog>
        )}
      </>
    );
  }

  const { container } = render(<Harness />);
  const trigger = container.querySelector<HTMLButtonElement>('[data-testid="trigger"]')!;
  trigger.focus();
  fireEvent.click(trigger);

  const dismissButton = container.querySelector<HTMLButtonElement>('[aria-label="Close"]')!;
  expect(document.activeElement).toBe(dismissButton);
  fireEvent.click(dismissButton);

  expect(document.activeElement).toBe(
    container.querySelector<HTMLButtonElement>('[data-testid="consumer-focus-target"]')
  );
});

test('renders headerActions before the dismiss button', () => {
  const { dialog } = renderDialog(
    <Dialog
      header="Title"
      headerActions={<button data-testid="header-action">Prev</button>}
      i18nStrings={{ dismissAriaLabel: 'Close' }}
      onDismiss={() => {}}
    >
      content
    </Dialog>
  );
  const action = dialog.querySelector('[data-testid="header-action"]')!;
  const dismiss = dialog.querySelector('[aria-label="Close"]')!;
  expect(action).not.toBeNull();
  expect(dismiss).not.toBeNull();
  expect(action.compareDocumentPosition(dismiss) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
});
