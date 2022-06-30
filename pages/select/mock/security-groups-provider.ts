// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { groupsRaw } from './data';

const PAGE_SIZE = 10;

export async function fetchSecurityGroups({ filteringText, pageNumber }: any) {
  await new Promise(resolve => setTimeout(resolve, 500));

  if (Math.random() > 0.8) {
    throw new Error('Simulated data fetching error');
  }

  // clone response data to have new object references every time
  const groups: any[] = JSON.parse(JSON.stringify(groupsRaw));

  const filteredGroups = groups
    .filter(group => group.label.indexOf(filteringText) > -1)
    .map(group => ({
      ...group,
      value: group.label,
    }));
  const offset = (pageNumber - 1) * PAGE_SIZE;
  return {
    items: filteredGroups.slice(offset, offset + PAGE_SIZE),
    hasNext: offset + PAGE_SIZE < filteredGroups.length,
  };
}
