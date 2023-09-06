// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useEffect, useMemo } from 'react';
import clsx from 'clsx';
import styles from './styles.css.js';
import { AnchorNavigationProps } from './interfaces';
import { checkSafeUrl } from '../internal/utils/check-safe-url';
import useScrollSpy from './scroll-spy.js';
import { fireCancelableEvent, fireNonCancelableEvent, isPlainLeftClick } from '../internal/events/index';
import { useStableCallback } from '@cloudscape-design/component-toolkit/internal';

export default function InternalAnchorNavigation({
  anchors,
  ariaLabelledby,
  className,
  onFollow,
  onActiveAnchorChange,
  disableTracking = false,
  activehref = '',
  ...props
}: AnchorNavigationProps) {
  const hrefs = useMemo(() => anchors.map(anchor => anchor.href), [anchors]);
  const memoizedAnchors = useMemo(() => anchors, [anchors]);

  const onFollowHandler = useCallback(
    (anchor: AnchorNavigationProps.Anchor, sourceEvent: React.SyntheticEvent | Event) => {
      fireCancelableEvent(onFollow, anchor, sourceEvent);
    },
    [onFollow]
  );

  const onActiveAnchorChangeHandler = useStableCallback((newActiveAnchor: AnchorNavigationProps.Anchor | undefined) => {
    fireNonCancelableEvent(onActiveAnchorChange, newActiveAnchor);
  });

  const [activeHref, setActiveHref, setDisableTracking] = useScrollSpy({ hrefs });

  useEffect(() => {
    setDisableTracking(disableTracking);

    if (activehref) {
      setActiveHref(activehref);
    }
  }, [setDisableTracking, setActiveHref, disableTracking, activehref]);

  useEffect(() => {
    if (activeHref) {
      onActiveAnchorChangeHandler(memoizedAnchors.find(anchor => anchor.href === activeHref));
    }
  }, [onActiveAnchorChangeHandler, memoizedAnchors, activeHref]);

  return (
    <nav aria-labelledby={ariaLabelledby} className={clsx(className, styles.root)} {...props}>
      <ol className={styles['anchor-list']}>
        {anchors.map((anchor, index) => {
          return (
            <Anchor
              fireFollow={onFollowHandler}
              isActive={anchor.href === activeHref}
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
  fireFollow: (anchor: AnchorNavigationProps.Anchor, event: React.SyntheticEvent | Event) => void;
  isActive: boolean;
  index: number;
}

const Anchor = ({ anchor, fireFollow, isActive, index }: AnchorProps) => {
  checkSafeUrl('SideNavigation', anchor.href);

  const onClick = useCallback(
    (event: React.MouseEvent) => {
      if (isPlainLeftClick(event)) {
        fireFollow(anchor, event);
      }
    },
    [fireFollow, anchor]
  );

  return (
    <li
      data-itemid={`anchor-item-${index}`}
      className={clsx(styles['anchor-item'], { [styles['anchor-item--active']]: isActive })}
    >
      <a
        onClick={onClick}
        className={clsx(styles['anchor-link'], { [styles['anchor-link--active']]: isActive })}
        {...(isActive ? { 'aria-current': true } : {})}
        href={anchor.href}
      >
        <span className={styles['anchor-link-text']} style={{ paddingLeft: `${anchor.level * 16 + 2}px` }}>
          {anchor.text}
        </span>
        {anchor.info && <span className={styles['anchor-link-info']}>{anchor.info}</span>}
      </a>
    </li>
  );
};
