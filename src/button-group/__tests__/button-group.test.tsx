// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import ButtonGroup, { ButtonGroupProps } from '../../../lib/components/button-group';
import createWrapper from '../../../lib/components/test-utils/dom';
import customCssProps from '../../internal/generated/custom-css-properties';

function renderButtonGroup(props: ButtonGroupProps) {
  const renderResult = render(<ButtonGroup {...props} />);
  return createWrapper(renderResult.container).findButtonGroup()!;
}

describe('ButtonGroup Style API', () => {
  test('custom properties', () => {
    const wrapper = renderButtonGroup({
      variant: 'icon',
      ariaLabel: 'Test button group',
      items: [
        {
          type: 'icon-button',
          id: 'test-button',
          text: 'Test',
          iconName: 'settings',
        },
      ],
      style: {
        root: {
          background: 'rgb(255, 255, 255)',
          borderColor: 'rgb(0, 0, 0)',
          borderRadius: '8px',
          borderWidth: '2px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          paddingBlock: '12px',
          paddingInline: '16px',
          focusRing: {
            borderColor: 'rgb(0, 0, 255)',
            borderRadius: '4px',
            borderWidth: '3px',
          },
        },
        item: {
          color: {
            active: 'rgb(255, 0, 0)',
            default: 'rgb(0, 128, 0)',
            disabled: 'rgb(128, 128, 128)',
            hover: 'rgb(255, 255, 0)',
          },
          boxShadow: {
            active: '0 0 0 2px rgb(255, 0, 0)',
            default: '0 1px 2px rgba(0,0,0,0.1)',
            disabled: 'none',
            hover: '0 2px 4px rgba(0,0,0,0.2)',
          },
          focusRing: {
            borderColor: 'rgb(255, 165, 0)',
            borderRadius: '2px',
            borderWidth: '2px',
          },
        },
      },
    });

    expect(getComputedStyle(wrapper.getElement()).getPropertyValue('background')).toBe('rgb(255, 255, 255)');
    expect(getComputedStyle(wrapper.getElement()).getPropertyValue('border-color')).toBe('rgb(0, 0, 0)');
    expect(getComputedStyle(wrapper.getElement()).getPropertyValue('border-radius')).toBe('8px');
    expect(getComputedStyle(wrapper.getElement()).getPropertyValue('border-width')).toBe('2px');
    expect(getComputedStyle(wrapper.getElement()).getPropertyValue('box-shadow')).toBe('0 2px 4px rgba(0,0,0,0.1)');
    expect(getComputedStyle(wrapper.getElement()).getPropertyValue('padding-block')).toBe('12px');
    expect(getComputedStyle(wrapper.getElement()).getPropertyValue('padding-inline')).toBe('16px');
    expect(getComputedStyle(wrapper.getElement()).getPropertyValue(customCssProps.styleFocusRingBorderColor)).toBe(
      'rgb(0, 0, 255)'
    );
    expect(getComputedStyle(wrapper.getElement()).getPropertyValue(customCssProps.styleFocusRingBorderRadius)).toBe(
      '4px'
    );
    expect(getComputedStyle(wrapper.getElement()).getPropertyValue(customCssProps.styleFocusRingBorderWidth)).toBe(
      '3px'
    );

    const itemElement = wrapper.findButtonById('test-button')!.getElement().parentElement!.parentElement!;
    expect(getComputedStyle(itemElement).getPropertyValue(customCssProps.styleColorActive)).toBe('rgb(255, 0, 0)');
    expect(getComputedStyle(itemElement).getPropertyValue(customCssProps.styleColorDefault)).toBe('rgb(0, 128, 0)');
    expect(getComputedStyle(itemElement).getPropertyValue(customCssProps.styleColorDisabled)).toBe(
      'rgb(128, 128, 128)'
    );
    expect(getComputedStyle(itemElement).getPropertyValue(customCssProps.styleColorHover)).toBe('rgb(255, 255, 0)');

    expect(getComputedStyle(itemElement).getPropertyValue(customCssProps.styleBoxShadowActive)).toBe(
      '0 0 0 2px rgb(255, 0, 0)'
    );
    expect(getComputedStyle(itemElement).getPropertyValue(customCssProps.styleBoxShadowDefault)).toBe(
      '0 1px 2px rgba(0,0,0,0.1)'
    );
    expect(getComputedStyle(itemElement).getPropertyValue(customCssProps.styleBoxShadowDisabled)).toBe('none');
    expect(getComputedStyle(itemElement).getPropertyValue(customCssProps.styleBoxShadowHover)).toBe(
      '0 2px 4px rgba(0,0,0,0.2)'
    );

    expect(getComputedStyle(itemElement).getPropertyValue(customCssProps.styleFocusRingBorderColor)).toBe(
      'rgb(255, 165, 0)'
    );
    expect(getComputedStyle(itemElement).getPropertyValue(customCssProps.styleFocusRingBorderRadius)).toBe('2px');
    expect(getComputedStyle(itemElement).getPropertyValue(customCssProps.styleFocusRingBorderWidth)).toBe('2px');
  });
});

describe('ButtonGroup Icon Toggle Button with SVG icons', () => {
  test('renders icon-toggle-button with pressedIconSvg when pressed', () => {
    const defaultSvg = (
      <svg className="default-icon" focusable="false" viewBox="0 0 16 16">
        <circle cx="8" cy="8" r="7" />
      </svg>
    );
    const pressedSvg = (
      <svg className="pressed-icon" focusable="false" viewBox="0 0 16 16">
        <circle cx="8" cy="8" r="8" fill="currentColor" />
      </svg>
    );

    const wrapper = renderButtonGroup({
      variant: 'icon',
      ariaLabel: 'Test',
      items: [
        {
          type: 'icon-toggle-button',
          id: 'test-toggle',
          text: 'Toggle Button',
          pressed: true,
          iconSvg: defaultSvg,
          pressedIconSvg: pressedSvg,
        },
      ],
    });

    const toggleButton = wrapper.findToggleButtonById('test-toggle');
    expect(toggleButton).toBeTruthy();

    // Verify the pressed SVG is rendered
    const element = toggleButton!.getElement();
    const pressedIconElement = element.querySelector('.pressed-icon');
    expect(pressedIconElement).toBeTruthy();
  });

  test('renders icon-toggle-button with default iconSvg when not pressed', () => {
    const defaultSvg = (
      <svg className="default-icon" focusable="false" viewBox="0 0 16 16">
        <circle cx="8" cy="8" r="7" />
      </svg>
    );
    const pressedSvg = (
      <svg className="pressed-icon" focusable="false" viewBox="0 0 16 16">
        <circle cx="8" cy="8" r="8" fill="currentColor" />
      </svg>
    );

    const wrapper = renderButtonGroup({
      variant: 'icon',
      ariaLabel: 'Test',
      items: [
        {
          type: 'icon-toggle-button',
          id: 'test-toggle',
          text: 'Toggle Button',
          pressed: false,
          iconSvg: defaultSvg,
          pressedIconSvg: pressedSvg,
        },
      ],
    });

    const toggleButton = wrapper.findToggleButtonById('test-toggle');
    expect(toggleButton).toBeTruthy();

    // Verify the default SVG is rendered when not pressed
    const element = toggleButton!.getElement();
    const defaultIconElement = element.querySelector('.default-icon');
    expect(defaultIconElement).toBeTruthy();
  });

  test('icon-toggle-button with pressedIconUrl shows correct icon when pressed', () => {
    const pressedUrl = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"%3E%3Ccircle cx="8" cy="8" r="8"%3E%3C/circle%3E%3C/svg%3E';

    const wrapper = renderButtonGroup({
      variant: 'icon',
      ariaLabel: 'Test',
      items: [
        {
          type: 'icon-toggle-button',
          id: 'test-toggle-url',
          text: 'Toggle with URL',
          pressed: true,
          iconName: 'star',
          pressedIconUrl: pressedUrl,
        },
      ],
    });

    const toggleButton = wrapper.findToggleButtonById('test-toggle-url');
    expect(toggleButton).toBeTruthy();
  });

  test('icon-toggle-button with all icon types prioritizes SVG correctly', () => {
    const pressedSvg = (
      <svg className="pressed-svg-test" focusable="false" viewBox="0 0 16 16">
        <circle cx="8" cy="8" r="8" />
      </svg>
    );

    const wrapper = renderButtonGroup({
      variant: 'icon',
      ariaLabel: 'Test',
      items: [
        {
          type: 'icon-toggle-button',
          id: 'test-toggle-all',
          text: 'Toggle with all icons',
          pressed: true,
          iconName: 'star',
          pressedIconName: 'star-filled',
          iconUrl: 'data:image/svg+xml,%3Csvg%3E%3C/svg%3E',
          pressedIconUrl: 'data:image/svg+xml,%3Csvg%3E%3C/svg%3E',
          iconSvg: (
            <svg className="default-svg-test" focusable="false" viewBox="0 0 16 16">
              <circle cx="8" cy="8" r="7" />
            </svg>
          ),
          pressedIconSvg: pressedSvg,
        },
      ],
    });

    const toggleButton = wrapper.findToggleButtonById('test-toggle-all');
    expect(toggleButton).toBeTruthy();

    // SVG should take precedence when present in pressed state
    const element = toggleButton!.getElement();
    const pressedSvgElement = element.querySelector('.pressed-svg-test');
    expect(pressedSvgElement).toBeTruthy();
  });

  test('icon-toggle-button maintains correct icon on state change', () => {
    const { rerender } = render(
      <ButtonGroup
        variant="icon"
        ariaLabel="Test"
        items={[
          {
            type: 'icon-toggle-button',
            id: 'test-toggle-state',
            text: 'Toggle State',
            pressed: false,
            iconSvg: (
              <svg className="default-state-icon" focusable="false" viewBox="0 0 16 16">
                <circle cx="8" cy="8" r="7" />
              </svg>
            ),
            pressedIconSvg: (
              <svg className="pressed-state-icon" focusable="false" viewBox="0 0 16 16">
                <circle cx="8" cy="8" r="8" fill="currentColor" />
              </svg>
            ),
          },
        ]}
      />
    );

    const container = document.querySelector('.awsui-button-group');
    let iconElement = container?.querySelector('.default-state-icon');
    expect(iconElement).toBeTruthy();

    // Rerender with pressed state
    rerender(
      <ButtonGroup
        variant="icon"
        ariaLabel="Test"
        items={[
          {
            type: 'icon-toggle-button',
            id: 'test-toggle-state',
            text: 'Toggle State',
            pressed: true,
            iconSvg: (
              <svg className="default-state-icon" focusable="false" viewBox="0 0 16 16">
                <circle cx="8" cy="8" r="7" />
              </svg>
            ),
            pressedIconSvg: (
              <svg className="pressed-state-icon" focusable="false" viewBox="0 0 16 16">
                <circle cx="8" cy="8" r="8" fill="currentColor" />
              </svg>
            ),
          },
        ]}
      />
    );

    iconElement = container?.querySelector('.pressed-state-icon');
    expect(iconElement).toBeTruthy();
  });
});
