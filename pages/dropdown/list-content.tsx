// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import repeatString from 'lodash/repeat';

import styles from './styles.scss';

const ListContent = ({ n, withSpaces = false, repeat = 1 }: { n: number; withSpaces?: boolean; repeat?: number }) => (
  <ul className={styles['list-container']}>
    {[...Array(n)].map((_, i) => (
      <li key={i}>{repeatString(`${i}${withSpaces ? ' ' : ''}`, repeat)}</li>
    ))}
  </ul>
);

export default ListContent;
