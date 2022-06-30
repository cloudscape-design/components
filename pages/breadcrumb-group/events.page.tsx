// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import BreadcrumbGroup, { BreadcrumbGroupProps } from '~components/breadcrumb-group';
import ScreenshotArea from '../utils/screenshot-area';
const items = ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth'];

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
  return (
    <ScreenshotArea disableAnimations={true}>
      <article>
        <h1>BreadcrumbGroup variations</h1>
        <BreadcrumbGroup
          ariaLabel="Navigation"
          expandAriaLabel="Show path"
          items={items.map(text => ({ text, href: `#` }))}
          onFollow={onFollowCallback}
          onClick={onClickCallback}
        />
        <div />
        <div id="onFollowMessage">{onFollowMessage}</div>
        <div id="onClickMessage">{onClickMessage}</div>
      </article>
    </ScreenshotArea>
  );
}
