// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';

import { Box, ButtonDropdown, ButtonDropdownProps, Input, InputProps, Link } from '~components';
import AttributeEditor, { AttributeEditorProps } from '~components/attribute-editor';

interface Tag {
  key?: string;
  value?: string;
}

interface ControlProps extends InputProps {
  index: number;
  setItems: React.Dispatch<React.SetStateAction<Tag[]>>;
  prop: keyof Tag;
}

const labelProps = {
  addButtonText: 'Add new item',
  removeButtonText: 'Remove',
  empty: 'No tags associated to the resource',
  i18nStrings: { itemRemovedAriaLive: 'An item was removed.' },
} as AttributeEditorProps<unknown>;

const tagLimit = 50;

const Control = React.memo(
  React.forwardRef<HTMLInputElement, ControlProps>(({ value, index, setItems, prop }, ref) => {
    return (
      <Input
        ref={ref}
        value={value}
        onChange={({ detail }) => {
          setItems(items => {
            const updatedItems = [...items];
            updatedItems[index] = { ...updatedItems[index], [prop]: detail.value };
            return updatedItems;
          });
        }}
      />
    );
  })
);

export default function AttributeEditorPage() {
  const [items, setItems] = useState<Tag[]>([
    { key: 'bla', value: 'foo' },
    { key: 'bar', value: 'yam' },
  ]);
  const ref = useRef<AttributeEditorProps.Ref>(null);

  const definition: AttributeEditorProps.FieldDefinition<Tag>[] = useMemo(
    () => [
      {
        label: 'Key label',
        info: <Link variant="info">Info</Link>,
        control: ({ key = '' }, itemIndex) => (
          <Control
            prop="key"
            value={key}
            index={itemIndex}
            setItems={setItems}
            ref={ref => (keyInputRefs.current[itemIndex] = ref)}
          />
        ),
      },
      {
        label: 'Value label',
        info: <Link variant="info">Info</Link>,
        control: ({ value = '' }, itemIndex) => (
          <Control prop="value" value={value} index={itemIndex} setItems={setItems} />
        ),
      },
    ],
    []
  );

  const buttonRefs = useRef<Array<ButtonDropdownProps.Ref | null>>([]);
  const keyInputRefs = useRef<Array<InputProps.Ref | null>>([]);
  const focusEventRef = useRef<() => void>();

  useLayoutEffect(() => {
    focusEventRef.current?.apply(undefined);
    focusEventRef.current = undefined;
  });

  const onAddButtonClick = useCallback(() => {
    setItems(items => {
      const newItems = [...items, {}];
      focusEventRef.current = () => {
        keyInputRefs.current[newItems.length - 1]?.focus();
      };
      return newItems;
    });
  }, []);

  const onRemoveButtonClick = useCallback((itemIndex: number) => {
    setItems(items => {
      const newItems = items.slice();
      newItems.splice(itemIndex, 1);

      if (newItems.length === 0) {
        ref.current?.focusAddButton();
      }
      if (itemIndex === items.length - 1) {
        buttonRefs.current[items.length - 2]?.focus();
      }

      return newItems;
    });
  }, []);
  const moveRow = useCallback((itemIndex: number, direction: string) => {
    const newIndex = direction === 'up' ? itemIndex - 1 : itemIndex + 1;
    setItems(items => {
      const newItems = items.slice();
      newItems.splice(newIndex, 0, newItems.splice(itemIndex, 1)[0]);
      buttonRefs.current[newIndex]?.focusDropdownTrigger();
      return newItems;
    });
  }, []);

  const additionalInfo = useMemo(() => `You can add ${tagLimit - items.length} more tags.`, [items.length]);

  return (
    <Box margin="xl">
      <h1>Attribute Editor - Custom row actions</h1>
      <AttributeEditor<Tag>
        ref={ref}
        {...labelProps}
        additionalInfo={additionalInfo}
        items={items}
        definition={definition}
        onAddButtonClick={onAddButtonClick}
        customRowActions={({ itemIndex }) => (
          <ButtonDropdown
            ref={ref => {
              buttonRefs.current[itemIndex] = ref;
            }}
            items={[
              { text: 'Move up', id: 'up', disabled: itemIndex === 0 },
              { text: 'Move down', id: 'down', disabled: itemIndex === items.length - 1 },
            ]}
            ariaLabel={`More actions for row ${itemIndex + 1}`}
            mainAction={{
              text: 'Delete row',
              ariaLabel: `Delete row ${itemIndex + 1}`,
              onClick: () => onRemoveButtonClick(itemIndex),
            }}
            onItemClick={e => moveRow(itemIndex, e.detail.id)}
          />
        )}
      />
    </Box>
  );
}
