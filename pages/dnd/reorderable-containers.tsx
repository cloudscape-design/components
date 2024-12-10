// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { ForwardedRef, forwardRef } from 'react';
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import clsx from 'clsx';

import { Box, Container, SpaceBetween } from '~components';
import { DndContainer } from '~components/internal/components/dnd-container';
import DragHandle from '~components/internal/components/drag-handle';

import { ArrowButtons, i18nStrings } from './commons';

import styles from './styles.scss';

interface OptionProps<Option> {
  ref?: ForwardedRef<HTMLDivElement>;
  option: Option;
  dragHandleAriaLabel?: string;
  listeners?: SyntheticListenerMap;
}

export function ReorderableContainers<Option extends { id: string }>({
  options,
  onChange,
  renderOption,
}: {
  options: readonly Option[];
  onChange: (options: readonly Option[]) => void;
  renderOption: (props: OptionProps<Option>) => React.ReactNode;
}) {
  return (
    <DndContainer
      sortedOptions={options}
      getId={option => option.id}
      onChange={onChange}
      renderOption={props => (
        <div className={clsx(styles.container, props.isDragging && styles.placeholder)} style={props.style}>
          {renderOption(props)}
        </div>
      )}
      renderActiveOption={props => <Box>{renderOption(props)}</Box>}
      i18nStrings={i18nStrings}
      dragOverlayClassName={styles['drag-overlay-container']}
    />
  );
}

export const ContainerWithDragHandle = forwardRef(
  (
    {
      dragHandleAriaLabel,
      listeners,
      option,
      ...arrowButtonsProps
    }: {
      dragHandleAriaLabel?: string;
      listeners?: SyntheticListenerMap;
      option: { id: string; title: string; content: React.ReactNode };
      disabledUp?: boolean;
      disabledDown?: boolean;
      onMoveUp: () => void;
      onMoveDown: () => void;
    },
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    const dragHandleAttributes = {
      ['aria-label']: [dragHandleAriaLabel, option.id].join(', '),
    };
    return (
      <div ref={ref} className={styles['container-option']}>
        <Container
          header={
            <SpaceBetween size="xs" direction="horizontal" alignItems="center">
              <DragHandle attributes={dragHandleAttributes} listeners={listeners} />
              <Box variant="h2">{option.title}</Box>
              <ArrowButtons {...arrowButtonsProps} />
            </SpaceBetween>
          }
        >
          {option.content}
        </Container>
      </div>
    );
  }
);
