// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act, render } from '@testing-library/react';

import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

import OptionList, { OptionListProps } from '../../../lib/components/option-list';
import createWrapper from '../../../lib/components/test-utils/dom';
import { clickOption, options, renderOptionList, selectedLabels, Stateful } from './common';

jest.mock('@cloudscape-design/component-toolkit/internal', () => ({
  ...jest.requireActual('@cloudscape-design/component-toolkit/internal'),
  warnOnce: jest.fn(),
}));

afterEach(() => {
  (warnOnce as jest.Mock).mockReset();
});

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

  test('ref.focus() focuses the listbox', () => {
    const ref = React.createRef<OptionListProps.Ref>();
    const { listbox } = renderOptionList(
      <OptionList ref={ref} ariaLabel="Goals" options={options} selectionType="single" />
    );
    act(() => ref.current!.focus());
    expect(document.activeElement).toBe(listbox);
  });
});
