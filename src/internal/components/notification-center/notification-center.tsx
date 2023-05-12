// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';
import { ToastProps } from './interface';
// eslint-disable-next-line @cloudscape-design/ban-files
import Tabs from '../../../tabs';
import InternalHeader from '../../../header/internal';
import InternalIcon from '../../../icon/internal';
import SpaceBetween from '../../../space-between/internal';
import InternalBox from '../../../box/internal';
import Icon from '../../../icon/internal';
import styles from './styles.css.js';
// eslint-disable-next-line @cloudscape-design/ban-files
import CollectionPreferences from '../../../collection-preferences';

const ICON_TYPES = {
  success: 'status-positive',
  warning: 'status-warning',
  info: 'status-info',
  error: 'status-negative',
} as const;

const Toast = ({ message, createdAt }: ToastProps) => {
  const { type, title, content } = message;
  const iconType = ICON_TYPES[type];
  const creation = new Date(createdAt);

  return (
    <div className={clsx(styles.toast, styles[`toast-type-${type}`])}>
      <div className={styles['toast-body']}>
        <div className={styles['toast-focus-container']} tabIndex={-1}>
          <div className={clsx(styles['toast-icon'], styles['toast-text'])} role="img">
            <InternalIcon name={iconType} />
          </div>
          <div className={clsx(styles['toast-message'], styles['toast-text'])}>
            <div className={styles['toast-header']}>{title}</div>
            <div className={styles['toast-content']}>{content}</div>
            <div className={styles['toast-time']}>{creation.toISOString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface NotificationsProps {
  messages: Array<ToastProps>;
}
const Notifications = ({ messages }: NotificationsProps) => {
  return (
    <SpaceBetween size={'m'}>
      {messages.map(message => (
        <Toast key={message.id} {...message} />
      ))}
    </SpaceBetween>
  );
};

function TabTitle({ type, count }: { type: any; count: number }) {
  return (
    <SpaceBetween size="xxs" direction="horizontal">
      <Icon name={type} />
      {count}
    </SpaceBetween>
  );
}

export const Center = ({ messages }: NotificationsProps) => {
  const successMessages = messages.filter(message => message.message.type === 'success');
  const errorMessages = messages.filter(message => message.message.type === 'error');
  const warningMessages = messages.filter(message => message.message.type === 'warning');
  const infoMessages = messages.filter(message => message.message.type === 'info');

  const preferencesComponent = (
    <CollectionPreferences
      cancelLabel="Cancel"
      confirmLabel="Confirm"
      title="Notification preferences"
      pageSizePreference={{
        title: 'Toast fade out time',
        options: [
          { value: 3, label: 'After 3 sec' },
          { value: 5, label: 'After 5 sec' },
          { value: 10, label: 'After 10 sec' },
          { value: 0, label: 'Auto-closing disabled' },
        ],
      }}
      contentDisplayPreference={{
        title: 'Select visible tabs',
        description: 'Customize notification types visibility',
        options: [
          {
            label: 'All',
            id: 'first',
            alwaysVisible: true,
          },
          {
            label: 'Success',
            id: 'success',
          },
          {
            label: 'Error',
            id: 'error',
          },
          {
            label: 'Warning',
            id: 'warning',
          },
          {
            label: 'Info',
            id: 'info',
          },
        ],
      }}
    />
  );

  return (
    <div>
      <InternalBox padding={'l'}>
        <InternalBox padding={'xs'}>
          <InternalHeader variant="h2" actions={preferencesComponent}>
            Notifications
          </InternalHeader>
        </InternalBox>
        <Tabs
          tabs={[
            {
              label: 'All',
              id: 'first',
              content: <Notifications messages={messages} />,
            },
            {
              label: <TabTitle type="status-positive" count={successMessages.length} />,
              id: 'success',
              content: <Notifications messages={successMessages} />,
            },
            {
              label: <TabTitle type="status-negative" count={errorMessages.length} />,
              id: 'error',
              content: <Notifications messages={errorMessages} />,
            },
            {
              label: <TabTitle type="status-warning" count={warningMessages.length} />,
              id: 'warning',
              content: <Notifications messages={warningMessages} />,
            },
            {
              label: <TabTitle type="status-info" count={infoMessages.length} />,
              id: 'info',
              content: <Notifications messages={infoMessages} />,
            },
          ]}
        ></Tabs>
      </InternalBox>
    </div>
  );
};
