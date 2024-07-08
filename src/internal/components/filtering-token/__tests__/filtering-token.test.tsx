// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import FilteringToken, { FilteringTokenProps } from '../../../../../lib/components/internal/components/filtering-token';
import FilteringTokenWrapper from '../../../../../lib/components/test-utils/dom/internal/filtering-token';

const token1 = {
  content: 'property1 = value',
  ariaLabel: 'filter property1 = value',
  dismissAriaLabel: 'remove filter property1 = value',
} as const;

const token2 = {
  content: 'property2 = value',
  ariaLabel: 'filter property2 = value',
  dismissAriaLabel: 'remove filter property2 = value',
} as const;

const token3 = {
  content: 'property3 = value',
  ariaLabel: 'filter property3 = value',
  dismissAriaLabel: 'remove filter property3 = value',
} as const;

const defaultProps: FilteringTokenProps = {
  tokens: [],
  operation: 'and',
  groupOperation: 'or',
  showOperation: false,
  andText: 'und',
  orText: 'oder',
  groupAriaLabel: 'filter group with 0 tokens',
  operationAriaLabel: 'operation',
  onChangeOperation: () => {},
  onChangeGroupOperation: () => {},
  onDismissToken: () => {},
};

function renderToken(props: Partial<FilteringTokenProps>): FilteringTokenWrapper {
  const { container } = render(<FilteringToken {...defaultProps} {...props} />);
  return new FilteringTokenWrapper(container.querySelector<HTMLElement>(`.${FilteringTokenWrapper.rootSelector}`)!);
}

describe('Property filter token component: single token', () => {
  it('renders a single token as role="group" with token ARIA label and dismiss button', () => {
    const token = renderToken({ tokens: [token1] });
    expect(token.getElement()).toHaveAttribute('role', 'group');
    expect(token.getElement()).toHaveAccessibleName('filter property1 = value');
    expect(token.findLabel()!.getElement()).toHaveTextContent('property1 = value');
    expect(token.findRemoveButton()!.getElement()).toHaveAccessibleName('remove filter property1 = value');
  });

  it('fires onDismiss when the remove button is pressed', () => {
    const onDismissToken = jest.fn();
    const token = renderToken({ tokens: [token1], onDismissToken });
    token.findRemoveButton().click();
    expect(onDismissToken).toHaveBeenCalledTimes(1);
    expect(onDismissToken).toHaveBeenCalledWith(0);
  });

  it('hides operation selector if showOperation is false', () => {
    const token = renderToken({ tokens: [token1], showOperation: false });
    expect(token.findTokenOperation()!).toBeNull();
  });

  it('shows operation selector if showOperation is true', () => {
    const onChangeOperation = jest.fn();
    const token = renderToken({ tokens: [token1], showOperation: true, onChangeOperation });
    expect(token.findTokenOperation()!.findTrigger().getElement()).toHaveTextContent('und');
    expect(token.findTokenOperation()!.findTrigger().getElement()).toHaveAccessibleName('operation und');

    token.findTokenOperation()!.openDropdown();
    const operationSelector = token.findTokenOperation()!;
    expect(operationSelector.findDropdown().findOptionByValue('and')!.getElement()).toHaveTextContent('und');
    expect(operationSelector.findDropdown().findOptionByValue('or')!.getElement()).toHaveTextContent('oder');

    operationSelector.selectOptionByValue('or');
    expect(onChangeOperation).toHaveBeenCalledTimes(1);
    expect(onChangeOperation).toHaveBeenCalledWith('or');
  });
});

describe('Property filter token component: token group', () => {
  it('renders 3 tokens as role="group" with group ARIA label no dismiss button', () => {
    const token = renderToken({ tokens: [token1, token2, token3], groupAriaLabel: 'filter group with 3 tokens' });
    expect(token.getElement()).toHaveAttribute('role', 'group');
    expect(token.getElement()).toHaveAccessibleName('filter group with 3 tokens');
    expect(token.findLabel()!.getElement()).toHaveTextContent('property1 = value');

    // TODO: fix
    // expect(token.findRemoveButton()).toBe(null);
  });

  // TODO: more tests
});
