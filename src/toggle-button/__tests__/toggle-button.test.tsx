// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

import createWrapper from '../../../lib/components/test-utils/dom';
import ToggleButton, { ToggleButtonProps } from '../../../lib/components/toggle-button';
import { getToggleIcon } from '../../../lib/components/toggle-button/util';

jest.mock('@cloudscape-design/component-toolkit/internal', () => ({
  ...jest.requireActual('@cloudscape-design/component-toolkit/internal'),
  warnOnce: jest.fn(),
}));

function renderToggleButton(props: ToggleButtonProps = { pressed: false }) {
  const renderResult = render(<ToggleButton {...props} />);
  return { wrapper: createWrapper(renderResult.container).findToggleButton()!, ...renderResult };
}

describe('ToggleButton Component', () => {
  afterEach(() => {
    (warnOnce as jest.Mock).mockReset();
  });

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

  test('throws a warning when pressedIconName icon is not set', () => {
    renderToggleButton({
      children: 'button',
      pressed: false,
      iconName: 'star',
      pressedIconName: undefined,
    });

    expect(warnOnce).toHaveBeenCalledWith('ToggleButton', '`pressedIconName` must be provided for `pressed` state.');
  });

  test('throws a warning when pressedIconSvg icon is not set', () => {
    const svg = (
      <svg className="test-svg">
        <circle className="test-svg-inner" cx="8" cy="8" r="7" />
      </svg>
    );
    renderToggleButton({
      children: 'button',
      pressed: false,
      iconSvg: svg,
      pressedIconSvg: undefined,
    });

    expect(warnOnce).toHaveBeenCalledWith('ToggleButton', '`pressedIconSvg` must be provided for `pressed` state.');
  });

  test('throws a warning when pressedIconUrl icon is not set', () => {
    const url = 'data:image/png;base64,aaaa';
    renderToggleButton({
      children: 'button',
      pressed: false,
      iconUrl: url,
      pressedIconUrl: undefined,
    });

    expect(warnOnce).toHaveBeenCalledWith('ToggleButton', '`pressedIconUrl` must be provided for `pressed` state.');
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
