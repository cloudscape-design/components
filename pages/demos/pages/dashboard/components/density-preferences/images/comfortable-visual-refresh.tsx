// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import { TableRow, TableRows, TopNavigation, WindowPath } from './common';

import * as styles from './styles.module.scss';

const comfortableImage = (
  <svg viewBox="0 0 230 107" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden={true}>
    <WindowPath />
    <TopNavigation />
    <g>
      <path className={styles.header} d="M24 8.00006H211V28.0001H24V8.00006Z" />
      <g className={styles._default}>
        <circle cx="29" cy="17.5001" r="2.5" className={styles.disabled} />
        <path d="M47 16.0001H77.1484V19.0001H47V16.0001Z" />
        <path d="M121 17.5C121 15.567 122.567 14 124.5 14H137.86C139.793 14 141.36 15.567 141.36 17.5V17.5C141.36 19.433 139.793 21 137.86 21H124.5C122.567 21 121 19.433 121 17.5V17.5Z" />
        <path d="M145 17.5C145 15.567 146.567 14 148.5 14H161.86C163.793 14 165.36 15.567 165.36 17.5V17.5C165.36 19.433 163.793 21 161.86 21H148.5C146.567 21 145 19.433 145 17.5V17.5Z" />
        <path
          d="M168 17.5C168 15.567 169.567 14 171.5 14H184.86C186.793 14 188.36 15.567 188.36 17.5V17.5C188.36 19.433 186.793 21 184.86 21H171.5C169.567 21 168 19.433 168 17.5V17.5Z"
          className={styles.primary}
        />
        <circle cx="206.5" cy="17.5001" r="2.5" className={styles.disabled} />
      </g>
    </g>
    <TableRow offset={32} isHeader={true} />

    <TableRows offsetTop={45} rows={5} />
  </svg>
);

export default comfortableImage;
