// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { act, createEvent, fireEvent, render } from '@testing-library/react';

import { KeyCode, warnOnce } from '@cloudscape-design/component-toolkit/internal';

import '../../__a11y__/to-validate-a11y';
import TestI18nProvider from '../../../lib/components/i18n/testing';
import OptionList, { OptionListProps } from '../../../lib/components/option-list';
import createWrapper from '../../../lib/components/test-utils/dom';

import selectableItemStyles from '../../../lib/components/internal/components/selectable-item/styles.css.js';

jest.mock('@cloudscape-design/component-toolkit/internal', () => ({
  ...jest.requireActual('@cloudscape-design/component-toolkit/internal'),
  warnOnce: jest.fn(),
}));

afterEach(() => {
  (warnOnce as jest.Mock).mockReset();
});

const options: OptionListProps.Option[] = [
  { value: 'a', label: 'First', description: 'First description' },
  { value: 'b', label: 'Second' },
  { value: 'c', label: 'Third' },
];

const withDisabled: OptionListProps.Options = [
  options[0],
  { ...options[1], disabled: true, disabledReason: 'Not available in this Region' },
  options[2],
];

const groupedOptions: OptionListProps.Options = [
  {
    value: 'compute',
    label: 'Compute',
    options: [
      { value: 'ec2', label: 'EC2' },
      { value: 'lambda', label: 'Lambda' },
    ],
  },
  {
    value: 'storage',
    label: 'Storage',
    options: [
      { value: 's3', label: 'S3' },
      { value: 'efs', label: 'EFS', disabled: true },
    ],
  },
];

const leafOptions = (source: OptionListProps.Options) =>
  source.flatMap(option => (option as OptionListProps.OptionGroup).options ?? [option]);

const byValue = (values: string[], source: OptionListProps.Options = options) =>
  values.map(value => leafOptions(source).find(option => option.value === value)!);

type StatefulProps = Partial<Omit<OptionListProps, 'onChange'>> & { initialSelected?: string[]; onChange?: jest.Mock };

function Stateful({ initialSelected = [], onChange, ...props }: StatefulProps) {
  const [selectedOptions, setSelectedOptions] = useState<ReadonlyArray<OptionListProps.Option>>(
    byValue(initialSelected, props.options ?? options)
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
  // There is no test-utils finder for the listbox element, which receives focus and keyboard events.
  const listbox = wrapper.find('[role="listbox"]')!.getElement();
  return { container, rerender, wrapper, listbox };
}

type Wrapper = ReturnType<typeof renderOptionList>['wrapper'];

const clickOption = (wrapper: Wrapper, index: number) =>
  fireEvent.mouseUp(wrapper.findOptionByIndex(index)!.getElement());

const pressKey = (listbox: HTMLElement, keyCode: number) => fireEvent.keyDown(listbox, { keyCode });

const selectedLabels = (wrapper: Wrapper) =>
  wrapper.findSelectedOptions().map(option => option.findLabel()!.getElement().textContent);

const highlightedValue = (wrapper: Wrapper) => wrapper.findHighlightedOption()?.getElement().dataset.value;

describe('OptionList', () => {
  describe('rendering', () => {
    test('renders a labelled, focusable listbox with an option per item', () => {
      const { wrapper, listbox } = renderOptionList(<Stateful />);
      expect(listbox).toHaveAttribute('aria-label', 'Goals');
      expect(listbox).toHaveAttribute('tabindex', '0');
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

    test('renders icon, label tag and tags', () => {
      const { wrapper } = renderOptionList(
        <Stateful
          options={[
            {
              value: 'a',
              label: 'First',
              icon: <span data-testid="custom-icon" />,
              labelTag: '128 GB',
              tags: ['CPU-v2', '2 GB RAM'],
            },
          ]}
        />
      );
      const option = wrapper.findOptionByValue('a')!;
      expect(option.find('[data-testid="custom-icon"]')).not.toBeNull();
      expect(option.findLabelTag()!.getElement()).toHaveTextContent('128 GB');
      expect(option.findTags().map(tag => tag.getElement().textContent)).toEqual(['CPU-v2', '2 GB RAM']);
    });

    test('passes aria-labelledby and aria-describedby to the listbox', () => {
      const { listbox } = renderOptionList(
        <Stateful ariaLabel={undefined} ariaLabelledby="heading" ariaDescribedby="description" />
      );
      expect(listbox).toHaveAttribute('aria-labelledby', 'heading');
      expect(listbox).toHaveAttribute('aria-describedby', 'description');
    });

    test('renders an empty listbox when there are no options', () => {
      const { wrapper } = renderOptionList(<Stateful options={[]} />);
      expect(wrapper.findOptions()).toHaveLength(0);
    });

    test('warns about duplicate values', () => {
      renderOptionList(
        <Stateful
          options={[
            { value: 'same', label: 'A' },
            { value: 'same', label: 'B' },
          ]}
        />
      );
      expect(warnOnce).toHaveBeenCalledWith(
        'OptionList',
        'Every option must have a unique `value`. The component may work incorrectly.'
      );
    });
  });

  describe('selection', () => {
    test('single: marks only the selected option with aria-selected and a check mark', () => {
      const { wrapper, listbox } = renderOptionList(<Stateful initialSelected={['b']} />);
      expect(wrapper.findOptions().map(option => option.getElement().getAttribute('aria-selected'))).toEqual([
        'false',
        'true',
        'false',
      ]);
      expect(selectedLabels(wrapper)).toEqual(['Second']);
      expect(listbox).not.toHaveAttribute('aria-multiselectable');
    });

    test('single: clicking replaces the selection and repeat click keeps it selected', () => {
      const onChange = jest.fn();
      const { wrapper } = renderOptionList(<Stateful onChange={onChange} />);

      clickOption(wrapper, 2);
      expect(onChange).toHaveBeenLastCalledWith(['b']);

      clickOption(wrapper, 3);
      expect(onChange).toHaveBeenLastCalledWith(['c']);

      clickOption(wrapper, 3);
      expect(onChange).toHaveBeenCalledTimes(3);
      expect(onChange).toHaveBeenLastCalledWith(['c']);
      expect(selectedLabels(wrapper)).toEqual(['Third']);
    });

    test('single: uses only the first selected option', () => {
      const { wrapper } = renderOptionList(<Stateful initialSelected={['a', 'c']} />);
      expect(selectedLabels(wrapper)).toEqual(['First']);
    });

    test('onChange returns the original option objects', () => {
      const onChange = jest.fn();
      const optionsWithIcon = [{ ...options[0], icon: <span /> }, ...options.slice(1)];
      const { wrapper } = renderOptionList(
        <OptionList
          ariaLabel="Goals"
          options={optionsWithIcon}
          selectionType="single"
          onChange={({ detail }) => onChange(detail)}
        />
      );
      clickOption(wrapper, 1);
      expect(onChange.mock.calls[0][0].selectedOptions[0]).toBe(optionsWithIcon[0]);
    });

    test('multi: marks the listbox multiselectable and every selected option', () => {
      const { wrapper, listbox } = renderOptionList(<Stateful selectionType="multi" initialSelected={['a', 'c']} />);
      expect(listbox).toHaveAttribute('aria-multiselectable', 'true');
      expect(wrapper.findOptions().map(option => option.getElement().getAttribute('aria-selected'))).toEqual([
        'true',
        'false',
        'true',
      ]);
      expect(selectedLabels(wrapper)).toEqual(['First', 'Third']);
    });

    test('multi: clicking toggles options and keeps the selection order', () => {
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

  describe('disabled options', () => {
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
      const { wrapper, listbox } = renderOptionList(<Stateful options={withDisabled} onChange={onChange} />);
      fireEvent.focus(listbox);
      pressKey(listbox, KeyCode.down);
      expect(highlightedValue(wrapper)).toBe('b');
      pressKey(listbox, KeyCode.enter);
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

    test.each<OptionListProps.SelectionType>(['single', 'multi'])(
      'describes the disabled option with its disabled reason when renderOption is used (%s)',
      selectionType => {
        const { wrapper, listbox } = renderOptionList(
          <Stateful
            selectionType={selectionType}
            options={withDisabled}
            renderOption={({ item }) => <span>Custom {item.option.label}</span>}
          />
        );
        const describedBy = wrapper.findOptionByValue('b')!.getElement().getAttribute('aria-describedby');
        expect(describedBy).toBeTruthy();
        expect(document.getElementById(describedBy!)).toHaveTextContent('Not available in this Region');

        // Custom content owns the visible output, so the tooltip isn't shown.
        fireEvent.focus(listbox);
        pressKey(listbox, KeyCode.down);
        expect(highlightedValue(wrapper)).toBe('b');
        expect(createWrapper().findTooltip()).toBeNull();
      }
    );

    test('shows the disabled reason tooltip when a disabled option is highlighted with the keyboard', () => {
      const { listbox } = renderOptionList(
        <Stateful
          options={[options[0], { value: 'b', label: 'Second', disabled: true, disabledReason: <b>Needs a quota</b> }]}
        />
      );
      const findTooltip = () => createWrapper().findTooltip();
      fireEvent.focus(listbox);
      expect(findTooltip()).toBeNull();
      pressKey(listbox, KeyCode.down);
      expect(findTooltip()!.findContent()!.getElement()).toHaveTextContent('Needs a quota');
    });

    test('Escape closes the disabled reason tooltip and keeps the highlight and selection', () => {
      const onChange = jest.fn();
      const { wrapper, listbox } = renderOptionList(
        <Stateful options={withDisabled} initialSelected={['a']} onChange={onChange} />
      );
      const findTooltip = () => createWrapper().findTooltip();
      fireEvent.focus(listbox);
      pressKey(listbox, KeyCode.down);
      expect(findTooltip()).not.toBeNull();

      fireEvent.keyDown(listbox, { key: 'Escape', keyCode: KeyCode.escape });
      expect(findTooltip()).toBeNull();
      expect(highlightedValue(wrapper)).toBe('b');
      expect(onChange).not.toHaveBeenCalled();
      expect(selectedLabels(wrapper)).toEqual(['First']);
    });
  });

  describe('keyboard', () => {
    test('focus highlights the first option, arrows move with wrap-around, Home and End jump', () => {
      const { wrapper, listbox } = renderOptionList(<Stateful />);
      const optionId = (index: number) => wrapper.findOptionByIndex(index)!.getElement().id;

      fireEvent.focus(listbox);
      expect(listbox).toHaveAttribute('aria-activedescendant', optionId(1));

      pressKey(listbox, KeyCode.down);
      expect(listbox).toHaveAttribute('aria-activedescendant', optionId(2));

      pressKey(listbox, KeyCode.up);
      pressKey(listbox, KeyCode.up);
      expect(listbox).toHaveAttribute('aria-activedescendant', optionId(3));

      pressKey(listbox, KeyCode.down);
      expect(listbox).toHaveAttribute('aria-activedescendant', optionId(1));

      pressKey(listbox, KeyCode.end);
      expect(listbox).toHaveAttribute('aria-activedescendant', optionId(3));

      pressKey(listbox, KeyCode.home);
      expect(listbox).toHaveAttribute('aria-activedescendant', optionId(1));
    });

    test('Home and End move the highlight without the browser scrolling the page', () => {
      const { wrapper, listbox } = renderOptionList(<Stateful />);
      fireEvent.focus(listbox);
      for (const [keyCode, value] of [
        [KeyCode.end, 'c'],
        [KeyCode.home, 'a'],
      ] as const) {
        const event = createEvent.keyDown(listbox, { keyCode });
        fireEvent(listbox, event);
        expect(event.defaultPrevented).toBe(true);
        expect(highlightedValue(wrapper)).toBe(value);
      }
    });

    test('Enter and Space select the highlighted option', () => {
      const onChange = jest.fn();
      const { listbox } = renderOptionList(<Stateful selectionType="multi" onChange={onChange} />);
      fireEvent.focus(listbox);

      pressKey(listbox, KeyCode.enter);
      expect(onChange).toHaveBeenLastCalledWith(['a']);

      pressKey(listbox, KeyCode.down);
      pressKey(listbox, KeyCode.space);
      expect(onChange).toHaveBeenLastCalledWith(['a', 'b']);

      pressKey(listbox, KeyCode.space);
      expect(onChange).toHaveBeenLastCalledWith(['a']);
    });

    test('Escape is not handled and reaches the parent', () => {
      const onChange = jest.fn();
      const onParentKeyDown = jest.fn();
      const { container } = render(
        <div onKeyDown={event => onParentKeyDown(event.keyCode)}>
          <Stateful onChange={onChange} />
        </div>
      );
      const listbox = createWrapper(container).findOptionList()!.find('[role="listbox"]')!.getElement();
      fireEvent.focus(listbox);
      pressKey(listbox, KeyCode.escape);
      expect(onParentKeyDown).toHaveBeenCalledWith(KeyCode.escape);
      expect(onChange).not.toHaveBeenCalled();
    });

    test('type-ahead highlights the matching option', () => {
      const { wrapper, listbox } = renderOptionList(<Stateful />);
      fireEvent.focus(listbox);
      fireEvent.keyDown(listbox, { key: 't' });
      expect(highlightedValue(wrapper)).toBe('c');
    });

    test('type-ahead after Space selects moves the highlight to the matching option', () => {
      const onChange = jest.fn();
      const { wrapper, listbox } = renderOptionList(<Stateful selectionType="multi" onChange={onChange} />);
      fireEvent.focus(listbox);
      fireEvent.keyDown(listbox, { key: ' ', keyCode: KeyCode.space });
      expect(onChange).toHaveBeenLastCalledWith(['a']);
      fireEvent.keyDown(listbox, { key: 't' });
      expect(highlightedValue(wrapper)).toBe('c');
    });

    test('blur clears the highlight', () => {
      const { wrapper, listbox } = renderOptionList(<Stateful />);
      fireEvent.focus(listbox);
      expect(wrapper.findHighlightedOption()).not.toBeNull();
      fireEvent.blur(listbox);
      expect(wrapper.findHighlightedOption()).toBeNull();
    });
  });

  describe('focus and highlight', () => {
    const originalScrollIntoView = HTMLElement.prototype.scrollIntoView;
    const longOptions: OptionListProps.Option[] = [
      ...Array.from({ length: 9 }, (_, index) => ({ value: `${index}`, label: `Option ${index}` })),
      { value: 'special', label: 'Special' },
    ];
    let scrollIntoView: jest.Mock;

    beforeEach(() => {
      scrollIntoView = HTMLElement.prototype.scrollIntoView = jest.fn();
    });
    afterEach(() => {
      HTMLElement.prototype.scrollIntoView = originalScrollIntoView;
    });

    const renderLongList = (props: StatefulProps = {}) =>
      renderOptionList(<Stateful options={longOptions} {...props} />);
    const lastScrolledValue = () =>
      (scrollIntoView.mock.instances[scrollIntoView.mock.instances.length - 1] as HTMLElement).dataset.value;

    test('does not show a highlight before the user interacts with the list', () => {
      const { wrapper } = renderLongList({ initialSelected: ['2'] });
      expect(wrapper.findHighlightedOption()).toBeNull();
    });

    test('hovering highlights the option without scrolling, and leaving the list clears it', () => {
      const { wrapper } = renderLongList();
      fireEvent.mouseMove(wrapper.findOptionByIndex(5)!.getElement());
      expect(highlightedValue(wrapper)).toBe('4');
      expect(scrollIntoView).not.toHaveBeenCalled();
      fireEvent.mouseLeave(wrapper.getElement());
      expect(wrapper.findHighlightedOption()).toBeNull();
    });

    test('focus entry highlights and scrolls to the first option', () => {
      const { wrapper, listbox } = renderLongList();
      fireEvent.focus(listbox);
      expect(highlightedValue(wrapper)).toBe('0');
      expect(scrollIntoView).toHaveBeenCalledTimes(1);
      expect(lastScrolledValue()).toBe('0');
    });

    test('focus entry highlights the selected option with the keyboard style and scrolls to it', () => {
      const { wrapper, listbox } = renderLongList({ initialSelected: ['special'] });
      fireEvent.focus(listbox);
      const highlighted = wrapper.findHighlightedOption()!;
      expect(highlighted.getElement().dataset.value).toBe('special');
      expect(highlighted.getElement()).toHaveClass(selectableItemStyles['is-keyboard']);
      expect(wrapper.findOptions().filter(option => option.isHighlighted())).toHaveLength(1);
      expect(scrollIntoView).toHaveBeenCalledTimes(1);
      expect(scrollIntoView).toHaveBeenCalledWith({ block: 'nearest', inline: 'nearest' });
      expect(lastScrolledValue()).toBe('special');
    });

    test('focus entry highlights the first selected option in list order, not selection order', () => {
      const { wrapper, listbox } = renderLongList({ selectionType: 'multi', initialSelected: ['special', '2'] });
      fireEvent.focus(listbox);
      expect(highlightedValue(wrapper)).toBe('2');
      expect(lastScrolledValue()).toBe('2');
    });

    test('focus from a pointer adds no highlight and does not scroll', () => {
      const { wrapper, listbox } = renderLongList({ initialSelected: ['special'] });
      fireEvent.mouseDown(listbox);
      fireEvent.focus(listbox);
      expect(wrapper.findHighlightedOption()).toBeNull();
      expect(scrollIntoView).not.toHaveBeenCalled();
    });

    test('focus after selecting with the mouse highlights and scrolls to the selected option', () => {
      const { wrapper, listbox } = renderLongList();
      // Real focus, so the mousedown below lands on an already focused list.
      act(() => listbox.focus());
      fireEvent.mouseDown(listbox);
      clickOption(wrapper, 10);
      expect(selectedLabels(wrapper)).toEqual(['Special']);
      act(() => listbox.blur());
      scrollIntoView.mockClear();
      act(() => listbox.focus());
      expect(highlightedValue(wrapper)).toBe('special');
      expect(lastScrolledValue()).toBe('special');
    });

    test('keyboard moves scroll the highlighted option into view', () => {
      const { listbox } = renderLongList();
      fireEvent.focus(listbox);
      scrollIntoView.mockClear();
      const scrolledValues = [KeyCode.down, KeyCode.end, KeyCode.home, KeyCode.up].map(keyCode => {
        pressKey(listbox, keyCode);
        return lastScrolledValue();
      });
      expect(scrolledValues).toEqual(['1', 'special', '0', 'special']);
      expect(scrollIntoView).toHaveBeenCalledTimes(4);
    });

    test('repeating a keyboard move that keeps the highlight scrolls it into view again', () => {
      const { listbox } = renderLongList();
      fireEvent.focus(listbox);
      pressKey(listbox, KeyCode.end);
      scrollIntoView.mockClear();
      pressKey(listbox, KeyCode.end);
      expect(scrollIntoView).toHaveBeenCalledTimes(1);
      expect(lastScrolledValue()).toBe('special');
    });

    test('a keyboard highlight of the hovered option scrolls it into view', () => {
      const { wrapper, listbox } = renderLongList();
      fireEvent.mouseMove(wrapper.findOptionByValue('special')!.getElement());
      expect(scrollIntoView).not.toHaveBeenCalled();
      fireEvent.keyDown(listbox, { key: 's' });
      expect(highlightedValue(wrapper)).toBe('special');
      expect(scrollIntoView).toHaveBeenCalledTimes(1);
      expect(lastScrolledValue()).toBe('special');
    });

    test('hovering after keyboard navigation does not scroll', () => {
      const { wrapper, listbox } = renderLongList();
      fireEvent.focus(listbox);
      scrollIntoView.mockClear();
      fireEvent.mouseMove(wrapper.findOptionByIndex(1)!.getElement());
      fireEvent.mouseMove(wrapper.findOptionByIndex(5)!.getElement());
      expect(highlightedValue(wrapper)).toBe('4');
      expect(scrollIntoView).not.toHaveBeenCalled();
    });
  });

  describe('option groups', () => {
    test('renders each group labelled by its header, and option finders skip the headers', () => {
      const { wrapper } = renderOptionList(<Stateful options={groupedOptions} />);
      expect(wrapper.findGroupHeaders().map(header => header.findLabel()!.getElement().textContent)).toEqual([
        'Compute',
        'Storage',
      ]);
      const header = wrapper.findGroupHeaderByValue('storage')!.getElement();
      expect(header.closest('[role="group"]')).toHaveAttribute('aria-labelledby', header.id);
      expect(wrapper.findOptions().map(option => option.getElement().dataset.value)).toEqual([
        'ec2',
        'lambda',
        's3',
        'efs',
      ]);
      expect(wrapper.findOptionByIndex(3)!.getElement().dataset.value).toBe('s3');
    });

    test('single: group headers cannot be chosen and arrow keys skip them', () => {
      const onChange = jest.fn();
      const { wrapper, listbox } = renderOptionList(<Stateful options={groupedOptions} onChange={onChange} />);
      fireEvent.mouseUp(wrapper.findGroupHeaderByValue('compute')!.getElement());
      expect(onChange).not.toHaveBeenCalled();

      fireEvent.focus(listbox);
      expect(highlightedValue(wrapper)).toBe('ec2');
      pressKey(listbox, KeyCode.down);
      pressKey(listbox, KeyCode.down);
      expect(highlightedValue(wrapper)).toBe('s3');
      pressKey(listbox, KeyCode.home);
      pressKey(listbox, KeyCode.up);
      expect(highlightedValue(wrapper)).toBe('efs');
    });

    test('multi: the group header is checked, mixed or unchecked by its selected options', () => {
      const { wrapper } = renderOptionList(<Stateful selectionType="multi" options={groupedOptions} />);
      const header = () => wrapper.findGroupHeaderByValue('compute')!;
      expect(header().getElement()).toHaveAttribute('aria-checked', 'false');
      clickOption(wrapper, 1);
      expect(header().getElement()).toHaveAttribute('aria-checked', 'mixed');
      expect(header().isSelected()).toBe(false);
      clickOption(wrapper, 2);
      expect(header().getElement()).toHaveAttribute('aria-checked', 'true');
      expect(header().isSelected()).toBe(true);
    });

    test('multi: choosing a group header toggles its enabled options with the mouse and keyboard', () => {
      const onChange = jest.fn();
      const { wrapper, listbox } = renderOptionList(
        <Stateful selectionType="multi" options={groupedOptions} initialSelected={['efs']} onChange={onChange} />
      );
      const storageHeader = wrapper.findGroupHeaderByValue('storage')!.getElement();
      fireEvent.mouseUp(storageHeader);
      expect(onChange).toHaveBeenLastCalledWith(['efs', 's3']);
      fireEvent.mouseUp(storageHeader);
      expect(onChange).toHaveBeenLastCalledWith(['efs']);

      fireEvent.focus(listbox);
      pressKey(listbox, KeyCode.home);
      expect(wrapper.findGroupHeaderByValue('compute')!.isHighlighted()).toBe(true);
      pressKey(listbox, KeyCode.enter);
      expect(onChange).toHaveBeenLastCalledWith(['efs', 'ec2', 'lambda']);
      pressKey(listbox, KeyCode.space);
      expect(onChange).toHaveBeenLastCalledWith(['efs']);
    });

    test('multi: a disabled group disables its options', () => {
      const onChange = jest.fn();
      const { wrapper } = renderOptionList(
        <Stateful
          selectionType="multi"
          options={[{ value: 'db', label: 'Databases', disabled: true, options: [{ value: 'rds', label: 'RDS' }] }]}
          onChange={onChange}
        />
      );
      expect(wrapper.findGroupHeaderByValue('db')!.isDisabled()).toBe(true);
      expect(wrapper.findOptionByValue('rds')!.isDisabled()).toBe(true);
      fireEvent.mouseUp(wrapper.findGroupHeaderByValue('db')!.getElement());
      clickOption(wrapper, 1);
      expect(onChange).not.toHaveBeenCalled();
    });

    test('onChange returns the original options and never a group', () => {
      const onChange = jest.fn();
      const { wrapper } = renderOptionList(
        <OptionList
          ariaLabel="Services"
          options={groupedOptions}
          selectionType="multi"
          onChange={({ detail }) => onChange(detail.selectedOptions)}
        />
      );
      fireEvent.mouseUp(wrapper.findGroupHeaderByValue('compute')!.getElement());
      const [ec2, lambda] = (groupedOptions[0] as OptionListProps.OptionGroup).options;
      expect(onChange.mock.calls[0][0]).toHaveLength(2);
      expect(onChange.mock.calls[0][0][0]).toBe(ec2);
      expect(onChange.mock.calls[0][0][1]).toBe(lambda);
    });

    describe('type-ahead', () => {
      const typeAheadOptions: OptionListProps.Options = [
        {
          value: 'compute',
          label: 'Compute',
          options: [
            { value: 'ec2', label: 'EC2' },
            { value: 'lambda', label: 'Lambda' },
            { value: 'fargate', label: 'Fargate' },
          ],
        },
        {
          value: 'databases',
          label: 'Databases',
          disabled: true,
          options: [
            { value: 'cassandra', label: 'Cassandra' },
            { value: 'documentdb', label: 'DocumentDB' },
          ],
        },
        { value: 'cherry', label: 'Cherry' },
      ];
      const type = (listbox: HTMLElement, key: string) => fireEvent.keyDown(listbox, { key });
      const isComputeHighlighted = (wrapper: Wrapper) => wrapper.findGroupHeaderByValue('compute')!.isHighlighted();

      test('multi: highlights the option that matches, not its group, and Enter selects only that option', () => {
        const onChange = jest.fn();
        const { wrapper, listbox } = renderOptionList(
          <Stateful selectionType="multi" options={typeAheadOptions} onChange={onChange} />
        );
        fireEvent.focus(listbox);
        type(listbox, 'e');
        expect(isComputeHighlighted(wrapper)).toBe(false);
        expect(highlightedValue(wrapper)).toBe('ec2');
        pressKey(listbox, KeyCode.enter);
        expect(onChange).toHaveBeenLastCalledWith(['ec2']);
      });

      test('multi: repeating a key cycles through the matching group and options, skipping a disabled group', () => {
        const { wrapper, listbox } = renderOptionList(<Stateful selectionType="multi" options={typeAheadOptions} />);
        fireEvent.focus(listbox);
        type(listbox, 'c');
        expect(isComputeHighlighted(wrapper)).toBe(true);
        type(listbox, 'c');
        expect(highlightedValue(wrapper)).toBe('cherry');
        type(listbox, 'c');
        expect(isComputeHighlighted(wrapper)).toBe(true);
      });

      test('single: skips the options of a group whose label matches', () => {
        const { wrapper, listbox } = renderOptionList(<Stateful options={typeAheadOptions} />);
        fireEvent.focus(listbox);
        type(listbox, 'c');
        expect(highlightedValue(wrapper)).toBe('cherry');
        type(listbox, 'c');
        expect(highlightedValue(wrapper)).toBe('cherry');
      });
    });

    test('announces the group of the highlighted option', () => {
      const { wrapper, listbox } = renderOptionList(<Stateful options={groupedOptions} />);
      fireEvent.focus(listbox);
      expect(wrapper.findOptionByValue('ec2')!.getElement()).toHaveTextContent('Compute');
    });
  });

  describe('renderOption', () => {
    test('renders custom content for options and group headers with the original options', () => {
      const renderOption = jest.fn(({ item }: Parameters<OptionListProps['renderOption'] & {}>[0]) => (
        <span>{`${item.type}: ${item.option.label}`}</span>
      ));
      const { wrapper } = renderOptionList(
        <Stateful options={groupedOptions} initialSelected={['ec2']} renderOption={renderOption} />
      );
      expect(wrapper.findOptionByValue('ec2')!.getElement()).toHaveTextContent('item: EC2');
      expect(wrapper.findGroupHeaderByValue('compute')!.getElement()).toHaveTextContent('group: Compute');

      const [compute] = groupedOptions as OptionListProps.OptionGroup[];
      const items = renderOption.mock.calls.map(([{ item }]) => item);
      expect(items).toContainEqual({ type: 'group', index: 0, option: compute, disabled: false });
      expect(items).toContainEqual({
        type: 'item',
        index: 1,
        option: compute.options[0],
        selected: true,
        highlighted: false,
        disabled: false,
        parent: { type: 'group', index: 0, option: compute, disabled: false },
      });
      expect(items.find(item => item.option === compute.options[0])!.option).toBe(compute.options[0]);

      // Single selection leaves out the multi-selection group state, on group headers and on `parent`.
      const groupItems = [
        ...items.filter(item => item.type === 'group'),
        ...items.flatMap(item => (item.type === 'item' && item.parent ? [item.parent] : [])),
      ];
      expect(groupItems.length).toBeGreaterThan(0);
      for (const group of groupItems) {
        expect(group).not.toHaveProperty('selected');
        expect(group).not.toHaveProperty('indeterminate');
        expect(group).not.toHaveProperty('highlighted');
      }
    });

    test.each(['single', 'multi'] as const)(
      '%s: parent reflects the group state, not the disabled state of the option',
      selectionType => {
        const renderOption = jest.fn<React.ReactNode, [{ item: OptionListProps.Item }]>(() => null);
        const options: OptionListProps.Options = [
          {
            value: 'compute',
            label: 'Compute',
            options: [
              { value: 'ec2', label: 'EC2' },
              { value: 'lambda', label: 'Lambda', disabled: true },
            ],
          },
          { value: 'storage', label: 'Storage', disabled: true, options: [{ value: 's3', label: 'S3' }] },
        ];
        renderOptionList(<Stateful selectionType={selectionType} options={options} renderOption={renderOption} />);
        const items = renderOption.mock.calls.map(([{ item }]) => item);
        const parentOf = (value: string) =>
          items.find(item => item.type === 'item' && item.option.value === value)! as OptionListProps.OptionItem;

        expect(parentOf('ec2').parent!.disabled).toBe(false);
        expect(parentOf('lambda').disabled).toBe(true);
        expect(parentOf('lambda').parent!.disabled).toBe(false);
        expect(parentOf('s3').parent!.disabled).toBe(true);
      }
    );

    test('multi: group header items include the checkbox state', () => {
      const renderOption = jest.fn(() => null);
      renderOptionList(
        <Stateful
          selectionType="multi"
          options={groupedOptions}
          initialSelected={['ec2']}
          renderOption={renderOption}
        />
      );
      expect(renderOption).toHaveBeenCalledWith(
        expect.objectContaining({
          item: expect.objectContaining({
            type: 'group',
            option: groupedOptions[0],
            indeterminate: true,
            selected: false,
            highlighted: false,
          }),
        })
      );
    });

    test('multi: items carry the option icon and the group selection state', () => {
      const icon = <span data-testid="custom-icon" />;
      const iconOptions: OptionListProps.Options = [
        {
          value: 'compute',
          label: 'Compute',
          options: [
            { value: 'ec2', label: 'EC2', icon },
            { value: 'lambda', label: 'Lambda' },
          ],
        },
      ];
      const optionIcons: React.ReactNode[] = [];
      const groupStates: Array<Pick<OptionListProps.OptionGroupItem, 'selected' | 'indeterminate' | 'highlighted'>> =
        [];
      const renderOption = jest.fn(({ item }: { item: OptionListProps.Item }) => {
        if (item.type === 'item') {
          optionIcons.push(item.option.icon);
        } else {
          groupStates.push({
            selected: item.selected,
            indeterminate: item.indeterminate,
            highlighted: item.highlighted,
          });
        }
        return null;
      });
      const { wrapper, listbox } = renderOptionList(
        <Stateful selectionType="multi" options={iconOptions} initialSelected={['ec2']} renderOption={renderOption} />
      );
      expect(optionIcons).toContain(icon);
      expect(groupStates[groupStates.length - 1]).toEqual({ selected: false, indeterminate: true, highlighted: false });

      fireEvent.focus(listbox);
      pressKey(listbox, KeyCode.home);
      expect(wrapper.findGroupHeaderByValue('compute')!.isHighlighted()).toBe(true);
      expect(groupStates[groupStates.length - 1]).toEqual({ selected: false, indeterminate: true, highlighted: true });

      pressKey(listbox, KeyCode.enter);
      expect(groupStates[groupStates.length - 1]).toEqual({ selected: true, indeterminate: false, highlighted: true });
    });
  });

  test('ref.focus() focuses the listbox', () => {
    const ref = React.createRef<OptionListProps.Ref>();
    const { listbox } = renderOptionList(
      <OptionList ref={ref} ariaLabel="Goals" options={options} selectionType="single" />
    );
    act(() => ref.current!.focus());
    expect(document.activeElement).toBe(listbox);
  });

  test('announces the highlighted option as selected with i18nStrings.selectedAriaLabel', () => {
    const { wrapper, listbox } = renderOptionList(
      <Stateful initialSelected={['a']} i18nStrings={{ selectedAriaLabel: 'Picked' }} />
    );
    fireEvent.focus(listbox);
    expect(wrapper.findOptionByValue('a')!.getElement()).toHaveTextContent('Picked');
  });

  describe('i18n provider', () => {
    const messages = { 'option-list': { 'i18nStrings.selectedAriaLabel': 'Custom selected' } };

    test('announces the selected option with the provider message', () => {
      const { wrapper, listbox } = renderOptionList(
        <TestI18nProvider messages={messages}>
          <Stateful initialSelected={['a']} />
        </TestI18nProvider>
      );
      fireEvent.focus(listbox);
      expect(wrapper.findOptionByValue('a')!.getElement()).toHaveTextContent('Custom selected');
    });

    test('i18nStrings.selectedAriaLabel takes precedence over the provider message', () => {
      const { wrapper, listbox } = renderOptionList(
        <TestI18nProvider messages={messages}>
          <Stateful initialSelected={['a']} i18nStrings={{ selectedAriaLabel: 'Picked' }} />
        </TestI18nProvider>
      );
      fireEvent.focus(listbox);
      const option = wrapper.findOptionByValue('a')!.getElement();
      expect(option).toHaveTextContent('Picked');
      expect(option).not.toHaveTextContent('Custom selected');
    });
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

  test.each<[string, OptionListProps.SelectionType, OptionListProps.Options, string]>([
    ['single selection', 'single', withDisabled, 'a'],
    ['multi selection', 'multi', withDisabled, 'a'],
    ['single selection with groups', 'single', groupedOptions, 'ec2'],
    ['multi selection with groups', 'multi', groupedOptions, 'ec2'],
  ])('is accessible: %s', async (_, selectionType, source, selected) => {
    const { container } = render(
      <Stateful selectionType={selectionType} options={source} initialSelected={[selected]} />
    );
    await expect(container).toValidateA11y();
  });
});
