// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act, render } from '@testing-library/react';

import Popover from '../../../../lib/components/popover/internal';
import FilteringToken, { FilteringTokenProps } from '../../../../lib/components/property-filter/filtering-token';
import { FilteringTokenWrapper } from '../../../../lib/components/test-utils/dom/property-filter';

const DEFAULT_PROPS: FilteringTokenProps = {
  andText: 'and',
  orText: 'or',
  dismissAriaLabel: '',
  operation: 'and',
  showOperation: false,
  onChange: () => {},
  onDismiss: () => {},
  children: null,
};

function renderToken(props: Partial<FilteringTokenProps>): FilteringTokenWrapper {
  const { container } = render(<FilteringToken {...DEFAULT_PROPS} {...props} />);
  return new FilteringTokenWrapper(container.querySelector<HTMLElement>(`.${FilteringTokenWrapper.rootSelector}`)!);
}

describe('Property filter token component', () => {
  it('adds an aria-label to the dismiss button', () => {
    const token = renderToken({ dismissAriaLabel: 'Close' });
    expect(token.findRemoveButton()!.getElement()).toHaveAttribute('aria-label', 'Close');
  });

  it('hides the select if showOperation is false', () => {
    const token = renderToken({ showOperation: false });
    expect(token.findTokenOperation()!).toBeNull();
  });

  it('renders a select with and/or text as options', () => {
    const token = renderToken({ showOperation: true, operation: 'and', andText: 'and-test', orText: 'or-test' });
    expect(token.findTokenOperation()!.findTrigger().getElement()).toHaveTextContent('and-test');
    act(() => token.findTokenOperation()!.openDropdown());
    const dropdown = token.findTokenOperation()!.findDropdown();
    expect(dropdown.findOptionByValue('and')!.getElement()).toHaveTextContent('and-test');
    expect(dropdown.findOptionByValue('or')!.getElement()).toHaveTextContent('or-test');
  });

  it('fires onChange when a select option is selected', () => {
    const onChange = jest.fn();
    const token = renderToken({ showOperation: true, onChange });
    act(() => token.findTokenOperation()!.openDropdown());
    act(() => token.findTokenOperation()!.selectOptionByValue('or'));
    expect(onChange).toHaveBeenCalledWith('or');
  });

  it('renders the token content', () => {
    const token = renderToken({ showOperation: true, children: <Popover content="">Hello world</Popover> });
    expect(token.findLabel().getElement()).toHaveTextContent('Hello world');
  });

  it('fires onDismiss when the remove button is pressed', () => {
    const onDismiss = jest.fn();
    const token = renderToken({ showOperation: true, onDismiss });
    act(() => token.findRemoveButton().click());
    expect(onDismiss).toHaveBeenCalled();
  });
});
