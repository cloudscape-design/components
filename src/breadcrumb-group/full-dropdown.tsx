// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { Ref } from 'react';
import clsx from 'clsx';

import { CustomTriggerProps } from '../button-dropdown/interfaces';
import InternalButtonDropdown from '../button-dropdown/internal';
import InternalIcon from '../icon/internal';
import { DATA_ATTR_FUNNEL_KEY, DATA_ATTR_RESOURCE_TYPE, FUNNEL_KEY_FUNNEL_NAME } from '../internal/analytics/selectors';
import { CancelableEventHandler } from '../internal/events';
import { BreadcrumbGroupProps } from './interfaces';

import styles from './styles.css.js';

interface FullCollapsedDropdownProps {
  items: ReadonlyArray<BreadcrumbGroupProps.Item>;
  onClick: CancelableEventHandler<{ id: string }>;
  onFollow: CancelableEventHandler<{ id: string }>;
}

const metadataTypeAttribute = {
  [DATA_ATTR_RESOURCE_TYPE]: 'true',
};

export const FullDropdown = ({ items, onClick, onFollow }: FullCollapsedDropdownProps) => (
  <>
    <InternalButtonDropdown
      items={items.map((item, index) => {
        const isCurrentPage = index === items.length - 1;
        return {
          id: index.toString(),
          text: item.text,
          href: isCurrentPage ? undefined : item.href,
          disabled: isCurrentPage,
          isCurrentPage,
        };
      })}
      className={styles['collapsed-button-dropdown']}
      customTriggerBuilder={getFullDropdownTrigger(items[items.length - 1].text)}
      linkStyle={true}
      onItemClick={onClick}
      onItemFollow={onFollow}
      analyticsMetadataTransformer={metadata => {
        if (metadata.detail?.id) {
          delete metadata.detail.id;
        }
        if (metadata.detail?.position) {
          metadata.detail.position = `${parseInt(metadata.detail.position as string, 10) + 1}`;
        }
        return metadata;
      }}
    />
    {items.length >= 1 && (
      <span className={styles.hidden} {...metadataTypeAttribute}>
        {items[1].text}
      </span>
    )}
  </>
);
const getFullDropdownTrigger =
  (currentPage: string) =>
  ({ ariaLabel, triggerRef, disabled, testUtilsClass, isOpen, onClick }: CustomTriggerProps) => {
    const metadataAttributes = {
      [DATA_ATTR_FUNNEL_KEY]: FUNNEL_KEY_FUNNEL_NAME,
    };
    return (
      <button
        ref={triggerRef as Ref<HTMLButtonElement>}
        {...metadataAttributes}
        className={clsx(styles['collapsed-button'], testUtilsClass)}
        disabled={disabled}
        onClick={event => {
          event.preventDefault();
          onClick();
        }}
        aria-expanded={isOpen}
        aria-haspopup={true}
        aria-label={ariaLabel}
        formAction="none"
      >
        <InternalIcon
          name="caret-down-filled"
          className={isOpen ? styles['button-icon-open'] : styles['button-icon-closed']}
        />
        <span>{currentPage}</span>
      </button>
    );
  };
