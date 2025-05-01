// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import styles from './styles.css.js';

function List({ children, direction = 'horizontal' }: any) {
  return (
    <dl className={styles.list} data-direction={direction}>
      {children}
    </dl>
  );
}

function ListItem({ children, direction = 'vertical' }: any) {
  return (
    <div className={styles.item} data-direction={direction}>
      {children}
    </div>
  );
}

function Term({ children }: any) {
  return <dt className={styles.term}>{children}</dt>;
}

function Details({ children }: any) {
  return <dd className={styles.details}>{children}</dd>;
}

export default {
  Details,
  List,
  ListItem,
  Term,
};
