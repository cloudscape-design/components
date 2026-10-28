// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import createWrapper from '../../../lib/components/test-utils/dom';
import TextFilter, { TextFilterProps } from '../../../lib/components/text-filter';

function renderTextFilter(
  props: Omit<TextFilterProps, 'filteringText'> & {
    filteringText?: string;
    styleClassNames?: Record<string, string | Record<string, string>>;
  } = {}
) {
  const { container } = render(
    <TextFilter filteringText="" onChange={() => {}} filteringAriaLabel="Filter" {...props} />
  );
  return { container, wrapper: createWrapper(container).findTextFilter()! };
}

describe('Text filter Style API v2', () => {
  test('forwards the input classes to the Input slots and applies the countText class', () => {
    const { container, wrapper } = renderTextFilter({
      filteringText: 'query',
      countText: '18 matches',
      styleClassNames: {
        input: { root: 'a', input: 'b', searchIcon: 'c', clearButton: 'd', unknown: 'e' },
        countText: 'f',
        unknown: 'g',
      },
    });
    const nativeInput = wrapper.findInput().findNativeInput().getElement();
    expect(nativeInput.parentElement).toHaveClass('a');
    expect(nativeInput).toHaveClass('b');
    expect(container.querySelector('.c')).toBe(nativeInput.parentElement!.previousElementSibling);
    expect(wrapper.findInput().findClearButton()!.getElement()).toHaveClass('d');
    expect(container.querySelector('.e')).toBeNull();
    expect(wrapper.findResultsCount().getElement()).toHaveClass('f');
    expect(container.querySelector('.g')).toBeNull();
  });

  test('applies the input classes when disabled and renders no countText element', () => {
    const { container, wrapper } = renderTextFilter({
      filteringText: 'query',
      countText: '18 matches',
      disabled: true,
      styleClassNames: { input: { root: 'a', input: 'b' }, countText: 'c' },
    });
    const nativeInput = wrapper.findInput().findNativeInput().getElement();
    expect(nativeInput.parentElement).toHaveClass('a');
    expect(nativeInput).toHaveClass('b');
    expect(container.querySelector('.c')).toBeNull();
  });

  test('does not leak the styleClassNames prop to the DOM', () => {
    const { container } = renderTextFilter({ styleClassNames: { input: { root: 'a' }, countText: 'b' } });
    expect(container.querySelector('[styleClassNames]')).toBeNull();
  });
});
