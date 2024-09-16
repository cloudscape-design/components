// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { act, render } from '@testing-library/react';

import PropertyFilter from '../../../lib/components/property-filter';
import { PropertyFilterProps, Ref } from '../../../lib/components/property-filter/interfaces';
import PropertyFilterInternal, { PropertyFilterInternalProps } from '../../../lib/components/property-filter/internal';
import createWrapper, { PropertyFilterWrapper } from '../../../lib/components/test-utils/dom';
import { PropertyFilterWrapperInternal } from '../../../lib/components/test-utils/dom/property-filter';
import {
  createDefaultProps,
  i18nStrings,
  i18nStringsTokenGroups,
  StatefulInternalPropertyFilter,
  StatefulPropertyFilter,
} from './common';

const defaultProps = createDefaultProps(
  [
    {
      key: 'string',
      propertyLabel: 'string',
      operators: ['!:', ':', '=', '!='],
      groupValuesLabel: 'String values',
    },
    {
      key: 'range',
      propertyLabel: 'range',
      operators: ['>', '<', '=', '!=', '>=', '<='],
      groupValuesLabel: 'Range values',
      group: 'group-name',
    },
  ],
  [
    { propertyKey: 'string', value: 'value1' },
    { propertyKey: 'string', value: 'value2' },
    { propertyKey: 'range', value: '1' },
    { propertyKey: 'range', value: '2' },
  ]
);

const renderComponent = (props?: Partial<PropertyFilterProps & { ref: React.Ref<Ref> }>) => {
  const { container } = render(<PropertyFilter {...defaultProps} {...props} />);
  return { container, propertyFilterWrapper: createWrapper(container).findPropertyFilter()! };
};

const renderStatefulComponent = (props?: Partial<PropertyFilterProps>) => {
  const { container } = render(<StatefulPropertyFilter {...defaultProps} {...props} />);
  return { container, propertyFilterWrapper: createWrapper(container).findPropertyFilter()! };
};

function renderInternalComponent(props: Partial<PropertyFilterInternalProps>) {
  const { container } = render(
    <PropertyFilterInternal
      {...defaultProps}
      enableTokenGroups={true}
      i18nStringsTokenGroups={i18nStringsTokenGroups}
      filteringOptions={[]}
      customGroupsText={[]}
      disableFreeTextFiltering={false}
      {...props}
    />
  );
  return new PropertyFilterWrapperInternal(container);
}

const renderStatefulInternalComponent = (props?: Partial<PropertyFilterInternalProps>) => {
  const { container } = render(
    <StatefulInternalPropertyFilter
      {...defaultProps}
      enableTokenGroups={true}
      i18nStringsTokenGroups={i18nStringsTokenGroups}
      filteringOptions={[]}
      customGroupsText={[]}
      disableFreeTextFiltering={false}
      {...props}
    />
  );
  return new PropertyFilterWrapperInternal(container);
};

describe('filtering tokens', () => {
  describe('content', () => {
    test('free text token', () => {
      const { propertyFilterWrapper: wrapper } = renderComponent({
        query: { tokens: [{ value: 'first', operator: ':' }], operation: 'or' },
      });
      expect(wrapper.findTokens()![0].getElement()).toHaveTextContent('first');
    });

    test('negated free text token', () => {
      const { propertyFilterWrapper: wrapper } = renderComponent({
        query: { tokens: [{ value: 'first', operator: '!:' }], operation: 'or' },
      });
      expect(wrapper.findTokens()![0].getElement()).toHaveTextContent('!: first');
    });

    test('custom operator free text token', () => {
      const { propertyFilterWrapper: wrapper } = renderComponent({
        freeTextFiltering: { operators: ['!^'] },
        query: { tokens: [{ value: 'first', operator: '!^' }], operation: 'or' },
      });
      expect(wrapper.findTokens()![0].getElement()).toHaveTextContent('!^ first');
    });

    test('property token', () => {
      const { propertyFilterWrapper: wrapper } = renderComponent({
        query: { tokens: [{ propertyKey: 'range', value: 'value', operator: '>' }], operation: 'or' },
      });
      expect(wrapper.findTokens()![0].getElement()).toHaveTextContent('range > value');
    });

    test('property token with missing property key and operator :', () => {
      const { propertyFilterWrapper: wrapper } = renderComponent({
        query: { tokens: [{ propertyKey: undefined, value: 'value', operator: ':' }], operation: 'or' },
      });
      expect(wrapper.findTokens()![0].getElement().textContent).toBe('value');
    });

    test('property token with missing property key and operator !:', () => {
      const { propertyFilterWrapper: wrapper } = renderComponent({
        query: { tokens: [{ propertyKey: undefined, value: 'value', operator: '!:' }], operation: 'or' },
      });
      expect(wrapper.findTokens()![0].getElement().textContent).toBe('!: value');
    });
  });

  describe('join operation control', () => {
    let wrapper: PropertyFilterWrapper;
    const handleChange = jest.fn();
    beforeEach(() => {
      wrapper = renderComponent({
        query: {
          tokens: [
            { propertyKey: 'range', value: 'value', operator: '>' },
            { propertyKey: 'string', value: 'value1', operator: ':' },
          ],
          operation: 'or',
        },
        onChange: handleChange,
      }).propertyFilterWrapper;
      handleChange.mockReset();
    });

    test('is missing on the first token', () => {
      expect(wrapper.findTokens()![0].findTokenOperation()).toBeNull();
    });

    test('can be used to change the operation', () => {
      const secondToken = wrapper.findTokens()![1];
      act(() => secondToken.findTokenOperation()!.openDropdown());
      act(() => secondToken.findTokenOperation()!.selectOption(1));
      expect(handleChange).toHaveBeenCalledWith(
        expect.objectContaining({ detail: expect.objectContaining({ operation: 'and' }) })
      );
    });

    test('can be used to check aria-label attribute on the filter token operator', () => {
      const secondToken = wrapper.findTokens()![1];
      const label = secondToken
        .findTokenOperation()
        ?.findTrigger()
        .getElement()
        .getAttribute('aria-labelledby')!
        .split(' ')
        .map(labelId => wrapper.getElement().querySelector(`#${labelId}`)!.textContent)
        .join(' ');
      expect(label).toBe('Boolean Operator or');
    });
  });

  describe('dismiss button', () => {
    test('causes onChange to fire, removing the token', () => {
      const handleChange = jest.fn();
      const { propertyFilterWrapper: wrapper } = renderComponent({
        onChange: handleChange,
        query: { tokens: [{ value: 'first', operator: '!:' }], operation: 'or' },
      });
      act(() => wrapper.findTokens()![0].findRemoveButton()!.click());
      expect(handleChange).toHaveBeenCalledWith(expect.objectContaining({ detail: { tokens: [], operation: 'or' } }));
    });

    test('moves the focus to the input, when pressed', () => {
      const { propertyFilterWrapper: wrapper } = renderStatefulComponent({
        query: { tokens: [{ value: 'first', operator: '!:' }], operation: 'or' },
      });
      act(() => wrapper.findTokens()![0].findRemoveButton()!.click());
      expect(wrapper.findNativeInput().getElement()).toHaveFocus();
      expect(wrapper.findDropdown().findOpenDropdown()).toBe(null);
    });

    test('has a label from i18nStrings', () => {
      const { propertyFilterWrapper: wrapper } = renderComponent({
        query: { tokens: [{ value: 'first', operator: '!:' }], operation: 'or' },
      });
      expect(wrapper.findTokens()![0].findRemoveButton().getElement()).toHaveAttribute(
        'aria-label',
        'Remove token undefined !: first'
      );
    });

    test('disabled, when the component is disabled', () => {
      const handleChange = jest.fn();
      const { propertyFilterWrapper: wrapper } = renderComponent({
        onChange: handleChange,
        query: { tokens: [{ value: 'first', operator: '!:' }], operation: 'or' },
        disabled: true,
      });
      expect(wrapper.findTokens()![0].findRemoveButton().getElement()).toBeDisabled();
      act(() => wrapper.findTokens()![0].findRemoveButton()!.click());
      expect(handleChange).not.toHaveBeenCalled();
    });

    test('moves focus to the adjacent grouped token and to the single remaining token', () => {
      const wrapper = renderStatefulInternalComponent({
        query: {
          operation: 'and',
          tokenGroups: [
            {
              operation: 'or',
              tokens: [
                { propertyKey: 'string', operator: '=', value: 'A' },
                { propertyKey: 'string', operator: '=', value: 'B' },
                { propertyKey: 'string', operator: '=', value: 'C' },
                { propertyKey: 'string', operator: '=', value: 'D' },
              ],
            },
          ],
          tokens: [],
        },
      });

      wrapper.findTokens()[0].findGroupTokens()[3].findRemoveButton()!.click();
      expect(wrapper.findTokens()[0].findGroupTokens()).toHaveLength(3);
      expect(wrapper.findTokens()[0].findGroupTokens()[2]!.find('button')!.getElement()).toHaveFocus();

      wrapper.findTokens()[0].findGroupTokens()[0].findRemoveButton()!.click();
      expect(wrapper.findTokens()[0].findGroupTokens()).toHaveLength(2);
      expect(wrapper.findTokens()[0].findGroupTokens()[0]!.find('button')!.getElement()).toHaveFocus();

      wrapper.findTokens()[0].findGroupTokens()[1].findRemoveButton()!.click();
      expect(wrapper.findTokens()[0].findGroupTokens()).toHaveLength(0);
      expect(wrapper.findTokens()[0].findLabel().getElement()).toHaveFocus();
    });
  });
});

describe('tokens show-more toggle', () => {
  test('is hidden, when there are no filtering tokens', () => {
    const { propertyFilterWrapper: wrapper } = renderComponent({ tokenLimit: 0 });
    expect(wrapper.findTokenToggle()).toBeNull();
  });

  test('is hidden, when tokenLimit is not provided', () => {
    const { propertyFilterWrapper: wrapper } = renderComponent({
      query: { tokens: [{ propertyKey: 'string', value: 'first', operator: ':' }], operation: 'or' },
    });
    expect(wrapper.findTokenToggle()).toBeNull();
  });

  describe('aria-label on toggle fewer/more button', () => {
    const propertiesWithMultipleTokens: Partial<PropertyFilterProps> = {
      tokenLimit: 1,
      query: {
        tokens: [
          { propertyKey: 'string', value: 'first', operator: ':' },
          { propertyKey: 'string', value: 'second', operator: ':' },
        ],
        operation: 'or',
      },
    };

    test('sets no aria-label text on the expand button by default', () => {
      const { propertyFilterWrapper: wrapper } = renderComponent(propertiesWithMultipleTokens);
      expect(wrapper.findTokenToggle()!.getElement()).not.toHaveAttribute('aria-label');
    });

    test('sets aria-label text on the expand button when provided', () => {
      const { propertyFilterWrapper: wrapper } = renderComponent({
        ...propertiesWithMultipleTokens,
        tokenLimitShowMoreAriaLabel: 'Show more token',
      });
      expect(wrapper.findTokenToggle()!.getElement()).toHaveAttribute('aria-label', 'Show more token');
    });

    test('sets no aria-label text on the collapse button by default', () => {
      const { propertyFilterWrapper: wrapper } = renderComponent(propertiesWithMultipleTokens);
      wrapper.findTokenToggle()!.click();
      expect(wrapper.findTokenToggle()!.getElement()).not.toHaveAttribute('aria-label');
    });

    test('sets aria-label text on the collapse button when provided', () => {
      const { propertyFilterWrapper: wrapper } = renderComponent({
        ...propertiesWithMultipleTokens,
        tokenLimitShowFewerAriaLabel: 'Show fewer token',
      });
      wrapper.findTokenToggle()!.click();
      expect(wrapper.findTokenToggle()!.getElement()).toHaveAttribute('aria-label', 'Show fewer token');
    });
  });

  test('toggles the visibility of tokens past the limit', () => {
    const { propertyFilterWrapper: wrapper } = renderComponent({
      tokenLimit: 1,
      query: {
        tokens: [
          { propertyKey: 'string', value: 'first', operator: ':' },
          { propertyKey: 'string', value: 'second', operator: ':' },
        ],
        operation: 'or',
      },
    });
    expect(wrapper.findTokenToggle()!.getElement()).toHaveTextContent(i18nStrings.tokenLimitShowMore!);
    expect(wrapper.findTokens()!).toHaveLength(1);
    expect(wrapper.findTokens()![0].findLabel().getElement()).toHaveTextContent('string : first');
    // show more
    act(() => wrapper.findTokenToggle()!.click());
    expect(wrapper.findTokenToggle()!.getElement()).toHaveTextContent(i18nStrings.tokenLimitShowFewer!);
    expect(wrapper.findTokens()!).toHaveLength(2);
    // show fewer
    act(() => wrapper.findTokenToggle()!.click());
    expect(wrapper.findTokenToggle()!.getElement()).toHaveTextContent(i18nStrings.tokenLimitShowMore!);
    expect(wrapper.findTokens()!).toHaveLength(1);
  });
});

describe('tokens remove all button', () => {
  test('is hidden, when there are no filtering tokens', () => {
    const { propertyFilterWrapper: wrapper } = renderComponent();
    expect(wrapper.findRemoveAllButton()).toBeNull();
  });

  test('a11y label', () => {
    const { propertyFilterWrapper: wrapper } = renderComponent({
      query: { tokens: [{ propertyKey: 'string', value: 'first', operator: ':' }], operation: 'or' },
    });
    expect(wrapper.findRemoveAllButton()!.getElement()).toHaveTextContent(i18nStrings.clearFiltersText!);
  });

  test('causes onChange to fire, removing all tokens', () => {
    const spy = jest.fn();
    const { propertyFilterWrapper: wrapper } = renderComponent({
      query: { tokens: [{ propertyKey: 'string', value: 'first', operator: ':' }], operation: 'or' },
      onChange: spy,
    });
    act(() => wrapper.findRemoveAllButton()!.click());
    expect(spy).toHaveBeenCalledWith(expect.objectContaining({ detail: { tokens: [], operation: 'or' } }));
  });

  test('moves focus to the input but keeps dropdown closed', () => {
    const { propertyFilterWrapper: wrapper } = renderComponent({
      query: { tokens: [{ propertyKey: 'string', value: 'first', operator: ':' }], operation: 'or' },
    });
    act(() => wrapper.findRemoveAllButton()!.click());
    expect(wrapper.findNativeInput()!.getElement()).toHaveFocus();
    expect(wrapper.findDropdown().findOpenDropdown()).toBe(null);
  });

  test('disabled, when the component is disabled', () => {
    const { propertyFilterWrapper: wrapper } = renderComponent({
      disabled: true,
      query: { tokens: [{ propertyKey: 'string', value: 'first', operator: ':' }], operation: 'or' },
    });
    expect(wrapper.findRemoveAllButton()!.getElement()).toBeDisabled();
  });
});

describe('grouped token', () => {
  const tokenJohn = { propertyKey: 'string', operator: '=', value: 'John' };
  const tokenJane = { propertyKey: 'string', operator: '=', value: 'Jane' };
  const tokenJack = { propertyKey: 'string', operator: '=', value: 'Jack' };

  test('token group has correct ARIA label and edit button ARIA label', () => {
    const wrapper = renderInternalComponent({
      query: { operation: 'and', tokenGroups: [{ operation: 'or', tokens: [tokenJohn, tokenJane] }], tokens: [] },
    });

    expect(wrapper.findTokens()[0].getElement()).toHaveAccessibleName('string equals John or string equals Jane');
    expect(wrapper.findTokens()[0].findEditButton()!.getElement()).toHaveAccessibleName(
      'Edit filter, string equals John or string equals Jane'
    );
  });

  test('changes group operation', () => {
    const onChange = jest.fn();
    const wrapper = renderInternalComponent({
      query: { operation: 'and', tokenGroups: [{ operation: 'and', tokens: [tokenJohn, tokenJane] }], tokens: [] },
      onChange,
    });

    wrapper.findTokens()[0].findGroupTokens()[1].findTokenOperation()!.openDropdown();
    wrapper.findTokens()[0].findGroupTokens()[1].findTokenOperation()!.selectOption(2);

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toBeCalledWith(
      expect.objectContaining({
        detail: {
          operation: 'and',
          tokenGroups: [{ operation: 'or', tokens: [tokenJohn, tokenJane] }],
          tokens: [],
        },
      })
    );
  });

  test('removes token from group', () => {
    const onChange = jest.fn();
    const wrapper = renderInternalComponent({
      query: {
        operation: 'and',
        tokenGroups: [{ operation: 'and', tokens: [tokenJohn, tokenJane, tokenJack] }],
        tokens: [],
      },
      onChange,
    });

    wrapper.findTokens()[0].findGroupTokens()[0].findRemoveButton()!.click();

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toBeCalledWith(
      expect.objectContaining({
        detail: {
          operation: 'and',
          tokenGroups: [{ operation: 'and', tokens: [tokenJane, tokenJack] }],
          tokens: [],
        },
      })
    );

    wrapper.findTokens()[0].findGroupTokens()[1].findRemoveButton()!.click();

    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange).toBeCalledWith(
      expect.objectContaining({
        detail: {
          operation: 'and',
          tokenGroups: [{ operation: 'and', tokens: [tokenJohn, tokenJack] }],
          tokens: [],
        },
      })
    );

    wrapper.findTokens()[0].findGroupTokens()[2].findRemoveButton()!.click();

    expect(onChange).toHaveBeenCalledTimes(3);
    expect(onChange).toBeCalledWith(
      expect.objectContaining({
        detail: {
          operation: 'and',
          tokenGroups: [{ operation: 'and', tokens: [tokenJohn, tokenJane] }],
          tokens: [],
        },
      })
    );
  });
});
