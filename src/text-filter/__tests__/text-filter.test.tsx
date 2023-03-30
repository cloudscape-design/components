// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';
import { DEBOUNCE_DEFAULT_DELAY } from '../../../lib/components/internal/debounce';
import TextFilter, { TextFilterProps } from '../../../lib/components/text-filter';
import createWrapper from '../../../lib/components/test-utils/dom';
import '../../__a11y__/to-validate-a11y';

function renderTextFilter(jsx: React.ReactElement) {
  const { container } = render(jsx);
  const wrapper = createWrapper(container).findTextFilter()!;
  return { wrapper };
}

test('should have no initial value for filtering', () => {
  const { wrapper } = renderTextFilter(<TextFilter filteringText={''} />);
  expect(wrapper.findInput().findNativeInput().getElement().value).toBe('');
});

test('should attach aria-describedby to the filtering input', () => {
  const { wrapper } = renderTextFilter(<TextFilter filteringText="test" countText="N matches" />);
  const ariaDescribedby = wrapper.findInput().findNativeInput().getElement().getAttribute('aria-describedby');
  expect(ariaDescribedby).not.toBeNull();
  expect(document.getElementById(ariaDescribedby!)).toHaveTextContent('N matches');
});

test('should apply filteringPlaceholder', () => {
  const { wrapper } = renderTextFilter(<TextFilter filteringText="" filteringPlaceholder="search placeholder" />);
  expect(wrapper.findInput().findNativeInput().getElement()).toHaveAttribute('placeholder', 'search placeholder');
});

test('should focus input via function', () => {
  let ref: TextFilterProps.Ref;
  const { wrapper } = renderTextFilter(
    <TextFilter ref={value => (ref = value!)} filteringText="" filteringPlaceholder="search placeholder" />
  );
  ref!.focus();
  expect(wrapper.findInput().findNativeInput().getElement()).toBe(document.activeElement);
});

test('should fire filtering change when the text input changes', () => {
  const onChange = jest.fn();
  const { wrapper } = renderTextFilter(<TextFilter filteringText="" onChange={onChange} />);

  wrapper.findInput().setInputValue('filtering');

  expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ detail: { filteringText: 'filtering' } }));
});

test('should fire onDelayedChange with a delay', async () => {
  const onDelayedChange = jest.fn();
  const { wrapper } = renderTextFilter(<TextFilter filteringText="" onDelayedChange={onDelayedChange} />);

  wrapper.findInput().setInputValue('filtering');

  await new Promise(resolve => setTimeout(resolve, 1));
  expect(onDelayedChange).not.toHaveBeenCalled();

  await new Promise(resolve => setTimeout(resolve, DEBOUNCE_DEFAULT_DELAY + 50));
  expect(onDelayedChange).toHaveBeenCalledWith(
    expect.objectContaining({
      detail: {
        filteringText: 'filtering',
      },
    })
  );
  expect(onDelayedChange).toHaveBeenCalledTimes(1);
});

test('should not disable the filtering input by default', () => {
  const { wrapper } = renderTextFilter(<TextFilter filteringText="" />);
  expect(wrapper.findInput().findNativeInput().getElement()).not.toHaveAttribute('disabled');
});

test('should disable the filtering input when disabled', () => {
  const { wrapper } = renderTextFilter(<TextFilter filteringText="" disabled={true} />);
  expect(wrapper.findInput().findNativeInput().getElement()).toHaveAttribute('disabled');
});

test('should pass the label to the filtering input if defined', () => {
  const { wrapper } = renderTextFilter(<TextFilter filteringText="" filteringAriaLabel="it is a filter" />);
  expect(wrapper.findInput().findNativeInput().getElement()).toHaveAttribute('aria-label', 'it is a filter');
});

test('should not pass the label to the filtering input if not defined', () => {
  const { wrapper } = renderTextFilter(<TextFilter filteringText="" />);
  expect(wrapper.findInput().findNativeInput().getElement()).not.toHaveAttribute('aria-label');
});

test('has autocomplete turned off', () => {
  const { wrapper } = renderTextFilter(<TextFilter filteringText="" />);
  expect(wrapper.findInput().findNativeInput().getElement()).toHaveAttribute('autocomplete', 'off');
});

describe('countText', () => {
  test('not displayed if no value was given', () => {
    const { wrapper } = renderTextFilter(<TextFilter filteringText="" />);
    expect(wrapper.findResultsCount()).toBe(null);
  });

  test('not displayed when filtering text is empty', () => {
    const { wrapper } = renderTextFilter(<TextFilter filteringText="" countText="0 matches" />);
    expect(wrapper.findResultsCount()).toBe(null);
  });

  test('displays the text when all conditions met', () => {
    const { wrapper } = renderTextFilter(<TextFilter filteringText="test" countText="10 matches" />);
    expect(wrapper.findResultsCount().getElement().textContent).toEqual('10 matches');
  });
});

test('check a11y', async () => {
  const { wrapper } = renderTextFilter(<TextFilter filteringText="" filteringAriaLabel="filter instances" />);
  await expect(wrapper.getElement()).toValidateA11y();
});
