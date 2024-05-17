// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { ButtonGroupProps, ItemProps } from '../interfaces.js';
import { InternalButton } from '../../button/internal.js';
import { ClickDetail, fireCancelableEvent } from '../../internal/events/index.js';
import styles from './styles.css.js';

export default function ItemElement({ item, onItemClick }: ItemProps) {
  if (item.type === 'divider') {
    return <DividerItemElement />;
  } else if (item.type === 'icon-button') {
    return <IconButtonItemElement item={item} onItemClick={onItemClick} />;
  }

  throw new Error('Unsupported item type.');
}

function DividerItemElement() {
  return <div className={styles.divider} />;
}

function IconButtonItemElement({
  item,
  onItemClick,
}: {
  item: ButtonGroupProps.IconButton;
  onItemClick?: (event: CustomEvent) => void;
}) {
  const onClickHandler = (event: CustomEvent<ClickDetail>) => {
    if (onItemClick) {
      fireCancelableEvent(onItemClick, { id: item.id }, event);
    }
  };

  return (
    <>
      <InternalButton
        variant="icon"
        disabled={item.disabled}
        iconName={item.iconName}
        iconAlt={item.tooltipText}
        iconSvg={item.iconSvg}
        ariaLabel={item.text}
        onClick={event => onClickHandler(event)}
      />
    </>
  );
}
