// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export interface TokenListProps<Item> {
  alignment: 'vertical' | 'horizontal';
  toggleAlignment?: 'vertical' | 'horizontal';
  items: readonly Item[];
  limit?: number;
  renderItem: (item: Item, itemIndex: number) => React.ReactNode;
  i18nStrings?: I18nStrings;
}

export interface I18nStrings {
  limitShowFewer?: string;
  limitShowMore?: string;
}
