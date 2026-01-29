// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { render } from '@testing-library/react';

import { KeyCode } from '@cloudscape-design/test-utils-core/utils';

import Autosuggest, { AutosuggestProps } from '../../../lib/components/autosuggest';
import createWrapper from '../../../lib/components/test-utils/dom';

const defaultOptions: AutosuggestProps.Options = [
  { value: '1', label: 'One' },
  { value: '2', label: 'Two' },
  { value: '3', label: 'Three' },
];

describe('Autosuggest renderOption', () => {
  function renderAutosuggestWrapper(props?: Partial<AutosuggestProps>, virtualScroll: boolean = false) {
    const { container } = render(
      <Autosuggest
        value=""
        virtualScroll={virtualScroll}
        onChange={() => {}}
        enteredTextLabel={() => 'Use value'}
        options={props?.options ?? []}
        {...props}
      />
    );
    return createWrapper(container).findAutosuggest()!;
  }

  for (const listType of ['virtual', 'plain']) {
    const renderAutosuggest = (props?: Partial<AutosuggestProps>) =>
      renderAutosuggestWrapper(props, listType === 'virtual');

    describe(`${listType} list`, () => {
      test('renders custom option content', () => {
        const renderOption = () => <div>Custom</div>;
        const wrapper = renderAutosuggest({ options: defaultOptions, renderOption });
        wrapper.focus();

        const elementWrapper = wrapper.findDropdown().findOption(1)!.getElement();
        expect(elementWrapper).not.toBeNull();
        expect(elementWrapper).toHaveTextContent('Custom');
      });

      test('receives correct item properties for item option', () => {
        const renderOption = jest.fn(() => <div>Custom</div>);
        const itemOption = { label: 'Test', value: '1' };
        const wrapper = renderAutosuggest({
          options: [itemOption],
          renderOption,
        });
        wrapper.focus();

        expect(renderOption).toHaveBeenCalledWith(
          expect.objectContaining({
            item: expect.objectContaining({
              option: expect.objectContaining(itemOption),
              selected: false,
              disabled: false,
              type: 'item',
            }),
          })
        );
      });

      test('receives correct item properties for group option', () => {
        const renderOption = jest.fn(() => <div>Custom</div>);
        const groupOption = { label: 'Group', options: [{ label: 'Child', value: 'c1' }] };
        const wrapper = renderAutosuggest({
          options: [groupOption],
          renderOption,
        });
        wrapper.focus();

        expect(renderOption).toHaveBeenCalledWith(
          expect.objectContaining({
            item: expect.objectContaining({
              option: expect.objectContaining(groupOption),
              disabled: false,
              type: 'group',
            }),
          })
        );
      });

      test('receives correct item properties for use-entered option', () => {
        const renderOption = jest.fn(() => <div>Custom</div>);
        const wrapper = renderAutosuggest({
          options: defaultOptions,
          value: 'test-value',
          renderOption,
        });
        wrapper.focus();

        // Find the call for the use-entered option
        const useEnteredCall = renderOption.mock.calls.find(
          (call: any) => call[0].item.type === 'use-entered'
        ) as any[];

        expect(useEnteredCall).toBeDefined();
        expect(useEnteredCall![0]).toEqual(
          expect.objectContaining({
            filterText: 'test-value',
            item: expect.objectContaining({
              type: 'use-entered',
              option: expect.objectContaining({
                value: 'test-value',
              }),
            }),
          })
        );
      });

      test('reflects highlighted state', () => {
        const renderOption = jest.fn(() => <div>Custom</div>);
        const wrapper = renderAutosuggest({ options: [{ label: 'First', value: '1' }], renderOption });
        wrapper.focus();

        wrapper.findNativeInput().keydown(KeyCode.down);
        expect(renderOption).toHaveBeenCalledWith(
          expect.objectContaining({
            item: expect.objectContaining({ highlighted: true }),
          })
        );
      });

      test('reflects selected state', () => {
        const renderOption = jest.fn(() => <div>Custom</div>);
        const option = { label: 'Test', value: '1' };
        const wrapper = renderAutosuggest({
          options: [option],
          value: '1',
          renderOption,
        });
        wrapper.focus();
        expect(renderOption).toHaveBeenCalledWith(
          expect.objectContaining({
            item: expect.objectContaining({ selected: true }),
          })
        );
      });

      test('renders children within groups correctly', () => {
        const renderOption = jest.fn(() => <div>Custom</div>);
        const wrapper = renderAutosuggest({
          options: [{ label: 'Group', options: [{ label: 'Child', value: 'c1' }] }],
          renderOption,
        });
        wrapper.focus();
        expect(renderOption).toHaveBeenCalledWith(
          expect.objectContaining({
            item: expect.objectContaining({ type: 'item' }),
          })
        );
      });

      test('receives correct parent attribute for child item in group', () => {
        const renderOption = jest.fn(() => <div>Custom</div>);
        const groupOption = { label: 'Parent Group', options: [{ label: 'Child Item', value: 'c1' }] };
        const wrapper = renderAutosuggest({
          options: [groupOption],
          renderOption,
        });
        wrapper.focus();

        // Verify that the child item receives the correct parent attribute
        expect(renderOption).toHaveBeenCalledWith(
          expect.objectContaining({
            item: expect.objectContaining({
              type: 'item',
              option: expect.objectContaining({ label: 'Child Item', value: 'c1' }),
              parent: expect.objectContaining({
                type: 'group',
                option: expect.objectContaining(groupOption),
              }),
            }),
          })
        );
      });

      test('reflects disabled state', () => {
        const renderOption = jest.fn(() => <div>Custom</div>);
        const wrapper = renderAutosuggest({
          options: [{ label: 'Test', value: '1', disabled: true }],
          renderOption,
        });
        wrapper.focus();

        expect(renderOption).toHaveBeenCalledWith(
          expect.objectContaining({
            item: expect.objectContaining({
              disabled: true,
            }),
          })
        );
      });

      test('allows selection with custom rendered options', () => {
        const onChange = jest.fn();
        const renderOption = jest.fn(() => <div>Custom</div>);
        const wrapper = renderAutosuggest({
          options: [
            { label: 'Test', value: '1' },
            { label: 'Test 2', value: '2' },
          ],
          renderOption,
          onChange,
        });
        wrapper.focus();
        wrapper.selectSuggestion(2);
        expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ detail: { value: '2' } }));
      });

      test('receives filterText parameter when filtering', () => {
        const renderOption = jest.fn(() => <div>Custom</div>);
        const wrapper = renderAutosuggest({
          options: defaultOptions,
          renderOption,
          filteringType: 'auto',
          value: 'test-filter',
        });

        wrapper.focus();

        expect(renderOption).toHaveBeenCalledWith(
          expect.objectContaining({
            filterText: 'test-filter',
          })
        );
      });

      test('renders custom content for use-entered option', () => {
        const renderOption = jest.fn(props => {
          if (props.item.type === 'use-entered') {
            return <div>Use custom: {props.item.option.value}</div>;
          }
          return <div>Regular option</div>;
        });

        const wrapper = renderAutosuggest({
          options: defaultOptions,
          value: 'custom-value',
          renderOption,
        });
        wrapper.focus();

        const enteredTextOption = wrapper.findEnteredTextOption();
        expect(enteredTextOption).not.toBe(null);
        expect(enteredTextOption!.getElement()).toHaveTextContent('Use custom: custom-value');
      });

      test('maintains option index in item properties', () => {
        const renderOption = jest.fn(() => <div>Custom</div>);
        const wrapper = renderAutosuggest({
          options: defaultOptions,
          renderOption,
        });
        wrapper.focus();

        // Check that each option receives the correct index
        expect(renderOption).toHaveBeenCalledWith(
          expect.objectContaining({
            item: expect.objectContaining({
              index: 0,
              option: expect.objectContaining({ value: '1' }),
            }),
          })
        );

        expect(renderOption).toHaveBeenCalledWith(
          expect.objectContaining({
            item: expect.objectContaining({
              index: 1,
              option: expect.objectContaining({ value: '2' }),
            }),
          })
        );
      });

      test('maintains group index in item properties', () => {
        const renderOption = jest.fn(() => <div>Custom</div>);

        const wrapper = renderAutosuggest({
          options: [
            { label: 'Group 1', options: [{ label: 'Child 1', value: 'c1' }] },
            { label: 'Group 2', options: [{ label: 'Child 2', value: 'c2' }] },
          ],
          renderOption,
        });
        wrapper.focus();

        expect(renderOption).toHaveBeenCalledWith(
          expect.objectContaining({
            item: expect.objectContaining({
              type: 'group',
              index: 0,
              option: expect.objectContaining({ label: 'Group 1' }),
            }),
          })
        );

        // Child 1 has index 1
        expect(renderOption).toHaveBeenCalledWith(
          expect.objectContaining({
            item: expect.objectContaining({
              type: 'group',
              index: 2,
              option: expect.objectContaining({ label: 'Group 2' }),
            }),
          })
        );
      });

      test('handles group disabled state correctly', () => {
        const renderOption = jest.fn(() => <div>Custom</div>);
        const disabledGroup = {
          label: 'Disabled Group',
          disabled: true,
          options: [{ label: 'Child', value: 'c1' }],
        };

        const wrapper = renderAutosuggest({
          options: [disabledGroup],
          renderOption,
        });
        wrapper.focus();

        // Check group is marked as disabled
        expect(renderOption).toHaveBeenCalledWith(
          expect.objectContaining({
            item: expect.objectContaining({
              type: 'group',
              disabled: true,
            }),
          })
        );
      });

      test('falls back to default content when renderOption returns null', () => {
        const renderOption = jest.fn(() => null);
        const wrapper = renderAutosuggest({
          options: [{ label: 'Test Option', value: 'test' }],
          renderOption,
        });
        wrapper.focus();

        const optionElement = wrapper.findDropdown().findOption(1)!.getElement();
        expect(optionElement).not.toBeNull();
        // Should display the default content (the option label) instead of custom content
        expect(optionElement).toHaveTextContent('Test Option');
        expect(renderOption).toHaveBeenCalled();
      });
    });
  }
});
