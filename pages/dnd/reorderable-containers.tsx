// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { ForwardedRef } from 'react';
import clsx from 'clsx';

import { Box, Container, DragHandle, DragHandleProps, SortableArea, SpaceBetween } from '~components';

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
    <SortableArea
      items={options}
      itemDefinition={{
        id: option => option.id,
        label: option => option.title,
        borderRadius: 'container',
      }}
      onItemsChange={({ detail }) => onReorder(detail.items)}
      renderItem={({ ref, className, style, ...props }) => {
        const content = renderOption({ ...props, option: props.item });
        return (
          <div ref={ref} className={clsx(className, styles.container)} style={style}>
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
