// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import AttributeEditor, { AttributeEditorProps } from '@cloudscape-design/components/attribute-editor';
import Autosuggest, { AutosuggestProps } from '@cloudscape-design/components/autosuggest';

import validateField from '../form-validation-config';
import { CustomHeader, FormDataAttributesValues, FormRefs } from '../types';

const validateHeader = <T extends keyof CustomHeader>(key: T, value: CustomHeader[T], messageValue: string) => {
  const { warningText, errorText } = validateField('customHeaders', value, messageValue);

  const errorAttribute = key + 'Error';
  const warningAttribute = key + 'Warning';
  return { [errorAttribute]: errorText, [warningAttribute]: warningText };
};

interface HeaderEditorProps {
  data: FormDataAttributesValues;
  setData: (data: Partial<FormDataAttributesValues>) => void;
  validation?: boolean;
  refs?: FormRefs;
}

export default function HeadersEditor({ validation = false, refs, data, setData }: HeaderEditorProps) {
  const { customHeaders: items } = data;

  const onAddHeader: AttributeEditorProps<CustomHeader>['onAddButtonClick'] = () =>
    setData({ customHeaders: [...items, {} as CustomHeader] });

  const onRemoveHeader: AttributeEditorProps<CustomHeader>['onRemoveButtonClick'] = ({ detail: { itemIndex } }) => {
    const itemsCopy = items.slice();
    itemsCopy.splice(itemIndex, 1);
    setData({ customHeaders: itemsCopy });
  };

  const updateItem = (update: Partial<CustomHeader>, item: CustomHeader, index: number) => {
    const itemsCopy = items.slice();
    const updatedItem = { ...item, ...update };
    itemsCopy.splice(index, 1, updatedItem);
    setData({ customHeaders: itemsCopy });
  };

  const onChange = (key: keyof CustomHeader, item: CustomHeader, index: number): AutosuggestProps['onChange'] => {
    return ({ detail }) => {
      let updateObj: Partial<CustomHeader> = { [key]: detail.value };

      if (validation) {
        const keyError = `${key}Error` as keyof CustomHeader;
        const keyWarning = `${key}Warning` as keyof CustomHeader;
        if (keyError || keyWarning) {
          const validationTexts = validateHeader(key, detail.value, key === 'key' ? 'name' : key);
          updateObj = { ...updateObj, ...validationTexts };
        }
      }

      updateItem(updateObj, item, index);
    };
  };

  const onBlur = (key: keyof CustomHeader, item: CustomHeader, index: number) => {
    if (!validation) {
      return;
    }

    const value = item[key];
    const validationTexts = validateHeader(key, value, key === 'key' ? 'name' : key);
    updateItem(validationTexts, item, index);
  };

  const definitions: AttributeEditorProps.FieldDefinition<CustomHeader>[] = [
    {
      label: 'Custom header name',
      control: (item, index) => {
        return (
          <Autosuggest
            placeholder="Enter name"
            clearAriaLabel="Clear"
            empty="No names found"
            onChange={onChange('key', item, index)}
            onBlur={() => onBlur('key', item, index)}
            value={item.key || ''}
            options={[{ value: 'Header-Name-1' }, { value: 'Header-Name-2' }, { value: 'Header-Name-3' }]}
            enteredTextLabel={value => `Use: "${value}"`}
            ariaRequired={true}
          />
        );
      },
      errorText: ({ keyError }) => keyError,
      warningText: ({ keyWarning }) => keyWarning,
    },
    {
      label: 'Custom header value',
      control: (item, index) => {
        return (
          <Autosuggest
            placeholder="Enter value"
            clearAriaLabel="Clear"
            empty="No values found"
            value={item.value || ''}
            onChange={onChange('value', item, index)}
            onBlur={() => onBlur('value', item, index)}
            options={[{ value: 'Value-1' }, { value: 'Value-2' }, { value: 'Value-3' }]}
            enteredTextLabel={value => `Use: "${value}"`}
            ariaRequired={true}
          />
        );
      },
      errorText: ({ valueError }) => valueError,
      warningText: ({ valueWarning }) => valueWarning,
    },
  ];

  return (
    <AttributeEditor
      removeButtonText="Remove"
      addButtonText="Add new header"
      empty="No headers associated with the resource."
      definition={definitions}
      onAddButtonClick={onAddHeader}
      onRemoveButtonClick={onRemoveHeader}
      items={items}
      ref={refs?.customHeaders}
    />
  );
}
