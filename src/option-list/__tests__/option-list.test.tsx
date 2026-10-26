// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { act, createEvent, fireEvent, render } from '@testing-library/react';

import { KeyCode } from '@cloudscape-design/component-toolkit/internal';

import '../../__a11y__/to-validate-a11y';
import OptionList, { OptionListProps } from '../../../lib/components/option-list';
import createWrapper from '../../../lib/components/test-utils/dom';

import selectableItemStyles from '../../../lib/components/internal/components/selectable-item/styles.css.js';

const options: OptionListProps.Option[] = [
  { value: 'a', label: 'First', description: 'First description' },
  { value: 'b', label: 'Second' },
  { value: 'c', label: 'Third' },
];

const byValue = (values: string[], source: OptionListProps.Options = options) =>
  values.map(value => source.find(option => option.value === value)!);

function Stateful({
  initialSelected = [],
  onChange,
  ...props
}: Partial<OptionListProps> & { initialSelected?: string[]; onChange?: jest.Mock }) {
  const source = props.options ?? options;
  const [selectedOptions, setSelectedOptions] = useState<ReadonlyArray<OptionListProps.Option>>(
    byValue(initialSelected, source)
  );
  return (
    <OptionList
      ariaLabel="Goals"
      options={options}
      selectionType="single"
      {...props}
      selectedOptions={selectedOptions}
      onChange={event => {
        onChange?.(event.detail.selectedOptions.map(option => option.value));
        setSelectedOptions(event.detail.selectedOptions);
      }}
    />
  );
}

function renderOptionList(jsx: React.ReactElement) {
  const { container, rerender } = render(jsx);
  const wrapper = createWrapper(container).findOptionList()!;
  return { container, rerender, wrapper };
}

type Wrapper = ReturnType<typeof renderOptionList>['wrapper'];

const clickOption = (wrapper: Wrapper, index: number) =>
  fireEvent.mouseUp(wrapper.findOptionByIndex(index)!.getElement());

const pressKey = (wrapper: Wrapper, keyCode: number, key?: string) =>
  fireEvent.keyDown(wrapper.findOptionsContainer().getElement(), { keyCode, key });

const selectedLabels = (wrapper: Wrapper) =>
  wrapper.findSelectedOptions().map(option => option.findLabel()!.getElement().textContent);

describe('OptionList', () => {
  describe('rendering', () => {
    test('renders a labelled, focusable listbox with an option per item', () => {
      const { wrapper } = renderOptionList(<Stateful />);
      const listbox = wrapper.findOptionsContainer().getElement();
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

    test('renders label and description', () => {
      const { wrapper } = renderOptionList(<Stateful />);
      const first = wrapper.findOptionByValue('a')!;
      expect(first.findLabel()!.getElement()).toHaveTextContent('First');
      expect(first.findDescription()!.getElement()).toHaveTextContent('First description');
      expect(wrapper.findOptionByValue('b')!.findDescription()).toBeNull();
    });

    test('renders an icon by name', () => {
      const { wrapper } = renderOptionList(
        <Stateful options={[{ value: 'a', label: 'First', iconName: 'settings' }]} />
      );
      expect(wrapper.findOptionByValue('a')!.findOption()!.find('svg')).not.toBeNull();
    });

    test('renders label tag and tags', () => {
      const { wrapper } = renderOptionList(
        <Stateful options={[{ value: 'a', label: 'First', labelTag: '128 GB', tags: ['CPU-v2', '2 GB RAM'] }]} />
      );
      const option = wrapper.findOptionByValue('a')!;
      expect(option.findLabelTag()!.getElement()).toHaveTextContent('128 GB');
      expect(option.findTags().map(tag => tag.getElement().textContent)).toEqual(['CPU-v2', '2 GB RAM']);
    });

    test('uses the label as the option title, not the value', () => {
      const { container } = renderOptionList(<Stateful />);
      expect(container.querySelector('[title="Second"]')).not.toBeNull();
      expect(container.querySelector('[title="b"]')).toBeNull();
    });

    test('passes aria-labelledby and aria-describedby to the listbox', () => {
      const { wrapper } = renderOptionList(
        <Stateful ariaLabel={undefined} ariaLabelledby="heading" ariaDescribedby="description" />
      );
      const listbox = wrapper.findOptionsContainer().getElement();
      expect(listbox).toHaveAttribute('aria-labelledby', 'heading');
      expect(listbox).toHaveAttribute('aria-describedby', 'description');
    });

    test('renders an empty listbox when there are no options', () => {
      const { wrapper } = renderOptionList(<Stateful options={[]} />);
      expect(wrapper.findOptions()).toHaveLength(0);
    });

    test('warns about duplicate values', () => {
      const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
      renderOptionList(
        <Stateful
          options={[
            { value: 'same', label: 'A' },
            { value: 'same', label: 'B' },
          ]}
        />
      );
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('Every option must have a unique `value`'));
      warn.mockRestore();
    });

    test('the same options array works for Select-style data with no mapping', () => {
      const selectOptions: OptionListProps.Options = [{ value: 'x', label: 'X', description: 'From Select' }];
      const { wrapper } = renderOptionList(<Stateful options={selectOptions} />);
      expect(wrapper.findOptionByValue('x')!.findDescription()!.getElement()).toHaveTextContent('From Select');
    });
  });

  describe('disabled options', () => {
    const withDisabled: OptionListProps.Options = [
      options[0],
      { ...options[1], disabled: true, disabledReason: 'Not available in this Region' },
      options[2],
    ];

    test.each<OptionListProps.SelectionType>(['single', 'multi'])(
      'marks disabled options and ignores clicks on them (%s)',
      selectionType => {
        const onChange = jest.fn();
        const { wrapper } = renderOptionList(
          <Stateful selectionType={selectionType} options={withDisabled} onChange={onChange} />
        );
        const disabledOption = wrapper.findOptionByValue('b')!;
        expect(disabledOption.isDisabled()).toBe(true);
        expect(disabledOption.getElement()).toHaveAttribute('aria-disabled', 'true');
        expect(wrapper.findOptionByValue('a')!.isDisabled()).toBe(false);

        clickOption(wrapper, 2);
        expect(onChange).not.toHaveBeenCalled();
        expect(wrapper.findSelectedOptions()).toHaveLength(0);
      }
    );

    test('keyboard can reach a disabled option but Enter does not select it', () => {
      const onChange = jest.fn();
      const { wrapper } = renderOptionList(<Stateful options={withDisabled} onChange={onChange} />);
      fireEvent.focus(wrapper.findOptionsContainer().getElement());
      pressKey(wrapper, KeyCode.down);
      expect(wrapper.findHighlightedOption()!.getElement()).toBe(wrapper.findOptionByValue('b')!.getElement());
      pressKey(wrapper, KeyCode.enter);
      expect(onChange).not.toHaveBeenCalled();
    });

    test('a selected disabled option stays selected and cannot be deselected in multi mode', () => {
      const onChange = jest.fn();
      const { wrapper } = renderOptionList(
        <Stateful selectionType="multi" options={withDisabled} initialSelected={['b']} onChange={onChange} />
      );
      clickOption(wrapper, 2);
      expect(onChange).not.toHaveBeenCalled();
      expect(selectedLabels(wrapper)).toEqual(['Second']);
    });

    test('describes the disabled option with its disabled reason', () => {
      const { wrapper } = renderOptionList(<Stateful options={withDisabled} />);
      const describedBy = wrapper.findOptionByValue('b')!.getElement().getAttribute('aria-describedby');
      expect(describedBy).toBeTruthy();
      expect(document.getElementById(describedBy!)).toHaveTextContent('Not available in this Region');
    });

    test('is valid for a11y with disabled options', async () => {
      const { container } = renderOptionList(<Stateful selectionType="multi" options={withDisabled} />);
      await expect(container).toValidateA11y();
    });
  });

  describe('single selection', () => {
    test('marks only the selected option with aria-selected and a check mark', () => {
      const { wrapper } = renderOptionList(<Stateful initialSelected={['b']} />);
      expect(wrapper.findOptions().map(option => option.getElement().getAttribute('aria-selected'))).toEqual([
        'false',
        'true',
        'false',
      ]);
      expect(selectedLabels(wrapper)).toEqual(['Second']);
      expect(wrapper.findOptionsContainer().getElement()).not.toHaveAttribute('aria-multiselectable');
      expect(wrapper.findOptionByValue('b')!.find('[role="checkbox"], input[type="checkbox"]')).toBeNull();
    });

    test('clicking replaces the selection and repeat click keeps it selected', () => {
      const onChange = jest.fn();
      const { wrapper } = renderOptionList(<Stateful onChange={onChange} />);

      clickOption(wrapper, 2);
      expect(onChange).toHaveBeenLastCalledWith(['b']);

      clickOption(wrapper, 3);
      expect(onChange).toHaveBeenLastCalledWith(['c']);
      expect(selectedLabels(wrapper)).toEqual(['Third']);

      clickOption(wrapper, 3);
      expect(onChange).toHaveBeenCalledTimes(3);
      expect(onChange).toHaveBeenLastCalledWith(['c']);
      expect(selectedLabels(wrapper)).toEqual(['Third']);
    });

    test('onChange returns the original option objects', () => {
      const onChange = jest.fn();
      const { wrapper } = renderOptionList(
        <OptionList
          ariaLabel="Goals"
          options={options}
          selectionType="single"
          onChange={({ detail }) => onChange(detail)}
        />
      );
      clickOption(wrapper, 1);
      expect(onChange.mock.calls[0][0].selectedOptions[0]).toBe(options[0]);
    });

    test('uses only the first selected option', () => {
      const { wrapper } = renderOptionList(<Stateful initialSelected={['a', 'c']} />);
      expect(selectedLabels(wrapper)).toEqual(['First']);
    });

    test('clicking the description selects the option (whole row is the target)', () => {
      const onChange = jest.fn();
      const { wrapper } = renderOptionList(<Stateful onChange={onChange} />);
      fireEvent.mouseUp(wrapper.findOptionByValue('a')!.findDescription()!.getElement());
      expect(onChange).toHaveBeenLastCalledWith(['a']);
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
      const { wrapper } = renderOptionList(<Stateful initialSelected={['b']} />);
      expect(wrapper.findHighlightedOption()).toBeNull();
    });

    test('keyboard focus highlights the selected option with the keyboard focus style', () => {
      const { wrapper } = renderOptionList(<Stateful initialSelected={['b']} />);
      fireEvent.focus(wrapper.findOptionsContainer().getElement());
      const highlighted = wrapper.findHighlightedOption()!.getElement();
      expect(highlighted).toBe(wrapper.findOptionByValue('b')!.getElement());
      expect(highlighted.className).toMatch(/is-keyboard/);
      expect(wrapper.findAll('[class*="highlighted"][role="option"]')).toHaveLength(1);
    });
  });

  describe('multi selection', () => {
    test('marks the listbox multiselectable and renders a checkbox per option', () => {
      const { wrapper } = renderOptionList(<Stateful selectionType="multi" initialSelected={['a', 'c']} />);
      expect(wrapper.findOptionsContainer().getElement()).toHaveAttribute('aria-multiselectable', 'true');
      expect(selectedLabels(wrapper)).toEqual(['First', 'Third']);
      expect(wrapper.findAll('svg').length).toBeGreaterThanOrEqual(3);
    });

    test('clicking toggles options and keeps the selection order', () => {
      const onChange = jest.fn();
      const { wrapper } = renderOptionList(
        <Stateful selectionType="multi" initialSelected={['c']} onChange={onChange} />
      );

      clickOption(wrapper, 1);
      expect(onChange).toHaveBeenLastCalledWith(['c', 'a']);

      clickOption(wrapper, 3);
      expect(onChange).toHaveBeenLastCalledWith(['a']);
      expect(selectedLabels(wrapper)).toEqual(['First']);
    });
  });

  describe('keyboard', () => {
    test('focus highlights the first option, arrows move with wrap-around, Home and End jump', () => {
      const { wrapper } = renderOptionList(<Stateful />);
      const listbox = wrapper.findOptionsContainer().getElement();
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

    test('Home and End move the highlight without the browser scrolling the page', () => {
      const { wrapper } = renderOptionList(<Stateful />);
      const listbox = wrapper.findOptionsContainer().getElement();
      fireEvent.focus(listbox);
      for (const [keyCode, value] of [
        [KeyCode.end, 'c'],
        [KeyCode.home, 'a'],
      ] as const) {
        const event = createEvent.keyDown(listbox, { keyCode });
        fireEvent(listbox, event);
        expect(event.defaultPrevented).toBe(true);
        expect(wrapper.findHighlightedOption()?.getElement().dataset.value).toBe(value);
      }
    });

    test('Enter and Space select the highlighted option', () => {
      const onChange = jest.fn();
      const { wrapper } = renderOptionList(<Stateful selectionType="multi" onChange={onChange} />);
      fireEvent.focus(wrapper.findOptionsContainer().getElement());

      pressKey(wrapper, KeyCode.enter);
      expect(onChange).toHaveBeenLastCalledWith(['a']);

      pressKey(wrapper, KeyCode.down);
      pressKey(wrapper, KeyCode.space);
      expect(onChange).toHaveBeenLastCalledWith(['a', 'b']);

      pressKey(wrapper, KeyCode.space);
      expect(onChange).toHaveBeenLastCalledWith(['a']);
    });

    test('Escape does not change the selection', () => {
      const onChange = jest.fn();
      const { wrapper } = renderOptionList(<Stateful onChange={onChange} />);
      fireEvent.focus(wrapper.findOptionsContainer().getElement());
      pressKey(wrapper, KeyCode.escape);
      expect(onChange).not.toHaveBeenCalled();
      expect(wrapper.findOptions()).toHaveLength(3);
    });

    test('type-ahead highlights the matching option', () => {
      const { wrapper } = renderOptionList(<Stateful />);
      const listbox = wrapper.findOptionsContainer().getElement();
      fireEvent.focus(listbox);
      fireEvent.keyDown(listbox, { key: 't' });
      expect(listbox).toHaveAttribute('aria-activedescendant', wrapper.findOptionByValue('c')!.getElement().id);
    });

    test('blur clears the highlight', () => {
      const { wrapper } = renderOptionList(<Stateful />);
      const listbox = wrapper.findOptionsContainer().getElement();
      fireEvent.focus(listbox);
      expect(wrapper.findHighlightedOption()).not.toBeNull();
      fireEvent.blur(listbox);
      expect(wrapper.findHighlightedOption()).toBeNull();
    });
  });

  describe('scrolling the highlighted option into view', () => {
    const longOptions: OptionListProps.Option[] = [
      ...Array.from({ length: 9 }, (_, index) => ({ value: `${index}`, label: `Option ${index}` })),
      { value: 'special', label: 'Special' },
    ];
    const originalScrollIntoView = HTMLElement.prototype.scrollIntoView;
    let scrollIntoView: jest.Mock;

    beforeEach(() => {
      scrollIntoView = HTMLElement.prototype.scrollIntoView = jest.fn();
    });
    afterEach(() => {
      HTMLElement.prototype.scrollIntoView = originalScrollIntoView;
    });

    const renderLongList = (props: { initialSelected?: string[] } = {}) => {
      const result = renderOptionList(<Stateful options={longOptions} {...props} />);
      const listbox = result.wrapper.findOptionsContainer().getElement();
      return { ...result, listbox };
    };
    const lastScrolledElement = () => scrollIntoView.mock.instances[scrollIntoView.mock.instances.length - 1];
    const optionAt = (container: HTMLElement, index: number) =>
      container.querySelector(`[data-mouse-target="${index}"]`);

    test('focus entry highlights and scrolls to the first option', () => {
      const { container, wrapper, listbox } = renderLongList();
      fireEvent.focus(listbox);
      expect(wrapper.findHighlightedOption()!.getElement()).toHaveTextContent('Option 0');
      expect(scrollIntoView).toHaveBeenCalledTimes(1);
      expect(lastScrolledElement()).toBe(optionAt(container, 0));
    });

    test('focus entry highlights and scrolls to the selected option', () => {
      const { container, wrapper, listbox } = renderLongList({ initialSelected: ['special'] });
      fireEvent.focus(listbox);
      expect(wrapper.findHighlightedOption()!.getElement()).toHaveTextContent('Special');
      expect(scrollIntoView).toHaveBeenCalledTimes(1);
      expect(scrollIntoView).toHaveBeenCalledWith({ block: 'nearest', inline: 'nearest' });
      expect(lastScrolledElement()).toBe(optionAt(container, 9));
    });

    test('focus entry highlights the first selected option in list order, not selection order', () => {
      // Selected 'Special' (last in the list) first, then 'Option 2'.
      const { container, wrapper } = renderOptionList(
        <Stateful options={longOptions} selectionType="multi" initialSelected={['special', '2']} />
      );
      fireEvent.focus(wrapper.findOptionsContainer().getElement());
      expect(wrapper.findHighlightedOption()!.getElement()).toHaveTextContent('Option 2');
      expect(lastScrolledElement()).toBe(optionAt(container, 2));
    });

    test('focus from a pointer does not scroll', () => {
      const { listbox } = renderLongList({ initialSelected: ['special'] });
      fireEvent.mouseDown(listbox);
      fireEvent.focus(listbox);
      expect(scrollIntoView).not.toHaveBeenCalled();
    });

    test('focus after selecting with the mouse highlights and scrolls to the selected option', () => {
      const { container, wrapper, listbox } = renderLongList();
      // Real focus, so the mousedown below lands on an already focused list.
      act(() => listbox.focus());
      fireEvent.mouseDown(listbox);
      clickOption(wrapper, 10);
      expect(selectedLabels(wrapper)).toEqual(['Special']);
      act(() => listbox.blur());
      scrollIntoView.mockClear();
      act(() => listbox.focus());
      expect(wrapper.findHighlightedOption()!.getElement()).toHaveTextContent('Special');
      expect(lastScrolledElement()).toBe(optionAt(container, 9));
    });

    test('arrow keys scroll the highlighted option into view', () => {
      const { container, wrapper, listbox } = renderLongList();
      fireEvent.focus(listbox);
      scrollIntoView.mockClear();
      pressKey(wrapper, KeyCode.down);
      expect(scrollIntoView).toHaveBeenCalledTimes(1);
      expect(scrollIntoView).toHaveBeenCalledWith({ block: 'nearest', inline: 'nearest' });
      expect(lastScrolledElement()).toBe(optionAt(container, 1));
    });

    test('End, Home and wrap-around ArrowUp scroll the highlighted option into view', () => {
      const { container, wrapper, listbox } = renderLongList();
      fireEvent.focus(listbox);
      scrollIntoView.mockClear();
      pressKey(wrapper, 35 /* End */);
      expect(lastScrolledElement()).toBe(optionAt(container, 9));
      pressKey(wrapper, 36 /* Home */);
      expect(lastScrolledElement()).toBe(optionAt(container, 0));
      pressKey(wrapper, KeyCode.up);
      expect(lastScrolledElement()).toBe(optionAt(container, 9));
      expect(scrollIntoView).toHaveBeenCalledTimes(3);
    });

    test('type-ahead scrolls the matched option into view', () => {
      const { container, listbox } = renderLongList();
      fireEvent.focus(listbox);
      fireEvent.keyDown(listbox, { key: 's' });
      expect(lastScrolledElement()).toBe(optionAt(container, 9));
    });

    test('mouse hover highlights without scrolling', () => {
      const { wrapper } = renderLongList();
      fireEvent.mouseMove(wrapper.findOptionByIndex(5)!.getElement());
      expect(wrapper.findHighlightedOption()!.getElement()).toHaveTextContent('Option 4');
      expect(scrollIntoView).not.toHaveBeenCalled();
    });

    test('focusing again after blur scrolls to the newly highlighted option', () => {
      const { container, wrapper, listbox } = renderLongList();
      fireEvent.focus(listbox);
      pressKey(wrapper, KeyCode.down);
      fireEvent.blur(listbox);
      scrollIntoView.mockClear();
      fireEvent.focus(listbox);
      expect(wrapper.findHighlightedOption()!.getElement()).toHaveTextContent('Option 0');
      expect(scrollIntoView).toHaveBeenCalledTimes(1);
      expect(lastScrolledElement()).toBe(optionAt(container, 0));
    });
  });

  describe('state', () => {
    test('controlled: does not change the selection without the consumer updating selectedOptions', () => {
      const onChange = jest.fn();
      const { wrapper } = renderOptionList(
        <OptionList
          ariaLabel="Goals"
          options={options}
          selectionType="single"
          selectedOptions={[options[0]]}
          onChange={({ detail }) => onChange(detail.selectedOptions.map(option => option.value))}
        />
      );
      clickOption(wrapper, 2);
      expect(onChange).toHaveBeenCalledWith(['b']);
      expect(selectedLabels(wrapper)).toEqual(['First']);
    });

    test('controlled: matches selected options by value, not by reference', () => {
      const props = { ariaLabel: 'Goals', options, selectionType: 'single' as const, onChange: () => {} };
      const { wrapper, rerender } = renderOptionList(<OptionList {...props} selectedOptions={[{ value: 'a' }]} />);
      expect(selectedLabels(wrapper)).toEqual(['First']);
      rerender(<OptionList {...props} selectedOptions={[{ value: 'c' }]} />);
      expect(selectedLabels(wrapper)).toEqual(['Third']);
    });

    test('ignores selected options that do not match an option', () => {
      const { wrapper } = renderOptionList(
        <OptionList
          ariaLabel="Goals"
          options={options}
          selectionType="multi"
          selectedOptions={[{ value: 'missing' }, { value: 'b' }]}
          onChange={() => {}}
        />
      );
      expect(selectedLabels(wrapper)).toEqual(['Second']);
    });

    test('uncontrolled: manages selection internally and fires onChange', () => {
      const onChange = jest.fn();
      const { wrapper } = renderOptionList(
        <OptionList
          ariaLabel="Goals"
          options={options}
          selectionType="multi"
          onChange={({ detail }) => onChange(detail.selectedOptions.map(option => option.value))}
        />
      );
      clickOption(wrapper, 1);
      clickOption(wrapper, 2);
      expect(onChange).toHaveBeenLastCalledWith(['a', 'b']);
      expect(selectedLabels(wrapper)).toEqual(['First', 'Second']);
    });
  });

  test('ref.focus() focuses the listbox', () => {
    const ref = React.createRef<OptionListProps.Ref>();
    const { wrapper } = renderOptionList(
      <OptionList ref={ref} ariaLabel="Goals" options={options} selectionType="single" />
    );
    act(() => ref.current!.focus());
    expect(document.activeElement).toBe(wrapper.findOptionsContainer().getElement());
  });

  test('announces the selected state of the highlighted option', () => {
    const { wrapper } = renderOptionList(
      <Stateful initialSelected={['a']} i18nStrings={{ selectedAriaLabel: 'Picked' }} />
    );
    fireEvent.focus(wrapper.findOptionsContainer().getElement());
    expect(wrapper.findOptionByValue('a')!.getElement()).toHaveTextContent('Picked');
  });

  test('hides the top divider of the first option only', () => {
    const { wrapper } = renderOptionList(<Stateful />);
    const optionElements = wrapper.findOptions().map(option => option.getElement());
    expect(optionElements[0]).toHaveClass(selectableItemStyles['hide-top-divider']);
    expect(optionElements[1]).not.toHaveClass(selectableItemStyles['hide-top-divider']);
    expect(optionElements[2]).not.toHaveClass(selectableItemStyles['hide-top-divider']);
  });

  test('passes id, className and data attributes to the root', () => {
    const { container } = render(
      <OptionList
        id="my-list"
        className="custom"
        data-testid="root"
        ariaLabel="Goals"
        options={options}
        selectionType="single"
      />
    );
    const root = createWrapper(container).findOptionList()!.getElement();
    expect(root).toHaveAttribute('id', 'my-list');
    expect(root).toHaveClass('custom');
    expect(root).toHaveAttribute('data-testid', 'root');
  });

  test.each<OptionListProps.SelectionType>(['single', 'multi'])('is accessible, selectionType=%s', async type => {
    const { container } = render(<Stateful selectionType={type} initialSelected={['a']} />);
    await expect(container).toValidateA11y();
  });
});
