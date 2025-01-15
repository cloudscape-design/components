// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import clsx from 'clsx';

import { Box, Container, SpaceBetween } from '~components';
import DragHandle from '~components/internal/components/drag-handle';
import SortableArea from '~components/internal/components/sortable-area';

import { ArrowButtons, i18nStrings } from './commons';

import styles from './styles.scss';

interface Item {
  id: string;
  title: string;
  content: React.ReactNode;
}

export function ReorderableContainers({
  items,
  onReorder,
  disabledUp,
  disabledDown,
  onMoveUp,
  onMoveDown,
}: {
  items: readonly Item[];
  onReorder: (items: readonly Item[]) => void;
  disabledUp?: (item: Item) => boolean;
  disabledDown?: (item: Item) => boolean;
  onMoveUp: (item: Item) => void;
  onMoveDown: (item: Item) => void;
}) {
  return (
    <SortableArea
      items={items}
      itemDefinition={{
        id: item => item.id,
        label: item => item.title,
        borderRadius: 'container',
      }}
      onItemsChange={({ detail }) => onReorder(detail.items)}
      renderItem={({ item, ref, className, style, dragHandleProps }) => (
        <div ref={ref} className={clsx(className, styles.container)} style={style}>
          <Container
            header={
              <SpaceBetween size="xs" direction="horizontal" alignItems="center">
                <DragHandle {...dragHandleProps} />
                <Box variant="h2">{item.title}</Box>
                <ArrowButtons
                  disabledUp={disabledUp?.(item)}
                  disabledDown={disabledDown?.(item)}
                  onMoveUp={() => onMoveUp(item)}
                  onMoveDown={() => onMoveDown(item)}
                />
              </SpaceBetween>
            }
          >
            {item.content}
          </Container>
        </div>
      )}
      i18nStrings={i18nStrings}
    />
  );
}
