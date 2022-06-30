// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';
import Trigger, { TriggerProps } from '../../../lib/components/select/parts/trigger';
import createWrapper from '../../../lib/components/test-utils/dom';
import buttonTriggerStyles from '../../../lib/components/internal/components/button-trigger/styles.css.js';

function renderComponent(props: TriggerProps) {
  const renderResult = render(<Trigger {...props} />);
  return createWrapper(renderResult.container).find(`.${buttonTriggerStyles['button-trigger']}`)!;
}

const defaultProps: any = {
  ariaLabelledby: 'aria-labelled-by',
  ariaDescribedby: 'aria described by',
  ariaLabel: 'aria label',
  selectedOption: null,
  invalid: false,
  disabled: false,
  placeholder: 'placeholder',
  triggerVariant: 'option',
  triggerProps: {
    ref: React.createRef(),
    onKeyDown: jest.fn(),
    onClick: jest.fn(),
    ariaLabelledby: 'option-labelled-by',
  },
  isOpen: false,
  controlId: 'control_id',
  name: 'control_name',
};

describe('Trigger component', () => {
  describe('Empty state', () => {
    const wrapper = renderComponent(defaultProps);
    const buttonTriggerEl = wrapper.getElement();

    test('should have root trigger class', () => {
      expect(buttonTriggerEl).toHaveClass(buttonTriggerStyles['button-trigger']);
    });

    test('should have id attribute', () => {
      expect(buttonTriggerEl).toHaveAttribute('id', 'control_id');
    });

    test('should have type=button', () => {
      expect(buttonTriggerEl).toHaveAttribute('type', 'button');
    });

    test('should not have disabled attribute', () => {
      expect(buttonTriggerEl).not.toHaveAttribute('disabled');
    });

    test('should have aria-expanded=false', () => {
      expect(buttonTriggerEl).toHaveAttribute('aria-expanded', 'false');
    });

    test('should have aria-label attribute', () => {
      expect(buttonTriggerEl).toHaveAttribute('aria-label', 'aria label');
    });

    test('should have aria-labelledby attribute consisting of passed aria-labelby and the internal one pointing at the currently selected option', () => {
      expect(buttonTriggerEl).toHaveAttribute('aria-labelledby', 'aria-labelled-by option-labelled-by');
      expect(buttonTriggerEl.querySelector('#option-labelled-by')).toBeTruthy();
    });

    test('should have aria-haspopup attribute', () => {
      expect(buttonTriggerEl).toHaveAttribute('aria-haspopup', 'listbox');
    });

    test('should have text content placeholder', () => {
      expect(buttonTriggerEl).toHaveTextContent('placeholder');
    });
  });

  describe('Open state', () => {
    const wrapper = renderComponent({ ...defaultProps, isOpen: true });
    const buttonTriggerEl = wrapper.getElement();

    test('should have aria-expanded=true', () => {
      expect(buttonTriggerEl).toHaveAttribute('aria-expanded', 'true');
    });
  });

  describe('Invalid state', () => {
    const wrapper = renderComponent({ ...defaultProps, invalid: true });
    const buttonTriggerEl = wrapper.getElement();

    test('should have invalid class', () => {
      expect(buttonTriggerEl).toHaveClass(buttonTriggerStyles['button-trigger'], buttonTriggerStyles.invalid);
    });
  });

  describe('Disabled state', () => {
    const wrapper = renderComponent({ ...defaultProps, disabled: true });
    const buttonTriggerEl = wrapper.getElement();

    test('should have disabled class and disabled attribute', () => {
      expect(buttonTriggerEl).toHaveClass(buttonTriggerStyles['button-trigger'], buttonTriggerStyles.disabled);
      expect(buttonTriggerEl).toHaveAttribute('disabled');
    });
  });

  describe('Selected option with undefined label', () => {
    const wrapper = renderComponent({
      ...defaultProps,
      selectedOption: {
        value: 'Option 1',
        label: undefined,
        labelTag: 'Label tag',
      },
    });
    const buttonTriggerEl = wrapper.getElement();

    test('should use the value if label is not provided', () => {
      expect(buttonTriggerEl).toHaveTextContent('Option 1');
    });
  });

  describe('Selected option with triggerVariant=label', () => {
    const wrapper = renderComponent({
      ...defaultProps,
      selectedOption: {
        value: 'Option 1',
        label: 'Option 1',
        labelTag: 'Label tag',
      },
    });
    const buttonTriggerEl = wrapper.getElement();

    test('should have text content of the selected option', () => {
      expect(buttonTriggerEl).toHaveTextContent('Option 1');
    });
  });

  describe('Selected option with triggerVariant=option', () => {
    const wrapper = renderComponent({
      ...defaultProps,
      selectedOption: {
        value: 'Option 1',
        label: 'Option 1',
        labelTag: 'Label tag',
      },
    });
    const buttonTriggerEl = wrapper.getElement();

    test('should have text content of the selected option', () => {
      expect(buttonTriggerEl).toHaveTextContent('Option 1Label tag');
    });
  });
});
