// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render, waitFor } from '@testing-library/react';

import TagEditor, { TagEditorProps } from '../../../lib/components/tag-editor';
import createWrapper, { TagEditorWrapper } from '../../../lib/components/test-utils/dom';

import { i18nStrings, MAX_KEY_LENGTH, MAX_VALUE_LENGTH } from './common';
import TestI18nProvider from '../../../lib/components/internal/i18n/testing';

const defaultProps = {
  i18nStrings,
  tags: [],
};

interface RenderResult {
  wrapper: TagEditorWrapper;
  onChangeSpy: jest.Mock;
  rerender: any;
}

function renderTagEditor(props: Partial<TagEditorProps> = {}): RenderResult {
  const onChangeSpy = jest.fn();
  const { container, rerender } = render(<TagEditor onChange={onChangeSpy} {...defaultProps} {...props} />);
  const wrapper = createWrapper(container).findTagEditor()!;

  return {
    wrapper,
    onChangeSpy,
    rerender: (props: Partial<TagEditorProps>) =>
      rerender(<TagEditor onChange={onChangeSpy} {...defaultProps} {...props} />),
  };
}

function StatefulTestComponent(props: Partial<TagEditorProps>) {
  const [internalTags, setInternalTags] = React.useState(props.tags || []);
  const onChange = (event: any) => {
    setInternalTags(event.detail.tags);
  };
  return <TagEditor {...defaultProps} {...props} tags={internalTags} onChange={onChange} />;
}

describe('Tag Editor component', () => {
  test('should set a tag key', () => {
    const { wrapper, onChangeSpy } = renderTagEditor({
      tags: [{ key: '', value: '', existing: true }],
    });
    wrapper.findRow(1)!.findField(1)!.findControl()!.findAutosuggest()!.setInputValue('k');

    expect(onChangeSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: { tags: [{ key: 'k', value: '', existing: true }], valid: true },
      })
    );
  });

  test('should set a tag value', () => {
    const { wrapper, onChangeSpy } = renderTagEditor({
      tags: [{ key: '', value: '', existing: true }],
    });
    wrapper.findRow(1)!.findField(2)!.findControl()!.findAutosuggest()!.setInputValue('v');

    expect(onChangeSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: { tags: [{ key: '', value: 'v', existing: true }], valid: true },
      })
    );
  });

  describe('allowedCharacterPattern', () => {
    test('is used for determining error state', () => {
      const { wrapper } = renderTagEditor({
        allowedCharacterPattern: '^[0-9]+$',
        tags: [{ key: 'key', value: '123', existing: false }],
      });
      const keyError = wrapper.findRow(1)!.findField(1)!.findError()!.getElement();
      expect(keyError).toHaveTextContent(i18nStrings.invalidKeyError);
    });

    test('is used for determining validity in onChange handler', () => {
      const { wrapper, onChangeSpy } = renderTagEditor({
        allowedCharacterPattern: '^[0-9]+$',
        tags: [{ key: '123', value: '456', existing: false }],
      });
      wrapper.findRow(1)!.findField(2)!.findControl()!.findAutosuggest()!.setInputValue('test');
      expect(onChangeSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: {
            tags: [{ existing: false, key: '123', value: 'test' }],
            valid: false,
          },
        })
      );
    });
  });

  describe('i18n', () => {
    test('uses the correct string when the component is in a loading state', () => {
      const { wrapper } = renderTagEditor({ loading: true });
      expect(wrapper.findLoadingText()).not.toBeNull();
      expect(wrapper.findLoadingText()!.getElement()).toHaveTextContent(i18nStrings.loading);
    });

    test('proxies the correct strings to sub components', () => {
      const { wrapper } = renderTagEditor({
        tags: [
          { key: 'key-1', value: 'value-1', existing: true },
          { key: 'key-2', value: 'value-2', existing: true, markedForRemoval: true },
          { key: '', value: '', existing: false },
        ],
      });

      const addButtonElement = wrapper.findAddButton().getElement();
      const removeButtonElement = wrapper.findRow(1)!.findRemoveButton()!.getElement();
      const undoPromptElement = wrapper.findRow(2)!.findField(2)!.findControl()!.getElement();
      const undoButtonElement = wrapper.findRow(2)!.findUndoButton()!.getElement();

      const keyLabel = wrapper.findRow(1)!.findField(1)!.findLabel()!.getElement();
      const valueLabel = wrapper.findRow(1)!.findField(2)!.findLabel()!.getElement();
      const additionalInfoElement = wrapper.findAdditionalInfo()!.getElement();

      expect(keyLabel).toHaveTextContent(i18nStrings.keyHeader);
      expect(valueLabel).toHaveTextContent(`${i18nStrings.valueHeader} - ${i18nStrings.optional}`);
      expect(addButtonElement).toHaveTextContent(i18nStrings.addButton);
      expect(removeButtonElement).toHaveTextContent(i18nStrings.removeButton);
      expect(undoPromptElement).toHaveTextContent(i18nStrings.undoPrompt);
      expect(undoButtonElement).toHaveTextContent(i18nStrings.undoButton);
      expect(additionalInfoElement).toHaveTextContent(i18nStrings.tagLimit(48, 50));
    });

    test('uses the correct string when the component has no tags', () => {
      const { wrapper } = renderTagEditor({
        tags: [],
        loading: false,
        tagLimit: 3,
      });

      const emptyRegionElement = wrapper.findEmptySlot()!.getElement();
      expect(emptyRegionElement).toHaveTextContent(i18nStrings.emptyTags);
    });

    test('uses the correct error strings', () => {
      const generateString = (length: number) => Array(length).fill('a').join('');

      const { wrapper } = renderTagEditor({
        tags: [
          {
            key: `maxCharLength${generateString(MAX_KEY_LENGTH)}`,
            value: `maxCharLength${generateString(MAX_VALUE_LENGTH)}`,
            existing: true,
          },
          { key: 'invalidChar!', value: 'invalidChar!', existing: true },
          { key: 'aws:Prefix', value: '', existing: true },
          { key: 'duplicateKey', value: '', existing: true },
          { key: 'duplicateKey', value: '', existing: true },
        ],
      });

      // 1-based index
      const getErrorElement = (row: number, column: number) =>
        wrapper.findRow(row)!.findField(column)!.findError()!.getElement();

      const getKeyErrorElement = (row: number) => getErrorElement(row, 1);
      const getValueErrorElement = (row: number) => getErrorElement(row, 2);

      expect(getKeyErrorElement(1)).toHaveTextContent(i18nStrings.maxKeyCharLengthError);
      expect(getValueErrorElement(1)).toHaveTextContent(i18nStrings.maxValueCharLengthError);

      expect(getKeyErrorElement(2)).toHaveTextContent(i18nStrings.invalidKeyError);
      expect(getValueErrorElement(2)).toHaveTextContent(i18nStrings.invalidValueError);

      expect(getKeyErrorElement(3)).toHaveTextContent(i18nStrings.awsPrefixError);
      expect(getKeyErrorElement(4)).toHaveTextContent(i18nStrings.duplicateKeyError);
      expect(getKeyErrorElement(5)).toHaveTextContent(i18nStrings.duplicateKeyError);
    });
  });

  describe('loading values', () => {
    test('shows loading error in values dropdown when the promise is rejected', async () => {
      const { wrapper } = renderTagEditor({
        i18nStrings,
        tags: [{ key: '', value: '', existing: true }],
        valuesRequest: () => Promise.reject(),
      });

      function findValuesSuggest() {
        return wrapper.findRow(1)!.findField(2)!.findControl()!.findAutosuggest();
      }

      findValuesSuggest()!.findNativeInput().focus();

      // wait for tag editor to load suggestions
      await waitFor(() =>
        expect(findValuesSuggest()!.findStatusIndicator()!.getElement()).toHaveTextContent(
          i18nStrings.valuesSuggestionError
        )
      );
    });

    test('shows status message for values dropdown when the key is defined', async () => {
      const { wrapper } = renderTagEditor({
        i18nStrings,
        tags: [{ key: 'sample', value: '', existing: true }],
        valuesRequest: () => Promise.resolve([]),
      });

      function findValuesSuggest() {
        return wrapper.findRow(1)!.findField(2)!.findControl()!.findAutosuggest();
      }

      findValuesSuggest()!.findNativeInput().focus();

      // wait for tag editor to load suggestions
      await waitFor(() =>
        expect(findValuesSuggest()!.findStatusIndicator()!.getElement()).toHaveTextContent(i18nStrings.valueSuggestion)
      );
    });
  });

  describe('Additional Info', () => {
    test('uses the correct string when the component has exceeded the tag limit', () => {
      const { wrapper } = renderTagEditor({
        tags: [
          { key: 'key-1', value: 'value-1', existing: true },
          { key: 'key-2', value: 'value-2', existing: true },
          { key: 'key-3', value: 'value-3', existing: true },
        ],
        loading: false,
        tagLimit: 2,
      });

      const additionalInfoElement = wrapper.findAdditionalInfo()!.getElement();
      expect(additionalInfoElement).toHaveTextContent(i18nStrings.tagLimitExceeded(2));
    });

    test('uses the correct string when the component has reached the tag limit', () => {
      const { wrapper } = renderTagEditor({
        tags: [
          { key: 'key-1', value: 'value-1', existing: true },
          { key: 'key-2', value: 'value-2', existing: true },
          { key: 'key-3', value: 'value-3', existing: true },
        ],
        loading: false,
        tagLimit: 3,
      });

      const additionalInfoElement = wrapper.findAdditionalInfo()!.getElement();
      expect(additionalInfoElement).toHaveTextContent(i18nStrings.tagLimitReached(3));
    });

    test('uses the default tag limit when no tags have been added', () => {
      const { wrapper } = renderTagEditor();
      const additionalInfoElement = wrapper.findAdditionalInfo()!.getElement();

      expect(additionalInfoElement).toHaveTextContent(i18nStrings.tagLimit(50, 50));
    });

    test('uses the correct value when component contains existing tags', () => {
      const { wrapper } = renderTagEditor({ tags: [{ key: 'key', value: 'value', existing: true }] });
      const additionalInfoElement = wrapper.findAdditionalInfo()!.getElement();

      expect(additionalInfoElement).toHaveTextContent(i18nStrings.tagLimit(49, 50));
    });

    test('uses the correct value when tags are added to the component', () => {
      const { wrapper } = renderTagEditor({ tags: [{ key: 'key', value: 'value', existing: false }] });
      const additionalInfoElement = wrapper.findAdditionalInfo()!.getElement();

      expect(additionalInfoElement).toHaveTextContent(i18nStrings.tagLimit(49, 50));
    });

    test('uses the correct value when existing tags are marked for removal', () => {
      const { wrapper } = renderTagEditor({
        tags: [{ key: 'key', value: 'value', existing: false, markedForRemoval: true }],
      });
      const additionalInfoElement = wrapper.findAdditionalInfo()!.getElement();

      expect(additionalInfoElement).toHaveTextContent(i18nStrings.tagLimit(50, 50));
    });
  });

  describe('Add button', () => {
    test('is not disabled by default ', () => {
      const { wrapper } = renderTagEditor();

      expect(wrapper.findAddButton().getElement()).not.toHaveAttribute('disabled');
    });

    test('is disabled when tag limit has been reached', () => {
      const { wrapper } = renderTagEditor({
        tags: [{ key: 'key', value: 'value', existing: true }],
        tagLimit: 1,
      });

      expect(wrapper.findAddButton().getElement()).toHaveAttribute('disabled');
    });

    test('is disabled when tag limit has been exceeded', () => {
      const { wrapper } = renderTagEditor({
        tags: [
          { key: 'key', value: 'value', existing: true },
          { key: 'key-2', value: 'value-2', existing: true },
        ],
        tagLimit: 1,
      });

      expect(wrapper.findAddButton().getElement()).toHaveAttribute('disabled');
    });

    test('adds an empty tag when there are no tags', () => {
      const { wrapper, onChangeSpy } = renderTagEditor();

      wrapper.findAddButton().click();
      expect(onChangeSpy).toHaveBeenCalledWith(
        expect.objectContaining({ detail: { tags: [{ key: '', value: '', existing: false }], valid: true } })
      );
    });

    test('appends an empty tag to existing tags', () => {
      const { wrapper, onChangeSpy } = renderTagEditor({ tags: [{ key: 'key', value: 'value', existing: true }] });

      wrapper.findAddButton().click();
      expect(onChangeSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: {
            tags: [
              { key: 'key', value: 'value', existing: true },
              { key: '', value: '', existing: false },
            ],
            valid: true,
          },
        })
      );
    });
  });

  describe('Remove button', () => {
    test('should remove a new tag', () => {
      const { wrapper, onChangeSpy } = renderTagEditor({ tags: [{ key: 'key', value: 'value', existing: false }] });
      wrapper.findRow(1)!.findRemoveButton()!.click();
      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      expect(onChangeSpy).toHaveBeenCalledWith(expect.objectContaining({ detail: { tags: [], valid: true } }));
    });

    test('should mark an existing tag for removal', () => {
      const { wrapper, onChangeSpy } = renderTagEditor({ tags: [{ key: 'key', value: 'value', existing: true }] });
      wrapper.findRow(1)!.findRemoveButton()!.click();

      expect(onChangeSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: { tags: [{ key: 'key', value: 'value', existing: true, markedForRemoval: true }], valid: true },
        })
      );
    });

    test('renders `ariaLabel` on remove button using `removeButtonAriaLabel` on all rows', () => {
      const removeButtonAriaLabel = (item: TagEditorProps.Tag) => `Remove ${item.key}`;
      const { wrapper } = renderTagEditor({
        tags: [{ key: 'test key', value: 'value', existing: false }],
        i18nStrings: { ...defaultProps.i18nStrings, removeButtonAriaLabel },
      });
      defaultProps.tags!.forEach((item, index) => {
        expect(
          wrapper
            .findRow(index + 1)!
            .findRemoveButton()!
            .getElement()
        ).toHaveAccessibleName(`Remove test key`);
      });
    });
  });

  test('should render itemRemovedAriaLive when a tag is removed', async () => {
    const tags = [
      { key: 'key', value: 'value', existing: false },
      { key: 'key2', value: 'value', existing: false },
      { key: 'key3', value: 'value', existing: false },
    ];

    const { container } = render(
      <StatefulTestComponent tags={tags} i18nStrings={{ ...i18nStrings, itemRemovedAriaLive: 'removal-text-test' }} />
    );
    const wrapper = createWrapper(container).findTagEditor()!;

    wrapper.findRow(1)!.findRemoveButton()!.click();

    await waitFor(() => {
      expect(wrapper.find(`[data-testid="removal-announcement"]`)!.getElement()).toHaveTextContent('removal-text-test');
    });
  });

  describe('Undo removal', () => {
    test('should remove `markedForRemoval` flag from a marked tag', () => {
      const { wrapper, onChangeSpy } = renderTagEditor({
        tags: [{ key: 'key', value: 'value', existing: true, markedForRemoval: true }],
      });

      wrapper.findRow(1)!.findUndoButton()!.click();
      expect(onChangeSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: { tags: [{ key: 'key', value: 'value', existing: true, markedForRemoval: false }], valid: true },
        })
      );
    });
  });

  describe('API Requests', () => {
    test('should call given keysRequest and valuesRequest methods upon focus the right amount of times', async () => {
      const keysRequestSpy = jest.fn().mockReturnValue(new Promise(() => {}));
      const valuesRequestSpy = jest.fn().mockReturnValue(new Promise(() => {}));
      const { wrapper } = renderTagEditor({
        tags: [{ key: 'key-1', value: 'value-1', existing: false }],
        keysRequest: keysRequestSpy,
        valuesRequest: valuesRequestSpy,
      });

      wrapper.findRow(1)!.findField(1)!.findControl()!.findAutosuggest()!.focus();
      wrapper.findRow(1)!.findField(2)!.findControl()!.findAutosuggest()!.focus();
      // subsequent focus should not generate new calls
      wrapper.findRow(1)!.findField(1)!.findControl()!.findAutosuggest()!.focus();
      wrapper.findRow(1)!.findField(2)!.findControl()!.findAutosuggest()!.focus();
      wrapper.findRow(1)!.findField(1)!.findControl()!.findAutosuggest()!.focus();
      wrapper.findRow(1)!.findField(2)!.findControl()!.findAutosuggest()!.focus();

      // We wait as api call is fired on delayedInput
      await waitFor(() => {
        expect(keysRequestSpy).toHaveBeenCalledTimes(1);
        expect(keysRequestSpy).toHaveBeenCalledWith('');
        expect(valuesRequestSpy).toHaveBeenCalledTimes(1);
        expect(valuesRequestSpy).toHaveBeenCalledWith('key-1', '');
      });
    });
    test('should call valuesRequest again upon focus after changing the key', async () => {
      const valuesRequestSpy = jest.fn().mockReturnValue(new Promise(() => {}));
      const { wrapper, rerender } = renderTagEditor({
        tags: [{ key: 'key-1', value: 'value-1', existing: false }],
        valuesRequest: valuesRequestSpy,
      });

      wrapper.findRow(1)!.findField(2)!.findControl()!.findAutosuggest()!.focus();
      wrapper.findRow(1)!.findField(1)!.findControl()!.findAutosuggest()!.focus();
      rerender({
        tags: [{ key: 'key-2', value: 'value-1', existing: false }],
        valuesRequest: valuesRequestSpy,
      });
      wrapper.findRow(1)!.findField(2)!.findControl()!.findAutosuggest()!.focus();

      // We wait as api call is fired on delayedInput
      await waitFor(() => {
        expect(valuesRequestSpy).toHaveBeenCalledTimes(2);
        expect(valuesRequestSpy).toHaveBeenNthCalledWith(1, 'key-1', '');
        expect(valuesRequestSpy).toHaveBeenNthCalledWith(2, 'key-2', '');
      });
    });
    test('should call given keysRequest method with the correct key', async () => {
      const keysRequestSpy = jest.fn().mockReturnValue(new Promise(() => {}));
      const { wrapper } = renderTagEditor({
        tags: [{ key: '', value: '', existing: false }],
        keysRequest: keysRequestSpy,
      });

      wrapper.findRow(1)!.findField(1)!.findControl()!.findAutosuggest()!.setInputValue('key-1');

      // We wait as api call is fired on delayedInput
      await waitFor(() => {
        expect(keysRequestSpy).toHaveBeenCalledTimes(1);
        expect(keysRequestSpy).toHaveBeenCalledWith('key-1');
      });
    });

    test('should populate key suggestions with response', async () => {
      const { wrapper } = renderTagEditor({
        tags: [{ key: '', value: '', existing: false }],
        keysRequest: () => Promise.resolve(['key-1', 'key-2']),
      });

      const keyAutosuggest = wrapper.findRow(1)!.findField(1)!.findControl()!.findAutosuggest()!;
      keyAutosuggest.focus();
      keyAutosuggest.setInputValue('k');

      // We wait as api call is fired on delayedInput
      await waitFor(() => expect(keyAutosuggest.findDropdown().findOptions()).toHaveLength(2));
    });

    test('should call given valuesRequest method with the correct value', async () => {
      const valuesRequestSpy = jest.fn().mockReturnValue(new Promise(() => {}));
      const { wrapper } = renderTagEditor({
        tags: [{ key: 'key-1', value: '', existing: false }],
        valuesRequest: valuesRequestSpy,
      });

      wrapper.findRow(1)!.findField(2)!.findControl()!.findAutosuggest()!.setInputValue('value-1');

      // We wait as api call is fired on delayedInput
      await waitFor(() => {
        expect(valuesRequestSpy).toHaveBeenCalledTimes(1);
        expect(valuesRequestSpy).toHaveBeenCalledWith('key-1', 'value-1');
      });
    });

    test('should populate value suggestions with response', async () => {
      const { wrapper } = renderTagEditor({
        tags: [{ key: '', value: '', existing: false }],
        valuesRequest: () => Promise.resolve(['value-1', 'value-2', 'value-3']),
      });

      const valueAutosuggest = wrapper.findRow(1)!.findField(2)!.findControl()!.findAutosuggest()!;
      valueAutosuggest.focus();
      valueAutosuggest.setInputValue('v');

      // We wait as api call is fired on delayedInput
      await waitFor(() => expect(valueAutosuggest.findDropdown().findOptions()).toHaveLength(3));
    });
  });

  describe('focus behavior', () => {
    const renderControlledTagEditor = (props: Partial<TagEditorProps>) => {
      const { wrapper, rerender, onChangeSpy } = renderTagEditor(props);
      return { wrapper, rerender: () => rerender({ ...props, ...onChangeSpy.mock.lastCall[0].detail }) };
    };

    test('should focus key input when adding a new tag', () => {
      const { wrapper, rerender } = renderControlledTagEditor({
        tags: [{ key: 'key', value: 'value', existing: false }],
      });

      wrapper.findAddButton().click();
      rerender();
      expect(wrapper.findRow(2)!.findAutosuggest()!.findNativeInput().getElement()).toHaveFocus();
    });

    test('should focus undo button when removing an existing tag', () => {
      const { wrapper, rerender } = renderControlledTagEditor({
        tags: [{ key: 'key', value: 'value', existing: true }],
      });

      wrapper.findRow(1)!.findRemoveButton()!.click();
      rerender();
      expect(wrapper.findRow(1)?.findUndoButton()!.getElement()).toHaveFocus();
    });

    test('should focus remove button undoing marking for removal', () => {
      const { wrapper, rerender } = renderControlledTagEditor({
        tags: [{ key: 'key', value: 'value', existing: true, markedForRemoval: true }],
      });

      wrapper.findRow(1)!.findUndoButton()!.click();
      rerender();
      expect(wrapper.findRow(1)!.findRemoveButton()!.getElement()).toHaveFocus();
    });

    test('should focus add button when removing single tag', () => {
      const { wrapper, rerender } = renderControlledTagEditor({
        tags: [{ key: 'key', value: 'value', existing: false }],
      });

      wrapper.findRow(1)!.findRemoveButton()!.click();
      rerender();
      expect(wrapper.findAddButton().getElement()).toHaveFocus();
    });

    test('should focus next key input when removing non-last tag', () => {
      const { wrapper, rerender } = renderControlledTagEditor({
        tags: [
          { key: 'key', value: 'value', existing: false },
          { key: 'key2', value: 'value2', existing: false },
        ],
      });

      wrapper.findRow(1)!.findRemoveButton()!.click();
      rerender();
      const nextInput = wrapper.findRow(1)!.findAutosuggest()!.findNativeInput().getElement();
      expect(nextInput).toHaveValue('key2');
      expect(nextInput).toHaveFocus();
    });

    test('should focus previous key input when removing last tag', () => {
      const { wrapper, rerender } = renderControlledTagEditor({
        tags: [
          { key: 'key', value: 'value', existing: false },
          { key: 'key2', value: 'value2', existing: false },
        ],
      });

      wrapper.findRow(2)!.findRemoveButton()!.click();
      rerender();
      const nextInput = wrapper.findRow(1)!.findAutosuggest()!.findNativeInput().getElement();
      expect(nextInput).toHaveValue('key');
      expect(nextInput).toHaveFocus();
    });

    test('should focus previous value input when removing last tag and previous is existing', () => {
      const { wrapper, rerender } = renderControlledTagEditor({
        tags: [
          { key: 'key', value: 'value', existing: true },
          { key: 'key2', value: 'value2', existing: false },
        ],
      });

      wrapper.findRow(2)!.findRemoveButton()!.click();
      rerender();
      const nextInput = wrapper
        .findRow(1)!
        .findField(2)!
        .findControl()!
        .findAutosuggest()!
        .findNativeInput()
        .getElement();
      expect(nextInput).toHaveValue('value');
      expect(nextInput).toHaveFocus();
    });

    test('should focus previous undo button when removing last tag and previous is existing and flagged for removal', () => {
      const { wrapper, rerender } = renderControlledTagEditor({
        tags: [
          { key: 'key', value: 'value', existing: true, markedForRemoval: true },
          { key: 'key2', value: 'value2', existing: false },
        ],
      });

      wrapper.findRow(2)!.findRemoveButton()!.click();
      rerender();
      expect(wrapper.findRow(1)!.findUndoButton()!.getElement()).toHaveFocus();
    });
  });

  describe('i18n', () => {
    test('supports using i18nStrings.loading from i18n provider', () => {
      const { container } = render(
        <TestI18nProvider
          messages={{
            'tag-editor': {
              'i18nStrings.loading': 'Custom loading',
            },
          }}
        >
          <StatefulTestComponent i18nStrings={undefined} loading={true} />
        </TestI18nProvider>
      );
      const wrapper = createWrapper(container).findTagEditor()!;
      expect(wrapper.findLoadingText()!.getElement()).toHaveTextContent('Custom loading');
    });

    test('supports using undo strings from i18n provider', () => {
      const { container } = render(
        <TestI18nProvider
          messages={{
            'tag-editor': {
              'i18nStrings.undoPrompt': 'Custom prompt',
              'i18nStrings.undoButton': 'Custom button',
            },
          }}
        >
          <TagEditor tags={[{ key: '', value: '', existing: true, markedForRemoval: true }]} i18nStrings={undefined} />
        </TestI18nProvider>
      );
      const wrapper = createWrapper(container).findTagEditor()!;
      expect(wrapper.findRow(1)!.findField(2)!.findControl()!.getElement()).toHaveTextContent(
        'Custom prompt Custom button'
      );
    });

    test('supports using basic strings from i18n provider', () => {
      const { container } = render(
        <TestI18nProvider
          messages={{
            'tag-editor': {
              'i18nStrings.addButton': 'Custom add',
              'i18nStrings.removeButtonAriaLabel': 'Custom remove {tag__key}',
              'i18nStrings.emptyTags': 'Custom empty tags',
              'i18nStrings.keyHeader': 'Custom key',
              'i18nStrings.valueHeader': 'Custom value',
              'i18nStrings.optional': 'Custom optional',
              'i18nStrings.keySuggestion': 'Custom key suggestion',
              'i18nStrings.valuePlaceholder': 'Custom value placeholder',
              'i18nStrings.tagLimit': 'Custom limit {availableTags} out of {tagLimit}',
              'i18nStrings.tagLimitReached': 'Custom limit reached {tagLimit}',
            },
          }}
        >
          <StatefulTestComponent i18nStrings={undefined} tagLimit={1} />
        </TestI18nProvider>
      );
      const wrapper = createWrapper(container).findTagEditor()!;
      expect(wrapper.findEmptySlot()!.getElement()).toHaveTextContent('Custom empty tags');
      expect(wrapper.findAddButton().getElement()).toHaveTextContent('Custom add');
      expect(wrapper.findAdditionalInfo()!.getElement()).toHaveTextContent('Custom limit 1 out of 1');

      wrapper.findAddButton().click();
      expect(wrapper.findAdditionalInfo()!.getElement()).toHaveTextContent('Custom limit reached 1');
      expect(wrapper.findRow(1)!.findField(1)!.findLabel()!.getElement()).toHaveTextContent('Custom key');
      expect(wrapper.findRow(1)!.findField(2)!.findLabel()!.getElement()).toHaveTextContent(
        'Custom value - Custom optional'
      );
      expect(
        wrapper.findRow(1)!.findField(1)!.findControl()!.findAutosuggest()!.findDropdown().getElement()
      ).toHaveTextContent('Custom key suggestion');
      expect(
        wrapper.findRow(1)!.findField(2)!.findControl()!.findAutosuggest()!.findNativeInput()!.getElement()
      ).toHaveAttribute('placeholder', 'Custom value placeholder');
      wrapper.findRow(1)!.findField(1)!.findControl()!.findAutosuggest()!.setInputValue('Key 1');
      expect(wrapper.findRow(1)!.findRemoveButton()!.getElement()).toHaveAccessibleName('Custom remove Key 1');
    });
  });
});
