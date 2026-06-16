// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act, fireEvent, render } from '@testing-library/react';

import Icon from '../../../lib/components/icon';
import createWrapper from '../../../lib/components/test-utils/dom';

function renderIcon(jsx: React.ReactElement) {
  const { container } = render(jsx);
  const wrapper = createWrapper(container).findIcon()!;
  return { container, wrapper, element: wrapper.getElement() };
}

describe('Icon tooltipText', () => {
  test('does not show a tooltip by default', () => {
    const { wrapper } = renderIcon(<Icon name="settings" tooltipText="Settings" />);
    expect(createWrapper().findTooltip()).toBeNull();
    expect(wrapper).not.toBeNull();
  });

  test('does not make the icon focusable when tooltipText is not provided', () => {
    const { element } = renderIcon(<Icon name="settings" />);
    expect(element).not.toHaveAttribute('tabIndex');
  });

  test('makes the icon focusable (tabIndex=0) when tooltipText is provided', () => {
    const { element } = renderIcon(<Icon name="settings" tooltipText="Settings" />);
    expect(element).toHaveAttribute('tabIndex', '0');
  });

  test('sets role="img" and aria-label from tooltipText when ariaLabel is not provided', () => {
    const { element } = renderIcon(<Icon name="settings" tooltipText="Settings" />);
    expect(element).toHaveAttribute('role', 'img');
    expect(element).toHaveAttribute('aria-label', 'Settings');
  });

  test('explicit ariaLabel takes precedence over tooltipText for aria-label', () => {
    const { element } = renderIcon(<Icon name="settings" ariaLabel="Open settings" tooltipText="Visible tooltip" />);
    expect(element).toHaveAttribute('aria-label', 'Open settings');
  });

  test('shows the tooltip on pointer enter and hides on pointer leave', () => {
    const { element } = renderIcon(<Icon name="settings" tooltipText="Settings" />);

    fireEvent.pointerEnter(element);
    let tooltip = createWrapper().findTooltip();
    expect(tooltip).not.toBeNull();
    expect(tooltip!.getElement()).toHaveTextContent('Settings');

    fireEvent.pointerLeave(element);
    tooltip = createWrapper().findTooltip();
    expect(tooltip).toBeNull();
  });

  test('shows the tooltip on focus and hides on blur', () => {
    const { element } = renderIcon(<Icon name="settings" tooltipText="Settings" />);

    fireEvent.focus(element);
    expect(createWrapper().findTooltip()).not.toBeNull();

    fireEvent.blur(element);
    expect(createWrapper().findTooltip()).toBeNull();
  });

  test('hides the tooltip on Escape key press', () => {
    const { element } = renderIcon(<Icon name="settings" tooltipText="Settings" />);

    fireEvent.pointerEnter(element);
    expect(createWrapper().findTooltip()).not.toBeNull();

    act(() => {
      document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    });

    expect(createWrapper().findTooltip()).toBeNull();
  });

  describe('with svg icon', () => {
    const svg = (
      <svg className="test-svg" focusable="false">
        <circle cx="8" cy="8" r="7" />
      </svg>
    );

    test('shows the tooltip on hover and applies aria-label', () => {
      const { element } = renderIcon(<Icon svg={svg} tooltipText="Custom" />);

      expect(element).toHaveAttribute('aria-label', 'Custom');
      expect(element).toHaveAttribute('tabIndex', '0');

      fireEvent.pointerEnter(element);
      const tooltip = createWrapper().findTooltip();
      expect(tooltip).not.toBeNull();
      expect(tooltip!.getElement()).toHaveTextContent('Custom');
    });

    test('still sets aria-hidden=false when tooltipText provides the accessible name', () => {
      const { element } = renderIcon(<Icon svg={svg} tooltipText="Custom" />);
      // hasAriaLabel becomes true via tooltipText fallback, so aria-hidden should be false.
      expect(element).toHaveAttribute('aria-hidden', 'false');
    });
  });

  describe('with url icon', () => {
    const url = 'data:image/png;base64,aaaa';

    test('shows the tooltip on hover and uses tooltipText as the img alt fallback', () => {
      const { container, element } = renderIcon(<Icon url={url} tooltipText="Custom" />);

      // The wrapper span gets the events / tabIndex but does NOT get aria-label
      // (the inner <img alt="..."> already provides the accessible name).
      expect(element).toHaveAttribute('tabIndex', '0');
      expect(element).not.toHaveAttribute('aria-label');

      const img = container.querySelector('img');
      expect(img).toHaveAttribute('alt', 'Custom');

      fireEvent.pointerEnter(element);
      const tooltip = createWrapper().findTooltip();
      expect(tooltip).not.toBeNull();
      expect(tooltip!.getElement()).toHaveTextContent('Custom');
    });

    test('explicit ariaLabel takes precedence over tooltipText for img alt', () => {
      const { container } = renderIcon(<Icon url={url} ariaLabel="Explicit" tooltipText="Visible" />);
      const img = container.querySelector('img');
      expect(img).toHaveAttribute('alt', 'Explicit');
    });

    test('alt prop is used only when both ariaLabel and tooltipText are absent', () => {
      const { container } = renderIcon(<Icon url={url} alt="Just alt" />);
      const img = container.querySelector('img');
      expect(img).toHaveAttribute('alt', 'Just alt');
    });
  });
});
