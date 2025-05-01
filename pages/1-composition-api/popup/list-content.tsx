// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import clsx from 'clsx';

import { Box } from '~components';

import validateChildren from '../utils/validate-children';

import styles from './styles.scss';

export const ListContent = ({ n }: { n: number }) => (
  <List>
    {[...Array(n)].map((_, i) => (
      <ListItem key={i}>
        <Box padding={{ vertical: 'xxs' }}>{`Link item ${i}`}</Box>
      </ListItem>
    ))}
  </List>
);

export const List = ({ children }: { children: any }) => {
  const permittedContent = [ListItem];
  return <ul className={styles['list-container']}>{validateChildren('Menu.List', permittedContent, children)}</ul>;
};

export const ListItem = ({ children, key }: { children: React.ReactNode; key: string | number }) => (
  <li key={key} className={clsx(styles['list-item'])}>
    {children}
  </li>
);

export const Divider = ({ margin = '4px 0px' }: { margin?: string }) => (
  <hr className={styles.divider} style={{ margin: margin }} />
);

export const NotificationList = ({ n }: { n: number }) => {
  return (
    <List>
      {[...Array(n)].map((_, i) => (
        <ListItem key={i}>
          <Box padding={{ vertical: 'xxs', horizontal: 'l' }}>
            <Box variant="awsui-key-label">{`Notification ${i}`}</Box>
            <Box variant="small">
              <span className={styles.truncate} style={{ maxWidth: '350px' }}>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Deserunt id ab optio assumenda quam, eum
                accusantium a cupiditate quo. Qui.
              </span>
            </Box>
            {i !== n - 1 ? <Divider margin={'8px 0px 4px 0px'} /> : <Box padding="xxs"></Box>}
          </Box>
        </ListItem>
      ))}
    </List>
  );
};
