// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import * as styles from './styles.module.scss';

interface TableRowProps {
  offset: number;
  separator?: boolean;
  compact?: boolean;
  isHeader?: boolean;
}

export const TableRow = ({ offset, separator = true, compact = false, isHeader = false }: TableRowProps) => {
  const offsetTop = 0.4482;
  const offsetBottom = 3.4482;
  const separatorDistance = compact ? 7 : 8;
  return (
    <g transform={`translate(0, ${offset})`} className={isHeader ? styles['column-header'] : styles.disabled}>
      <path d={`M53 ${offsetTop}H56V${offsetBottom}H53V${offsetTop}Z`} />
      <path
        d={`M61 ${offsetTop}H85V${offsetBottom}H61V${offsetTop}Z`}
        className={!isHeader ? styles.secondary : undefined}
      />
      <path d={`M138 ${offsetTop}H118V${offsetBottom}H138V${offsetTop}Z`} />
      <path d={`M185 ${offsetTop}H141V${offsetBottom}H185V${offsetTop}Z`} />
      {separator && <path d={`M48 ${separatorDistance}H187.387`} className={styles.separator} strokeLinecap="square" />}
    </g>
  );
};

interface TableRowsProps {
  offsetTop: number;
  rows: number;
  compact?: boolean;
}

export const TableRows = ({ offsetTop, rows, compact = false }: TableRowsProps) => {
  const distance = compact ? 10 : 13;
  return (
    <g>
      {[...Array(rows)].map((_, index) => (
        <TableRow key={index} offset={offsetTop + index * distance} compact={compact} separator={index + 1 !== rows} />
      ))}
    </g>
  );
};

export const WindowPath = () => (
  <path
    d="M24 1.00006H211C211.552 1.00006 212 1.44778 212 2.00006V105C212 105.552 211.552 106 211 106H24C23.4477 106 23 105.552 23 105V2.00006C23 1.44778 23.4477 1.00006 24 1.00006Z"
    className={styles.window}
    strokeWidth="2"
  />
);
export const TopNavigation = () => (
  <g className="awsui-context-top-navigation">
    <rect x="24" y="2" width="187" height="6" className={styles['top-navigation']} />
  </g>
);
