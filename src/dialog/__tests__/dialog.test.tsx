// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';

import Dialog, { DialogProps } from '../../../lib/components/dialog';
import TestI18nProvider from '../../../lib/components/i18n/testing';
import createWrapper from '../../../lib/components/test-utils/dom';

function renderDialog(props: Partial<DialogProps> = {}) {
  const renderResult = render(<Dialog header="Title" onDismiss={() => {}} {...props} />);
  return createWrapper(renderResult.container).findDialog()!;
}

describe('Dialog', () => {
  describe('root element', () => {
    test('renders with role="dialog"', () => {
      const wrapper = renderDialog({ children: 'content' });
      expect(wrapper.getElement()).toHaveAttribute('role', 'dialog');
      expect(wrapper.getElement()).toHaveTextContent('content');
    });

    test('does not set aria-modal', () => {
      const wrapper = renderDialog();
      expect(wrapper.getElement()).not.toHaveAttribute('aria-modal');
    });
  });

  describe('header', () => {
    test('uses the header as the accessible name via aria-labelledby', () => {
      const wrapper = renderDialog({ header: "What's your goal?" });
      expect(wrapper.getElement()).toHaveAttribute('aria-labelledby', wrapper.findHeader()!.getElement().id);
      expect(wrapper.findHeader()!.getElement()).toHaveTextContent("What's your goal?");
    });
  });

  describe('headerActions', () => {
    test('renders headerActions as ReactNode', () => {
      const wrapper = renderDialog({
        headerActions: <span data-testid="custom">Custom action</span>,
      });
      expect(wrapper.findHeaderActions()!.getElement().querySelector('[data-testid="custom"]')).toHaveTextContent(
        'Custom action'
      );
    });

    test('does not expose headerActions when not provided', () => {
      const wrapper = renderDialog();
      expect(wrapper.findHeaderActions()).toBeNull();
    });
  });

  describe('children', () => {
    test('renders children as ReactNode', () => {
      const wrapper = renderDialog({
        children: <div data-testid="custom">Custom content</div>,
      });
      expect(wrapper.findContent()!.getElement().querySelector('[data-testid="custom"]')).toHaveTextContent(
        'Custom content'
      );
    });

    test('does not render content when children are not provided', () => {
      const wrapper = renderDialog();
      expect(wrapper.findContent()).toBeNull();
    });
  });

  describe('footer', () => {
    test('renders footer as ReactNode', () => {
      const wrapper = renderDialog({
        footer: <div data-testid="custom">Custom footer</div>,
      });
      expect(wrapper.findFooter()!.getElement().querySelector('[data-testid="custom"]')).toHaveTextContent(
        'Custom footer'
      );
    });

    test('does not render footer when not provided', () => {
      const wrapper = renderDialog();
      expect(wrapper.findFooter()).toBeNull();
    });
  });

  describe('i18n', () => {
    const providerLabel = 'Close dialog from provider';

    function renderWithI18n(props: Partial<DialogProps> = {}) {
      const { container } = render(
        <TestI18nProvider messages={{ dialog: { 'i18nStrings.dismissAriaLabel': providerLabel } }}>
          <Dialog header="Title" onDismiss={() => {}} {...props} />
        </TestI18nProvider>
      );
      return createWrapper(container).findDialog()!;
    }

    test('uses dismissAriaLabel from i18n provider', () => {
      const wrapper = renderWithI18n();
      expect(wrapper.findDismissButton()!.getElement()).toHaveAccessibleName(providerLabel);
    });

    test('uses dismissAriaLabel prop over i18n provider', () => {
      const wrapper = renderWithI18n({ i18nStrings: { dismissAriaLabel: 'Close dialog from prop' } });
      expect(wrapper.findDismissButton()!.getElement()).toHaveAccessibleName('Close dialog from prop');
    });
  });

  describe('dismissal', () => {
    test('always renders a dismiss button and fires onDismiss with the close button reason', () => {
      const onDismiss = jest.fn();
      const wrapper = renderDialog({
        children: 'content',
        i18nStrings: { dismissAriaLabel: 'Close' },
        onDismiss,
      });
      expect(wrapper.findDismissButton()).not.toBeNull();
      wrapper.findDismissButton()!.click();
      expect(onDismiss).toHaveBeenCalledWith(expect.objectContaining({ detail: { reason: 'closeButton' } }));
    });

    test('fires onDismiss with the keyboard reason and restores focus when Escape is pressed', async () => {
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

      const wrapper = createWrapper(container).findDialog()!;
      expect(wrapper.getElement().contains(document.activeElement)).toBe(true);
      fireEvent.keyDown(wrapper.getElement(), { key: 'Escape' });

      expect(onDismiss).toHaveBeenCalledWith(expect.objectContaining({ detail: { reason: 'keyboard' } }));
      await waitFor(() => expect(document.activeElement).toBe(trigger));
    });
  });

  describe('focus management', () => {
    test('does not move focus when the dialog element is unavailable', () => {
      const componentToolkit = jest.requireActual<typeof import('@cloudscape-design/component-toolkit/internal')>(
        '@cloudscape-design/component-toolkit/internal'
      );
      const useMergeRefsSpy = jest.spyOn(componentToolkit, 'useMergeRefs').mockReturnValueOnce(() => {});

      const activeElement = document.activeElement;
      const wrapper = renderDialog({
        i18nStrings: { dismissAriaLabel: 'Close' },
      });

      expect(document.activeElement).toBe(activeElement);
      expect(wrapper.findDismissButton()!.getElement()).not.toHaveFocus();
      useMergeRefsSpy.mockRestore();
    });

    test('moves focus to the close button when it mounts', () => {
      const wrapper = renderDialog({
        children: 'content',
        i18nStrings: { dismissAriaLabel: 'Close' },
      });
      expect(document.activeElement).toBe(wrapper.findDismissButton()!.getElement());
    });

    test('moves focus to the first headerActions control when present', () => {
      const wrapper = renderDialog({
        children: 'content',
        headerActions: <button data-testid="header-action">Prev</button>,
        i18nStrings: { dismissAriaLabel: 'Close' },
      });
      expect(document.activeElement).toBe(
        wrapper.findHeaderActions()!.getElement().querySelector('[data-testid="header-action"]')
      );
    });

    test('does not restore focus when focus was already inside the dialog on mount', async () => {
      const trigger = document.createElement('button');
      document.body.appendChild(trigger);
      trigger.focus();

      const { container, unmount } = render(
        <Dialog
          header="Title"
          headerActions={<button autoFocus={true}>Action</button>}
          i18nStrings={{ dismissAriaLabel: 'Close' }}
          onDismiss={() => {}}
        />
      );
      const wrapper = createWrapper(container).findDialog()!;
      expect(wrapper.findHeaderActions()!.getElement().querySelector('button')).toHaveFocus();

      unmount();
      await new Promise(resolve => setTimeout(resolve, 0));
      expect(trigger).not.toHaveFocus();
      trigger.remove();
    });

    test('moves focus in on mount and restores focus on unmount', async () => {
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
      const wrapper = createWrapper(container).findDialog()!;
      expect(document.activeElement).toBe(wrapper.findDismissButton()!.getElement());

      rerender(view(false));
      await waitFor(() => expect(document.activeElement).toBe(trigger));
    });

    test('restores the original trigger when the consumer moves focus while dismissing', async () => {
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

      const wrapper = createWrapper(container).findDialog()!;
      expect(document.activeElement).toBe(wrapper.findDismissButton()!.getElement());
      wrapper.findDismissButton()!.click();

      await waitFor(() => expect(document.activeElement).toBe(trigger));
    });
  });
});
