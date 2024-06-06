// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import AttributeEditor, { AttributeEditorProps } from '~components/attribute-editor';
import Input, { InputProps } from '~components/input';
import Link from '~components/link';
import Box from '~components/box';

import { NonCancelableEventHandler } from '~components/internal/events';

interface Item {
  key?: string;
  value?: string;
}

interface StateProps {
  items: Item[];
}

interface OnRemoveClickEvent {
  detail: AttributeEditorProps.RemoveButtonClickDetail;
}

export default class AttributeEditorPage extends React.Component<any, StateProps> {
  private definition: AttributeEditorProps<Item>['definition'];
  private maxItems = 5;

  constructor(props: any) {
    super(props);

    this.onAddButtonClick = this.onAddButtonClick.bind(this);
    this.onRemoveButtonClick = this.onRemoveButtonClick.bind(
      this
    ) as NonCancelableEventHandler<AttributeEditorProps.RemoveButtonClickDetail>;

    const onFieldChange =
      (fieldName: string, index: number) =>
      ({ detail }: { detail: InputProps.ChangeDetail }) => {
        const updatedItem: Item = {
          ...this.state.items[index],
          [fieldName]: detail.value,
        };

        const items = [...this.state.items.slice(0, index), updatedItem, ...this.state.items.slice(index + 1)];
        this.setState({ items });
      };

    this.definition = [
      {
        label: 'Key label',
        info: <Link variant="info">Info</Link>,
        control: (item: Item, itemIndex: number) => (
          <Input value={item.key || ''} onChange={onFieldChange('key', itemIndex)} />
        ),
        errorText: (item: Item) => (item.key && item.key.match(/^AWS/i) ? 'Key cannot start with "AWS"' : null),
        warningText: (item: Item) => (item.key && item.key.includes(' ') ? 'Key has empty characters' : null),
      },
      {
        label: 'Value label',
        info: <Link variant="info">Info</Link>,
        control: (item: Item, itemIndex: number) => (
          <Input value={item.value || ''} onChange={onFieldChange('value', itemIndex)} />
        ),
        errorText: (item: Item) =>
          item.value && item.value.length > 5 ? (
            <span>
              Value {item.value} is longer than 5 characters, <Link variant="info">Info</Link>
            </span>
          ) : null,
        warningText: (item: Item) =>
          item.value && item.value.includes(' ') ? (
            <span>
              Value has empty characters, <Link variant="info">Info</Link>
            </span>
          ) : null,
      },
    ];

    this.state = {
      items: [
        { key: 'bla', value: 'foo' },
        { key: 'bar', value: 'yam' },
      ],
    };
  }

  onAddButtonClick() {
    this.setState({ items: [...this.state.items, {}] });
  }

  onRemoveButtonClick({ detail }: OnRemoveClickEvent) {
    const { itemIndex } = detail;
    const items = [...this.state.items];
    items.splice(itemIndex, 1);
    this.setState({ items });
  }

  limitReached() {
    return this.state.items.length >= this.maxItems;
  }

  additionalInfo() {
    if (this.limitReached()) {
      return `You have reached the limit of ${this.maxItems} items.`;
    }

    return `You can add up to ${this.maxItems - this.state.items.length} more items.`;
  }

  render() {
    return (
      <Box margin="xl">
        <h1>Attribute Editor</h1>
        <AttributeEditor
          addButtonText="Add new item"
          removeButtonText="Remove"
          empty="No items associated with the resource."
          disableAddButton={this.limitReached()}
          items={this.state.items}
          additionalInfo={this.additionalInfo()}
          definition={this.definition}
          onAddButtonClick={this.onAddButtonClick}
          onRemoveButtonClick={this.onRemoveButtonClick}
        />
      </Box>
    );
  }
}
