// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useMemo, useCallback, useEffect } from 'react';
import clsx from 'clsx';
import { getBaseProps } from '../internal/base-component';
import { fireNonCancelableEvent, fireCancelableEvent } from '../internal/events';
import { SideNavigationProps } from './interfaces';
import { Header, NavigationItemsList } from './parts';
import { generateExpandableItemsMapping, checkDuplicateHrefs } from './util';
import styles from './styles.css.js';
import { isDevelopment } from '../internal/is-development';
import { createWidgetizedComponent } from '../internal/widgets';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';

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
    <div {...baseProps} className={clsx(styles.root, baseProps.className)} ref={__internalRootRef}>
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

export const createWidgetizedSideNavigation = createWidgetizedComponent<
  SideNavigationInternalProps,
  typeof SideNavigationImplementation
>(SideNavigationImplementation);
