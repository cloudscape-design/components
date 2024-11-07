// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { range } from 'lodash';

import { generateItems, Instance } from '../table/generate-data';

export interface Coordinates {
  x: number;
  y: number;
}

export interface Indices {
  rowIndex: number;
  colIndex: number;
}

export function checkMatches(cs: Coordinates, is: Indices) {
  const cellX = Math.floor((cs.x - 15) / 150);
  const cellY = Math.floor((cs.y - 85) / 35);
  return cellX === is.colIndex && cellY === is.rowIndex;
}

export const dataAttributes = range(0, 100).reduce(
  (acc, index) => {
    acc[`data-test-${index + 1}`] = index;
    return acc;
  },
  {} as Record<string, number>
);

export const items = generateItems(500);
export const columnDefinitions = [
  { key: 'id', label: 'ID', render: (item: Instance) => item.id },
  { key: 'state', label: 'State', render: (item: Instance) => item.state },
  { key: 'imageId', label: 'Image ID', render: (item: Instance) => <a href="#">{item.imageId}</a> },
  { key: 'dnsName', label: 'DNS name', render: (item: Instance) => item.dnsName ?? 'none' },
  { key: 'type', label: 'Type', render: (item: Instance) => item.type },
];
