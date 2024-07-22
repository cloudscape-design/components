// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useMemo, useState } from 'react';

import { Box, FormField, Input, InputProps, NonCancelableCustomEvent } from '~components';
import AttributeEditor, { AttributeEditorProps } from '~components/attribute-editor';

interface Tag {
  key?: string;
  value?: string;
}

interface ControlProps extends InputProps {
  index: number;
  setItems?: any;
  prop: keyof Tag;
}

const i18nStrings = {
  addButtonText: 'Add new user',
  removeButtonText: 'Remove',
  empty: 'No secondary owners assigned to this resource.',
};

const Control = React.memo(({ value, index, setItems, prop }: ControlProps) => {
  return (
    <Input
      value={value}
      ariaLabel="Secondary owner username"
      ariaLabelledby=""
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
  const [items, setItems] = useState<Tag[]>([{ key: '' }]);

  const definition: AttributeEditorProps.FieldDefinition<Tag>[] = useMemo(
    () => [
      {
        control: ({ key = '' }, itemIndex) => <Control prop="key" value={key} index={itemIndex} setItems={setItems} />,
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

  return (
    <Box margin="xl">
      <h1>Attribute Editor - Using a form field label</h1>
      <FormField label="Secondary owners" description="Secondary owners can edit this profile.">
        <AttributeEditor
          {...i18nStrings}
          items={items}
          definition={definition}
          onAddButtonClick={onAddButtonClick}
          onRemoveButtonClick={onRemoveButtonClick}
        />
      </FormField>
    </Box>
  );
}
