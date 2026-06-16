// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
export const getTextFilterCounterServerSideText = (items: unknown[] = [], pagesCount: number, pageSize: number) => {
  const count = pagesCount > 1 ? `${pageSize * (pagesCount - 1)}+` : items.length + '';
  return count === '1' ? `1 match` : `${count} matches`;
};

export const getTextFilterCounterText = (count: number | undefined = 0) =>
  `${count} ${count === 1 ? 'match' : 'matches'}`;
