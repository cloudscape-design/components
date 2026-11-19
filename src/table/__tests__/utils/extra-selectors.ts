// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { TableWrapper } from '../../../../lib/components/test-utils/dom';

import screenreaderOnlyStyles from '../../../../lib/components/internal/components/screenreader-only/styles.selectors.js';

export const getSelectionInput = (w: TableWrapper, index: number) =>
  w.findRowSelectionArea(index)!.find<HTMLInputElement>('input')!;

export const getSelectAllInput = (w: TableWrapper) => w.findSelectAllTrigger()!.find<HTMLInputElement>('input')!;

export const getControlIds = (w: TableWrapper) =>
  w.findRows().map(row => row.find('td:first-child input')!.getElement().id);

export const getSelectionA11yHeader = (w: TableWrapper) =>
  w.findColumnHeaders()[0].find(`.${screenreaderOnlyStyles.root}`)?.getElement() ?? null;
