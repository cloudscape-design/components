// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState, useCallback, useMemo } from 'react';
import AttributeEditor, { AttributeEditorProps } from '~components/attribute-editor';
import { Box, Input, InputProps, Link, NonCancelableCustomEvent } from '~components';

interface Tag {
  key?: string;
  value?: string;
}

interface ControlProps extends InputProps {
  index: number;
  setItems?: any;
  prop: keyof Tag;
}

const labelProps = {
  addButtonText: 'Add new item',
  removeButtonText: 'Remove',
  empty: 'No tags associated to the resource',
  i18nStrings: { itemRemovedAriaLive: 'An item was removed.' },
} as AttributeEditorProps<unknown>;

const tagLimit = 50;

const Control = React.memo(({ value, index, setItems, prop }: ControlProps) => {
  return (
    <Input
      value={value}
      onChange={({ detail }) => {
        setItems((items: any) => {
          const updatedItems = [...items];
          updatedItems[index] = { ...updatedItems[index], [prop]: detail.value };
          return updatedItems;
        });
      }}
    />
  );
});

export default function AttributeEditorPage() {
  const [items, setItems] = useState<Tag[]>([
    { key: 'bla', value: 'foo' },
    { key: 'bar', value: 'yam' },
  ]);

  const definition: AttributeEditorProps.FieldDefinition<Tag>[] = useMemo(
    () => [
      {
        label: 'Key label',
        info: <Link variant="info">Info</Link>,
        control: ({ key = '' }, itemIndex) => <Control prop="key" value={key} index={itemIndex} setItems={setItems} />,
        errorText: (item: Tag) => (item.key && item.key.match(/^AWS/i) ? 'Key cannot start with "AWS"' : null),
        warningText: (item: Tag) => (item.key && item.key.includes(' ') ? 'Key has empty character' : null),
      },
      {
        label: 'Value label',
        info: <Link variant="info">Info</Link>,
        control: ({ value = '' }, itemIndex) => (
          <Control prop="value" value={value} index={itemIndex} setItems={setItems} />
        ),
        errorText: (item: Tag) =>
          item.value && item.value.length > 5 ? (
            <span>
              Value {item.value} is longer than 5 characters, <Link variant="info">Info</Link>
            </span>
          ) : null,
        warningText: (item: Tag) =>
          item.value && item.value.includes('*') ? (
            <span>
              Value {item.value} includes wildcard, <Link variant="info">Info</Link>
            </span>
          ) : null,
      },
    ],
    []
  );

  const onAddButtonClick = useCallback(() => {
    setItems(items => [...items, {}]);
  }, []);

  const onRemoveButtonClick = useCallback(
    ({ detail: { itemIndex } }: NonCancelableCustomEvent<AttributeEditorProps.RemoveButtonClickDetail>) => {
      setItems(items => {
        const newItems = items.slice();
        newItems.splice(itemIndex, 1);
        return newItems;
      });
    },
    []
  );

  const additionalInfo = useMemo(() => `You can add ${tagLimit - items.length} more tags.`, [items.length]);

  return (
    <Box margin="xl">
      <h1>Attribute Editor - Functional</h1>
      <AttributeEditor<Tag>
        {...labelProps}
        additionalInfo={additionalInfo}
        items={items}
        definition={definition}
        onAddButtonClick={onAddButtonClick}
        onRemoveButtonClick={onRemoveButtonClick}
      />
    </Box>
  );
}
