// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useEffect, useMemo } from 'react';
import clsx from 'clsx';

import { isAppLayoutToolbarEnabled } from '../app-layout/utils/feature-flags';
import { getBaseProps } from '../internal/base-component';
import { fireCancelableEvent, fireNonCancelableEvent } from '../internal/events';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { isDevelopment } from '../internal/is-development';
import { createWidgetizedComponent } from '../internal/widgets';
import { SideNavigationProps } from './interfaces';
import { Header, NavigationItemsList } from './parts';
import { checkDuplicateHrefs, generateExpandableItemsMapping } from './util';

import styles from './styles.css.js';

export type SideNavigationInternalProps = SideNavigationProps & InternalBaseComponentProps;

export function SideNavigationImplementation({
  header,
  activeHref,
  items = [],
  onFollow,
  onChange,
  __internalRootRef,
  ...props
}: SideNavigationInternalProps) {
  const baseProps = getBaseProps(props);
  const parentMap = useMemo(() => generateExpandableItemsMapping(items), [items]);

  if (isDevelopment) {
    // This code should be wiped in production anyway.
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => checkDuplicateHrefs(items), [items]);
  }

  const onChangeHandler = useCallback(
    (item: SideNavigationProps.Section | SideNavigationProps.ExpandableLinkGroup, expanded: boolean) => {
      // generateExpandableItemsMapping walks through the entire tree, so we're certain about getting a value.
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      fireNonCancelableEvent(onChange, { item, expanded: expanded, expandableParents: parentMap.get(item)! });
    },
    [onChange, parentMap]
  );

  const onFollowHandler = useCallback(
    (
      item:
        | SideNavigationProps.Link
        | SideNavigationProps.Header
        | SideNavigationProps.LinkGroup
        | SideNavigationProps.ExpandableLinkGroup,
      sourceEvent: React.SyntheticEvent | Event
    ) => {
      fireCancelableEvent(onFollow, item, sourceEvent);
    },
    [onFollow]
  );

  return (
    <div
      {...baseProps}
      className={clsx(styles.root, baseProps.className, isAppLayoutToolbarEnabled() && styles['with-toolbar'])}
      ref={__internalRootRef}
    >
      {header && (
        <Header definition={header} activeHref={activeHref} fireChange={onChangeHandler} fireFollow={onFollowHandler} />
      )}
      {items && (
        <div className={styles['list-container']}>
          <NavigationItemsList
            variant="root"
            items={items}
            fireFollow={onFollowHandler}
            fireChange={onChangeHandler}
            activeHref={activeHref}
          />
        </div>
      )}
    </div>
  );
}

export const createWidgetizedSideNavigation = createWidgetizedComponent(SideNavigationImplementation);
