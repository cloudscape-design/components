// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act, fireEvent, render } from '@testing-library/react';

import Button, { ButtonProps } from '../../../lib/components/button';
import createWrapper from '../../../lib/components/test-utils/dom';

function renderButton(props: Partial<ButtonProps> = {}) {
  const { container } = render(<Button {...props}>Click me</Button>);
  return createWrapper(container).findButton()!;
}

describe('Button tooltipText', () => {
  test('does not show a tooltip by default', () => {
    const wrapper = renderButton({ tooltipText: 'Helpful text' });
    expect(wrapper.findTooltip()).toBeNull();
  });

  test('shows a tooltip on focus', () => {
    const wrapper = renderButton({ tooltipText: 'Helpful text' });

    wrapper.getElement().focus();

    const tooltip = wrapper.findTooltip();
    expect(tooltip).not.toBeNull();
    expect(tooltip!.getElement()).toHaveTextContent('Helpful text');
  });

  test('hides the tooltip on blur', () => {
    const wrapper = renderButton({ tooltipText: 'Helpful text' });

    wrapper.getElement().focus();
    expect(wrapper.findTooltip()).not.toBeNull();

    wrapper.getElement().blur();
    expect(wrapper.findTooltip()).toBeNull();
  });

  test('shows the tooltip on mouse enter and hides on mouse leave', () => {
    const wrapper = renderButton({ tooltipText: 'Helpful text' });

    fireEvent.mouseEnter(wrapper.getElement());
    expect(wrapper.findTooltip()).not.toBeNull();

    fireEvent.mouseLeave(wrapper.getElement());
    expect(wrapper.findTooltip()).toBeNull();
  });

  test('hides the tooltip on Escape key press', () => {
    const wrapper = renderButton({ tooltipText: 'Helpful text' });

    wrapper.getElement().focus();
    expect(wrapper.findTooltip()).not.toBeNull();

    act(() => {
      document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    });

    expect(wrapper.findTooltip()).toBeNull();
  });

  test('does not render a tooltip when tooltipText is not provided', () => {
    const wrapper = renderButton();

    wrapper.getElement().focus();
    fireEvent.mouseEnter(wrapper.getElement());

    expect(wrapper.findTooltip()).toBeNull();
  });

  describe('precedence over disabledReason', () => {
    test('shows disabledReason instead of tooltipText when disabled with reason', () => {
      const wrapper = renderButton({
        disabled: true,
        disabledReason: 'Disabled because of reason',
        tooltipText: 'Helpful text',
      });

      wrapper.getElement().focus();

      // disabledReason wins: the disabled-reason tooltip is shown, the tooltipText tooltip is not.
      expect(wrapper.findDisabledReason()).not.toBeNull();
      expect(wrapper.findDisabledReason()!.getElement()).toHaveTextContent('Disabled because of reason');
      expect(wrapper.findTooltip()).toBeNull();
    });
  });

  describe('inactive states', () => {
    test('does not show tooltip when button is in loading state', () => {
      const wrapper = renderButton({ loading: true, tooltipText: 'Helpful text' });

      wrapper.getElement().focus();
      fireEvent.mouseEnter(wrapper.getElement());

      expect(wrapper.findTooltip()).toBeNull();
    });

    test('does not show tooltip when button is disabled without reason', () => {
      const wrapper = renderButton({ disabled: true, tooltipText: 'Helpful text' });

      // Disabled buttons can't be focused, but we still verify hover does nothing.
      fireEvent.mouseEnter(wrapper.getElement());

      expect(wrapper.findTooltip()).toBeNull();
    });
  });

  describe('with href', () => {
    test('shows a tooltip on focus for a link button', () => {
      const { container } = render(
        <Button href="#test" tooltipText="Open settings">
          Settings
        </Button>
      );
      const wrapper = createWrapper(container).findButton()!;

      wrapper.getElement().focus();
      expect(wrapper.findTooltip()).not.toBeNull();
      expect(wrapper.findTooltip()!.getElement()).toHaveTextContent('Open settings');
    });
  });
});
