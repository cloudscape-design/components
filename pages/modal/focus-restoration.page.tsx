// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { AttributeEditor, Button, Input, Modal, SpaceBetween } from '~components';

interface Item {
  key: string;
  value: string;
}

function createItems() {
  return Array(15)
    .fill(null)
    .map((_, i) => ({ key: `some-key-${i}`, value: `some-value-${i}` }));
}

function Destructible() {
  const [visible, setVisible] = useState(false);
  const [items, setItems] = useState(createItems());
  return (
    <article>
      <Button id="destructible" onClick={() => setVisible(true)}>
        Show destructible modal
      </Button>
      {visible && (
        <Modal visible={true} onDismiss={() => setVisible(false)} closeAriaLabel="Close modal">
          <ItemsForm items={items} setItems={setItems} />
        </Modal>
      )}
    </article>
  );
}

function Controlled() {
  const [visible, setVisible] = useState(false);
  const [items, setItems] = useState(createItems());
  return (
    <article>
      <Button id="controlled" onClick={() => setVisible(true)}>
        Show controlled modal
      </Button>
      <Modal visible={visible} onDismiss={() => setVisible(false)} closeAriaLabel="Close modal">
        <ItemsForm items={items} setItems={setItems} />
      </Modal>
    </article>
  );
}

function ItemsForm({ items, setItems }: { items: Item[]; setItems: (items: Item[]) => void }) {
  return (
    <AttributeEditor
      onAddButtonClick={() => setItems([...items, { key: '', value: '' }])}
      onRemoveButtonClick={({ detail: { itemIndex } }) => {
        const tmpItems = [...items];
        tmpItems.splice(itemIndex, 1);
        setItems(tmpItems);
      }}
      items={items}
      addButtonText="Add new item"
      definition={[
        {
          label: 'Key',
          control: item => <Input value={item.key} onChange={() => undefined} placeholder="Enter key" />,
        },
        {
          label: 'Value',
          control: item => <Input value={item.value} onChange={() => undefined} placeholder="Enter value" />,
        },
      ]}
      removeButtonText="Remove"
      empty="No items associated with the resource."
    />
  );
}

export default function () {
  return (
    <>
      <h1>Destructible modals</h1>
      <SpaceBetween size="m">
        <Destructible />
        <Controlled />
      </SpaceBetween>
    </>
  );
}
