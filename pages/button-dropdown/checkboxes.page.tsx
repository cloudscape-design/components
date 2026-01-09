// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';

import { Icon } from '~components';
import ButtonDropdown, { ButtonDropdownProps } from '~components/button-dropdown';

import ScreenshotArea from '../utils/screenshot-area';

import styles from './styles.scss';

const getItems = (firstChecked: boolean, secondChecked: boolean, thirdChecked: boolean, fourthChecked: boolean) => {
  const items: ButtonDropdownProps.Items = [
    {
      id: 'id1',
      text: 'Option with checkbox',
      checked: firstChecked,
      itemType: 'checkbox',
    },
    {
      id: 'id2',
      text: 'Disabled option with checkbox',
      disabled: true,
      checked: secondChecked,
      itemType: 'checkbox',
    },
    {
      id: 'id3',
      text: 'Option with checkbox and icon',
      checked: thirdChecked,
      iconName: 'gen-ai',
      itemType: 'checkbox',
    },
    {
      id: 'id4',
      text: 'Disabled option with checkbox and icon',
      disabled: true,
      checked: fourthChecked,
      iconName: 'gen-ai',
      itemType: 'checkbox',
    },
    {
      id: 'id5',
      text: 'Option without checkbox',
    },
    {
      id: 'id6',
      text: 'Disabled option with secondaryText',
      secondaryText: 'This is a secondary text',
      disabled: true,
    },
    {
      id: 'id7',
      text: 'Option with icon and secondaryText',
      iconName: 'gen-ai',
      secondaryText: 'This is a secondary text',
    },
    {
      id: 'id8',
      text: 'Option with checkbox, icon, and secondaryText',
      iconName: 'gen-ai',
      secondaryText: 'This is a secondary text',
      checked: thirdChecked,
      itemType: 'checkbox',
    },
    {
      id: 'id8',
      text: 'Option with checkbox, icon, labelTag, and secondaryText',
      iconName: 'gen-ai',
      secondaryText: 'This is a secondary text',
      checked: thirdChecked,
      itemType: 'checkbox',
      labelTag: 'Ctrl + L',
    },
  ];
  return items;
};

function ButtonDropdownComponent({ variant }: { variant: 'normal' | 'nested' | 'expandable' }) {
  const [firstChecked, setFirstChecked] = React.useState(true);
  const [secondChecked, setSecondChecked] = React.useState(true);
  const [thirdChecked, setThirdChecked] = React.useState(true);
  const [fourthChecked, setFourthChecked] = React.useState(true);

  const onClick = React.useCallback(({ detail }: { detail: ButtonDropdownProps.ItemClickDetails }) => {
    if (detail.checked === undefined) {
      return;
    }
    switch (detail.id) {
      case 'id1':
        setFirstChecked(detail.checked);
        break;

      case 'id2':
        setSecondChecked(detail.checked);
        break;

      case 'id3':
        setThirdChecked(detail.checked);
        break;

      case 'id4':
        setFourthChecked(detail.checked);
        break;
    }
  }, []);
  const renderItem: ButtonDropdownProps.ButtonDropdownItemRenderer = ({ item }) => {
    if (item.type === 'group') {
      return (
        <div
          style={{
            padding: '4px 8px',
            fontWeight: 'bold',
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <span>{item.option.text}</span>
          <div
            style={{
              transform: item.expanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 80ms linear',
            }}
          >
            {item.expandDirection === 'vertical' ? (
              <Icon name="caret-down-filled" />
            ) : (
              <Icon name="caret-right-filled" />
            )}
          </div>
        </div>
      );
    } else if (item.type === 'checkbox') {
      return (
        <div style={{ padding: '4px 8px' }}>
          {item.checked ? <Icon name="check" /> : ''}
          {item.option.text}
        </div>
      );
    } else {
      return <div style={{ padding: '4px 8px' }}>{item.option.text}</div>;
    }
  };

  return (
    <ButtonDropdown
      renderItem={renderItem}
      items={
        variant === 'normal'
          ? getItems(firstChecked, secondChecked, thirdChecked, fourthChecked)
          : [
              { items: getItems(firstChecked, secondChecked, thirdChecked, fourthChecked), text: 'Category' },
              {
                text: 'Non selectable category',
                items: [
                  { text: 'Option 1', id: 'option-1' },
                  { text: 'Option 2', id: 'option-2' },
                ],
              },
            ]
      }
      onItemClick={onClick}
      expandableGroups={variant === 'expandable'}
    >
      {variant}
    </ButtonDropdown>
  );
}

export default function ButtonDropdownPage() {
  return (
    <ScreenshotArea
      disableAnimations={true}
      style={{
        // extra space to include dropdown in the screenshot area
        paddingBottom: 100,
      }}
    >
      <article>
        <h1>ButtonDropdown with checkboxes</h1>
        <div className={styles.container}>
          <ButtonDropdownComponent variant="normal" />
        </div>
        <div className={styles.container}>
          <ButtonDropdownComponent variant="nested" />
        </div>
        <div className={styles.container}>
          <ButtonDropdownComponent variant="expandable" />
        </div>
      </article>
    </ScreenshotArea>
  );
}
