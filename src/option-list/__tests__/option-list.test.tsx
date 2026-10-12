// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { act, fireEvent, render } from '@testing-library/react';

import { KeyCode } from '@cloudscape-design/component-toolkit/internal';

import '../../__a11y__/to-validate-a11y';
import { isGroup } from '../../../lib/components/internal/components/option/utils/filter-options';
import OptionList, { OptionListProps } from '../../../lib/components/option-list';
import createWrapper from '../../../lib/components/test-utils/dom';

const options: OptionListProps.Option[] = [
  { value: 'a', label: 'First', description: 'First description' },
  { value: 'b', label: 'Second' },
  { value: 'c', label: 'Third' },
];

const groupedOptions: OptionListProps.Options = [
  { value: 'standalone', label: 'Standalone' },
  {
    label: 'Compute',
    value: 'compute',
    options: [
      { value: 'ec2', label: 'EC2' },
      { value: 'lambda', label: 'Lambda' },
    ],
  },
  {
    label: 'Storage',
    value: 'storage',
    options: [
      { value: 's3', label: 'S3' },
      { value: 'ebs', label: 'EBS', disabled: true },
    ],
  },
];

const byValue = (values: string[], source: OptionListProps.Options = options) => {
  const flat = source.flatMap(option => (isGroup(option) ? option.options : [option]));
  return values.map(value => flat.find(option => option.value === value)!);
};

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
  fireEvent.keyDown(wrapper.findListbox().getElement(), { keyCode, key });

const selectedLabels = (wrapper: Wrapper) =>
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
      const listbox = wrapper.findListbox().getElement();
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
      fireEvent.focus(wrapper.findListbox().getElement());
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

  describe('groups', () => {
    test('renders group headers inside role=group, and options are counted without headers', () => {
      const { wrapper } = renderOptionList(<Stateful options={groupedOptions} />);
      expect(wrapper.findGroupHeaders().map(header => header.findLabel()!.getElement().textContent)).toEqual([
        'Compute',
        'Storage',
      ]);
      expect(wrapper.findOptions()).toHaveLength(5);
      expect(wrapper.findOptionByIndex(2)!.findLabel()!.getElement()).toHaveTextContent('EC2');
      const group = wrapper.findGroupHeaderByValue('compute')!.getElement().closest('[role="group"]')!;
      expect(group).not.toBeNull();
      expect(group.textContent).toContain('Lambda');
    });

    describe('single selection', () => {
      test('clicking a group header does not select anything', () => {
        const onChange = jest.fn();
        const { wrapper } = renderOptionList(<Stateful options={groupedOptions} onChange={onChange} />);
        fireEvent.mouseUp(wrapper.findGroupHeaderByValue('compute')!.getElement());
        expect(onChange).not.toHaveBeenCalled();
      });

      test('keyboard skips group headers', () => {
        const { wrapper } = renderOptionList(<Stateful options={groupedOptions} />);
        fireEvent.focus(wrapper.findListbox().getElement());
        pressKey(wrapper, KeyCode.down);
        expect(wrapper.findHighlightedOption()!.findLabel()!.getElement()).toHaveTextContent('EC2');
      });

      test('selects a child option', () => {
        const onChange = jest.fn();
        const { wrapper } = renderOptionList(<Stateful options={groupedOptions} onChange={onChange} />);
        clickOption(wrapper, 3);
        expect(onChange).toHaveBeenLastCalledWith(['lambda']);
        expect(wrapper.findGroupHeaderByValue('compute')!.isSelected()).toBe(false);
      });
    });

    describe('multi selection', () => {
      test('clicking a group header selects all its enabled options, then deselects them', () => {
        const onChange = jest.fn();
        const { wrapper } = renderOptionList(
          <Stateful selectionType="multi" options={groupedOptions} onChange={onChange} />
        );
        const header = () => wrapper.findGroupHeaderByValue('compute')!;

        fireEvent.mouseUp(header().getElement());
        expect(onChange).toHaveBeenLastCalledWith(['ec2', 'lambda']);
        expect(header().isSelected()).toBe(true);

        fireEvent.mouseUp(header().getElement());
        expect(onChange).toHaveBeenLastCalledWith([]);
        expect(header().isSelected()).toBe(false);
      });

      test('group header shows a partial state when only some options are selected', () => {
        const { wrapper } = renderOptionList(
          <Stateful selectionType="multi" options={groupedOptions} initialSelected={['ec2']} />
        );
        const header = wrapper.findGroupHeaderByValue('compute')!;
        expect(header.isSelected()).toBe(false);
        expect(header.find('rect[class*="styled-box-indeterminate"]')).not.toBeNull();
        expect(wrapper.findGroupHeaderByValue('storage')!.find('rect[class*="styled-box-indeterminate"]')).toBeNull();
      });

      test('selecting all children marks the group as selected', () => {
        const { wrapper } = renderOptionList(
          <Stateful selectionType="multi" options={groupedOptions} initialSelected={['ec2']} />
        );
        clickOption(wrapper, 3);
        expect(wrapper.findGroupHeaderByValue('compute')!.isSelected()).toBe(true);
      });

      test('a group header ignores disabled children', () => {
        const onChange = jest.fn();
        const { wrapper } = renderOptionList(
          <Stateful selectionType="multi" options={groupedOptions} onChange={onChange} />
        );
        fireEvent.mouseUp(wrapper.findGroupHeaderByValue('storage')!.getElement());
        expect(onChange).toHaveBeenLastCalledWith(['s3']);
      });

      test('keyboard reaches group headers and Space toggles the group', () => {
        const onChange = jest.fn();
        const { wrapper } = renderOptionList(
          <Stateful selectionType="multi" options={groupedOptions} onChange={onChange} />
        );
        const listbox = wrapper.findListbox().getElement();
        fireEvent.focus(listbox);
        pressKey(wrapper, KeyCode.down);
        expect(listbox).toHaveAttribute(
          'aria-activedescendant',
          wrapper.findGroupHeaderByValue('compute')!.getElement().id
        );
        pressKey(wrapper, KeyCode.space);
        expect(onChange).toHaveBeenLastCalledWith(['ec2', 'lambda']);
      });
    });

    test.each<OptionListProps.SelectionType>(['single', 'multi'])('is accessible with groups (%s)', async type => {
      const { container } = render(
        <Stateful selectionType={type} options={groupedOptions} initialSelected={['ec2']} />
      );
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
      expect(wrapper.findListbox().getElement()).not.toHaveAttribute('aria-multiselectable');
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
      fireEvent.focus(wrapper.findListbox().getElement());
      const highlighted = wrapper.findHighlightedOption()!.getElement();
      expect(highlighted).toBe(wrapper.findOptionByValue('b')!.getElement());
      expect(highlighted.className).toMatch(/is-keyboard/);
      expect(wrapper.findAll('[class*="highlighted"][role="option"]')).toHaveLength(1);
    });
  });

  describe('multi selection', () => {
    test('marks the listbox multiselectable and renders a checkbox per option', () => {
      const { wrapper } = renderOptionList(<Stateful selectionType="multi" initialSelected={['a', 'c']} />);
      expect(wrapper.findListbox().getElement()).toHaveAttribute('aria-multiselectable', 'true');
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
      expect(listbox).toHaveAttribute('aria-activedescendant', wrapper.findOptionByValue('c')!.getElement().id);
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
        <OptionList ariaLabel="Goals" options={options} selectionType="single" onFocus={onFocus} onBlur={onBlur} />
      );
      const listbox = wrapper.findListbox().getElement();
      fireEvent.focus(listbox);
      expect(onFocus).toHaveBeenCalledTimes(1);
      fireEvent.blur(listbox);
      expect(onBlur).toHaveBeenCalledTimes(1);
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
    expect(document.activeElement).toBe(wrapper.findListbox().getElement());
  });

  test('announces the selected state of the highlighted option', () => {
    const { wrapper } = renderOptionList(
      <Stateful initialSelected={['a']} i18nStrings={{ selectedAriaLabel: 'Picked' }} />
    );
    fireEvent.focus(wrapper.findListbox().getElement());
    expect(wrapper.findOptionByValue('a')!.getElement()).toHaveTextContent('Picked');
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
