// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import styles from './styles.css.js';

const bottomPositionIcon = (
  <svg
    className={styles['preference-icon--svg']}
    focusable={false}
    viewBox="0 0 240 134"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    aria-hidden="true"
  >
    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <g>
        <g>
          <rect
            className={styles['preference-icon--layout-border']}
            strokeWidth="2"
            x="1"
            y="1"
            width="238"
            height="125"
            rx="2"
          ></rect>
          <rect className={styles['preference-icon--layout-background']} x="12" y="0" width="217" height="126"></rect>
          <path
            className={styles['preference-icon--layout-header']}
            d="M2,0 L238,0 C239.104569,-1.58997828e-14 240,0.8954305 240,2 L240,10 L240,10 L0,10 L0,2 C-1.3527075e-16,0.8954305 0.8954305,2.02906125e-16 2,0 Z"
          ></path>
        </g>
        <g transform="translate(28.000000, 22.000000)">
          <rect
            className={styles['preference-icon--border']}
            strokeWidth="2"
            x="1"
            y="1"
            width="182"
            height="110"
            rx="2"
          ></rect>
          <rect className={styles['preference-icon--primary-button']} x="152" y="6" width="26" height="10"></rect>
          <rect className={styles['preference-icon--disabled-element']} x="122" y="6" width="26" height="10"></rect>
          <rect className={styles['preference-icon--disabled-element']} x="92" y="6" width="26" height="10"></rect>
          <rect className={styles['preference-icon--disabled-element']} x="122" y="29" width="55" height="3"></rect>
          <rect className={styles['preference-icon--disabled-element']} x="92" y="29" width="26" height="3"></rect>
          <polygon className={styles['preference-icon--focus-text']} points="19 29 49 29 49 32 19 32"></polygon>
          <polygon className={styles['preference-icon--focus-text']} points="10 10 40 10 40 13 10 13"></polygon>
          <polygon className={styles['preference-icon--disabled-element']} points="10 29 13 29 13 32 10 32"></polygon>
          <line
            className={styles['preference-icon--separator']}
            x1="3"
            y1="22.7619048"
            x2="181"
            y2="22.7619048"
            strokeWidth="2"
            strokeLinecap="square"
          ></line>
          <g transform="translate(3.000000, 37.285714)">
            <rect className={styles['preference-icon--disabled-element']} x="119" y="6" width="55" height="3"></rect>
            <rect className={styles['preference-icon--disabled-element']} x="89" y="6" width="26" height="3"></rect>
            <polygon className={styles['preference-icon--focus-text']} points="16 6 46 6 46 9 16 9"></polygon>
            <polygon className={styles['preference-icon--disabled-element']} points="7 6 10 6 10 9 7 9"></polygon>
            <line
              className={styles['preference-icon--separator']}
              x1="0"
              y1="0.666666667"
              x2="178"
              y2="0.666666667"
              strokeLinecap="square"
            ></line>
          </g>
        </g>
        <g transform="translate(12.000000, 74.000000)">
          <g>
            <rect
              className={styles['preference-icon--border']}
              strokeWidth="2"
              x="1"
              y="1"
              width="215"
              height="58"
              rx="2"
            ></rect>
            <rect className={styles['preference-icon--secondary']} x="177" y="8" width="30.6630435" height="10"></rect>
            <polygon
              className={styles['preference-icon--focus-text']}
              points="10 12 45.3804348 12 45.3804348 15 10 15"
            ></polygon>
          </g>
          <g className={styles['preference-icon--secondary']} transform="translate(9.000000, 40.000000)">
            <polygon points="-3.55271368e-15 0 39 0 39 3 -3.55271368e-15 3"></polygon>
            <polygon points="53 0 92 0 92 3 53 3"></polygon>
            <polygon points="107 0 146 0 146 3 107 3"></polygon>
            <polygon points="160 0 199 0 199 3 160 3"></polygon>
            <polygon points="-3.55271368e-15 9 39 9 39 12 -3.55271368e-15 12"></polygon>
            <polygon points="53 9 92 9 92 12 53 12"></polygon>
            <polygon points="107 9 146 9 146 12 107 12"></polygon>
            <polygon points="160 9 199 9 199 12 160 12"></polygon>
          </g>
          <polygon className={styles['preference-icon--focus-text']} points="10 23 32 23 32 26 10 26"></polygon>
          <polygon className={styles['preference-icon--secondary']} points="40 23 62 23 62 26 40 26"></polygon>
        </g>
      </g>
    </g>
  </svg>
);

export default bottomPositionIcon;
