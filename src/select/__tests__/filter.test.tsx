// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import Filter, { FilterProps } from '../../../lib/components/select/parts/filter';
import createWrapper, { InputWrapper } from '../../../lib/components/test-utils/dom';

import inputStyles from '../../../lib/components/input/styles.css.js';
import styles from '../../../lib/components/select/parts/styles.css.js';

function renderComponent(props: FilterProps) {
  const renderResult = render(<Filter {...props} />);
  return createWrapper(renderResult.container).findComponent(`.${styles.filter}`, InputWrapper)!;
}

const defaultProps: FilterProps = {
  ariaRequired: true,
  filteringType: 'auto',
  placeholder: 'Find option',
  ariaLabel: 'Filtering aria label',
  __nativeAttributes: { 'aria-controls': '1-1597474295719-5012' },
  value: 'test filtering value',
  onChange: () => {},
};

describe('Filter component', () => {
  test('should render nothing when filteringType is none', () => {
    const wrapper = renderComponent({ ...defaultProps, filteringType: 'none' });
    expect(wrapper).toBeNull();
  });

  describe('Default', () => {
    const wrapper = renderComponent(defaultProps);
    const containerEl = wrapper.getElement();
    const inputEl = wrapper.findNativeInput().getElement();

    test('should have root filter class', () => {
      expect(containerEl).toHaveClass(styles.filter);
    });

    test('should have no border class', () => {
      expect(inputEl).toHaveClass(inputStyles['input-has-no-border-radius']);
    });

    test('should have aria-required attribute', () => {
      expect(inputEl).toHaveAttribute('aria-required');
    });

    test('should have placeholder attribute', () => {
      expect(inputEl).toHaveAttribute('placeholder', 'Find option');
    });

    test('should have aria-label attribute', () => {
      expect(inputEl).toHaveAttribute('aria-label');
    });

    test('should have aria-expanded attribute', () => {
      expect(inputEl).toHaveAttribute('aria-expanded');
    });

    test('should have aria-haspopup attribute', () => {
      expect(inputEl).toHaveAttribute('aria-haspopup');
    });

    test('should have role=combobox attribute', () => {
      expect(inputEl).toHaveAttribute('role', 'combobox');
    });

    test('should have autocomplete=off attribute', () => {
      expect(inputEl).toHaveAttribute('autocomplete', 'off');
    });

    test('should have autocorrect=off attribute', () => {
      expect(inputEl).toHaveAttribute('autocorrect', 'off');
    });

    test('should have autocapitalize=off attribute', () => {
      expect(inputEl).toHaveAttribute('autocapitalize', 'off');
    });

    test('should have aria-controls attribute', () => {
      expect(inputEl).toHaveAttribute('aria-controls', '1-1597474295719-5012');
    });

    test('should have value', () => {
      expect(inputEl).toHaveAttribute('value', defaultProps.value);
    });

    test('should have type="text"', () => {
      expect(inputEl).toHaveAttribute('type', 'text');
    });
  });
});
