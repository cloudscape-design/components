// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';

import Dialog, { DialogProps } from '../../../lib/components/dialog';
import TestI18nProvider from '../../../lib/components/i18n/testing';
import createWrapper from '../../../lib/components/test-utils/dom';

function renderDialog(props: Partial<DialogProps> = {}) {
  const { header = 'Title', children = 'content', onDismiss = () => {}, ...restProps } = props;
  const renderResult = render(
    <Dialog header={header} onDismiss={onDismiss} {...restProps}>
      {children}
    </Dialog>
  );
  return createWrapper(renderResult.container).findDialog()!;
}

function renderStatefulDialog({
  open = false,
  header = 'Title',
  children = 'content',
  onDismiss = () => {},
  ...dialogProps
}: Partial<DialogProps> & { open?: boolean } = {}) {
  function StatefulDialog() {
    const [isOpen, setIsOpen] = React.useState(open);
    const handleDismiss: DialogProps['onDismiss'] = event => {
      onDismiss(event);
      setIsOpen(false);
    };

    return (
      <>
        <button data-testid="trigger" onClick={() => setIsOpen(true)}>
          Open
        </button>
        <button data-testid="focus-target">Focus target</button>
        {isOpen && (
          <Dialog header={header} onDismiss={handleDismiss} {...dialogProps}>
            {children}
          </Dialog>
        )}
      </>
    );
  }

  const renderResult = render(<StatefulDialog />);
  return {
    container: renderResult.container,
    trigger: renderResult.container.querySelector<HTMLButtonElement>('[data-testid="trigger"]')!,
    focusTarget: renderResult.container.querySelector<HTMLButtonElement>('[data-testid="focus-target"]')!,
    findDialog: () => createWrapper(renderResult.container).findDialog(),
    rerender: () => renderResult.rerender(<StatefulDialog />),
  };
}

describe('Dialog', () => {
  test('renders with role="dialog"', () => {
    const wrapper = renderDialog({ children: 'Custom content' });
    expect(wrapper.getElement()).toHaveAttribute('role', 'dialog');
    expect(wrapper.findContent()!.getElement()).toHaveTextContent('Custom content');
  });

  test('uses the header as the accessible name via aria-labelledby', () => {
    const wrapper = renderDialog({ header: "What's your goal?" });
    expect(wrapper.getElement()).toHaveAttribute('aria-labelledby', wrapper.findHeader()!.getElement().id);
    expect(wrapper.findHeader()!.getElement()).toHaveTextContent("What's your goal?");
  });

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

  test('does not include the dismiss button in headerActions', () => {
    const wrapper = renderDialog({
      headerActions: <button>Action</button>,
      i18nStrings: { dismissAriaLabel: 'Close' },
    });
    expect(wrapper.findHeaderActions()!.getElement()).not.toContainElement(wrapper.findDismissButton()!.getElement());
  });

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

  test('uses dismissAriaLabel from i18n provider', () => {
    const providerLabel = 'Close dialog from provider';
    const { container } = render(
      <TestI18nProvider messages={{ dialog: { 'i18nStrings.dismissAriaLabel': providerLabel } }}>
        <Dialog header="Title" onDismiss={() => {}}>
          content
        </Dialog>
      </TestI18nProvider>
    );
    const wrapper = createWrapper(container).findDialog()!;
    expect(wrapper.findDismissButton()!.getElement()).toHaveAccessibleName(providerLabel);
  });

  test('uses dismissAriaLabel prop over i18n provider', () => {
    const { container } = render(
      <TestI18nProvider messages={{ dialog: { 'i18nStrings.dismissAriaLabel': 'Provider label' } }}>
        <Dialog header="Title" i18nStrings={{ dismissAriaLabel: 'Close dialog from prop' }} onDismiss={() => {}}>
          content
        </Dialog>
      </TestI18nProvider>
    );
    const wrapper = createWrapper(container).findDialog()!;
    expect(wrapper.findDismissButton()!.getElement()).toHaveAccessibleName('Close dialog from prop');
  });

  test('fires onDismiss when the dismiss button is clicked', () => {
    const onDismiss = jest.fn();
    const wrapper = renderDialog({ i18nStrings: { dismissAriaLabel: 'Close' }, onDismiss });
    wrapper.findDismissButton()!.click();
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  test('fires onDismiss when Escape is pressed', () => {
    const onDismiss = jest.fn();
    const wrapper = renderDialog({ onDismiss });
    fireEvent.keyDown(wrapper.getElement(), { key: 'Escape' });
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  test('moves focus to the dismiss button when it mounts', () => {
    const wrapper = renderDialog({ i18nStrings: { dismissAriaLabel: 'Close' } });
    expect(wrapper.findDismissButton()!.getElement()).toHaveFocus();
  });

  test('moves focus to the first headerActions control when present', () => {
    const wrapper = renderDialog({
      headerActions: <button data-testid="header-action">Previous</button>,
      i18nStrings: { dismissAriaLabel: 'Close' },
    });
    expect(wrapper.findHeaderActions()!.getElement().querySelector('[data-testid="header-action"]')).toHaveFocus();
  });

  test('restores focus after dismissal with the dismiss button', async () => {
    const view = renderStatefulDialog({ i18nStrings: { dismissAriaLabel: 'Close' } });
    view.trigger.focus();
    fireEvent.click(view.trigger);
    view.findDialog()!.findDismissButton()!.click();
    await waitFor(() => expect(view.trigger).toHaveFocus());
  });

  test('restores focus after dismissal with Escape', async () => {
    const view = renderStatefulDialog();
    view.trigger.focus();
    fireEvent.click(view.trigger);
    fireEvent.keyDown(view.findDialog()!.getElement(), { key: 'Escape' });
    await waitFor(() => expect(view.trigger).toHaveFocus());
  });

  test('does not move focus again when rerendered', () => {
    const view = renderStatefulDialog({ open: true, i18nStrings: { dismissAriaLabel: 'Close' } });
    expect(view.findDialog()!.findDismissButton()!.getElement()).toHaveFocus();
    view.focusTarget.focus();

    view.rerender();

    expect(view.focusTarget).toHaveFocus();
  });

  test('preserves focus moved by the consumer while dismissing', async () => {
    const view = renderStatefulDialog({
      i18nStrings: { dismissAriaLabel: 'Close' },
      onDismiss: () => document.querySelector<HTMLButtonElement>('[data-testid="focus-target"]')!.focus(),
    });
    view.trigger.focus();
    fireEvent.click(view.trigger);
    view.findDialog()!.findDismissButton()!.click();

    await waitFor(() => expect(view.focusTarget).toHaveFocus());
  });
});
