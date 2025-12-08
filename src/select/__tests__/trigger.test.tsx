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
  selectedOption: null,
  invalid: false,
  warning: false,
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

    test('should have aria-labelledby attribute consisting of passed aria-labelby and the one pointing to trigger content', () => {
      const labelledby = buttonTriggerEl.getAttribute('aria-labelledby');
      const contentId = labelledby!.split('aria-labelled-by ')[1];
      expect(buttonTriggerEl.querySelector(`#${contentId}`)).toBeTruthy();
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

  describe('Warning state', () => {
    const wrapper = renderComponent({ ...defaultProps, warning: true });
    const buttonTriggerEl = wrapper.getElement();

    test('should have warning class', () => {
      expect(buttonTriggerEl).toHaveClass(buttonTriggerStyles['button-trigger'], buttonTriggerStyles.warning);
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
  describe('autoFocus', () => {
    test('receives focus when autoFocus is true', () => {
      const wrapper = renderComponent({ ...defaultProps, triggerProps: { autoFocus: true } });
      const buttonTriggerEl = wrapper.getElement();

      expect(buttonTriggerEl).toHaveFocus();
    });
  });

  describe('Custom content with renderOption', () => {
    const mockRenderOption = jest.fn();
    const selectedOption = {
      value: 'custom-option',
      label: 'Custom Option',
      description: 'A custom option for testing',
    };

    beforeEach(() => {
      mockRenderOption.mockClear();
    });

    test('should call renderOption with trigger item when triggerVariant is option', () => {
      mockRenderOption.mockReturnValue(<div data-testid="custom-trigger-content">Custom Trigger Content</div>);

      const wrapper = renderComponent({
        ...defaultProps,
        selectedOption,
        triggerVariant: 'option',
        renderOption: mockRenderOption,
      });

      expect(mockRenderOption).toHaveBeenCalledWith({
        filterText: undefined,
        item: {
          type: 'trigger',
          option: selectedOption,
        },
      });

      const buttonTriggerEl = wrapper.getElement();
      expect(buttonTriggerEl.querySelector('[data-testid="custom-trigger-content"]')).toBeTruthy();
    });

    test('should render custom content in trigger when renderOption returns JSX', () => {
      const customContent = (
        <div data-testid="custom-trigger">
          <span>Prefix: </span>
          <strong>{selectedOption.label}</strong>
          <span> - {selectedOption.description}</span>
        </div>
      );
      mockRenderOption.mockReturnValue(customContent);

      const wrapper = renderComponent({
        ...defaultProps,
        selectedOption,
        triggerVariant: 'option',
        renderOption: mockRenderOption,
      });

      const buttonTriggerEl = wrapper.getElement();
      const customTriggerEl = buttonTriggerEl.querySelector('[data-testid="custom-trigger"]');

      expect(customTriggerEl).toBeTruthy();
      expect(customTriggerEl).toHaveTextContent('Prefix: Custom Option - A custom option for testing');
    });

    test('should fall back to default option rendering when renderOption returns null', () => {
      mockRenderOption.mockReturnValue(null);

      const wrapper = renderComponent({
        ...defaultProps,
        selectedOption,
        triggerVariant: 'option',
        renderOption: mockRenderOption,
      });

      const buttonTriggerEl = wrapper.getElement();
      expect(buttonTriggerEl).toHaveTextContent('Custom Option');
      expect(mockRenderOption).toHaveBeenCalledWith({
        filterText: undefined,
        item: {
          type: 'trigger',
          option: selectedOption,
        },
      });
    });

    test('should not call renderOption when triggerVariant is label', () => {
      mockRenderOption.mockReturnValue(<div>Should not render</div>);

      const wrapper = renderComponent({
        ...defaultProps,
        selectedOption,
        triggerVariant: 'label',
        renderOption: mockRenderOption,
      });

      expect(mockRenderOption).not.toHaveBeenCalled();
      const buttonTriggerEl = wrapper.getElement();
      expect(buttonTriggerEl).toHaveTextContent('Custom Option');
    });
  });
});
