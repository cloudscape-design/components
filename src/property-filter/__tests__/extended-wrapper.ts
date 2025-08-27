// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import createWrapper, {
  AutosuggestWrapper,
  FormFieldWrapper,
  MultiselectWrapper,
  SelectWrapper,
} from '../../../lib/components/test-utils/dom';

import itemStyles from '../../../lib/components/internal/components/selectable-item/styles.css.js';
import selectableStyles from '../../../lib/components/internal/components/selectable-item/styles.selectors.js';
import propertyFilterStyles from '../../../lib/components/property-filter/styles.selectors.js';
import tokenStyles from '../../../lib/components/token/styles.selectors.js';

export function createExtendedWrapper() {
  const wrapper = createWrapper().findPropertyFilter()!;
  function findEditorDropdown() {
    return wrapper
      .findTokens()
      .map(w => w.findEditorDropdown())
      .filter(Boolean)[0]!;
  }
  function findControl(fieldIndex: number, fieldType: 'property' | 'operator' | 'value') {
    const dropdown = findEditorDropdown();
    const field = {
      property: dropdown.findPropertyField(fieldIndex),
      operator: dropdown.findOperatorField(fieldIndex),
      value: dropdown.findValueField(fieldIndex),
    }[fieldType];
    return field.findControl()!;
  }

  return {
    input: {
      focus() {
        wrapper.focus();
      },
      value(text: string) {
        wrapper.setInputValue(text);
      },
      date(text: string) {
        wrapper.findDropdown().findOpenDropdown()!.findDateInput()!.setInputValue(text);
      },
      keys(...codes: number[]) {
        codes.forEach(code => wrapper.findNativeInput().keydown(code));
      },
      submit() {
        wrapper.findPropertySubmitButton()!.click();
      },
      cancel() {
        wrapper.findPropertyCancelButton()!.click();
      },
      selectByValue(value: null | string) {
        wrapper.selectSuggestionByValue(value as any);
      },
      selectAll() {
        wrapper
          .findDropdown()
          .findOpenDropdown()!
          .findByClassName(selectableStyles['selectable-item'])!
          .fireEvent(new MouseEvent('mouseup', { bubbles: true }));
      },
      dropdown() {
        return !!wrapper.findDropdown().findOpenDropdown();
      },
      status() {
        return wrapper.findDropdown().findFooterRegion()?.getElement().textContent ?? '';
      },
      options() {
        const enteredTextOption = wrapper.findEnteredTextOption()?.getElement().textContent;
        const otherOptions = printOptions(wrapper);
        return [enteredTextOption, ...otherOptions].filter(Boolean);
      },
    },
    tokens: {
      token(index = 1) {
        const token = wrapper.findTokens()[index - 1];
        return {
          nested(index = 1) {
            const nested = token.findGroupTokens()[index - 1];
            return {
              operation(value: 'and' | 'or') {
                nested.findTokenOperation()!.openDropdown();
                nested.findTokenOperation()?.selectOptionByValue(value);
              },
            };
          },
          operation(value: 'and' | 'or') {
            token.findTokenOperation()!.openDropdown();
            token.findTokenOperation()?.selectOptionByValue(value);
          },
        };
      },
      list() {
        return wrapper.findTokens().map(w => {
          const operation = w.findTokenOperation()?.find('button')?.getElement().textContent;
          const value = w.findLabel()?.getElement().textContent;
          const nested = w
            .findGroupTokens()
            .map(w => {
              const operation = w.findTokenOperation()?.find('button')?.getElement().textContent;
              const value = w.findLabel()?.getElement().textContent;
              return [operation, value].filter(Boolean).join(' ');
            })
            .join(' ');
          return [operation, value, nested].filter(Boolean).join(' ');
        });
      },
    },
    editor: {
      dropdown() {
        return !!findEditorDropdown();
      },
      open(index: number) {
        const token = wrapper.findTokens()[index - 1];
        const target = token.findEditButton() ?? token.findLabel();
        target.click();
      },
      property(fieldIndex = 1) {
        const select = findControl(fieldIndex, 'property').findSelect()!;
        return {
          open() {
            dropdownOpen(select);
          },
          value(option: null | string) {
            dropdownOpen(select);
            select.selectOptionByValue(option as any);
          },
          options() {
            dropdownOpen(select);
            return printOptions(select);
          },
        };
      },
      operator(fieldIndex = 1) {
        const select = findControl(fieldIndex, 'operator').findSelect()!;
        return {
          open() {
            dropdownOpen(select);
          },
          value(option: null | string) {
            dropdownOpen(select);
            select.selectOptionByValue(option as any);
          },
          options() {
            dropdownOpen(select);
            return printOptions(select);
          },
        };
      },
      value(fieldIndex = 1) {
        return {
          autosuggest() {
            const autosuggest = findControl(fieldIndex, 'value').findAutosuggest()!;
            return {
              focus() {
                autosuggest.focus();
              },
              option(value: string) {
                autosuggest.focus();
                autosuggest.selectSuggestionByValue(value);
              },
              input(text: string) {
                autosuggest.setInputValue(text);
              },
              options() {
                return printOptions(autosuggest);
              },
            };
          },
          multiselect() {
            const multiselect = findControl(fieldIndex, 'value').findMultiselect()!;
            return {
              open() {
                dropdownOpen(multiselect);
              },
              filter(text: string) {
                dropdownOpen(multiselect);
                multiselect.findFilteringInput()!.setInputValue(text);
              },
              value(options: (null | string)[]) {
                dropdownOpen(multiselect);
                options.forEach(option => multiselect.selectOptionByValue(option as any));
              },
              options() {
                dropdownOpen(multiselect);
                return printOptions(multiselect);
              },
            };
          },
          dateInput() {
            const dateInput = findControl(fieldIndex, 'value').findDateInput()!;
            return {
              value(value: string) {
                dateInput.setInputValue(value);
              },
            };
          },
        };
      },
      remove(rowIndex: number) {
        findEditorDropdown().findTokenRemoveActions(rowIndex)!.openDropdown();
        findEditorDropdown().findTokenRemoveActions(rowIndex)!.findItemById('remove')!.click();
      },
      addFilter() {
        findEditorDropdown().findTokenAddActions()!.findMainAction()!.click();
      },
      submit() {
        findEditorDropdown().findSubmitButton()!.click();
      },
      cancel() {
        findEditorDropdown().findCancelButton()!.click();
      },
      form() {
        const dropdown = findEditorDropdown();
        const rows: string[] = [];
        for (let index = 1; index <= 10; index++) {
          const property = printField(dropdown.findPropertyField(index), 'property');
          const operator = printField(dropdown.findOperatorField(index), 'operator');
          const value = printField(dropdown.findValueField(index), 'value');
          if (property || operator || value) {
            rows.push([property, operator, value].join(' '));
          } else {
            break;
          }
        }
        return rows;
      },
    },
  };
}

function dropdownOpen(wrapper: SelectWrapper | MultiselectWrapper) {
  if (!wrapper.findDropdown().findOpenDropdown()) {
    wrapper.openDropdown();
  }
}

function printOptions(wrapper: AutosuggestWrapper | SelectWrapper | MultiselectWrapper) {
  const options = wrapper
    .findDropdown()
    .findOptions()
    .flatMap(w => {
      const selectOptions = w.findAllByClassName(itemStyles['option-content']);
      const options = selectOptions.length > 0 ? selectOptions : [w];
      return options.map(w => w.getElement().textContent);
    });
  return options.filter(Boolean);
}

function printField(wrapper: null | FormFieldWrapper, type: 'property' | 'operator' | 'value') {
  if (!wrapper) {
    return null;
  }
  const headers = createWrapper().findAllByClassName(propertyFilterStyles['token-editor-grid-header']);
  const header = headers[['property', 'operator', 'value'].indexOf(type)];
  const formFieldLabel = wrapper.findLabel()?.getElement().textContent ?? header?.getElement().textContent;
  const autosuggest = wrapper.findControl()!.findAutosuggest();
  const dateInput = wrapper.findControl()?.findDateInput();
  if (autosuggest || dateInput) {
    const input = autosuggest?.findNativeInput() ?? dateInput?.findNativeInput();
    const value = input!.getElement().value;
    return `${formFieldLabel}[${value}]`;
  }
  const select = wrapper.findControl()!.findSelect();
  if (select) {
    const value = select.getElement().textContent;
    return `${formFieldLabel}[${value}]`;
  }
  const multiselect = wrapper.findControl()!.findMultiselect();
  if (multiselect) {
    const tokens = multiselect.findAllByClassName(tokenStyles.root);
    const value = tokens.map(w => w.getElement().textContent).join(', ');
    return `${formFieldLabel}[${value}]`;
  }
  return `${formFieldLabel}[]`;
}
