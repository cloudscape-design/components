// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';

import { getAnalyticsMetadataAttribute } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

import InternalBox from '../box/internal';
import { ExpandableSectionProps } from '../expandable-section/interfaces';
import InternalExpandableSection from '../expandable-section/internal';
import { useInternalI18n } from '../i18n/context';
import InternalIcon from '../icon/internal';
import { isPlainLeftClick } from '../internal/events';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import { checkSafeUrl } from '../internal/utils/check-safe-url';
import Tooltip from '../tooltip/internal';
import { NonCancelableCustomEvent } from '../types/events';
import { GeneratedAnalyticsMetadataSideNavigationClick } from './analytics-metadata/interfaces';
import { SideNavigationProps } from './interfaces';
import { hasActiveLink } from './util';

import analyticsSelectors from './analytics-metadata/styles.css.js';
import styles from './styles.css.js';
import testUtilStyles from './test-classes/styles.css.js';

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
  collapsed?: boolean;
}

interface HeaderProps extends BaseItemComponentProps {
  definition: SideNavigationProps.Header;
}

export function Header({ definition, activeHref, fireFollow, collapsed }: HeaderProps) {
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
      <h2 className={clsx(styles.header, collapsed && styles['header--collapsed'])}>
        <a
          href={definition.href}
          className={clsx(styles['header-link'], { [styles['header-link--has-logo']]: !!definition.logo })}
          aria-current={definition.href === activeHref ? 'page' : undefined}
          aria-label={collapsed ? definition.text : undefined}
          onClick={onClick}
          {...getAnalyticsMetadataAttribute(clickActionAnalyticsMetadata)}
        >
          {definition.logo &&
            (definition.logo.svg ? (
              <span
                className={clsx(styles['header-logo'], {
                  [styles['header-logo--stretched']]: !definition.text || collapsed,
                })}
              >
                {definition.logo.svg}
              </span>
            ) : (
              <img
                className={clsx(styles['header-logo'], {
                  [styles['header-logo--stretched']]: !definition.text || collapsed,
                })}
                src={definition.logo.src}
                alt={definition.logo.alt}
              />
            ))}
          {!collapsed && (
            <span className={clsx(styles['header-link-text'], analyticsSelectors['header-link-text'])}>
              {definition.text}
            </span>
          )}
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
  collapsed,
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

    // Emits a divider as its own list segment (dividers break the <ul> grouping).
    function pushDivider() {
      lists[lists.length] = {
        listVariant: variant,
        element: (
          <div data-itemid={`item-${itemid}`}>
            <Divider variant="default" collapsed={collapsed} />
          </div>
        ),
      };
      currentListIndex = lists.length;
      lists[currentListIndex] = {
        listVariant: variant,
        items: [],
      };
    }

    // Renders icon-bearing children of a container item as a collapsed group.
    // The inner <ul> carries the group label so list semantics are preserved
    // for screen readers even when the visual header is hidden.
    function pushCollapsedGroup(
      children: ReadonlyArray<SideNavigationProps.Item>,
      label: string,
      { leadingDivider = false }: { leadingDivider?: boolean } = {}
    ) {
      const iconChildren = children.filter(child => (child as SideNavigationProps.Link).icon);
      if (iconChildren.length === 0) {
        return;
      }
      // A section's title is hidden when collapsed; render a divider in its place
      if (leadingDivider) {
        pushDivider();
      }
      const groupElements = iconChildren.map((child, childIndex) => {
        const childPosition = `${position ? `${position},` : ''}${itemid},${childIndex + 1}`;
        return (
          <li key={childPosition} className={clsx(styles['list-item'], styles['list-item--collapsed'])}>
            <Link
              definition={child as SideNavigationProps.Link}
              activeHref={activeHref}
              fireFollow={fireFollow}
              fireChange={fireChange}
              position={childPosition}
              collapsed={collapsed}
            />
          </li>
        );
      });
      const prevItem = index > 0 ? items[index - 1] : null;
      const nextItem = index < items.length - 1 ? items[index + 1] : null;
      lists[currentListIndex].items?.push({
        element: (
          <li
            key={`group-${itemid}`}
            className={clsx(
              styles['list-item--group'],
              (leadingDivider || prevItem?.type === 'divider') && styles['list-item--group-no-padding-start'],
              nextItem?.type === 'divider' && styles['list-item--group-no-padding-end']
            )}
          >
            <ul className={styles['list--collapsed-group']} aria-label={label}>
              {groupElements}
            </ul>
          </li>
        ),
      });
    }

    // In collapsed mode, flatten container items to show only icon-bearing children.
    if (collapsed && (item.type === 'expandable-link-group' || item.type === 'link-group') && !item.icon) {
      const group = item as SideNavigationProps.ExpandableLinkGroup | SideNavigationProps.LinkGroup;
      pushCollapsedGroup(group.items, group.text);
      return;
    }
    if (collapsed && (item.type === 'section' || item.type === 'section-group')) {
      const sectionLabel =
        item.type === 'section'
          ? (item as SideNavigationProps.Section).text
          : (item as SideNavigationProps.SectionGroup).title;
      // Section-groups may contain nested sections — flatten one level.
      const childItems =
        item.type === 'section'
          ? (item as SideNavigationProps.Section).items
          : (item as SideNavigationProps.SectionGroup).items.flatMap(child =>
              child.type === 'section' ? (child as SideNavigationProps.Section).items : [child]
            );
      pushCollapsedGroup(childItems, sectionLabel, { leadingDivider: true });
      return;
    }
    if (collapsed && item.type !== 'divider' && !(item as SideNavigationProps.Link).icon) {
      return;
    }
    switch (item.type) {
      case 'divider': {
        pushDivider();
        return;
      }
      case 'link': {
        lists[currentListIndex].items?.push({
          element: (
            <li
              key={index}
              data-itemid={`item-${itemid}`}
              className={clsx(
                styles['list-item'],
                collapsed && styles['list-item--collapsed'],
                item.info && styles['list-item--info']
              )}
            >
              <Link
                definition={item}
                activeHref={activeHref}
                fireChange={fireChange}
                fireFollow={fireFollow}
                position={itemPosition}
                collapsed={collapsed}
              />
            </li>
          ),
        });
        return;
      }
      case 'section': {
        lists[currentListIndex].items?.push({
          element: (
            <li
              key={index}
              data-itemid={`item-${itemid}`}
              className={clsx(styles['list-item'], collapsed && styles['list-item--collapsed'])}
            >
              <Section
                definition={item}
                activeHref={activeHref}
                variant={variant}
                fireChange={fireChange}
                fireFollow={fireFollow}
                position={itemPosition}
                collapsed={collapsed}
              />
            </li>
          ),
        });
        return;
      }
      case 'section-group': {
        lists[currentListIndex].items?.push({
          element: (
            <li
              key={index}
              data-itemid={`item-${itemid}`}
              className={clsx(styles['list-item'], collapsed && styles['list-item--collapsed'])}
            >
              <SectionGroup
                definition={item}
                activeHref={activeHref}
                fireChange={fireChange}
                fireFollow={fireFollow}
                position={itemPosition}
                collapsed={collapsed}
              />
            </li>
          ),
        });
        return;
      }
      case 'link-group': {
        lists[currentListIndex].items?.push({
          element: (
            <li
              key={index}
              data-itemid={`item-${itemid}`}
              className={clsx(
                styles['list-item'],
                collapsed && styles['list-item--collapsed'],
                item.info && styles['list-item--info']
              )}
            >
              <LinkGroup
                definition={item}
                activeHref={activeHref}
                fireChange={fireChange}
                fireFollow={fireFollow}
                position={itemPosition}
                collapsed={collapsed}
              />
            </li>
          ),
        });
        return;
      }
      case 'expandable-link-group': {
        lists[currentListIndex].items?.push({
          element: (
            <li
              key={index}
              data-itemid={`item-${itemid}`}
              className={clsx(styles['list-item'], collapsed && styles['list-item--collapsed'])}
            >
              <ExpandableLinkGroup
                definition={item}
                activeHref={activeHref}
                fireChange={fireChange}
                fireFollow={fireFollow}
                variant={variant}
                position={itemPosition}
                collapsed={collapsed}
              />
            </li>
          ),
        });
        return;
      }
    }
  });

  // In collapsed mode, skip empty item segments and deduplicate consecutive dividers.
  const filteredLists = collapsed
    ? lists.filter((list, index) => {
        if (list.items) {
          return list.items.length > 0;
        }
        // Divider — skip if preceded by another divider or empty segment, or followed by nothing.
        const prevVisible = lists
          .slice(0, index)
          .reverse()
          .find(l => !l.items || l.items.length > 0);
        const nextVisible = lists.slice(index + 1).find(l => !l.items || l.items.length > 0);
        return (
          (!prevVisible || (prevVisible.items !== undefined && prevVisible.items.length > 0)) &&
          nextVisible !== undefined &&
          (nextVisible.items === undefined || nextVisible.items.length > 0)
        );
      })
    : lists;

  return (
    <>
      {filteredLists.map((list, index) => {
        if (!list.items || list.items.length === 0) {
          return (
            <div
              key={`hr-${index}`}
              className={clsx(styles.list, styles[`list-variant-${variant}`], {
                [styles['list-variant-root--first']]: list.listVariant === 'root' && index === 0,
                [styles['list-variant-root--collapsed']]: list.listVariant === 'root' && collapsed,
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
                [styles['list-variant-root--collapsed']]: list.listVariant === 'root' && collapsed,
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
  collapsed?: boolean;
}

function Divider({ variant = 'default', isPresentational = false, collapsed }: DividerProps) {
  return (
    <hr
      className={clsx(styles.divider, styles[`divider-${variant}`], collapsed && styles['divider--collapsed'])}
      role={isPresentational ? 'presentation' : undefined}
    />
  );
}

interface LinkProps extends BaseItemComponentProps {
  definition: SideNavigationProps.Link;
}

interface ItemIconProps extends React.HTMLAttributes<HTMLSpanElement> {
  icon: React.ReactNode;
  collapsed?: boolean;
}

const ItemIcon = React.forwardRef<HTMLSpanElement, ItemIconProps>(function ItemIcon(
  { icon, collapsed, className, ...rest },
  ref
) {
  if (!icon) {
    return null;
  }
  return (
    <span
      ref={ref}
      className={clsx(
        styles['item-icon'],
        testUtilStyles['item-icon'],
        collapsed && styles['item-icon--collapsed'],
        className
      )}
      {...rest}
    >
      {icon}
    </span>
  );
});

// Manages a tooltip that shows the item's text label on focus or hover.
// Used in the collapsed state, where the visible labels are hidden, to give
// pointer and keyboard users a way to identify each item without relying on
// their browser's native title popup.
function useCollapsedTooltip<T extends HTMLElement>(label: React.ReactNode) {
  const [show, setShow] = useState(false);
  const triggerRef = useRef<T | null>(null);

  const triggerProps = {
    onFocus: () => setShow(true),
    onBlur: () => setShow(false),
    onMouseEnter: () => setShow(true),
    onMouseLeave: () => setShow(false),
  };

  const tooltip = show ? (
    <Tooltip getTrack={() => triggerRef.current} content={label} position="right" onEscape={() => setShow(false)} />
  ) : null;

  return { triggerRef, triggerProps, tooltip };
}

function Link({ definition, activeHref, fireFollow, position, collapsed }: LinkProps) {
  checkSafeUrl('SideNavigation', definition.href);
  const isActive = definition.href === activeHref;
  const i18n = useInternalI18n('link');
  const collapsedTooltip = useCollapsedTooltip<HTMLAnchorElement>(definition.text);

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

  const renderedExternalIconAriaLabel = i18n('externalIconAriaLabel', definition.externalIconAriaLabel);

  return (
    <>
      <a
        ref={collapsed ? collapsedTooltip.triggerRef : undefined}
        href={definition.href}
        className={clsx(styles.link, {
          [styles['link-active']]: isActive,
          [styles['link--collapsed']]: collapsed,
        })}
        target={definition.external ? '_blank' : undefined}
        rel={definition.external ? 'noopener noreferrer' : undefined}
        aria-current={definition.href === activeHref ? 'page' : undefined}
        aria-label={collapsed ? definition.text : undefined}
        onClick={onClick}
        {...(collapsed ? collapsedTooltip.triggerProps : {})}
        {...getAnalyticsMetadataAttribute(clickActionAnalyticsMetadata)}
      >
        <ItemIcon icon={definition.icon} collapsed={collapsed} aria-hidden={collapsed ? true : undefined} />
        {!collapsed && (
          <span className={styles['link-text-wrapper']}>
            <span className={analyticsSelectors['link-text']}>{definition.text}</span>
            {definition.external && (
              <span aria-label={renderedExternalIconAriaLabel} role={renderedExternalIconAriaLabel ? 'img' : undefined}>
                <InternalIcon name="external" className={styles['external-icon']} />
              </span>
            )}
          </span>
        )}
        {collapsed && collapsedTooltip.tooltip}
      </a>
      {!collapsed && definition.info && (
        <span className={clsx(styles.info, testUtilStyles.info)}>{definition.info}</span>
      )}
    </>
  );
}

interface SectionProps extends BaseItemComponentProps {
  definition: SideNavigationProps.Section;
  variant: 'section' | 'section-group' | 'link-group' | 'expandable-link-group' | 'root';
}

function Section({ definition, activeHref, fireFollow, fireChange, variant, position, collapsed }: SectionProps) {
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

  if (collapsed) {
    return null;
  }

  const isInSectionGroup = variant === 'section-group';

  return (
    <InternalExpandableSection
      variant="footer"
      expanded={expanded}
      onChange={onExpandedChange}
      className={clsx(
        styles.section,
        isInSectionGroup && styles['section--no-ident'],
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

function SectionGroup({ definition, activeHref, fireFollow, fireChange, position, collapsed }: SectionGroupProps) {
  if (collapsed) {
    return null;
  }
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

function LinkGroup({ definition, activeHref, fireFollow, fireChange, position, collapsed }: LinkGroupProps) {
  checkSafeUrl('SideNavigation', definition.href);

  return (
    <>
      <Link
        definition={{
          type: 'link',
          href: definition.href,
          text: definition.text,
          info: definition.info,
          icon: definition.icon,
        }}
        fireFollow={(_, event) => fireFollow(definition, event)}
        fireChange={fireChange}
        activeHref={activeHref}
        position={position}
        collapsed={collapsed}
      />
      {!collapsed && (
        <NavigationItemsList
          variant="link-group"
          items={definition.items}
          fireFollow={fireFollow}
          fireChange={fireChange}
          activeHref={activeHref}
          position={position}
        />
      )}
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
  collapsed,
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

  if (collapsed) {
    return (
      <Link
        definition={{ type: 'link', href: definition.href, text: definition.text, icon: definition.icon }}
        fireFollow={onHeaderFollow}
        fireChange={fireChange}
        activeHref={activeHref}
        position={position}
        collapsed={collapsed}
      />
    );
  }

  return (
    <InternalExpandableSection
      className={clsx(
        styles['expandable-link-group'],
        variant === 'section-group' && styles['expandable-link-group--no-ident'],
        definition.href === activeHref && styles['expandable-link-group--active']
      )}
      variant="navigation"
      expanded={userExpanded ?? expanded}
      onChange={onExpandedChange}
      headerText={
        <Link
          definition={{ type: 'link', href: definition.href, text: definition.text, icon: definition.icon }}
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
