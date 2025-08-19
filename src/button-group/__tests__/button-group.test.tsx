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
          gap: '16px',
          flexDirection: 'column',
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
    expect(getComputedStyle(wrapper.getElement()).getPropertyValue('gap')).toBe('16px');
    expect(getComputedStyle(wrapper.getElement()).getPropertyValue('flex-direction')).toBe('column');
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
