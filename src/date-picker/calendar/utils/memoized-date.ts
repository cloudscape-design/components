// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { parseDate } from '../../../internal/utils/date-time';

// reuse date instances, to allow shallow equality checking
const memoCache: Record<string, Date> = {};
export const memoizedDate = (key: string, date: string | null): null | Date => {
  const parsed = date && date.length >= 4 ? parseDate(date) : null;
  if (!(memoCache[key] && parsed && memoCache[key].getTime() === parsed.getTime())) {
    memoCache[key] = parsed as Date;
  }
  return memoCache[key];
};
