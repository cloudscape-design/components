// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { fireEvent, render } from '@testing-library/react';

import '../../__a11y__/to-validate-a11y';
import Input, { InputProps } from '../../../lib/components/input';
import InternalInput from '../../../lib/components/input/internal';
import customCssProps from '../../../lib/components/internal/generated/custom-css-properties';
import createWrapper, { InputWrapper } from '../../../lib/components/test-utils/dom';

import styles from '../../../lib/components/input/styles.css.js';

function renderInput(props: Partial<InputProps> = {}) {
  const { container, rerender } = render(<Input value="" onChange={() => {}} {...props} />);
  const wrapper = createWrapper(container).findInput()!;
  return { wrapper, rerender };
}

const findField = (wrapper: ReturnType<typeof renderInput>['wrapper']) =>
  wrapper.findByClassName(styles['input-field'])!.getElement();

describe('field box', () => {
  test('wraps the native input and renders no prefix, suffix or divider by default', () => {
    const { wrapper } = renderInput();
    const field = findField(wrapper);
    expect(field).toContainElement(wrapper.findNativeInput().getElement());
    expect(field.children).toHaveLength(1);
    expect(wrapper.findPrefix()).toBeNull();
    expect(wrapper.findSuffix()).toBeNull();
    expect(wrapper.findAllByClassName(styles['input-adornment-divider'])).toHaveLength(0);
  });

  test('renders the clear button outside the field box so its focus does not show the field focus ring', () => {
    const { wrapper } = renderInput({ type: 'search', value: 'query', clearAriaLabel: 'Clear' });
    const field = findField(wrapper);
    const clearButton = wrapper.findClearButton()!.getElement();
    expect(field).not.toContainElement(clearButton);
    expect(wrapper.getElement()).toContainElement(clearButton);
  });

  test('splits custom Input styles between the field box and the native input', () => {
    const style: InputProps['style'] = {
      root: {
        backgroundColor: { default: '#ffffff', hover: '#f2f3f3' },
        borderColor: { default: '#000000', hover: '#111111' },
        borderRadius: '6px',
        borderWidth: '2px',
        color: { default: '#222222', disabled: '#999999' },
        paddingBlock: '12px',
        paddingInline: '16px',
      },
    };
    const { wrapper } = renderInput({ style });
    const field = findField(wrapper);
    const nativeInput = wrapper.findNativeInput().getElement();

    expect(field).toHaveStyle({ borderRadius: '6px', borderWidth: '2px' });
    expect(field.style.paddingBlock).toBe('');
    expect(field.style.paddingInline).toBe('');
    expect(field.style.getPropertyValue(customCssProps.styleBackgroundHover)).toBe('#f2f3f3');
    expect(field.style.getPropertyValue(customCssProps.styleBorderColorHover)).toBe('#111111');

    expect(nativeInput.style.paddingBlock).toBe('12px');
    expect(nativeInput.style.paddingInline).toBe('16px');
    expect(nativeInput.style.borderRadius).toBe('');
    expect(nativeInput.style.borderWidth).toBe('');
    expect(nativeInput.style.getPropertyValue(customCssProps.styleColorDisabled)).toBe('#999999');
  });

  describe('reflects validation and interaction state', () => {
    const getField = (props: Partial<InputProps>) => findField(renderInput(props).wrapper);

    test('adds the invalid modifier when invalid', () => {
      expect(getField({ invalid: true })).toHaveClass(styles['input-field-invalid']);
    });

    test('prefers the invalid modifier over the warning modifier', () => {
      const field = getField({ invalid: true, warning: true });
      expect(field).toHaveClass(styles['input-field-invalid']);
      expect(field).not.toHaveClass(styles['input-field-warning']);
    });

    test('adds the warning modifier when warning and not invalid', () => {
      expect(getField({ warning: true })).toHaveClass(styles['input-field-warning']);
    });

    test('adds the disabled modifier when disabled', () => {
      const field = getField({ disabled: true });
      expect(field).toHaveClass(styles['input-field-disabled']);
      expect(field).toHaveAttribute('aria-disabled', 'true');
    });

    test('keeps the invalid modifier when disabled', () => {
      const field = getField({ disabled: true, invalid: true });
      expect(field).toHaveClass(styles['input-field-disabled']);
      expect(field).toHaveClass(styles['input-field-invalid']);
    });

    test('keeps the warning modifier when disabled', () => {
      const field = getField({ disabled: true, warning: true });
      expect(field).toHaveClass(styles['input-field-disabled']);
      expect(field).toHaveClass(styles['input-field-warning']);
    });

    test('adds the readonly modifier when readOnly and not disabled', () => {
      expect(getField({ readOnly: true })).toHaveClass(styles['input-field-readonly']);
    });

    test('prefers the disabled modifier over the readonly modifier', () => {
      const field = getField({ disabled: true, readOnly: true });
      expect(field).toHaveClass(styles['input-field-disabled']);
      expect(field).not.toHaveClass(styles['input-field-readonly']);
    });
  });

  test('moves the no-border-radius modifier to the field box', () => {
    const { container } = render(<InternalInput value="" onChange={() => {}} __noBorderRadius={true} />);
    const wrapper = createWrapper(container).findComponent(`.${styles['input-container']}`, InputWrapper)!;
    expect(findField(wrapper)).toHaveClass(styles['input-field-no-border-radius']);
  });

  describe('clicking the field border', () => {
    test('focuses the native input', () => {
      const { wrapper } = renderInput();
      const mouseDown = fireEvent.mouseDown(findField(wrapper));
      expect(mouseDown).toBe(false);
      expect(wrapper.findNativeInput().getElement()).toHaveFocus();
    });

    test('does nothing when disabled', () => {
      const { wrapper } = renderInput({ disabled: true });
      const mouseDown = fireEvent.mouseDown(findField(wrapper));
      expect(mouseDown).toBe(true);
      expect(wrapper.findNativeInput().getElement()).not.toHaveFocus();
    });

    test('leaves clicks on the adornments alone', () => {
      const { wrapper } = renderInput({ prefix: '$' });
      const mouseDown = fireEvent.mouseDown(wrapper.findPrefix()!.getElement());
      expect(mouseDown).toBe(true);
      expect(wrapper.findNativeInput().getElement()).not.toHaveFocus();
    });
  });
});

describe('prefix and suffix adornments', () => {
  test('renders a prefix', () => {
    const { wrapper } = renderInput({ prefix: '$' });
    expect(wrapper.findPrefix()!.getElement()).toHaveTextContent('$');
    expect(wrapper.findSuffix()).toBeNull();
    expect(findField(wrapper)).toContainElement(wrapper.findPrefix()!.getElement());
  });

  test('renders a suffix', () => {
    const { wrapper } = renderInput({ suffix: '%' });
    expect(wrapper.findSuffix()!.getElement()).toHaveTextContent('%');
    expect(wrapper.findPrefix()).toBeNull();
    expect(findField(wrapper)).toContainElement(wrapper.findSuffix()!.getElement());
  });

  test('renders both a prefix and a suffix', () => {
    const { wrapper } = renderInput({ prefix: 'https://', suffix: '.com' });
    expect(wrapper.findPrefix()!.getElement()).toHaveTextContent('https://');
    expect(wrapper.findSuffix()!.getElement()).toHaveTextContent('.com');
  });

  test('renders a divider only on sides that have an adornment', () => {
    const { wrapper, rerender } = renderInput({ prefix: '$' });
    expect(wrapper.findAllByClassName(styles['input-adornment-divider'])).toHaveLength(1);

    rerender(<Input value="" onChange={() => {}} prefix="$" suffix="%" />);
    expect(wrapper.findAllByClassName(styles['input-adornment-divider'])).toHaveLength(2);
  });

  test('renders arbitrary React nodes', () => {
    const { wrapper } = renderInput({ prefix: <span data-testid="custom">node</span> });
    expect(wrapper.findPrefix()!.find('[data-testid="custom"]')).not.toBeNull();
  });

  test('renders truthy numeric adornments', () => {
    const { wrapper } = renderInput({ prefix: 1, suffix: 1 });
    expect(wrapper.findPrefix()!.getElement()).toHaveTextContent('1');
    expect(wrapper.findSuffix()!.getElement()).toHaveTextContent('1');
  });

  test('keeps the default text color on the value and applies the status color to the adornments only', () => {
    const { wrapper } = renderInput({ prefix: '$', invalid: true });
    expect(findField(wrapper)).toHaveClass(styles['input-field-invalid']);
    expect(wrapper.findNativeInput().getElement()).not.toHaveClass(styles['input-invalid']);
  });

  test.each([null, false, 0, undefined, ''] as const)(
    'does not render an adornment cell or divider for non-rendered React child %p',
    absentContent => {
      const { wrapper } = renderInput({ prefix: absentContent, suffix: absentContent });
      expect(wrapper.findPrefix()).toBeNull();
      expect(wrapper.findSuffix()).toBeNull();
      expect(wrapper.findAllByClassName(styles['input-adornment-divider'])).toHaveLength(0);
    }
  );

  describe('accessibility', () => {
    test('marks adornments as decorative with aria-hidden', () => {
      const { wrapper } = renderInput({ prefix: '$', suffix: '%' });
      expect(wrapper.findPrefix()!.getElement()).toHaveAttribute('aria-hidden', 'true');
      expect(wrapper.findSuffix()!.getElement()).toHaveAttribute('aria-hidden', 'true');
    });

    test('has no axe violations', async () => {
      const { container } = render(
        <Input value="123" onChange={() => {}} ariaLabel="Amount" prefix="$" suffix="USD" />
      );
      await expect(container).toValidateA11y();
    });
  });
});
