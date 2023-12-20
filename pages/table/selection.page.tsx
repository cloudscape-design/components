// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import SpaceBetween from '~components/space-between';
import Table from '~components/table';
import ScreenshotArea from '../utils/screenshot-area';
import { ariaLabels, createSimpleItems, simpleColumns } from './shared-configs';

export default function () {
  return (
    <>
      <h1>Table selection</h1>
      <ScreenshotArea>
        <SpaceBetween size="m">
          <MultiSelection />
          <SingleSelection />
        </SpaceBetween>
      </ScreenshotArea>
    </>
  );
}

const MultiSelection = () => {
  const [selectedItems, setSelectedItems] = useState([{ number: 2, text: 'Two' }]);
  return (
    <Table
      columnDefinitions={simpleColumns}
      items={createSimpleItems(3)}
      selectionType={'multi'}
      selectedItems={selectedItems}
      trackBy={'text'}
      onSelectionChange={({ detail: { selectedItems } }) => setSelectedItems(selectedItems)}
      isItemDisabled={({ text }) => text === 'Two'}
      ariaLabels={ariaLabels}
    />
  );
};

const SingleSelection = () => {
  const [selectedItems, setSelectedItems] = useState([{ number: 1, text: 'One' }]);
  return (
    <Table
      columnDefinitions={simpleColumns}
      items={createSimpleItems(3)}
      selectionType={'single'}
      selectedItems={selectedItems}
      trackBy={'text'}
      onSelectionChange={({ detail: { selectedItems } }) => setSelectedItems(selectedItems)}
      ariaLabels={ariaLabels}
    />
  );
};
