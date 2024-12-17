// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { ForwardedRef, forwardRef } from 'react';
import clsx from 'clsx';

import { Box, Container, SpaceBetween } from '~components';
import { DndArea } from '~components/internal/components/dnd-area';
import DragHandle, { DragHandleProps } from '~components/internal/components/drag-handle';

import { ArrowButtons, i18nStrings } from './commons';

import styles from './styles.scss';

interface OptionProps<Option> {
  ref?: ForwardedRef<HTMLDivElement>;
  option: Option;
  dragHandleAttributes: DragHandleProps['attributes'];
  dragHandleListeners?: DragHandleProps['listeners'];
}

export function ReorderableContainers<Option extends { id: string; title: string }>({
  options,
  onReorder,
  renderOption,
}: {
  options: readonly Option[];
  onReorder: (options: readonly Option[]) => void;
  renderOption: (props: OptionProps<Option>) => React.ReactNode;
}) {
  return (
    <DndArea
      items={options.map(option => ({ id: option.id, label: option.title, data: option }))}
      onItemsChange={items => onReorder(items.map(item => item.data))}
      renderItem={props => {
        const className = clsx(styles.container, props.isDragging && styles.placeholder);
        const content = renderOption({ ...props, option: props.item.data });
        return props.isActive ? (
          <Box>{content}</Box>
        ) : (
          <div className={className} style={props.style}>
            {content}
          </div>
        );
      }}
      i18nStrings={i18nStrings}
      dragOverlayClassName={styles['drag-overlay-container']}
    />
  );
}

export const ContainerWithDragHandle = forwardRef(
  (
    {
      dragHandleAttributes,
      dragHandleListeners,
      option,
      ...arrowButtonsProps
    }: {
      dragHandleAttributes: DragHandleProps['attributes'];
      dragHandleListeners?: DragHandleProps['listeners'];
      option: { id: string; title: string; content: React.ReactNode };
      disabledUp?: boolean;
      disabledDown?: boolean;
      onMoveUp: () => void;
      onMoveDown: () => void;
    },
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    return (
      <div ref={ref} className={styles['container-option']}>
        <Container
          header={
            <SpaceBetween size="xs" direction="horizontal" alignItems="center">
              <DragHandle attributes={dragHandleAttributes} listeners={dragHandleListeners} />
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
