// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';
import clsx from 'clsx';

import { Box, Checkbox, Flashbar as BaseFlashbar, FlashbarProps as BaseFlashbarProps } from '~components';

import styles from './flashbar.scss';

export type FlashbarItem =
  | BaseFlashbarProps.MessageDefinition
  | {
      type: 'gen-ai';
      id: string;
      header: React.ReactNode;
      content: React.ReactNode;
      onDismiss?: () => void;
    };

export interface FlashbarProps extends Omit<BaseFlashbarProps, 'items'> {
  items: ReadonlyArray<FlashbarItem>;
}

export function Flashbar({ items, ...rest }: FlashbarProps) {
  const [hideNextTime, setHideNextTime] = useState(false);

  const flashItems: BaseFlashbarProps.MessageDefinition[] = items.map(item => {
    if (item.type !== 'gen-ai') {
      return item;
    }
    return {
      ...item,
      type: 'info',
      __genai: true,
      dismissible: true,
      content: (
        <Box color="inherit">
          {item.content}
          <Box margin={{ top: 'xs' }}>
            <Checkbox
              checked={hideNextTime}
              onChange={({ detail }) => setHideNextTime(detail.checked)}
              classNames={{ control: styles['checkbox-control'], label: styles['checkbox-label'] }}
            >
              {`Don't show this again`}
            </Checkbox>
          </Box>
        </Box>
      ),
    };
  });

  return (
    <BaseFlashbar
      {...rest}
      items={flashItems}
      classNames={{
        item: ({ item }) =>
          clsx(styles.item, {
            [styles['item-error']]: item.type === 'error',
            [styles['item-genai']]: (item as any).__genai,
            [styles['item-genai-hide']]: (item as any).__genai && hideNextTime,
          }),
        dismissButton: styles.dismiss,
        notificationBar: styles['notification-bar'],
      }}
    />
  );
}
