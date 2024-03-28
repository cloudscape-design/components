// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useEffect, useMemo } from 'react';
import clsx from 'clsx';
import styles from './styles.css.js';
import testUtilsStyles from './test-classes/styles.css.js';
import { AnchorNavigationProps } from './interfaces';
import { checkSafeUrl } from '../internal/utils/check-safe-url';
import useScrollSpy from './use-scroll-spy.js';
import { fireCancelableEvent, fireNonCancelableEvent, isPlainLeftClick } from '../internal/events/index';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component/index.js';
import { getBaseProps } from '../internal/base-component/index.js';

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

  return (
    <nav
      {...baseProps}
      ref={__internalRootRef}
      aria-labelledby={ariaLabelledby}
      className={clsx(baseProps.className, styles.root, testUtilsStyles.root)}
    >
      <ol className={clsx(styles['anchor-list'], testUtilsStyles['anchor-list'])}>
        {anchors.map((anchor, index) => {
          return (
            <Anchor
              onFollow={onFollowHandler}
              isActive={anchor.href === currentActiveHref}
              key={index}
              index={index}
              anchor={anchor}
            />
          );
        })}
      </ol>
    </nav>
  );
}

interface AnchorProps {
  anchor: AnchorNavigationProps.Anchor;
  onFollow: (anchor: AnchorNavigationProps.Anchor, event: React.SyntheticEvent | Event) => void;
  isActive: boolean;
  index: number;
}

const Anchor = ({ anchor, onFollow, isActive, index }: AnchorProps) => {
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
    </li>
  );
};
