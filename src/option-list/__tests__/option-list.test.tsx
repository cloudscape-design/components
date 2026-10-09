// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { act, fireEvent, render } from '@testing-library/react';

import { KeyCode } from '@cloudscape-design/component-toolkit/internal';

import '../../__a11y__/to-validate-a11y';
import OptionList, { OptionListProps } from '../../../lib/components/option-list';
import createWrapper from '../../../lib/components/test-utils/dom';

interface Item {
  id: string;
  label: string;
  description?: string;
}

const items: Item[] = [
  { id: 'a', label: 'First', description: 'First description' },
  { id: 'b', label: 'Second' },
  { id: 'c', label: 'Third' },
];

const renderItem = (item: Item) => ({ id: item.id, content: item.label, secondaryContent: item.description });

function Stateful({
  initialSelectedIds = [],
  onChange,
  ...props
}: Partial<OptionListProps<Item>> & { initialSelectedIds?: string[]; onChange?: jest.Mock }) {
  const [selectedIds, setSelectedIds] = useState<ReadonlyArray<string>>(initialSelectedIds);
  return (
    <OptionList
      ariaLabel="Goals"
      items={items}
      renderItem={renderItem}
      selectionType="single"
      {...props}
      selectedIds={selectedIds}
      onChange={event => {
        onChange?.(event.detail);
        setSelectedIds(event.detail.selectedIds);
      }}
    />
  );
}

function renderOptionList(jsx: React.ReactElement) {
  const { container, rerender } = render(jsx);
  const wrapper = createWrapper(container).findOptionList()!;
  return { container, rerender, wrapper };
}

const clickOption = (wrapper: ReturnType<typeof renderOptionList>['wrapper'], index: number) =>
  fireEvent.mouseUp(wrapper.findOptionByIndex(index)!.getElement());

const pressKey = (wrapper: ReturnType<typeof renderOptionList>['wrapper'], keyCode: number, key?: string) =>
  fireEvent.keyDown(wrapper.findListbox().getElement(), { keyCode, key });

const selectedLabels = (wrapper: ReturnType<typeof renderOptionList>['wrapper']) =>
  wrapper.findSelectedOptions().map(option => option.findLabel()!.getElement().textContent);

describe('OptionList', () => {
  describe('rendering', () => {
    test('renders a labelled, focusable listbox with an option per item', () => {
      const { wrapper } = renderOptionList(<Stateful />);
      const listbox = wrapper.findListbox().getElement();
      expect(listbox).toHaveAttribute('role', 'listbox');
      expect(listbox).toHaveAttribute('aria-label', 'Goals');
      expect(listbox).toHaveAttribute('tabindex', '0');
      expect(wrapper.findOptions()).toHaveLength(3);
      expect(wrapper.findOptions().map(option => option.getElement().getAttribute('role'))).toEqual([
        'option',
        'option',
        'option',
      ]);
    });

    test('renders label and secondary content', () => {
      const { wrapper } = renderOptionList(<Stateful />);
      const first = wrapper.findOptionById('a')!;
      expect(first.findLabel()!.getElement()).toHaveTextContent('First');
      expect(first.findSecondaryContent()!.getElement()).toHaveTextContent('First description');
      expect(wrapper.findOptionById('b')!.findSecondaryContent()).toBeNull();
    });

    test('renders an icon', () => {
      const { wrapper } = renderOptionList(
        <Stateful renderItem={item => ({ id: item.id, content: item.label, icon: <span data-testid="icon" /> })} />
      );
      expect(wrapper.findOptionById('a')!.find('[data-testid="icon"]')).not.toBeNull();
    });

    test('renders label tag and tags', () => {
      const { wrapper } = renderOptionList(
        <Stateful
          renderItem={item => ({ id: item.id, content: item.label, labelTag: '128 GB', tags: ['CPU-v2', '2 GB RAM'] })}
        />
      );
      const option = wrapper.findOptionById('a')!;
      expect(option.findLabelTag()!.getElement()).toHaveTextContent('128 GB');
      expect(option.findTags().map(tag => tag.getElement().textContent)).toEqual(['CPU-v2', '2 GB RAM']);
    });

    test('renders non-string content', () => {
      const { wrapper } = renderOptionList(
        <Stateful renderItem={item => ({ id: item.id, content: <strong>{item.label}</strong> })} />
      );
      expect(wrapper.findAll('strong')).toHaveLength(3);
      expect(wrapper.findOptionById('b')!.findLabel()!.getElement()).toHaveTextContent('Second');
    });

    test('uses the content string as the option title, not the id', () => {
      const { container } = renderOptionList(<Stateful />);
      expect(container.querySelector('[title="Second"]')).not.toBeNull();
      expect(container.querySelector('[title="b"]')).toBeNull();
    });

    test('passes aria-labelledby and aria-describedby to the listbox', () => {
      const { wrapper } = renderOptionList(
        <Stateful ariaLabel={undefined} ariaLabelledby="heading" ariaDescribedby="description" />
      );
      const listbox = wrapper.findListbox().getElement();
      expect(listbox).toHaveAttribute('aria-labelledby', 'heading');
      expect(listbox).toHaveAttribute('aria-describedby', 'description');
    });

    test('renders an empty listbox when there are no items', () => {
      const { wrapper } = renderOptionList(<Stateful items={[]} />);
      expect(wrapper.findOptions()).toHaveLength(0);
    });

    test('warns about duplicate ids', () => {
      const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
      renderOptionList(<Stateful renderItem={item => ({ id: 'same', content: item.label })} />);
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('Every item must have a unique `id`'));
      warn.mockRestore();
    });
  });

  describe('single selection', () => {
    test('marks only the selected option with aria-selected and a check mark', () => {
      const { wrapper } = renderOptionList(<Stateful initialSelectedIds={['b']} />);
      expect(wrapper.findOptions().map(option => option.getElement().getAttribute('aria-selected'))).toEqual([
        'false',
        'true',
        'false',
      ]);
      expect(selectedLabels(wrapper)).toEqual(['Second']);
      expect(wrapper.findListbox().getElement()).not.toHaveAttribute('aria-multiselectable');
      expect(wrapper.findOptionById('b')!.find('[role="checkbox"], input[type="checkbox"]')).toBeNull();
    });

    test('clicking replaces the selection and repeat click keeps it selected', () => {
      const onChange = jest.fn();
      const { wrapper } = renderOptionList(<Stateful onChange={onChange} />);

      clickOption(wrapper, 2);
      expect(onChange).toHaveBeenLastCalledWith({ selectedIds: ['b'] });

      clickOption(wrapper, 3);
      expect(onChange).toHaveBeenLastCalledWith({ selectedIds: ['c'] });
      expect(selectedLabels(wrapper)).toEqual(['Third']);

      clickOption(wrapper, 3);
      expect(onChange).toHaveBeenLastCalledWith({ selectedIds: ['c'] });
      expect(selectedLabels(wrapper)).toEqual(['Third']);
    });

    test('clicking secondary content selects the option (whole row is the target)', () => {
      const onChange = jest.fn();
      const { wrapper } = renderOptionList(<Stateful onChange={onChange} />);
      fireEvent.mouseUp(wrapper.findOptionById('a')!.findSecondaryContent()!.getElement());
      expect(onChange).toHaveBeenLastCalledWith({ selectedIds: ['a'] });
    });

    test('hovering highlights the option and leaving the list clears it', () => {
      const { wrapper } = renderOptionList(<Stateful />);
      fireEvent.mouseEnter(wrapper.getElement());
      fireEvent.mouseMove(wrapper.findOptionByIndex(2)!.getElement());
      expect(wrapper.findHighlightedOption()!.getElement()).toBe(wrapper.findOptionByIndex(2)!.getElement());
      fireEvent.mouseLeave(wrapper.getElement());
      expect(wrapper.findHighlightedOption()).toBeNull();
    });

    test('does not show a highlight before the user interacts with the list', () => {
      const { wrapper } = renderOptionList(<Stateful initialSelectedIds={['b']} />);
      expect(wrapper.findHighlightedOption()).toBeNull();
    });

    test('keyboard focus highlights the selected option with the keyboard focus style', () => {
      const { wrapper } = renderOptionList(<Stateful initialSelectedIds={['b']} />);
      fireEvent.focus(wrapper.findListbox().getElement());
      const highlighted = wrapper.findHighlightedOption()!.getElement();
      expect(highlighted).toBe(wrapper.findOptionById('b')!.getElement());
      expect(highlighted.className).toMatch(/is-keyboard/);
      expect(wrapper.findAll('[class*="highlighted"][role="option"]')).toHaveLength(1);
    });
  });

  describe('multi selection', () => {
    test('marks the listbox multiselectable and renders a checkbox per option', () => {
      const { wrapper } = renderOptionList(<Stateful selectionType="multi" initialSelectedIds={['a', 'c']} />);
      expect(wrapper.findListbox().getElement()).toHaveAttribute('aria-multiselectable', 'true');
      expect(selectedLabels(wrapper)).toEqual(['First', 'Third']);
      expect(wrapper.findAll('svg').length).toBeGreaterThanOrEqual(3);
    });

    test('clicking toggles options and keeps the selection order', () => {
      const onChange = jest.fn();
      const { wrapper } = renderOptionList(
        <Stateful selectionType="multi" initialSelectedIds={['c']} onChange={onChange} />
      );

      clickOption(wrapper, 1);
      expect(onChange).toHaveBeenLastCalledWith({ selectedIds: ['c', 'a'] });

      clickOption(wrapper, 3);
      expect(onChange).toHaveBeenLastCalledWith({ selectedIds: ['a'] });
      expect(selectedLabels(wrapper)).toEqual(['First']);
    });
  });

  describe('keyboard', () => {
    test('focus highlights the first option, arrows move with wrap-around, Home and End jump', () => {
      const { wrapper } = renderOptionList(<Stateful />);
      const listbox = wrapper.findListbox().getElement();
      const optionId = (index: number) => wrapper.findOptionByIndex(index)!.getElement().id;

      fireEvent.focus(listbox);
      expect(listbox).toHaveAttribute('aria-activedescendant', optionId(1));

      pressKey(wrapper, KeyCode.down);
      expect(listbox).toHaveAttribute('aria-activedescendant', optionId(2));

      pressKey(wrapper, KeyCode.up);
      pressKey(wrapper, KeyCode.up);
      expect(listbox).toHaveAttribute('aria-activedescendant', optionId(3));

      pressKey(wrapper, KeyCode.down);
      expect(listbox).toHaveAttribute('aria-activedescendant', optionId(1));

      pressKey(wrapper, 35 /* End */);
      expect(listbox).toHaveAttribute('aria-activedescendant', optionId(3));

      pressKey(wrapper, 36 /* Home */);
      expect(listbox).toHaveAttribute('aria-activedescendant', optionId(1));
    });

    test('Enter and Space select the highlighted option', () => {
      const onChange = jest.fn();
      const { wrapper } = renderOptionList(<Stateful selectionType="multi" onChange={onChange} />);
      fireEvent.focus(wrapper.findListbox().getElement());

      pressKey(wrapper, KeyCode.enter);
      expect(onChange).toHaveBeenLastCalledWith({ selectedIds: ['a'] });

      pressKey(wrapper, KeyCode.down);
      pressKey(wrapper, KeyCode.space);
      expect(onChange).toHaveBeenLastCalledWith({ selectedIds: ['a', 'b'] });

      pressKey(wrapper, KeyCode.space);
      expect(onChange).toHaveBeenLastCalledWith({ selectedIds: ['a'] });
    });

    test('Escape does not change the selection or the highlight', () => {
      const onChange = jest.fn();
      const { wrapper } = renderOptionList(<Stateful onChange={onChange} />);
      fireEvent.focus(wrapper.findListbox().getElement());
      pressKey(wrapper, KeyCode.escape);
      expect(onChange).not.toHaveBeenCalled();
      expect(wrapper.findOptions()).toHaveLength(3);
    });

    test('type-ahead highlights the matching option', () => {
      const { wrapper } = renderOptionList(<Stateful />);
      const listbox = wrapper.findListbox().getElement();
      fireEvent.focus(listbox);
      fireEvent.keyDown(listbox, { key: 't' });
      expect(listbox).toHaveAttribute('aria-activedescendant', wrapper.findOptionById('c')!.getElement().id);
    });

    test('blur clears the highlight', () => {
      const { wrapper } = renderOptionList(<Stateful />);
      const listbox = wrapper.findListbox().getElement();
      fireEvent.focus(listbox);
      expect(wrapper.findHighlightedOption()).not.toBeNull();
      fireEvent.blur(listbox);
      expect(wrapper.findHighlightedOption()).toBeNull();
    });

    test('fires onFocus and onBlur', () => {
      const onFocus = jest.fn();
      const onBlur = jest.fn();
      const { wrapper } = renderOptionList(
        <OptionList
          ariaLabel="Goals"
          items={items}
          renderItem={renderItem}
          selectionType="single"
          onFocus={onFocus}
          onBlur={onBlur}
        />
      );
      const listbox = wrapper.findListbox().getElement();
      fireEvent.focus(listbox);
      expect(onFocus).toHaveBeenCalledTimes(1);
      fireEvent.blur(listbox);
      expect(onBlur).toHaveBeenCalledTimes(1);
    });
  });

  describe('state', () => {
    test('controlled: does not change the selection without the consumer updating selectedIds', () => {
      const onChange = jest.fn();
      const { wrapper } = renderOptionList(
        <OptionList
          ariaLabel="Goals"
          items={items}
          renderItem={renderItem}
          selectionType="single"
          selectedIds={['a']}
          onChange={({ detail }) => onChange(detail)}
        />
      );
      clickOption(wrapper, 2);
      expect(onChange).toHaveBeenCalledWith({ selectedIds: ['b'] });
      expect(selectedLabels(wrapper)).toEqual(['First']);
    });

    test('controlled: reflects new selectedIds from the consumer', () => {
      const props = { ariaLabel: 'Goals', items, renderItem, selectionType: 'single' as const, onChange: () => {} };
      const { wrapper, rerender } = renderOptionList(<OptionList {...props} selectedIds={['a']} />);
      rerender(<OptionList {...props} selectedIds={['c']} />);
      expect(selectedLabels(wrapper)).toEqual(['Third']);
    });

    test('ignores selected ids that do not match an item', () => {
      const { wrapper } = renderOptionList(<Stateful initialSelectedIds={['missing', 'b']} selectionType="multi" />);
      expect(selectedLabels(wrapper)).toEqual(['Second']);
    });

    test('uncontrolled: manages selection internally and fires onChange', () => {
      const onChange = jest.fn();
      const { wrapper } = renderOptionList(
        <OptionList
          ariaLabel="Goals"
          items={items}
          renderItem={renderItem}
          selectionType="multi"
          onChange={({ detail }) => onChange(detail)}
        />
      );
      clickOption(wrapper, 1);
      clickOption(wrapper, 2);
      expect(onChange).toHaveBeenLastCalledWith({ selectedIds: ['a', 'b'] });
      expect(selectedLabels(wrapper)).toEqual(['First', 'Second']);
    });
  });

  test('ref.focus() focuses the listbox', () => {
    const ref = React.createRef<OptionListProps.Ref>();
    const { wrapper } = renderOptionList(
      <OptionList ref={ref} ariaLabel="Goals" items={items} renderItem={renderItem} selectionType="single" />
    );
    act(() => ref.current!.focus());
    expect(document.activeElement).toBe(wrapper.findListbox().getElement());
  });

  test('announces the selected state of the highlighted option', () => {
    const { wrapper } = renderOptionList(
      <Stateful initialSelectedIds={['a']} i18nStrings={{ selectedAriaLabel: 'Picked' }} />
    );
    fireEvent.focus(wrapper.findListbox().getElement());
    expect(wrapper.findOptionById('a')!.getElement()).toHaveTextContent('Picked');
  });

  test('passes id, className and data attributes to the root', () => {
    const { container } = render(
      <OptionList
        id="my-list"
        className="custom"
        data-testid="root"
        ariaLabel="Goals"
        items={items}
        renderItem={renderItem}
        selectionType="single"
      />
    );
    const root = createWrapper(container).findOptionList()!.getElement();
    expect(root).toHaveAttribute('id', 'my-list');
    expect(root).toHaveClass('custom');
    expect(root).toHaveAttribute('data-testid', 'root');
  });

  test.each<OptionListProps.SelectionType>(['single', 'multi'])('is accessible, selectionType=%s', async type => {
    const { container } = render(<Stateful selectionType={type} initialSelectedIds={['a']} />);
    await expect(container).toValidateA11y();
  });
});
