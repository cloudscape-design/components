// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { useMobile } from '../internal/hooks/use-mobile';
import CategoryElement from './category-elements/category-element';
import ExpandableCategoryElement from './category-elements/expandable-category-element';
import MobileExpandableCategoryElement from './category-elements/mobile-expandable-category-element';
import { ItemListProps } from './interfaces';
import ItemElement from './item-element';
import { isItemGroup } from './utils/utils';

export default function ItemsList({
  items,
  onItemActivate,
  onGroupToggle,
  targetItem,
  isHighlighted,
  isKeyboardHighlight,
  isExpanded,
  lastInDropdown,
  highlightItem,
  categoryDisabled = false,
  hasExpandableGroups = false,
  hasCategoryHeader = false,
  expandToViewport = false,
  variant = 'normal',
  analyticsMetadataTransformer,
  position,
  linkStyle,
}: ItemListProps) {
  const isMobile = useMobile();

  const elements = items.map((item, index) => {
    if (!isItemGroup(item)) {
      const showDivider = (index === items.length - 1 && !lastInDropdown) || isItemGroup(items[index + 1]);

      return (
        <ItemElement
          key={index}
          item={item}
          onItemActivate={onItemActivate}
          disabled={item.disabled ?? categoryDisabled}
          highlighted={isHighlighted(item)}
          isKeyboardHighlighted={isKeyboardHighlight(item)}
          highlightItem={highlightItem}
          showDivider={showDivider}
          hasCategoryHeader={hasCategoryHeader}
          variant={variant}
          position={`${position ? `${position},` : ''}${index + 1}`}
          analyticsMetadataTransformer={analyticsMetadataTransformer}
          linkStyle={linkStyle}
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
            lastInDropdown={lastInDropdown && index === items.length - 1}
            highlightItem={highlightItem}
            disabled={item.disabled ?? false}
            variant={variant}
            position={`${position ? `${position},` : ''}${index + 1}`}
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
            lastInDropdown={true}
            highlightItem={highlightItem}
            disabled={item.disabled ?? false}
            expandToViewport={expandToViewport}
            variant={variant}
            position={`${position ? `${position},` : ''}${index + 1}`}
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
        lastInDropdown={lastInDropdown && index === items.length - 1}
        highlightItem={highlightItem}
        disabled={item.disabled ?? false}
        variant={variant}
        position={`${position ? `${position},` : ''}${index + 1}`}
      />
    );
  });

  return <>{elements}</>;
}
