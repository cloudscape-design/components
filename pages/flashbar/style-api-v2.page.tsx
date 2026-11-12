// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { Flashbar, FlashbarProps } from '~components';

import { SimplePage } from '../app/templates';

import styles from './style-api-v2.scss';

const noop = () => void 0;

// One class per message type through the item callback; the collapsed stack applies it to the placeholders too.
const itemClassName = ({ item }: { item: FlashbarProps.MessageDefinition }) =>
  item.loading ? styles['item-loading'] : styles[`item-${item.type ?? 'info'}`];

const dismissible = { dismissible: true, dismissLabel: 'Dismiss', onDismiss: noop };

const itemsByType: FlashbarProps.MessageDefinition[] = [
  { type: 'success', content: 'Instance started.', id: 'success', ...dismissible },
  { type: 'error', content: 'Deployment failed.', id: 'error', ...dismissible },
  { type: 'warning', content: 'Certificate expires soon.', id: 'warning', ...dismissible },
  { type: 'info', content: 'New features available.', id: 'info', ...dismissible },
  { loading: true, content: 'Creating snapshot.', id: 'loading' },
];

export default function () {
  return (
    <SimplePage title="Flashbar - Style API v2" screenshotArea={{ disableAnimations: true }} i18n={{}}>
      <Flashbar
        items={[
          {
            type: 'success',
            header: 'Deployment complete',
            content: 'All 12 instances are running.',
            id: 'item',
            ...dismissible,
          },
        ]}
        {...{ styleClassNames: { item: styles.item, icon: styles.icon, dismissButton: styles['dismiss-button'] } }}
      />
      <Flashbar
        items={itemsByType}
        {...{ styleClassNames: { item: itemClassName, icon: styles.icon, dismissButton: styles['dismiss-button'] } }}
      />
      <Flashbar
        stackItems={true}
        items={itemsByType.slice(0, 3)}
        {...{
          styleClassNames: {
            item: itemClassName,
            icon: styles.icon,
            dismissButton: styles['dismiss-button'],
            notificationBar: styles['notification-bar'],
          },
        }}
      />
    </SimplePage>
  );
}
