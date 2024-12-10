// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';

import { getAnalyticsMetadataAttribute } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

import InternalBox from '../box/internal';
import { ExpandableSectionProps } from '../expandable-section/interfaces';
import InternalExpandableSection from '../expandable-section/internal';
import InternalIcon from '../icon/internal';
import { isPlainLeftClick, NonCancelableCustomEvent } from '../internal/events';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import { checkSafeUrl } from '../internal/utils/check-safe-url';
import { GeneratedAnalyticsMetadataSideNavigationClick } from './analytics-metadata/interfaces';
import { SideNavigationProps } from './interfaces';
import { hasActiveLink } from './util';

import analyticsSelectors from './analytics-metadata/styles.css.js';
import styles from './styles.css.js';

interface BaseItemComponentProps {
  activeHref?: string;
  fireChange: (item: SideNavigationProps.Section | SideNavigationProps.ExpandableLinkGroup, expanded: boolean) => void;
  fireFollow: (
    item:
      | SideNavigationProps.Link
      | SideNavigationProps.Header
      | SideNavigationProps.LinkGroup
      | SideNavigationProps.ExpandableLinkGroup,
    event: React.SyntheticEvent | Event
  ) => void;
  position?: string;
}

interface HeaderProps extends BaseItemComponentProps {
  definition: SideNavigationProps.Header;
}

export function Header({ definition, activeHref, fireFollow }: HeaderProps) {
  checkSafeUrl('SideNavigation', definition.href);
  const onClick = useCallback(
    (event: React.MouseEvent) => {
      if (isPlainLeftClick(event)) {
        fireFollow(definition, event);
      }
    },
    [fireFollow, definition]
  );

  const clickActionAnalyticsMetadata: GeneratedAnalyticsMetadataSideNavigationClick = {
    action: 'click',
    detail: {
      label: `.${analyticsSelectors['header-link-text']}`,
      external: 'false',
      href: definition.href,
      position: 'header',
    },
  };

  return (
    <>
      <h2 className={styles.header}>
        <a
          href={definition.href}
          className={clsx(styles['header-link'], { [styles['header-link--has-logo']]: !!definition.logo })}
          aria-current={definition.href === activeHref ? 'page' : undefined}
          onClick={onClick}
          {...getAnalyticsMetadataAttribute(clickActionAnalyticsMetadata)}
        >
          {definition.logo && (
            <img
              className={clsx(styles['header-logo'], {
                [styles['header-logo--stretched']]: !definition.text,
              })}
              {...definition.logo}
            />
          )}
          <span className={clsx(styles['header-link-text'], analyticsSelectors['header-link-text'])}>
            {definition.text}
          </span>
        </a>
      </h2>
      <Divider isPresentational={true} variant="header" />
    </>
  );
}

interface NavigationItemsListProps extends BaseItemComponentProps {
  items: ReadonlyArray<SideNavigationProps.Item>;
  variant: 'section' | 'section-group' | 'link-group' | 'expandable-link-group' | 'root';
}

interface Item {
  element?: ReactNode;
  listVariant?: 'section' | 'section-group' | 'link-group' | 'expandable-link-group' | 'root';
  items?: Array<Item>;
}

export function NavigationItemsList({
  items,
  variant,
  activeHref,
  fireChange,
  fireFollow,
  position = '',
}: NavigationItemsListProps) {
  const lists: Array<Item> = [];
  let currentListIndex = 0;
  lists[currentListIndex] = {
    listVariant: variant,
    items: [],
  };

  items.forEach((item, index) => {
    const itemid = index + 1;
    const itemPosition = `${position ? `${position},` : ''}${itemid}`;
    switch (item.type) {
      case 'divider': {
        const dividerIndex = lists.length;
        lists[dividerIndex] = {
          element: (
            <div data-itemid={`item-${itemid}`}>
              <Divider variant="default" />
            </div>
          ),
        };
        currentListIndex = lists.length;
        lists[currentListIndex] = {
          listVariant: variant,
          items: [],
        };
        return;
      }
      case 'link': {
        lists[currentListIndex].items?.push({
          element: (
            <li key={index} data-itemid={`item-${itemid}`} className={styles['list-item']}>
              <Link
                definition={item}
                activeHref={activeHref}
                fireChange={fireChange}
                fireFollow={fireFollow}
                position={itemPosition}
              />
            </li>
          ),
        });
        return;
      }
      case 'section': {
        lists[currentListIndex].items?.push({
          element: (
            <li key={index} data-itemid={`item-${itemid}`} className={styles['list-item']}>
              <Section
                definition={item}
                activeHref={activeHref}
                variant={variant}
                fireChange={fireChange}
                fireFollow={fireFollow}
                position={itemPosition}
              />
            </li>
          ),
        });
        return;
      }
      case 'section-group': {
        lists[currentListIndex].items?.push({
          element: (
            <li key={index} data-itemid={`item-${itemid}`} className={styles['list-item']}>
              <SectionGroup
                definition={item}
                activeHref={activeHref}
                fireChange={fireChange}
                fireFollow={fireFollow}
                position={itemPosition}
              />
            </li>
          ),
        });
        return;
      }
      case 'link-group': {
        lists[currentListIndex].items?.push({
          element: (
            <li key={index} data-itemid={`item-${itemid}`} className={styles['list-item']}>
              <LinkGroup
                definition={item}
                activeHref={activeHref}
                fireChange={fireChange}
                fireFollow={fireFollow}
                position={itemPosition}
              />
            </li>
          ),
        });
        return;
      }
      case 'expandable-link-group': {
        lists[currentListIndex].items?.push({
          element: (
            <li key={index} data-itemid={`item-${itemid}`} className={styles['list-item']}>
              <ExpandableLinkGroup
                definition={item}
                activeHref={activeHref}
                fireChange={fireChange}
                fireFollow={fireFollow}
                variant={variant}
                position={itemPosition}
              />
            </li>
          ),
        });
        return;
      }
    }
  });

  return (
    <>
      {lists.map((list, index) => {
        if (!list.items || list.items.length === 0) {
          return (
            <div
              key={`hr-${index}`}
              className={clsx(styles.list, styles[`list-variant-${variant}`], {
                [styles['list-variant-root--first']]: list.listVariant === 'root' && index === 0,
              })}
            >
              {list.element}
            </div>
          );
        } else {
          return (
            <ul
              key={`list-${index}`}
              className={clsx(styles.list, styles[`list-variant-${list.listVariant}`], {
                [styles['list-variant-root--first']]: list.listVariant === 'root' && index === 0,
              })}
            >
              {list.items.map(item => item.element)}
            </ul>
          );
        }
      })}
    </>
  );
}

interface DividerProps {
  variant: 'default' | 'header';
  isPresentational?: boolean;
}

function Divider({ variant = 'default', isPresentational = false }: DividerProps) {
  return (
    <hr
      className={clsx(styles.divider, styles[`divider-${variant}`])}
      role={isPresentational ? 'presentation' : undefined}
    />
  );
}

interface LinkProps extends BaseItemComponentProps {
  definition: SideNavigationProps.Link;
  expanded?: boolean;
}

function Link({ definition, expanded, activeHref, fireFollow, position }: LinkProps) {
  checkSafeUrl('SideNavigation', definition.href);
  const isActive = definition.href === activeHref;

  const onClick = useCallback(
    (event: React.MouseEvent) => {
      if (isPlainLeftClick(event)) {
        fireFollow(definition, event);
      }
    },
    [fireFollow, definition]
  );

  const clickActionAnalyticsMetadata: GeneratedAnalyticsMetadataSideNavigationClick = {
    action: 'click',
    detail: {
      label: `.${analyticsSelectors['link-text']}`,
      external: `${!!definition.external}`,
      href: definition.href,
      position,
    },
  };

  return (
    <>
      <a
        href={definition.href}
        className={clsx(styles.link, { [styles['link-active']]: isActive })}
        target={definition.external ? '_blank' : undefined}
        rel={definition.external ? 'noopener noreferrer' : undefined}
        aria-expanded={expanded}
        aria-current={definition.href === activeHref ? 'page' : undefined}
        onClick={onClick}
        {...getAnalyticsMetadataAttribute(clickActionAnalyticsMetadata)}
      >
        <span className={analyticsSelectors['link-text']}>{definition.text}</span>
        {definition.external && (
          <span
            aria-label={definition.externalIconAriaLabel}
            role={definition.externalIconAriaLabel ? 'img' : undefined}
          >
            <InternalIcon name="external" className={styles['external-icon']} />
          </span>
        )}
      </a>
      {definition.info && <span className={styles.info}>{definition.info}</span>}
    </>
  );
}

interface SectionProps extends BaseItemComponentProps {
  definition: SideNavigationProps.Section;
  variant: 'section' | 'section-group' | 'link-group' | 'expandable-link-group' | 'root';
}

function Section({ definition, activeHref, fireFollow, fireChange, variant, position }: SectionProps) {
  const [expanded, setExpanded] = useState<boolean>(definition.defaultExpanded ?? true);
  const isVisualRefresh = useVisualRefresh();

  const onExpandedChange = useCallback(
    (e: NonCancelableCustomEvent<ExpandableSectionProps.ChangeDetail>) => {
      fireChange(definition, e.detail.expanded);
      setExpanded(e.detail.expanded);
    },
    [definition, fireChange]
  );

  useEffect(() => {
    setExpanded(definition.defaultExpanded ?? true);
  }, [definition]);

  return (
    <InternalExpandableSection
      variant="footer"
      expanded={expanded}
      onChange={onExpandedChange}
      className={clsx(
        styles.section,
        variant === 'section-group' && styles['section--no-ident'],
        isVisualRefresh && styles.refresh
      )}
      headerText={definition.text}
    >
      <NavigationItemsList
        variant="section"
        items={definition.items}
        fireFollow={fireFollow}
        fireChange={fireChange}
        activeHref={activeHref}
        position={position}
      />
    </InternalExpandableSection>
  );
}

interface SectionGroupProps extends BaseItemComponentProps {
  definition: SideNavigationProps.SectionGroup;
}

function SectionGroup({ definition, activeHref, fireFollow, fireChange, position }: SectionGroupProps) {
  return (
    <div className={styles['section-group']}>
      <InternalBox className={styles['section-group-title']} variant="h3">
        {definition.title}
      </InternalBox>
      <NavigationItemsList
        variant="section-group"
        items={definition.items}
        fireFollow={fireFollow}
        fireChange={fireChange}
        activeHref={activeHref}
        position={position}
      />
    </div>
  );
}

interface LinkGroupProps extends BaseItemComponentProps {
  definition: SideNavigationProps.LinkGroup;
}

function LinkGroup({ definition, activeHref, fireFollow, fireChange, position }: LinkGroupProps) {
  checkSafeUrl('SideNavigation', definition.href);

  return (
    <>
      <Link
        definition={{ type: 'link', href: definition.href, text: definition.text, info: definition.info }}
        fireFollow={(_, event) => fireFollow(definition, event)}
        fireChange={fireChange}
        activeHref={activeHref}
        position={position}
      />
      <NavigationItemsList
        variant="link-group"
        items={definition.items}
        fireFollow={fireFollow}
        fireChange={fireChange}
        activeHref={activeHref}
        position={position}
      />
    </>
  );
}

interface ExpandableLinkGroupProps extends BaseItemComponentProps {
  definition: SideNavigationProps.ExpandableLinkGroup;
  variant: 'section' | 'section-group' | 'link-group' | 'expandable-link-group' | 'root';
}

function ExpandableLinkGroup({
  definition,
  fireFollow,
  fireChange,
  activeHref,
  variant,
  position,
}: ExpandableLinkGroupProps) {
  // Check whether the definition contains an active link and memoize it to avoid
  // rechecking every time.
  const containsActiveLink = useMemo(() => {
    return activeHref ? hasActiveLink(definition.items, activeHref) : false;
  }, [activeHref, definition.items]);

  const [expanded, setExpanded] = useState<boolean>(() => {
    return definition.defaultExpanded ?? (definition.href === activeHref || containsActiveLink);
  });

  const [userExpanded, setUserExpanded] = useState<boolean | undefined>();

  // Reset user expansion status when the items property is updated.
  useEffect(() => setUserExpanded(undefined), [definition]);

  // By default, the expandable section is open when there's an active link inside.
  useEffect(() => {
    setExpanded(definition.href === activeHref || containsActiveLink);
  }, [definition.href, containsActiveLink, activeHref]);

  // If the definition object itself is updated, reset the expansion state to default.
  useEffect(() => {
    if (definition.defaultExpanded !== undefined) {
      setExpanded(definition.defaultExpanded);
    }
  }, [definition]);

  const onExpandedChange = useCallback(
    (e: NonCancelableCustomEvent<ExpandableSectionProps.ChangeDetail>) => {
      fireChange(definition, e.detail.expanded);
      setUserExpanded(e.detail.expanded);
    },
    [definition, fireChange]
  );

  const onHeaderFollow: LinkProps['fireFollow'] = (_, event) => {
    fireFollow(definition, event);
    setUserExpanded(true);
    if (!expanded) {
      fireChange(definition, true);
    }
  };

  return (
    <InternalExpandableSection
      className={clsx(
        styles['expandable-link-group'],
        variant === 'section-group' && styles['expandable-link-group--no-ident']
      )}
      variant="navigation"
      expanded={userExpanded ?? expanded}
      onChange={onExpandedChange}
      headerText={
        <Link
          definition={{ type: 'link', href: definition.href, text: definition.text }}
          expanded={userExpanded ?? expanded}
          fireFollow={onHeaderFollow}
          fireChange={fireChange}
          activeHref={activeHref}
          position={position}
        />
      }
    >
      <NavigationItemsList
        variant="expandable-link-group"
        items={definition.items}
        fireFollow={fireFollow}
        fireChange={fireChange}
        activeHref={activeHref}
        position={position}
      />
    </InternalExpandableSection>
  );
}
