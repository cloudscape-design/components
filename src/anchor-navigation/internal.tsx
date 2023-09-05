// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useEffect, useMemo } from 'react';
import clsx from 'clsx';
import styles from './styles.css.js';
import { AnchorNavigationProps } from './interfaces.js';
import { checkSafeUrl } from '../internal/utils/check-safe-url.js';
import useScrollSpy from './scroll-spy.js';
import { fireCancelableEvent, fireNonCancelableEvent, isPlainLeftClick } from '../internal/events/index.js';
import { useStableCallback } from '@cloudscape-design/component-toolkit/internal';

interface AnchorProps {
  anchor: AnchorNavigationProps.Anchor;
  fireFollow: (anchor: AnchorNavigationProps.Anchor, event: React.SyntheticEvent | Event) => void;
  isActive: boolean;
}
const Anchor = ({ anchor, fireFollow, isActive }: AnchorProps) => {
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
    <li className={clsx(styles['anchor-item'], { [styles['anchor-item-active']]: isActive })}>
      <a
        onClick={onClick}
        className={clsx(styles['anchor-link'], { [styles['anchor-link-active']]: isActive })}
        {...(isActive ? { 'aria-current': true } : {})}
        href={anchor.href}
      >
        <span className={styles['anchor-link-text']} style={{ paddingLeft: `${anchor.level * 16 + 2}px` }}>
          {anchor.text}
        </span>
        {anchor.info && <span className={styles.info}>{anchor.info}</span>}
      </a>
    </li>
  );
};

export default function InternalAnchorNavigation({
  anchors,
  ariaLabelledby,
  onFollow,
  onActiveAnchorChange,
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
    // setActiveDrawerId(newDrawerId);
    fireNonCancelableEvent(onActiveAnchorChange, newActiveAnchor);
  });

  const [activeId] = useScrollSpy({ hrefs });

  useEffect(() => {
    onActiveAnchorChangeHandler(memoizedAnchors.find(anchor => anchor.href === '#' + activeId));
  }, [onActiveAnchorChangeHandler, memoizedAnchors, activeId]);

  return (
    <nav aria-labelledby={ariaLabelledby} className={styles.root} {...props}>
      <ol className={styles['anchor-list']}>
        {anchors.map((anchor, index) => {
          return (
            <Anchor
              fireFollow={onFollowHandler}
              isActive={anchor.href === `#${activeId}`}
              key={index}
              anchor={anchor}
            />
          );
        })}
      </ol>
    </nav>
  );
}
