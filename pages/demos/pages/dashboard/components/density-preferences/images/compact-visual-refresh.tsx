// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import { TableRow, TableRows, TopNavigation, WindowPath } from './common';

import * as styles from './styles.module.scss';

const compactImage = (
  <svg viewBox="0 0 230 107" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden={true}>
    <WindowPath />
    <TopNavigation />
    <g>
      <path className={styles.header} d="M24 8.00006H211V24.0001H24V8.00006Z" />
      <g className={styles._default}>
        <circle cx="29" cy="15.5001" r="2.5" className={styles.disabled} />
        <path d="M47 14H77.1484V17H47V14Z" />
        <path d="M121 15C121 13.8954 121.895 13 123 13H139.36C140.465 13 141.36 13.8954 141.36 15V15C141.36 16.1046 140.465 17 139.36 17H123C121.895 17 121 16.1046 121 15V15Z" />
        <path d="M145 15C145 13.8954 145.895 13 147 13H163.36C164.465 13 165.36 13.8954 165.36 15V15C165.36 16.1046 164.465 17 163.36 17H147C145.895 17 145 16.1046 145 15V15Z" />
        <path
          d="M168 15C168 13.8954 168.895 13 170 13H186.36C187.465 13 188.36 13.8954 188.36 15V15C188.36 16.1046 187.465 17 186.36 17H170C168.895 17 168 16.1046 168 15V15Z"
          className={styles.primary}
        />
        <circle cx="206.5" cy="15.5001" r="2.5" className={styles.disabled} />
      </g>
    </g>
    <TableRow offset={27} compact={true} isHeader={true} />
    <TableRows offsetTop={37} compact={true} rows={7} />
  </svg>
);

export default compactImage;
