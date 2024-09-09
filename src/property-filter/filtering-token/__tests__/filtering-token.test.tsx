// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';
import { render } from '@testing-library/react';

import FilteringToken, { FilteringTokenProps } from '../../../../lib/components/property-filter/filtering-token';
import { FilteringTokenWrapperInternal } from '../../../../lib/components/test-utils/dom/property-filter';

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

const token4 = {
  content: 'property4 = value',
  ariaLabel: 'filter property4 = value',
  dismissAriaLabel: 'remove filter property4 = value',
} as const;

const defaultProps: FilteringTokenProps = {
  tokens: [],
  operation: 'and',
  groupOperation: 'or',
  showOperation: false,
  andText: 'und',
  orText: 'oder',
  groupAriaLabel: 'filter group with 0 tokens',
  groupEditAriaLabel: 'edit token group',
  operationAriaLabel: 'operation',
  onChangeOperation: () => {},
  onChangeGroupOperation: () => {},
  onDismissToken: () => {},
  editorContent: 'Token editor content',
  editorHeader: 'Token editor header',
  editorDismissAriaLabel: 'dismiss editor',
  editorExpandToViewport: false,
  hasGroups: false,
  popoverSize: 'content',
};

function renderToken(props: Partial<FilteringTokenProps>): FilteringTokenWrapperInternal {
  const { container } = render(<FilteringToken {...defaultProps} {...props} />);
  return new FilteringTokenWrapperInternal(
    container.querySelector<HTMLElement>(`.${FilteringTokenWrapperInternal.rootSelector}`)!
  );
}

function StatefulToken(props: FilteringTokenProps) {
  const [tokens, setTokens] = useState(props.tokens);
  return (
    <FilteringToken
      {...defaultProps}
      {...props}
      tokens={tokens}
      onDismissToken={removeIndex => setTokens(prev => prev.filter((_, index) => index !== removeIndex))}
    />
  );
}

function renderStatefulToken(props: Partial<FilteringTokenProps>): FilteringTokenWrapperInternal {
  const { container } = render(<StatefulToken {...defaultProps} {...props} />);
  return new FilteringTokenWrapperInternal(
    container.querySelector<HTMLElement>(`.${FilteringTokenWrapperInternal.rootSelector}`)!
  );
}

test('renders a single token as role="group" with token ARIA label and dismiss button', () => {
  const token = renderToken({ tokens: [token1] });
  expect(token.getElement()).toHaveAttribute('role', 'group');
  expect(token.getElement()).toHaveAccessibleName('filter property1 = value');
  expect(token.findLabel()!.getElement()).toHaveTextContent('property1 = value');
  expect(token.findRemoveButton()!.getElement()).toHaveAccessibleName('remove filter property1 = value');
  expect(token.findTokenOperation()!).toBeNull();
});

test('renders 3 tokens as role="group" with group ARIA label no dismiss button', () => {
  const token = renderToken({ tokens: [token1, token2, token3], groupAriaLabel: 'filter group with 3 tokens' });
  expect(token.getElement()).toHaveAttribute('role', 'group');
  expect(token.getElement()).toHaveAccessibleName('filter group with 3 tokens');
  expect(token.findLabel()).toBe(null);
  expect(token.findRemoveButton()).toBe(null);
  expect(token.findTokenOperation()!).toBeNull();
});

test('nested tokens rendered as role="group" with token ARIA label and dismiss button', () => {
  const token = renderToken({ tokens: [token1, token2, token3], groupAriaLabel: 'filter group with 3 tokens' });
  const groupTokens = token.findGroupTokens();
  expect(groupTokens).toHaveLength(3);

  for (let index = 0; index < groupTokens.length; index++) {
    expect(groupTokens[index].getElement()).toHaveAttribute('role', 'group');
    expect(groupTokens[index].getElement()).toHaveAccessibleName(`filter property${index + 1} = value`);
    expect(groupTokens[index].findLabel()!.getElement()).toHaveTextContent(`property${index + 1} = value`);
    expect(groupTokens[index].findRemoveButton()!.getElement()).toHaveAccessibleName(
      `remove filter property${index + 1} = value`
    );
  }
});

test('fires root onDismiss when the remove button is pressed', () => {
  const onDismissToken = jest.fn();
  const token = renderToken({ tokens: [token1], onDismissToken });
  token.findRemoveButton().click();
  expect(onDismissToken).toHaveBeenCalledTimes(1);
  expect(onDismissToken).toHaveBeenCalledWith(0);
});

test('fires grouped onDismiss when the remove button is pressed', () => {
  const onDismissToken = jest.fn();
  const token = renderToken({ tokens: [token1, token2], onDismissToken });
  token.findGroupTokens()[1].findRemoveButton().click();
  expect(onDismissToken).toHaveBeenCalledTimes(1);
  expect(onDismissToken).toHaveBeenCalledWith(1);
});

test.each([1, 2])('shows root operation selector if showOperation is true, slice=%s', slice => {
  const onChangeOperation = jest.fn();
  const token = renderToken({ tokens: [token1, token2].slice(slice), showOperation: true, onChangeOperation });
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

test('shows operation selector for 2 and 3 grouped tokens', () => {
  const onChangeGroupOperation = jest.fn();
  const token = renderToken({
    tokens: [token1, token2, token3],
    groupAriaLabel: 'filter group with 3 tokens',
    onChangeGroupOperation,
  });
  const groupTokens = token.findGroupTokens();

  expect(groupTokens[0].findTokenOperation()).toBe(null);
  expect(groupTokens[1].findTokenOperation()).not.toBe(null);
  expect(groupTokens[2].findTokenOperation()).not.toBe(null);

  expect(groupTokens[1].findTokenOperation()!.findTrigger().getElement()).toHaveTextContent('oder');
  expect(groupTokens[1].findTokenOperation()!.findTrigger().getElement()).toHaveAccessibleName('operation oder');

  groupTokens[1].findTokenOperation()!.openDropdown();
  const operationSelector = groupTokens[1].findTokenOperation()!;
  expect(operationSelector.findDropdown().findOptionByValue('and')!.getElement()).toHaveTextContent('und');
  expect(operationSelector.findDropdown().findOptionByValue('or')!.getElement()).toHaveTextContent('oder');

  operationSelector.selectOptionByValue('and');
  expect(onChangeGroupOperation).toHaveBeenCalledTimes(1);
  expect(onChangeGroupOperation).toHaveBeenCalledWith('and');
});

test.each([false, true])(
  'opens token editor by clicking on token label, editorExpandToViewport=%s',
  editorExpandToViewport => {
    const token = renderToken({ tokens: [token1], editorExpandToViewport });

    expect(token.findLabel()!.getElement()).toHaveTextContent('property1 = value');

    token.findLabel().click();
    const editor = token.findEditorDropdown({ expandToViewport: editorExpandToViewport })!;

    expect(editor).not.toBe(null);
    expect(editor.getElement()).toHaveTextContent('Token editor headerToken editor content');
    expect(editor.findHeader().getElement()).toHaveTextContent('Token editor header');
    expect(editor.findDismissButton().getElement()).toHaveAccessibleName('dismiss editor');
  }
);

test.each([false, true])(
  'opens token editor by clicking on token edit button, editorExpandToViewport=%s',
  editorExpandToViewport => {
    const token = renderToken({ tokens: [token1, token2], editorExpandToViewport });

    expect(token.findEditButton()!.getElement()).toHaveAccessibleName('edit token group');

    token.findEditButton().click();
    const editor = token.findEditorDropdown({ expandToViewport: editorExpandToViewport })!;

    expect(editor).not.toBe(null);
    expect(editor.getElement()).toHaveTextContent('Token editor headerToken editor content');
    expect(editor.findHeader().getElement()).toHaveTextContent('Token editor header');
    expect(editor.findDismissButton().getElement()).toHaveAccessibleName('dismiss editor');
  }
);

test('moved focus to adjacent element when inner token is removed', () => {
  const token = renderStatefulToken({ tokens: [token1, token2, token3, token4] });

  // Removing token3 and expecting focus to move to token4
  token.findGroupTokens()[2].findRemoveButton()!.click();
  expect(token.findGroupTokens()[2].find('button')!.getElement()).toHaveFocus();

  // Removing token4 and expecting focus to move to token2
  token.findGroupTokens()[2].findRemoveButton()!.click();
  expect(token.findGroupTokens()[1].find('button')!.getElement()).toHaveFocus();

  // Removing token1 and expecting focus to move to token2 (standalone)
  token.findGroupTokens()[0].findRemoveButton()!.click();
  expect(token.find('button')!.getElement()).toHaveFocus();
});
