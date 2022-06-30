// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';
import createWrapper from '../../../../lib/components/test-utils/dom';

import { AutosuggestItem } from '../../../../lib/components/autosuggest/interfaces';
import { useDropdownA11yProps } from '../../../../lib/components/autosuggest/hooks/a11y';

const options = [...Array(4)].map((_, index) => ({
  value: `value${index + 1}`,
  option: { value: `value${index + 1}` },
}));

const groups = [...Array(2)].map((_, index) => ({
  label: `group${index + 1}`,
  option: { label: `group${index + 1}` },
}));

const parentMap = new Map();
parentMap.set(options[1], groups[0]);
parentMap.set(options[2], groups[0]);
parentMap.set(options[3], groups[1]);

jest.mock('../../../../lib/components/autosuggest/controller', () => ({
  getParentGroup: (item: AutosuggestItem) => parentMap.get(item),
}));

jest.mock('../../../../lib/components/internal/hooks/use-unique-id', () => ({
  generateUniqueId: () => 'unique-id',
}));

const renderHookComponent = (jsx: React.ReactElement) => {
  const { container, rerender } = render(jsx);
  const wrapper = createWrapper(container);
  return { wrapper, rerender };
};

interface UseDropdownA11yHookProps {
  listId: string;
  expanded: boolean;
  inputAriaLabel?: string;
  highlightedOption?: AutosuggestItem;
}

const UseDropdownA11yProps = ({ listId, expanded, inputAriaLabel, highlightedOption }: UseDropdownA11yHookProps) => {
  const [inputProps, itemProps] = useDropdownA11yProps(listId, expanded, inputAriaLabel, highlightedOption);
  return (
    <>
      <input {...inputProps} />
      <div {...itemProps}></div>
    </>
  );
};

describe('useDropdownA11yProps', () => {
  test('adds combobox role to input', () => {
    const { wrapper } = renderHookComponent(<UseDropdownA11yProps listId="list" expanded={false} />);
    expect(wrapper.find('input')!.getElement()).toHaveAttribute('role', 'combobox');
  });

  test('adds correct aria properties to input', () => {
    const { wrapper } = renderHookComponent(<UseDropdownA11yProps listId="list" expanded={false} />);

    const inputEl = wrapper.find('input')!.getElement();
    expect(inputEl).toHaveAttribute('aria-autocomplete', 'list');
    expect(inputEl).toHaveAttribute('aria-expanded', 'false');
    expect(inputEl).toHaveAttribute('aria-controls', 'list');
    expect(inputEl).not.toHaveAttribute('aria-label');
    expect(inputEl).not.toHaveAttribute('aria-activedescendant');
  });

  test('adds correct aria properties to input when expanded', () => {
    const { wrapper } = renderHookComponent(<UseDropdownA11yProps listId="list" expanded={true} />);
    expect(wrapper.find('input')!.getElement()).toHaveAttribute('aria-expanded', 'true');
  });

  test('can add an aria-label to input', () => {
    const { wrapper } = renderHookComponent(
      <UseDropdownA11yProps listId="list" expanded={false} inputAriaLabel="input label" />
    );
    expect(wrapper.find('input')!.getElement()).toHaveAttribute('aria-label', 'input label');
  });

  test('adds id of highlighted item as aria-activedescendant to input', () => {
    const { wrapper } = renderHookComponent(
      <UseDropdownA11yProps listId="list" expanded={false} highlightedOption={options[0]} />
    );
    expect(wrapper.find('input')!.getElement()).toHaveAttribute('aria-activedescendant', 'unique-id');
  });

  test('adds id to highlighted item', () => {
    const { wrapper } = renderHookComponent(
      <UseDropdownA11yProps listId="list" expanded={false} highlightedOption={options[0]} />
    );
    expect(wrapper.find('div')!.getElement()).toHaveAttribute('id', 'unique-id');
  });
});
