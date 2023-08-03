// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import InternalSpinner from '../spinner/internal';

import styles from './styles.css.js';

interface Props {
  children: React.ReactNode;
}

export default (props: Props) => (
  <div className={styles['loading-screen']}>
    <InternalSpinner size="normal" variant="normal" />
    &nbsp;
    {props.children}
  </div>
);
