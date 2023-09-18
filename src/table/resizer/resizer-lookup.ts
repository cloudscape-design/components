// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { findUpUntil } from '@cloudscape-design/component-toolkit/dom';
import tableStyles from '../styles.css.js';
import styles from './styles.css.js';
import { getOverflowParents } from '../../internal/utils/scrollable-containers.js';

export function getResizerElements(resizerElement: null | HTMLElement) {
  if (!resizerElement) {
    return null;
  }

  const header = findUpUntil(resizerElement, element => element.tagName.toLowerCase() === 'th');
  if (!header) {
    return null;
  }

  const tableRoot = findUpUntil(header, element => element.className.indexOf(tableStyles.root) > -1);
  if (!tableRoot) {
    return null;
  }

  const table = tableRoot.querySelector<HTMLElement>(`table`);
  if (!table) {
    return null;
  }

  // tracker is rendered inside table wrapper to align with its size
  const tracker = tableRoot.querySelector<HTMLElement>(`.${styles.tracker}`);
  if (!tracker) {
    return null;
  }

  const scrollParent = getOverflowParents(header)[0];
  if (!scrollParent) {
    return null;
  }

  return { header, table, tracker, scrollParent };
}

export function getHeaderWidth(resizerElement: null | HTMLElement): number {
  const header = resizerElement && findUpUntil(resizerElement, element => element.tagName.toLowerCase() === 'th');
  return header?.getBoundingClientRect().width ?? 0;
}
