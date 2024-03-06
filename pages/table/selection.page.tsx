// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useState } from 'react';
import SpaceBetween from '~components/space-between';
import Table from '~components/table';
import ScreenshotArea from '../utils/screenshot-area';
import { ariaLabels, createSimpleItems, simpleColumns } from './shared-configs';
import { Checkbox } from '~components';
import AppContext, { AppContextType } from '../app/app-context';

type PageContext = React.Context<
  AppContextType<{
    enableKeyboardNavigation: boolean;
  }>
>;

export default function Page() {
  const { urlParams, setUrlParams } = useContext(AppContext as PageContext);
  return (
    <>
      <h1>Table selection</h1>

      <Checkbox
        checked={urlParams.enableKeyboardNavigation}
        onChange={event => {
          setUrlParams({ enableKeyboardNavigation: event.detail.checked });
          window.location.reload();
        }}
      >
        Keyboard navigation
      </Checkbox>

      <ScreenshotArea disableAnimations={true}>
        <SpaceBetween size="m">
          <MultiSelection />
          <SingleSelection />
        </SpaceBetween>
      </ScreenshotArea>
    </>
  );
}

const MultiSelection = () => {
  const { urlParams } = useContext(AppContext as PageContext);
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
      enableKeyboardNavigation={urlParams.enableKeyboardNavigation}
    />
  );
};

const SingleSelection = () => {
  const { urlParams } = useContext(AppContext as PageContext);
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
      enableKeyboardNavigation={urlParams.enableKeyboardNavigation}
    />
  );
};
