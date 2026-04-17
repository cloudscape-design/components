// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import ButtonDropdown, { ButtonDropdownProps } from '~components/button-dropdown';
import SpaceBetween from '~components/space-between';

import { SimplePage } from '../app/templates';

import './css-style-api.css';

const items: ButtonDropdownProps['items'] = [
  { id: 'launch', text: 'Launch instance' },
  { id: 'stop', text: 'Stop instance' },
  {
    text: 'Networking',
    items: [
      { id: 'attach-eni', text: 'Attach network interface' },
      { id: 'detach-eni', text: 'Detach network interface' },
    ],
  },
  {
    text: 'Storage',
    items: [
      { id: 'attach-vol', text: 'Attach volume' },
      { id: 'detach-vol', text: 'Detach volume', disabled: true },
    ],
  },
];

const mainAction: ButtonDropdownProps['mainAction'] = {
  text: 'Launch instance',
  href: '#',
};

export default function Page() {
  return (
    <SimplePage title="CSS Style API — ButtonDropdown">
      <SpaceBetween size="xl">
        <div>
          <h2>expandToViewport=false</h2>
          <p>Dropdown is rendered inline. Style via root selector.</p>
          <SpaceBetween size="m" direction="horizontal">
            <ButtonDropdown className="custom-button-dropdown" items={items} expandableGroups={true}>
              Actions
            </ButtonDropdown>
            <ButtonDropdown className="custom-button-dropdown" items={items} mainAction={mainAction} variant="primary">
              Actions
            </ButtonDropdown>
          </SpaceBetween>
        </div>

        <div>
          <h2>expandToViewport=true</h2>
          <p>
            Dropdown is rendered in a portal. Use <code>referrerClassName</code> to style the dropdown container.
          </p>
          <SpaceBetween size="m" direction="horizontal">
            <ButtonDropdown
              className="custom-button-dropdown"
              referrerClassName="custom-button-dropdown-portal"
              items={items}
              expandableGroups={true}
              expandToViewport={true}
            >
              Actions
            </ButtonDropdown>
            <ButtonDropdown
              className="custom-button-dropdown"
              referrerClassName="custom-button-dropdown-portal"
              items={items}
              mainAction={mainAction}
              variant="primary"
              expandToViewport={true}
            >
              Actions
            </ButtonDropdown>
          </SpaceBetween>
        </div>
      </SpaceBetween>
    </SimplePage>
  );
}
