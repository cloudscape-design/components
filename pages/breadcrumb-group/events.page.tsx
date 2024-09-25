// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { SpaceBetween } from '~components';
import BreadcrumbGroup, { BreadcrumbGroupProps } from '~components/breadcrumb-group';

import ScreenshotArea from '../utils/screenshot-area';
const defaultItems = [
  'First that is very very very very very very long long long text',
  'Second',
  'Third',
  'Fourth',
  'Fifth',
  'Sixth that is very very very very very very long long long text',
];

export default function ButtonDropdownPage() {
  const [onFollowMessage, setOnFollowMessage] = useState('');
  const [onClickMessage, setOnClickMessage] = useState('');
  const onFollowCallback = (event: CustomEvent<BreadcrumbGroupProps.ClickDetail>) => {
    setOnFollowMessage(`OnFollow: ${event.detail.text} item was selected`);
    event.preventDefault(); // prevent reloading to see updated message
  };
  const onClickCallback = (event: CustomEvent<BreadcrumbGroupProps.ClickDetail>) => {
    setOnClickMessage(`OnClick: ${event.detail.text} item was selected`);
  };
  const [items, setItems] = useState(defaultItems);
  return (
    <ScreenshotArea disableAnimations={true}>
      <article>
        <h1>BreadcrumbGroup variations</h1>
        <SpaceBetween size="xxl">
          <div>
            <button type="button" id="focus-target-long-text">
              focus long text
            </button>
            <BreadcrumbGroup
              ariaLabel="Navigation long text"
              expandAriaLabel="Show path for long text"
              items={items.map(text => ({ text, href: `#` }))}
              onFollow={onFollowCallback}
              onClick={onClickCallback}
            />
            <div id="onFollowMessage">{onFollowMessage}</div>
            <div id="onClickMessage">{onClickMessage}</div>
          </div>
          <div>
            <button type="button" id="focus-target-short-text">
              focus short text
            </button>
          </div>
          <button type="button" id="add" onClick={() => setItems([...items, defaultItems[5]])}>
            Add
          </button>
          <button type="button" id="remove" onClick={() => setItems(items.slice(0, items.length - 1))}>
            Remove
          </button>
        </SpaceBetween>
      </article>
    </ScreenshotArea>
  );
}
