// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { ForwardedRef, forwardRef } from 'react';
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import { useUniqueId } from '@dnd-kit/utilities';
import clsx from 'clsx';

import { Box, SpaceBetween } from '~components';
import { DndContainer } from '~components/internal/components/dnd-container';
import DragHandle from '~components/internal/components/drag-handle';

import { Instance } from '../table/generate-data';
import { DnsName, i18nStrings, Status } from './commons';

import styles from './styles.scss';

interface OptionProps<Option> {
  ref?: ForwardedRef<HTMLDivElement>;
  option: Option;
  dragHandleAriaLabel?: string;
  listeners?: SyntheticListenerMap;
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
    <DndContainer
      options={sortableOptions}
      getOptionId={option => option.id}
      onReorder={sortedOptions => onReorder([...staticOptions, ...sortedOptions])}
      renderOption={props => {
        if (props.isActive) {
          return <Box>{renderOption(props)}</Box>;
        }
        return (
          <li
            className={clsx(props.isDragging && styles.placeholder, props.isSorting && styles.sorting)}
            style={props.style}
          >
            {renderOption(props)}
          </li>
        );
      }}
      renderContent={content => (
        <ul className={styles.list} aria-label="re-orderable list" role="list">
          {staticOptions.map(option => (
            <li key={option.id}>{renderStaticOption?.(option)}</li>
          ))}
          {content}
        </ul>
      )}
      i18nStrings={i18nStrings}
    />
  );
}

export const InstanceOption = forwardRef(
  (
    {
      dragHandleAriaLabel,
      listeners,
      option,
      sortable = true,
    }: { dragHandleAriaLabel?: string; listeners?: SyntheticListenerMap; option: Instance; sortable?: boolean },
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    const idPrefix = useUniqueId('option');
    const controlId = `${idPrefix}-control-${option.id}`;
    const dragHandleAttributes = {
      ['aria-label']: [dragHandleAriaLabel, option.id].join(', '),
    };
    return (
      <div ref={ref} className={styles['option-body']}>
        <DragHandle attributes={dragHandleAttributes} listeners={listeners} disabled={!sortable} />

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
