// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useEffect, useMemo } from 'react';
import clsx from 'clsx';

import { getBaseProps } from '../internal/base-component/index.js';
import { fireCancelableEvent, fireNonCancelableEvent } from '../internal/events/index';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component/index.js';
import { AnchorNavigationProps } from './interfaces';
import useScrollSpy from './use-scroll-spy.js';
import { renderNestedAnchors } from './utils';

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

  return (
    <nav
      {...baseProps}
      ref={__internalRootRef}
      aria-labelledby={ariaLabelledby}
      className={clsx(baseProps.className, styles.root, testUtilsStyles.root)}
    >
      <ol className={clsx(styles['anchor-list'], testUtilsStyles['anchor-list'])}>
        {renderNestedAnchors(anchors, {
          onFollowHandler,
          currentActiveHref,
        })}
      </ol>
    </nav>
  );
}
