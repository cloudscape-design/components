// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { ItemListProps } from './interfaces';
import ItemElement from './item-element';
import ExpandableCategoryElement from './category-elements/expandable-category-element';
import CategoryElement from './category-elements/category-element';
import { isItemGroup } from './utils/utils';
import { useMobile } from '../internal/hooks/use-mobile';
import MobileExpandableCategoryElement from './category-elements/mobile-expandable-category-element';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';

export default function ItemsList({
  items,
  onItemActivate,
  onGroupToggle,
  targetItem,
  isHighlighted,
  isKeyboardHighlight,
  isExpanded,
  isLast,
  highlightItem,
  categoryDisabled = false,
  hasExpandableGroups = false,
  hasCategoryHeader = false,
  expandToViewport = false,
  variant = 'normal',
}: ItemListProps) {
  const isMobile = useMobile();
  const isVisualRefresh = useVisualRefresh();

  const elements = items.map((item, index) => {
    if (!isItemGroup(item)) {
      const last = index === items.length - 1 || isItemGroup(items[index + 1]);
      const showDivider =
        !isLast && isItemGroup(items[index + 1]) && (!hasExpandableGroups || isMobile || !isVisualRefresh);

      return (
        <ItemElement
          key={index}
          item={item}
          onItemActivate={onItemActivate}
          disabled={item.disabled ?? categoryDisabled}
          highlighted={isHighlighted(item)}
          isKeyboardHighlighted={isKeyboardHighlight(item)}
          highlightItem={highlightItem}
          first={index === 0 || isItemGroup(items[index - 1])}
          last={last}
          showDivider={showDivider}
          hasCategoryHeader={hasCategoryHeader}
          variant={variant}
        />
      );
    }
    if (hasExpandableGroups) {
      return item.text ? (
        isMobile ? (
          <MobileExpandableCategoryElement
            key={index}
            item={item}
            onItemActivate={onItemActivate}
            onGroupToggle={onGroupToggle}
            targetItem={targetItem}
            isHighlighted={isHighlighted}
            isKeyboardHighlight={isKeyboardHighlight}
            isExpanded={isExpanded}
            isLast={isLast && index === items.length - 1}
            highlightItem={highlightItem}
            disabled={item.disabled ?? false}
            variant={variant}
          />
        ) : (
          <ExpandableCategoryElement
            key={index}
            item={item}
            onItemActivate={onItemActivate}
            onGroupToggle={onGroupToggle}
            targetItem={targetItem}
            isHighlighted={isHighlighted}
            isKeyboardHighlight={isKeyboardHighlight}
            isExpanded={isExpanded}
            isLast={true}
            highlightItem={highlightItem}
            disabled={item.disabled ?? false}
            expandToViewport={expandToViewport}
            variant={variant}
          />
        )
      ) : null;
    }
    return (
      <CategoryElement
        key={index}
        item={item}
        onItemActivate={onItemActivate}
        onGroupToggle={onGroupToggle}
        targetItem={targetItem}
        isHighlighted={isHighlighted}
        isKeyboardHighlight={isKeyboardHighlight}
        isExpanded={isExpanded}
        isLast={isLast && index === items.length - 1}
        highlightItem={highlightItem}
        disabled={item.disabled ?? false}
        variant={variant}
      />
    );
  });

  return <>{elements}</>;
}
