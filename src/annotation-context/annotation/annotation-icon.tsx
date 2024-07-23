// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import styles from './styles.css.js';

export interface AnnotationIconProps {
  open?: boolean;
}

export const AnnotationIcon = ({ open }: AnnotationIconProps) => {
  if (open) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        focusable="false"
        aria-hidden="true"
        className={styles.icon}
      >
        <g fill="none" fillRule="evenodd" transform="translate(1 1)">
          <circle cx="7" cy="7" r="7" strokeWidth="2" />
          <path strokeLinecap="square" strokeWidth="2.2" d="M2.5,-1 L2.5,3" transform="rotate(90 1.75 6.25)" />
        </g>
      </svg>
    );
  } else {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        focusable="false"
        aria-hidden="true"
        className={styles.icon}
      >
        <g fill="none" fillRule="evenodd" transform="translate(1 1)">
          <circle cx="7" cy="7" r="7" strokeWidth="2" />
          <g strokeLinecap="square" strokeWidth="2.2" transform="translate(4.5 5)">
            <path d="M2.5,0 L2.5,4" transform="rotate(90 2.5 2)" />
            <path d="M2.5,0 L2.5,4" />
          </g>
        </g>
      </svg>
    );
  }
};
