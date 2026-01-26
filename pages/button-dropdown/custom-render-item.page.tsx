// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';

import { Toggle } from '~components';
import ButtonDropdown, { ButtonDropdownProps } from '~components/button-dropdown';

import AppContext, { AppContextType } from '../app/app-context';
import { SimplePage } from '../app/templates';

const itemsWithGroups: ButtonDropdownProps['items'] = [
  {
    id: 'item',
    text: 'Default Item',
    secondaryText: 'Secondary Text',
    labelTag: 'Label Tag',
  },
  {
    id: 'checked-checkbox',
    text: 'Checked Checkbox',
    secondaryText: 'Secondary Text',
    labelTag: 'Label Tag',
    itemType: 'checkbox',
    checked: true,
  },
  {
    id: 'unchecked-checkbox',
    text: 'Unchecked Checkbox',
    secondaryText: 'Secondary Text',
    labelTag: 'Label Tag',
    itemType: 'checkbox',
    checked: false,
  },
  {
    id: 'group',
    text: 'Simple Group',
    items: [
      {
        id: 'option',
        text: 'Option',
      },
      {
        id: 'disabled-option',
        text: 'Disabled Option',
        disabled: true,
      },
      {
        id: 'checked-option',
        text: 'Option Checkbox',
        itemType: 'checkbox',
        checked: true,
      },
      {
        id: 'external-option',
        text: 'External Option',
        secondaryText: '',
        labelTag: 'Ctrl + P',
        external: true,
        href: '/#/light/',
      },
    ],
  },
];

type PageContext = React.Context<
  AppContextType<{
    expandableGroups?: boolean;
  }>
>;

export default function ButtonDropdownPage() {
  const { urlParams, setUrlParams } = React.useContext(AppContext as PageContext);
  const expandableGroups = urlParams.expandableGroups ?? false;

  const renderItem: ButtonDropdownProps.ItemRenderer = ({ item }) => {
    if (item.type === 'group') {
      return <div>Group: {item.option.text}</div>;
    } else if (item.type === 'checkbox') {
      return <div>Checkbox: {item.option.text}</div>;
    } else {
      return <div>Item: {item.option.text}</div>;
    }
  };

  return (
    <SimplePage
      title="Button Dropdown with custom item renderer"
      settings={
        <Toggle
          checked={!!urlParams.expandableGroups}
          onChange={({ detail }) => setUrlParams({ expandableGroups: detail.checked })}
        >
          Expandable Groups
        </Toggle>
      }
      screenshotArea={{
        style: {
          padding: 10,
        },
      }}
    >
      <div style={{ maxInlineSize: '400px', blockSize: '650px' }}>
        <ButtonDropdown items={itemsWithGroups} expandableGroups={expandableGroups} renderItem={renderItem}>
          Expandable Groups
        </ButtonDropdown>
      </div>
    </SimplePage>
  );
}
