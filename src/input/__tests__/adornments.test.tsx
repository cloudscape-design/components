// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import '../../__a11y__/to-validate-a11y';
import Input, { InputProps } from '../../../lib/components/input';
import InternalInput from '../../../lib/components/input/internal';
import customCssProps from '../../../lib/components/internal/generated/custom-css-properties';
import createWrapper from '../../../lib/components/test-utils/dom';

import styles from '../../../lib/components/input/styles.css.js';

function renderInput(props: Partial<InputProps> = {}) {
  const { container, rerender } = render(<Input value="" onChange={() => {}} {...props} />);
  const wrapper = createWrapper(container).findInput()!;
  return { wrapper, rerender };
}

describe('prefix and suffix adornments', () => {
  test('does not render adornment container, prefix, or suffix by default', () => {
    const { wrapper } = renderInput();
    expect(wrapper.findByClassName(styles['input-adorned-container'])).toBeNull();
    expect(wrapper.findPrefix()).toBeNull();
    expect(wrapper.findSuffix()).toBeNull();
    expect(wrapper.findNativeInput().getElement()).not.toHaveClass(styles['input-adorned']);
  });

  test('renders a prefix', () => {
    const { wrapper } = renderInput({ prefix: '$' });
    expect(wrapper.findPrefix()!.getElement()).toHaveTextContent('$');
    expect(wrapper.findSuffix()).toBeNull();
    expect(wrapper.findByClassName(styles['input-adorned-container'])).not.toBeNull();
    expect(wrapper.findNativeInput().getElement()).toHaveClass(styles['input-adorned']);
  });

  test('renders a suffix', () => {
    const { wrapper } = renderInput({ suffix: '%' });
    expect(wrapper.findSuffix()!.getElement()).toHaveTextContent('%');
    expect(wrapper.findPrefix()).toBeNull();
    expect(wrapper.findNativeInput().getElement()).toHaveClass(styles['input-adorned']);
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

  test('renders numeric adornments', () => {
    const { wrapper } = renderInput({ prefix: 0, suffix: 0 });
    expect(wrapper.findPrefix()!.getElement()).toHaveTextContent('0');
    expect(wrapper.findSuffix()!.getElement()).toHaveTextContent('0');
  });

  test('applies custom Input styles to the adorned container', () => {
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
    const { wrapper } = renderInput({ prefix: '$', style });
    const container = wrapper.findByClassName(styles['input-adorned-container'])!.getElement();

    expect(container).toHaveStyle({ borderRadius: '6px', borderWidth: '2px' });
    expect(container.style.getPropertyValue(customCssProps.styleBackgroundHover)).toBe('#f2f3f3');
    expect(container.style.getPropertyValue(customCssProps.styleBorderColorHover)).toBe('#111111');
    expect(container.style.getPropertyValue(customCssProps.styleColorDisabled)).toBe('#999999');

    // paddingBlock and paddingInline go to the native input, NOT the container
    const nativeInput = wrapper.findNativeInput()!.getElement();
    expect(nativeInput.style.paddingBlock).toBe('12px');
    expect(nativeInput.style.paddingInline).toBe('16px');
  });

  test('contains the end icon within the adorned focus container', () => {
    const { container } = render(<InternalInput value="" onChange={() => {}} prefix="$" __endIcon="settings" />);
    const adornedContainer = container.querySelector(`.${styles['input-adorned-container']}`)!;
    const endIcon = container.querySelector(`.${styles['input-icon-end']}`)!;

    expect(adornedContainer).toContainElement(endIcon as HTMLElement);
    endIcon.querySelector('button')!.focus();
    expect(adornedContainer.contains(document.activeElement)).toBe(true);
  });

  test.each([null, false, true, undefined, ''] as const)(
    'does not render an adornment cell or divider for non-rendered React child %p',
    absentContent => {
      const { wrapper } = renderInput({ prefix: absentContent, suffix: absentContent });
      expect(wrapper.findPrefix()).toBeNull();
      expect(wrapper.findSuffix()).toBeNull();
      expect(wrapper.findByClassName(styles['input-adorned-container'])).toBeNull();
      expect(wrapper.findAllByClassName(styles['input-adornment-divider'])).toHaveLength(0);
    }
  );

  describe('adornment container reflects validation and interaction state', () => {
    const getContainer = (props: Partial<InputProps>) =>
      renderInput({ prefix: '$', ...props })
        .wrapper.findByClassName(styles['input-adorned-container'])!
        .getElement();

    test('adds the invalid modifier when invalid', () => {
      expect(getContainer({ invalid: true })).toHaveClass(styles['input-adorned-container-invalid']);
    });

    test('prefers the invalid modifier over the warning modifier', () => {
      const container = getContainer({ invalid: true, warning: true });
      expect(container).toHaveClass(styles['input-adorned-container-invalid']);
      expect(container).not.toHaveClass(styles['input-adorned-container-warning']);
    });

    test('adds the warning modifier when warning and not invalid', () => {
      expect(getContainer({ warning: true })).toHaveClass(styles['input-adorned-container-warning']);
    });

    test('adds the disabled modifier when disabled', () => {
      expect(getContainer({ disabled: true })).toHaveClass(styles['input-adorned-container-disabled']);
    });

    test('adds the readonly modifier when readOnly and not disabled', () => {
      const container = getContainer({ readOnly: true });
      expect(container).toHaveClass(styles['input-adorned-container-readonly']);
    });

    test('prefers the disabled modifier over the readonly modifier', () => {
      const container = getContainer({ disabled: true, readOnly: true });
      expect(container).toHaveClass(styles['input-adorned-container-disabled']);
      expect(container).not.toHaveClass(styles['input-adorned-container-readonly']);
    });
  });

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
