// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import createWrapper from '../../../lib/components/test-utils/dom';
import ToggleButton, { ToggleButtonProps } from '../../../lib/components/toggle-button';
import { getToggleIcon } from '../../../lib/components/toggle-button/util';

function renderToggleButton(props: ToggleButtonProps = { pressed: false }) {
  const renderResult = render(<ToggleButton {...props} />);
  return { wrapper: createWrapper(renderResult.container).findToggleButton()!, ...renderResult };
}

describe('ToggleButton Component', () => {
  test('should have toggle button attributes by default', () => {
    const { wrapper } = renderToggleButton({
      children: 'button',
      pressed: false,
      iconName: 'star',
      pressedIconName: 'star-filled',
    });

    expect(wrapper.getElement()).toHaveAttribute('aria-pressed', 'false');
  });

  test('should be pressed when pressed prop is set to true', () => {
    const { wrapper } = renderToggleButton({
      children: 'button',
      pressed: true,
      iconName: 'star',
      pressedIconName: 'star-filled',
    });

    expect(wrapper.isPressed()).toBe(true);
  });

  test('should fire onChange on click', () => {
    const onChange = jest.fn();
    const { wrapper } = renderToggleButton({
      children: 'button',
      pressed: false,
      iconName: 'star',
      pressedIconName: 'star-filled',
      onChange,
    });

    wrapper.click();

    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ detail: { pressed: true } }));
  });

  test('should not fire onChange if disabled', () => {
    const onChange = jest.fn();
    const { wrapper } = renderToggleButton({
      children: 'button',
      pressed: false,
      iconName: 'star',
      pressedIconName: 'star-filled',
      disabled: true,
      onChange,
    });

    wrapper.click();

    expect(onChange).not.toHaveBeenCalled();
  });

  describe('icon switch behavior', () => {
    test('should return undefined if icons are not provided', () => {
      expect(getToggleIcon(true, undefined, undefined)).toBe(undefined);
    });

    test('should keep default iconName if provided when pressed is set to false', () => {
      expect(getToggleIcon(false, 'star', 'star-filled')).toBe('star');
    });

    test('should switch default iconName to pressedIconName if provided when pressed is set to true', () => {
      expect(getToggleIcon(true, 'star', 'star-filled')).toBe('star-filled');
    });

    test('should keep default iconName if pressedIconName is not provided and pressed is set true', () => {
      expect(getToggleIcon(true, 'star')).toBe('star');
    });
  });
});
