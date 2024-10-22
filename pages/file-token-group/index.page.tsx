// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import FileTokenGroup, { FileTokenGroupProps } from '~components/file-token-group';

import ScreenshotArea from '../utils/screenshot-area';

const file = new File([new Blob(['demo content 1'])], 'demo file 1', { type: 'image/*' });

const generateItems = (numberOfItems: number) => {
  return [...new Array(numberOfItems)].map((item, index) => ({
    file,
    disabled: index === 1,
  })) as FileTokenGroupProps.Item[];
};

export default function FileTokenGroupPage() {
  const [items, setItems] = useState(generateItems(3));

  const onDismiss = (event: { detail: { fileIndex: number } }) => {
    const newItems = [...items];
    newItems.splice(event.detail.fileIndex, 1);
    setItems(newItems);
  };

  return (
    <>
      <h1>Token Group integration test page</h1>
      <ScreenshotArea>
        <input className="focus-element" aria-label="focus element" />
        <FileTokenGroup
          alignment="vertical"
          items={items}
          onDismiss={onDismiss}
          i18nStrings={{
            removeFileAriaLabel: index => `Remove item ${index + 1}`,
            limitShowFewer: 'Show fewer',
            limitShowMore: 'Show more',
          }}
          id="test"
        />
      </ScreenshotArea>
    </>
  );
}
