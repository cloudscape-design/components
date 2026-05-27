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
import { isPlainLeftClick, NonCancelableCustomEvent } from '../internal/events';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import { checkSafeUrl } from '../internal/utils/check-safe-url';
import Tooltip from '../tooltip/internal';
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
  expandIconPosition?: SideNavigationProps.ExpandIconPosition;
  collapsed?: boolean;
  // Renamed from `variant` (which is already used for the list variant) so we
  // can plumb the SideNavigation public `variant` prop down to each link.
  highlightVariant?: SideNavigationProps.Variant;
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
  expandIconPosition,
  collapsed,
  highlightVariant,
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
    // In collapsed mode, only selectable items are visible (links, link-groups, ELGs).
    // Sections and section-groups are non-selectable containers — skip them.
    if (collapsed && (item.type === 'section' || item.type === 'section-group')) {
      return;
    }
    if (collapsed && item.type !== 'divider' && !item.icon) {
      return;
    }
    switch (item.type) {
      case 'divider': {
        const dividerIndex = lists.length;
        lists[dividerIndex] = {
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
        return;
      }
      case 'link': {
        lists[currentListIndex].items?.push({
          element: (
            <li
              key={index}
              data-itemid={`item-${itemid}`}
              className={clsx(styles['list-item'], collapsed && styles['list-item--collapsed'])}
            >
              <Link
                definition={item}
                activeHref={activeHref}
                fireChange={fireChange}
                fireFollow={fireFollow}
                position={itemPosition}
                collapsed={collapsed}
                highlightVariant={highlightVariant}
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
                expandIconPosition={expandIconPosition}
                collapsed={collapsed}
                highlightVariant={highlightVariant}
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
                expandIconPosition={expandIconPosition}
                collapsed={collapsed}
                highlightVariant={highlightVariant}
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
              className={clsx(styles['list-item'], collapsed && styles['list-item--collapsed'])}
            >
              <LinkGroup
                definition={item}
                activeHref={activeHref}
                fireChange={fireChange}
                fireFollow={fireFollow}
                position={itemPosition}
                expandIconPosition={expandIconPosition}
                collapsed={collapsed}
                highlightVariant={highlightVariant}
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
                expandIconPosition={expandIconPosition}
                collapsed={collapsed}
                highlightVariant={highlightVariant}
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
        // Divider — skip if preceded by another divider or empty segment.
        const prevVisible = lists
          .slice(0, index)
          .reverse()
          .find(l => !l.items || l.items.length > 0);
        return !prevVisible || (prevVisible.items !== undefined && prevVisible.items.length > 0);
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
                [styles['list-variant-root--symmetric']]:
                  list.listVariant === 'root' && (collapsed || expandIconPosition === 'end'),
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
                [styles['list-variant-root--symmetric']]:
                  list.listVariant === 'root' && (collapsed || expandIconPosition === 'end'),
                [styles[`expand-icon-end`]]: expandIconPosition === 'end',
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
      className={clsx(styles.divider, styles[`divider-${variant}`], collapsed && styles['divider-collapsed'])}
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
        collapsed && styles['item-icon-collapsed'],
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

function Link({ definition, activeHref, fireFollow, position, collapsed, highlightVariant }: LinkProps) {
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
          [styles['link--active']]: isActive,
          [styles['link--collapsed']]: collapsed,
          [styles['link--pill']]: highlightVariant === 'highlighted',
        })}
        target={definition.external ? '_blank' : undefined}
        rel={definition.external ? 'noopener noreferrer' : undefined}
        aria-current={definition.href === activeHref ? 'page' : undefined}
        aria-label={collapsed ? definition.text : undefined}
        onClick={onClick}
        {...(collapsed ? collapsedTooltip.triggerProps : {})}
        {...getAnalyticsMetadataAttribute(clickActionAnalyticsMetadata)}
      >
        <ItemIcon icon={definition.icon} collapsed={collapsed} />
        {!collapsed && <span className={analyticsSelectors['link-text']}>{definition.text}</span>}
        {!collapsed && definition.external && (
          <span aria-label={renderedExternalIconAriaLabel} role={renderedExternalIconAriaLabel ? 'img' : undefined}>
            <InternalIcon name="external" className={styles['external-icon']} />
          </span>
        )}
      </a>
      {!collapsed && definition.info && (
        <span className={clsx(styles.info, testUtilStyles.info)}>{definition.info}</span>
      )}
      {collapsed && collapsedTooltip.tooltip}
    </>
  );
}

interface SectionProps extends BaseItemComponentProps {
  definition: SideNavigationProps.Section;
  variant: 'section' | 'section-group' | 'link-group' | 'expandable-link-group' | 'root';
}

function Section({
  definition,
  activeHref,
  fireFollow,
  fireChange,
  variant,
  position,
  expandIconPosition,
  collapsed,
  highlightVariant,
}: SectionProps) {
  const [expanded, setExpanded] = useState<boolean>(definition.defaultExpanded ?? true);
  const isVisualRefresh = useVisualRefresh();
  const collapsedTooltip = useCollapsedTooltip<HTMLSpanElement>(definition.text);

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
    return (
      <>
        <ItemIcon
          ref={collapsedTooltip.triggerRef}
          icon={definition.icon}
          collapsed={collapsed}
          aria-label={definition.text}
          {...collapsedTooltip.triggerProps}
        />
        {collapsedTooltip.tooltip}
      </>
    );
  }

  const isNestedInSectionGroup = variant === 'section-group';

  return (
    <InternalExpandableSection
      variant="footer"
      expanded={expanded}
      onChange={onExpandedChange}
      className={clsx(
        styles.section,
        isNestedInSectionGroup && styles['section--no-ident'],
        expandIconPosition === 'end' && styles['section--expand-icon-end'],
        isVisualRefresh && styles.refresh
      )}
      headerText={
        definition.icon ? (
          <span className={styles['section-header-text']}>
            <ItemIcon icon={definition.icon} />
            {definition.text}
          </span>
        ) : (
          definition.text
        )
      }
      __expandIconPosition={expandIconPosition}
    >
      <NavigationItemsList
        variant="section"
        items={definition.items}
        fireFollow={fireFollow}
        fireChange={fireChange}
        activeHref={activeHref}
        position={position}
        expandIconPosition={expandIconPosition}
        highlightVariant={highlightVariant}
      />
    </InternalExpandableSection>
  );
}

interface SectionGroupProps extends BaseItemComponentProps {
  definition: SideNavigationProps.SectionGroup;
}

function SectionGroup({
  definition,
  activeHref,
  fireFollow,
  fireChange,
  position,
  expandIconPosition,
  collapsed,
  highlightVariant,
}: SectionGroupProps) {
  const collapsedTooltip = useCollapsedTooltip<HTMLSpanElement>(definition.title);

  if (collapsed) {
    return (
      <>
        <ItemIcon
          ref={collapsedTooltip.triggerRef}
          icon={definition.icon}
          collapsed={collapsed}
          aria-label={definition.title}
          {...collapsedTooltip.triggerProps}
        />
        {collapsedTooltip.tooltip}
      </>
    );
  }
  return (
    <div className={styles['section-group']}>
      <InternalBox className={styles['section-group-title']} variant="h3">
        <ItemIcon icon={definition.icon} />
        {definition.title}
      </InternalBox>
      <NavigationItemsList
        variant="section-group"
        items={definition.items}
        fireFollow={fireFollow}
        fireChange={fireChange}
        activeHref={activeHref}
        position={position}
        expandIconPosition={expandIconPosition}
        highlightVariant={highlightVariant}
      />
    </div>
  );
}

interface LinkGroupProps extends BaseItemComponentProps {
  definition: SideNavigationProps.LinkGroup;
}

function LinkGroup({
  definition,
  activeHref,
  fireFollow,
  fireChange,
  position,
  expandIconPosition,
  collapsed,
  highlightVariant,
}: LinkGroupProps) {
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
        highlightVariant={highlightVariant}
      />
      {!collapsed && (
        <NavigationItemsList
          variant="link-group"
          items={definition.items}
          fireFollow={fireFollow}
          fireChange={fireChange}
          activeHref={activeHref}
          position={position}
          expandIconPosition={expandIconPosition}
          highlightVariant={highlightVariant}
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
  expandIconPosition,
  collapsed,
  highlightVariant,
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
        highlightVariant={highlightVariant}
      />
    );
  }

  return (
    <InternalExpandableSection
      className={clsx(
        styles['expandable-link-group'],
        variant === 'section-group' && styles['expandable-link-group--no-ident'],
        expandIconPosition === 'end' && styles['expandable-link-group--expand-icon-end'],
        highlightVariant === 'highlighted' && definition.href === activeHref && styles['expandable-link-group-active']
      )}
      variant="navigation"
      expanded={userExpanded ?? expanded}
      onChange={onExpandedChange}
      headerText={
        // The ELG header link doesn't carry highlightVariant — the ELG
        // wrapper handles the active background via expandable-link-group-active.
        <Link
          definition={{ type: 'link', href: definition.href, text: definition.text, icon: definition.icon }}
          fireFollow={onHeaderFollow}
          fireChange={fireChange}
          activeHref={activeHref}
          position={position}
        />
      }
      __expandIconPosition={expandIconPosition}
    >
      <NavigationItemsList
        variant="expandable-link-group"
        items={definition.items}
        fireFollow={fireFollow}
        fireChange={fireChange}
        activeHref={activeHref}
        position={position}
        expandIconPosition={expandIconPosition}
        highlightVariant={highlightVariant}
      />
    </InternalExpandableSection>
  );
}
