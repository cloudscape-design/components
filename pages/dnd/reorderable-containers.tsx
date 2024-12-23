// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { ForwardedRef } from 'react';
import clsx from 'clsx';

import { Box, Container, SpaceBetween } from '~components';
import { DndArea } from '~components/internal/components/dnd-area';
import DragHandle, { DragHandleProps } from '~components/internal/components/drag-handle';

import { ArrowButtons, i18nStrings } from './commons';

import styles from './styles.scss';

interface OptionProps<Option> {
  ref?: ForwardedRef<HTMLDivElement>;
  option: Option;
  dragHandleProps: DragHandleProps;
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
      renderItem={({ ref, className, style, ...props }) => {
        const content = renderOption({ ...props, option: props.item.data });
        return (
          <div ref={ref} className={clsx(styles.container, className)} style={style}>
            {content}
          </div>
        );
      }}
      i18nStrings={i18nStrings}
    />
  );
}

export const ContainerWithDragHandle = ({
  dragHandleProps,
  option,
  ...arrowButtonsProps
}: {
  dragHandleProps: DragHandleProps;
  option: { id: string; title: string; content: React.ReactNode };
  disabledUp?: boolean;
  disabledDown?: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) => {
  return (
    <Container
      header={
        <SpaceBetween size="xs" direction="horizontal" alignItems="center">
          <DragHandle {...dragHandleProps} />
          <Box variant="h2">{option.title}</Box>
          <ArrowButtons {...arrowButtonsProps} />
        </SpaceBetween>
      }
    >
      {option.content}
    </Container>
  );
};
