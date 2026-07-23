// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Button from '../../button/internal';
import InternalLiveRegion from '../../live-region/internal';
import SpaceBetween from '../../space-between/internal';
import { TableProps } from '../interfaces';

import styles from './styles.css.js';

interface RowEditActionCellProps<ItemType> {
  item: ItemType;
  isEditing: boolean;
  isLoading: boolean;
  ariaLabels: TableProps['ariaLabels'];
  disabledReason?: string;
  onEditStart: () => void;
  onSave: () => void;
  onCancel: () => void;
}

export function RowEditActionCell<ItemType>({
  item,
  isEditing,
  isLoading,
  ariaLabels,
  disabledReason,
  onEditStart,
  onSave,
  onCancel,
}: RowEditActionCellProps<ItemType>) {
  return (
    <td className={styles['row-edit-action-cell']}>
      {isEditing ? (
        <SpaceBetween direction="horizontal" size="xxs">
          {!isLoading && (
            <Button
              ariaLabel={ariaLabels?.cancelRowEditLabel?.(item)}
              formAction="none"
              iconName="close"
              variant="inline-icon"
              onClick={onCancel}
            />
          )}
          <Button
            ariaLabel={ariaLabels?.submitRowEditLabel?.(item)}
            formAction="none"
            iconName="check"
            variant="inline-icon"
            loading={isLoading}
            onClick={onSave}
          />
          <InternalLiveRegion tagName="span" hidden={true}>
            {isLoading ? ariaLabels?.submittingRowEditText?.(item) : ''}
          </InternalLiveRegion>
        </SpaceBetween>
      ) : (
        <Button
          ariaLabel={ariaLabels?.activateRowEditLabel?.(item)}
          formAction="none"
          iconName="edit"
          variant="inline-icon"
          disabled={!!disabledReason}
          onClick={onEditStart}
        />
      )}
    </td>
  );
}
