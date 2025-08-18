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
          background: '#fff',
          borderColor: '#000',
          borderRadius: '8px',
          borderWidth: '2px',
          gap: '16px',
          flexDirection: 'column',
          paddingBlock: '12px',
          paddingInline: '16px',
          focusRing: {
            borderColor: '#blue',
            borderRadius: '4px',
            borderWidth: '3px',
          },
        },
        item: {
          background: {
            active: '#red',
            default: '#green',
            disabled: '#gray',
            hover: '#yellow',
            pressed: '#purple',
          },
          borderColor: {
            active: '#red',
            default: '#green',
            disabled: '#gray',
            hover: '#yellow',
            pressed: '#purple',
          },
          color: {
            active: '#red',
            default: '#green',
            disabled: '#gray',
            hover: '#yellow',
            pressed: '#purple',
          },
          borderRadius: '4px',
          borderWidth: '1px',
          focusRing: {
            borderColor: '#orange',
            borderRadius: '2px',
            borderWidth: '2px',
          },
          paddingBlock: '8px',
          paddingInline: '12px',
        },
      },
    });

    expect(getComputedStyle(wrapper.getElement()).getPropertyValue(customCssProps.styleBackgroundDefault)).toBe('#fff');
    expect(getComputedStyle(wrapper.getElement()).getPropertyValue(customCssProps.styleBorderColorDefault)).toBe(
      '#000'
    );
    expect(getComputedStyle(wrapper.getElement()).borderRadius).toBe('8px');
    expect(getComputedStyle(wrapper.getElement()).borderWidth).toBe('2px');
    expect(getComputedStyle(wrapper.getElement()).gap).toBe('16px');
    expect(getComputedStyle(wrapper.getElement()).flexDirection).toBe('column');
    expect(getComputedStyle(wrapper.getElement()).paddingBlock).toBe('12px');
    expect(getComputedStyle(wrapper.getElement()).paddingInline).toBe('16px');
    expect(getComputedStyle(wrapper.getElement()).getPropertyValue(customCssProps.styleFocusRingBorderColor)).toBe(
      '#blue'
    );
    expect(getComputedStyle(wrapper.getElement()).getPropertyValue(customCssProps.styleFocusRingBorderRadius)).toBe(
      '4px'
    );
    expect(getComputedStyle(wrapper.getElement()).getPropertyValue(customCssProps.styleFocusRingBorderWidth)).toBe(
      '3px'
    );

    const itemElement = wrapper.findButtonById('test-button')!.getElement().parentElement!;
    expect(getComputedStyle(itemElement).getPropertyValue(customCssProps.styleBackgroundActive)).toBe('#red');
    expect(getComputedStyle(itemElement).getPropertyValue(customCssProps.styleBackgroundDefault)).toBe('#green');
    expect(getComputedStyle(itemElement).getPropertyValue(customCssProps.styleBackgroundDisabled)).toBe('#gray');
    expect(getComputedStyle(itemElement).getPropertyValue(customCssProps.styleBackgroundHover)).toBe('#yellow');
    expect(getComputedStyle(itemElement).getPropertyValue('--awsui-button-group-item-background-pressed')).toBe(
      '#purple'
    );
    expect(getComputedStyle(itemElement).getPropertyValue(customCssProps.styleBorderColorActive)).toBe('#red');
    expect(getComputedStyle(itemElement).getPropertyValue(customCssProps.styleBorderColorDefault)).toBe('#green');
    expect(getComputedStyle(itemElement).getPropertyValue(customCssProps.styleBorderColorDisabled)).toBe('#gray');
    expect(getComputedStyle(itemElement).getPropertyValue(customCssProps.styleBorderColorHover)).toBe('#yellow');
    expect(getComputedStyle(itemElement).getPropertyValue('--awsui-button-group-item-border-color-pressed')).toBe(
      '#purple'
    );
    expect(getComputedStyle(itemElement).getPropertyValue(customCssProps.styleColorActive)).toBe('#red');
    expect(getComputedStyle(itemElement).getPropertyValue(customCssProps.styleColorDefault)).toBe('#green');
    expect(getComputedStyle(itemElement).getPropertyValue(customCssProps.styleColorDisabled)).toBe('#gray');
    expect(getComputedStyle(itemElement).getPropertyValue(customCssProps.styleColorHover)).toBe('#yellow');
    expect(getComputedStyle(itemElement).getPropertyValue('--awsui-button-group-item-color-pressed')).toBe('#purple');
    expect(getComputedStyle(itemElement).borderRadius).toBe('4px');
    expect(getComputedStyle(itemElement).borderWidth).toBe('1px');
    expect(getComputedStyle(itemElement).getPropertyValue(customCssProps.styleFocusRingBorderColor)).toBe('#orange');
    expect(getComputedStyle(itemElement).getPropertyValue(customCssProps.styleFocusRingBorderRadius)).toBe('2px');
    expect(getComputedStyle(itemElement).getPropertyValue(customCssProps.styleFocusRingBorderWidth)).toBe('2px');
    expect(getComputedStyle(itemElement).paddingBlock).toBe('8px');
    expect(getComputedStyle(itemElement).paddingInline).toBe('12px');
  });
});
