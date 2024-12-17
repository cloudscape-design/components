// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { ForwardedRef, forwardRef } from 'react';
import { useUniqueId } from '@dnd-kit/utilities';
import clsx from 'clsx';

import { Box, SpaceBetween } from '~components';
import { DndArea } from '~components/internal/components/dnd-area';
import DragHandle, { DragHandleProps } from '~components/internal/components/drag-handle';

import { Instance } from '../table/generate-data';
import { DnsName, i18nStrings, Status } from './commons';

import styles from './styles.scss';

interface OptionProps<Option> {
  ref?: ForwardedRef<HTMLDivElement>;
  option: Option;
  dragHandleAttributes: DragHandleProps['attributes'];
  dragHandleListeners?: DragHandleProps['listeners'];
}

export function ReorderableList<Option extends { id: string }>({
  options,
  onReorder,
  renderOption,
  renderStaticOption,
  fixedOptionsStart = 0,
}: {
  options: readonly Option[];
  onReorder: (options: readonly Option[]) => void;
  renderOption: (props: OptionProps<Option>) => React.ReactNode;
  renderStaticOption: (option: Option) => React.ReactNode;
  fixedOptionsStart?: number;
}) {
  const staticOptions = options.slice(0, fixedOptionsStart);
  const sortableOptions = options.slice(fixedOptionsStart);
  return (
    <ul className={styles.list} aria-label="re-orderable list" role="list">
      {staticOptions.map(option => (
        <li key={option.id}>{renderStaticOption?.(option)}</li>
      ))}
      <DndArea
        items={sortableOptions.map(option => ({ id: option.id, label: option.id, data: option }))}
        onItemsChange={items => onReorder([...staticOptions, ...items.map(item => item.data)])}
        renderItem={props => {
          const className = clsx(props.isDragging && styles.placeholder, props.isSorting && styles.sorting);
          const content = renderOption({ ...props, option: props.item.data });
          return props.isActive ? (
            <Box>{content}</Box>
          ) : (
            <li className={className} style={props.style}>
              {content}
            </li>
          );
        }}
        i18nStrings={i18nStrings}
      />
    </ul>
  );
}

export const InstanceOption = forwardRef(
  (
    {
      dragHandleAttributes,
      dragHandleListeners,
      option,
      sortable = true,
    }: {
      dragHandleAttributes?: DragHandleProps['attributes'];
      dragHandleListeners?: DragHandleProps['listeners'];
      option: Instance;
      sortable?: boolean;
    },
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    const idPrefix = useUniqueId('option');
    const controlId = `${idPrefix}-control-${option.id}`;
    return (
      <div ref={ref} className={styles['option-body']}>
        <DragHandle
          attributes={{
            ...dragHandleAttributes,
            ['aria-disabled']: !sortable,
          }}
          listeners={dragHandleListeners}
        />

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
);
