// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

interface Item {
  id: string;
  content: React.ReactNode;
  parent?: string;
}

export const items: Item[] = [
  {
    id: '1',
    content: 'Item 1',
  },
  {
    id: '2',
    content: 'Item 2',
    parent: '1',
  },
  {
    id: '3',
    content: 'Item 3',
    parent: '2',
  },
  {
    id: '4',
    content: 'Item 4',
    parent: '3',
  },
  {
    id: '5',
    content: 'Item 5',
    parent: '4',
  },
  {
    id: '6',
    content: 'Item 6',
    parent: '5',
  },
  {
    id: '7',
    content: 'Item 7',
    parent: '6',
  },
  {
    id: '8',
    content: 'Item 8',
    parent: '7',
  },
  {
    id: '9',
    content: 'Item 9',
    parent: '8',
  },
  {
    id: '10',
    content: 'Item 10',
    parent: '9',
  },
  {
    id: '11',
    content: 'Item 11',
  },
  {
    id: '12',
    content: 'Item 12',
  },
  {
    id: '13',
    content: 'Item 13',
  },
  {
    id: '14',
    content: 'Item 14',
  },
];
