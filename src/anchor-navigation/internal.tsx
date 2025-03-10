// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useEffect, useMemo } from 'react';
import clsx from 'clsx';

import { getBaseProps } from '../internal/base-component/index.js';
import { fireCancelableEvent, fireNonCancelableEvent, isPlainLeftClick } from '../internal/events/index';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component/index.js';
import { checkSafeUrl } from '../internal/utils/check-safe-url';
import { AnchorNavigationProps } from './interfaces';
import useScrollSpy from './use-scroll-spy.js';

import styles from './styles.css.js';
import testUtilsStyles from './test-classes/styles.css.js';

export default function InternalAnchorNavigation({
  anchors,
  ariaLabelledby,
  onFollow,
  onActiveHrefChange,
  activeHref = '',
  __internalRootRef = null,
  scrollSpyOffset = 0,
  ...props
}: AnchorNavigationProps & InternalBaseComponentProps) {
  const baseProps = getBaseProps(props);

  const hrefs = useMemo(() => anchors.map(anchor => anchor.href), [anchors]);

  const onFollowHandler = useCallback(
    (anchor: AnchorNavigationProps.Anchor, sourceEvent: React.SyntheticEvent | Event) => {
      fireCancelableEvent(onFollow, anchor, sourceEvent);
    },
    [onFollow]
  );

  const currentActiveHref = useScrollSpy({
    hrefs,
    scrollSpyOffset,
    activeHref,
  });

  useEffect(() => {
    if (currentActiveHref) {
      const newActiveAnchor = anchors.find(anchor => anchor.href === currentActiveHref);
      fireNonCancelableEvent(onActiveHrefChange, newActiveAnchor);
    }
  }, [onActiveHrefChange, anchors, currentActiveHref]);

  const renderNestedAnchors = (items: AnchorNavigationProps.Anchor[], startIndex: number = 0): React.ReactNode => {
    if (items.length === 0) {
      return null;
    }

    const result: React.ReactNode[] = [];
    let currentIndex = 0;

    while (currentIndex < items.length) {
      const currentItem = items[currentIndex];
      const childItems: AnchorNavigationProps.Anchor[] = [];

      let nextIndex = currentIndex + 1;
      while (nextIndex < items.length && items[nextIndex].level > currentItem.level) {
        childItems.push(items[nextIndex]);
        nextIndex++;
      }

      result.push(
        <AnchorItem
          onFollow={onFollowHandler}
          isActive={currentItem.href === currentActiveHref}
          key={startIndex + currentIndex}
          index={startIndex + currentIndex}
          anchor={currentItem}
        >
          {childItems.length > 0 && (
            <ol className={styles['anchor-list']}>{renderNestedAnchors(childItems, startIndex + currentIndex + 1)}</ol>
          )}
        </AnchorItem>
      );

      currentIndex = nextIndex;
    }

    return result;
  };

  return (
    <nav
      {...baseProps}
      ref={__internalRootRef}
      aria-labelledby={ariaLabelledby}
      className={clsx(baseProps.className, styles.root, testUtilsStyles.root)}
    >
      <ol className={clsx(styles['anchor-list'], testUtilsStyles['anchor-list'])}>{renderNestedAnchors(anchors)}</ol>
    </nav>
  );
}

interface AnchorItemProps {
  anchor: AnchorNavigationProps.Anchor;
  onFollow: (anchor: AnchorNavigationProps.Anchor, event: React.SyntheticEvent | Event) => void;
  isActive: boolean;
  index: number;
  children: React.ReactNode;
}

const AnchorItem = ({ anchor, onFollow, isActive, index, children }: AnchorItemProps) => {
  checkSafeUrl('AnchorNavigation', anchor.href);

  const onClick = useCallback(
    (event: React.MouseEvent) => {
      if (isPlainLeftClick(event)) {
        onFollow(anchor, event);
      }
    },
    [onFollow, anchor]
  );

  const activeItemClasses = clsx(styles['anchor-item--active'], testUtilsStyles['anchor-item--active']);

  return (
    <li data-itemid={`anchor-item-${index + 1}`} className={clsx(styles['anchor-item'], isActive && activeItemClasses)}>
      <a
        onClick={onClick}
        className={clsx(
          styles['anchor-link'],
          testUtilsStyles['anchor-link'],
          isActive && styles['anchor-link--active']
        )}
        {...(isActive ? { 'aria-current': true } : {})}
        href={anchor.href}
      >
        <span
          className={clsx(styles['anchor-link-text'], testUtilsStyles['anchor-link-text'])}
          style={{ paddingInlineStart: `${anchor.level * 16 + 2}px` }}
        >
          {anchor.text}
        </span>
        {anchor.info && (
          <span className={clsx(styles['anchor-link-info'], testUtilsStyles['anchor-link-info'])}>{anchor.info}</span>
        )}
      </a>
      {children}
    </li>
  );
};
