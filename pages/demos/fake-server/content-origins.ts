// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import { ContentOriginsResource } from '../resources/types';
import fakeDelay from './utils/fake-delay';
import fetchJson from './utils/fetch-json';
import paginate from './utils/paginate';

export async function fetchContentOrigins({
  filteringText,
  currentPageIndex,
}: {
  filteringText: string;
  currentPageIndex: number;
}) {
  const [items] = await Promise.all([
    fetchJson<ContentOriginsResource[]>('./resources/content-origins.json'),
    fakeDelay(),
  ]);
  const filteredItems = filteringText ? items.filter(item => item.label.indexOf(filteringText) > -1) : items;
  const { paginatedItems, hasNextPage } = paginate(filteredItems, currentPageIndex);
  return { origins: paginatedItems, hasNextPage };
}
