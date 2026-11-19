// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { useUniqueId } from '@dnd-kit/utilities';
import clsx from 'clsx';

import { SpaceBetween } from '~components';
import DragHandle, { DragHandleProps } from '~components/internal/components/drag-handle';
import SortableArea from '~components/internal/components/sortable-area';

import { Instance } from '../table/generate-data';
import { DnsName, i18nStrings, Status } from './commons';

import styles from './styles.scss';

export function ReorderableList({
  options,
  onReorder,
  fixedOptionsStart = 0,
}: {
  options: readonly Instance[];
  onReorder: (options: readonly Instance[]) => void;
  fixedOptionsStart?: number;
}) {
  const staticOptions = options.slice(0, fixedOptionsStart);
  const sortableOptions = options.slice(fixedOptionsStart);
  return (
    <ul className={styles.list} aria-label="re-orderable list" role="list">
      {staticOptions.map(option => (
        <li key={option.id}>
          <InstanceOption option={option} />
        </li>
      ))}
      <SortableArea
        items={sortableOptions}
        itemDefinition={{ id: option => option.id, label: option => option.id }}
        onItemsChange={({ detail }) => onReorder([...staticOptions, ...detail.items])}
        renderItem={({ item, ref, className, style, dragHandleProps, ...props }) => {
          className = clsx(className, styles.option, props.isSortingActive && styles.sorting);
          return (
            <li ref={ref} className={className} style={style}>
              <InstanceOption dragHandleProps={dragHandleProps} option={item} />
            </li>
          );
        }}
        i18nStrings={i18nStrings}
      />
    </ul>
  );
}

function InstanceOption({ dragHandleProps, option }: { dragHandleProps?: DragHandleProps; option: Instance }) {
  const idPrefix = useUniqueId('option');
  const controlId = `${idPrefix}-control-${option.id}`;
  return (
    <div className={styles['option-body']}>
      {dragHandleProps ? <DragHandle {...dragHandleProps} /> : <DragHandle ariaLabel="" disabled={true} />}

      <SpaceBetween size="s">
        <SpaceBetween size="s" direction="horizontal">
          <div style={{ width: 120 }}>
            <label className={styles['option-label']} htmlFor={controlId}>
              {option.id}
            </label>
          </div>
          <div style={{ width: 120 }}>{option.type}</div>
          <div style={{ width: 120 }}>
            <Status {...option} />
          </div>
        </SpaceBetween>

        <DnsName {...option} />
      </SpaceBetween>
    </div>
  );
}
