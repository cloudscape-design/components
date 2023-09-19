// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useEffect, useMemo } from 'react';
import clsx from 'clsx';
import styles from './styles.css.js';
import testUtilsStyles from './test-classes/styles.css.js';
import { AnchorNavigationProps } from './interfaces';
import { checkSafeUrl } from '../internal/utils/check-safe-url';
import useScrollSpy from './scroll-spy.js';
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
      className={clsx(baseProps.className, styles.root)}
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
  checkSafeUrl('SideNavigation', anchor.href);

  const onClick = useCallback(
    (event: React.MouseEvent) => {
      if (isPlainLeftClick(event)) {
        onFollow(anchor, event);
      }
    },
    [onFollow, anchor]
  );

  return (
    <li
      data-itemid={`anchor-item-${index}`}
      className={clsx(styles['anchor-item'], {
        [(styles['anchor-item--active'], testUtilsStyles['anchor-item--active'])]: isActive,
      })}
    >
      <a
        onClick={onClick}
        className={clsx(styles['anchor-link'], testUtilsStyles['anchor-link'], {
          [styles['anchor-link--active']]: isActive,
        })}
        {...(isActive ? { 'aria-current': true } : {})}
        href={anchor.href}
      >
        <span
          className={clsx(styles['anchor-link-text'], testUtilsStyles['link-text'])}
          style={{ paddingLeft: `${anchor.level * 16 + 2}px` }}
        >
          {anchor.text}
        </span>
        {anchor.info && (
          <span className={clsx(styles['anchor-link-info'], testUtilsStyles['link-info'])}>{anchor.info}</span>
        )}
      </a>
    </li>
  );
};
