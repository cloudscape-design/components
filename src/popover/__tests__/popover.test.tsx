// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act, render } from '@testing-library/react';
import createWrapper, { ElementWrapper, PopoverWrapper } from '../../../lib/components/test-utils/dom';
import Popover, { PopoverProps } from '../../../lib/components/popover';
import '../../__a11y__/to-validate-a11y';

import styles from '../../../lib/components/popover/styles.selectors.js';
import { KeyCode } from '@cloudscape-design/test-utils-core/dist/utils';
import TestI18nProvider from '../../../lib/components/internal/i18n/testing';

class PopoverInternalWrapper extends PopoverWrapper {
  findBody({ renderWithPortal } = { renderWithPortal: false }): ElementWrapper | null {
    if (renderWithPortal) {
      return createWrapper().findByClassName(styles.body);
    }
    return this.findByClassName(styles.body);
  }
}

function renderPopover(props: PopoverProps) {
  const { container } = render(<Popover {...props} />);
  return new PopoverInternalWrapper(container);
}

describe('Slots', () => {
  it('renders text trigger correctly', () => {
    const wrapper = renderPopover({ children: 'Trigger' });
    expect(wrapper.findTrigger().getElement().tagName).toBe('BUTTON');
    expect(wrapper.findTrigger().getElement()).toHaveTextContent('Trigger');
  });

  it('renders custom trigger correctly', () => {
    const wrapper = renderPopover({ triggerType: 'custom', children: <button type="button">Trigger</button> });
    expect(wrapper.findTrigger().getElement().tagName).not.toBe('BUTTON');
    expect(wrapper.findTrigger().getElement()).toHaveTextContent('Trigger');
  });

  it('renders the popover header correctly', () => {
    const wrapper = renderPopover({ children: 'Trigger', header: 'Memory error' });
    wrapper.findTrigger().click();
    expect(wrapper.findHeader()!.getElement()).toHaveTextContent('Memory error');
  });

  it('renders the popover content correctly', () => {
    const wrapper = renderPopover({ children: 'Trigger', content: 'There was an error.' });
    wrapper.findTrigger().click();
    expect(wrapper.findContent()!.getElement()).toHaveTextContent('There was an error.');
  });

  it('renders the popover header correctly with portal', () => {
    const wrapper = renderPopover({ children: 'Trigger', header: 'Memory error', renderWithPortal: true });
    wrapper.findTrigger().click();
    expect(wrapper.findHeader({ renderWithPortal: true })!.getElement()).toHaveTextContent('Memory error');
  });

  it('renders the popover content correctly with portal', () => {
    const wrapper = renderPopover({ children: 'Trigger', content: 'There was an error.', renderWithPortal: true });
    wrapper.findTrigger().click();
    expect(wrapper.findContent({ renderWithPortal: true })!.getElement()).toHaveTextContent('There was an error.');
  });
});

describe('Dismiss button', () => {
  it('renders a dismiss button by default', () => {
    const wrapper = renderPopover({ children: 'Trigger', content: 'Hello!' });
    wrapper.findTrigger().click();
    expect(wrapper.findDismissButton()).not.toBeNull();
  });

  it('does not render a dismiss button if dismissButton is false', () => {
    const wrapper = renderPopover({ children: 'Trigger', dismissButton: false });
    wrapper.findTrigger().click();
    expect(wrapper.findDismissButton()).toBeNull();
  });

  it('renders a dismiss button in portal', () => {
    const wrapper = renderPopover({ children: 'Trigger', content: 'Hello!', renderWithPortal: true });
    wrapper.findTrigger().click();
    expect(wrapper.findDismissButton({ renderWithPortal: true })).not.toBeNull();
  });
});

[false, true].forEach(renderWithPortal => {
  describe(`Visibility renderWithPortal=${renderWithPortal}`, () => {
    it('does not initially render the popover body', () => {
      const wrapper = renderPopover({ children: 'Trigger', content: 'Popover', renderWithPortal });
      expect(wrapper.findBody({ renderWithPortal })).toBeNull();
    });

    it('renders the popover body when a click is fired from the trigger', () => {
      const wrapper = renderPopover({ children: 'Trigger', content: 'Popover', renderWithPortal });
      wrapper.findTrigger().click();
      expect(wrapper.findBody({ renderWithPortal })).toBeTruthy();
    });

    it('hides the popover body when an element outside the popover is clicked', () => {
      const wrapper = renderPopover({ children: 'Trigger', content: 'Popover', renderWithPortal });
      wrapper.findTrigger().click();
      act(() => {
        document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      });
      expect(wrapper.findBody({ renderWithPortal })).toBeNull();
    });

    it('does not hide the popover body when a click event is fired inside the body', () => {
      const wrapper = renderPopover({ children: 'Trigger', content: 'Popover', renderWithPortal });
      wrapper.findTrigger().click();
      act(() => {
        wrapper
          .findBody({ renderWithPortal })!
          .getElement()
          .dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      });
      expect(wrapper.findBody({ renderWithPortal })).toBeTruthy();
    });

    it('does not hide the popover body when a click is fired on the trigger', () => {
      const wrapper = renderPopover({ children: 'Trigger', content: 'Popover', renderWithPortal });
      wrapper.findTrigger().click();
      act(() => {
        wrapper
          .findTrigger()
          .getElement()
          .dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      });
      expect(wrapper.findBody({ renderWithPortal })).toBeTruthy();
    });
  });
});

describe('Focus behavior', () => {
  it('moves focus to the dismiss button on open if dismiss button is present', () => {
    const wrapper = renderPopover({ children: 'Trigger', content: 'Popover' });
    act(() => {
      wrapper.findTrigger().click();
    });
    expect(document.activeElement).toBe(wrapper.findDismissButton()!.getElement());
  });

  it('does not move focus on open if dismiss button is not present', () => {
    const wrapper = renderPopover({ children: 'Trigger', content: 'Popover', dismissButton: false });
    act(() => {
      wrapper.findTrigger().click();
    });
    expect(document.activeElement).not.toBe(wrapper.findBody()!.getElement());
  });

  it('moves focus to the dismiss button on open if dismiss button is present - with portal', () => {
    const wrapper = renderPopover({ children: 'Trigger', content: 'Popover', renderWithPortal: true });
    act(() => {
      wrapper.findTrigger().click();
    });
    expect(document.activeElement).toBe(wrapper.findDismissButton({ renderWithPortal: true })!.getElement());
  });

  it('does not move focus on open if dismiss button is not present - with portal', () => {
    const wrapper = renderPopover({
      children: 'Trigger',
      content: 'Popover',
      dismissButton: false,
      renderWithPortal: true,
    });
    act(() => {
      wrapper.findTrigger().click();
    });
    expect(document.activeElement).not.toBe(wrapper.findBody({ renderWithPortal: true })!.getElement());
  });
});

describe('Keyboard interaction', () => {
  it('hides the popover body on tab if dismiss button is not present', () => {
    const wrapper = renderPopover({ children: 'Trigger', content: 'Popover', dismissButton: false });
    wrapper.findTrigger().click();
    wrapper.findTrigger().keydown(KeyCode.tab);
    expect(wrapper.findBody()).toBeNull();
  });

  it('hides the popover body on esc', () => {
    const wrapper = renderPopover({ children: 'Trigger', content: 'Popover' });
    wrapper.findTrigger().click();
    wrapper.findTrigger().keydown(KeyCode.escape);
    expect(wrapper.findBody()).toBeNull();
  });

  it('hides the popover body on esc when dismiss button is not present', () => {
    const wrapper = renderPopover({ children: 'Trigger', content: 'Popover', dismissButton: false });
    wrapper.findTrigger().click();
    wrapper.findTrigger().keydown(KeyCode.escape);
    expect(wrapper.findBody()).toBeNull();
  });
});

describe('i18n', () => {
  it('uses dismissAriaLabel from i18n provider', () => {
    const { container } = render(
      <TestI18nProvider messages={{ popover: { dismissAriaLabel: 'Custom dismiss' } }}>
        <Popover content="Content">Trigger</Popover>
      </TestI18nProvider>
    );
    const wrapper = createWrapper(container).findPopover()!;
    wrapper.findTrigger().click();
    expect(wrapper.findDismissButton()!.getElement()).toHaveAttribute('aria-label', 'Custom dismiss');
  });
});

describe('ARIA labels', () => {
  it('adds aria-haspopup to the trigger button if triggerType is text', () => {
    const wrapper = renderPopover({ children: 'Trigger', content: 'Popover' });
    expect(wrapper.findTrigger().getElement()).toHaveAttribute('aria-haspopup');
  });

  it('sets the body aria-labelledby to the header container id if dismissButton is true and header is present', () => {
    const wrapper = renderPopover({ children: 'Trigger', content: 'Popover', header: 'Header time' });
    wrapper.findTrigger().click();
    const headerId = wrapper.findHeader()!.getElement().id;
    expect(wrapper.findBody()!.getElement()).toHaveAttribute('aria-labelledby', headerId);
  });

  it('does not set aria-labelledby when there is no header', () => {
    const wrapper = renderPopover({ children: 'Trigger', content: 'Popover' });
    wrapper.findTrigger().click();
    expect(wrapper.findBody()!.getElement()).not.toHaveAttribute('aria-labelledby');
  });

  it('does not use aria-live if dismissButton is true', () => {
    const wrapper = renderPopover({ children: 'Trigger', content: 'Popover' });
    wrapper.findTrigger().click();
    expect(wrapper.find('[aria-live]')).toBeNull();
  });

  it('uses aria-live if dismissButton is false', () => {
    const wrapper = renderPopover({ children: 'Trigger', content: 'Popover', dismissButton: false });
    wrapper.findTrigger().click();
    expect(wrapper.find('[aria-live="polite"]')).toBeTruthy();
  });

  it('sets aria-modal to true when a dismiss button is present', () => {
    const wrapper = renderPopover({ children: 'Trigger', content: 'Popover' });
    wrapper.findTrigger().click();
    expect(wrapper.findBody()!.getElement()).toHaveAttribute('aria-modal', 'true');
  });

  it('does not set aria-modal when a dismiss button is not present', () => {
    const wrapper = renderPopover({ children: 'Trigger', content: 'Popover', dismissButton: false });
    wrapper.findTrigger().click();
    expect(wrapper.findBody()!.getElement()).not.toHaveAttribute('aria-modal');
  });

  it('does not pass the dismissAriaLabel to the dismiss button if not defined', () => {
    const wrapper = renderPopover({ children: 'Trigger', content: 'Popover' });
    wrapper.findTrigger().click();
    expect(wrapper.findDismissButton()!.getElement()).not.toHaveAttribute('aria-label');
  });

  it('passes the dismissAriaLabel to the dismiss button if defined', () => {
    const wrapper = renderPopover({ children: 'Trigger', content: 'Popover', dismissAriaLabel: 'Close' });
    wrapper.findTrigger().click();
    expect(wrapper.findDismissButton()!.getElement()).toHaveAttribute('aria-label', 'Close');
  });

  it('sets role="dialog" if dismissButton is true', () => {
    const wrapper = renderPopover({ children: 'Trigger', content: 'Popover', dismissButton: true });
    wrapper.findTrigger().click();
    expect(wrapper.findBody()!.getElement()).toHaveAttribute('role', 'dialog');
  });

  it('does not set role="dialog" if dismissButton is false', () => {
    const wrapper = renderPopover({ children: 'Trigger', content: 'Popover', dismissButton: false });
    wrapper.findTrigger().click();
    expect(wrapper.findBody()!.getElement()).not.toHaveAttribute('role', 'dialog');
  });

  it('accessibility validation basic popover', async () => {
    const wrapper = renderPopover({
      children: 'Trigger',
      content: 'Popover',
      dismissButton: false,
      renderWithPortal: true,
    });
    wrapper.findTrigger().click();
    await expect(document.body).toValidateA11y();
  });

  it('accessibility validation for popover with dismiss button and header', async () => {
    const wrapper = renderPopover({
      children: 'Trigger',
      header: 'Popover',
      content: 'Content',
      dismissButton: true,
      dismissAriaLabel: 'Dismiss',
      renderWithPortal: true,
    });
    wrapper.findTrigger().click();
    await expect(document.body).toValidateA11y();
  });
});
