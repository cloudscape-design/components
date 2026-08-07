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
import { Transition } from '../internal/components/transition';
import { isPlainLeftClick } from '../internal/events';
import { useOneTheme, useVisualRefresh } from '../internal/hooks/use-visual-mode';
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
  activeTooltip?: string | null;
  setActiveTooltip?: (position: string | null) => void;
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
      {!collapsed && (
        <h2 className={styles.header}>
          <a
            href={definition.href}
            className={clsx(styles['header-link'], { [styles['header-link--has-logo']]: !!definition.logo })}
            aria-current={definition.href === activeHref ? 'page' : undefined}
            onClick={onClick}
            {...getAnalyticsMetadataAttribute(clickActionAnalyticsMetadata)}
          >
            {definition.logo &&
              (definition.logo.svg ? (
                <span
                  className={clsx(styles['header-logo'], {
                    [styles['header-logo--stretched']]: !definition.text,
                  })}
                >
                  {definition.logo.svg}
                </span>
              ) : (
                <img
                  className={clsx(styles['header-logo'], {
                    [styles['header-logo--stretched']]: !definition.text,
                  })}
                  src={definition.logo.src}
                  alt={definition.logo.alt}
                />
              ))}
            <span className={clsx(styles['header-link-text'], analyticsSelectors['header-link-text'])}>
              {definition.text}
            </span>
          </a>
        </h2>
      )}
      {!collapsed && <Divider isPresentational={true} variant="header" />}
    </>
  );
}

interface NavigationItemsListProps extends BaseItemComponentProps {
  items: ReadonlyArray<SideNavigationProps.Item>;
  variant: 'section' | 'section-group' | 'link-group' | 'expandable-link-group' | 'root';
  withIcons?: boolean;
  ariaLabel?: string;
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
  withIcons,
  ariaLabel,
  activeTooltip,
  setActiveTooltip,
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
      lists.push({
        listVariant: variant,
        element: (
          <div data-itemid={`item-${itemid}`} className={clsx(collapsed && styles['list-item--group'])}>
            <Divider variant="default" collapsed={collapsed} />
          </div>
        ),
      });
      currentListIndex =
        lists.push({
          listVariant: variant,
          items: [],
        }) - 1;
    }

    // In collapsed mode, hide plain links without icons (they have no visual representation).
    // Exception: link-group / expandable-link-group children must stay rendered so
    // the grid-template-rows collapse animation has content to transition.
    if (
      collapsed &&
      item.type === 'link' &&
      !(item as SideNavigationProps.Link).icon &&
      variant !== 'link-group' &&
      variant !== 'expandable-link-group'
    ) {
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
              className={clsx(styles['list-item'], collapsed && styles['list-item--collapsed'])}
            >
              <Link
                definition={item}
                activeHref={activeHref}
                fireChange={fireChange}
                fireFollow={fireFollow}
                position={itemPosition}
                collapsed={collapsed}
                activeTooltip={activeTooltip}
                setActiveTooltip={setActiveTooltip}
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
              className={clsx(
                styles['list-item'],
                collapsed && styles['list-item--collapsed'],
                collapsed && styles['list-item--group']
              )}
            >
              <Section
                definition={item}
                activeHref={activeHref}
                variant={variant}
                fireChange={fireChange}
                fireFollow={fireFollow}
                position={itemPosition}
                collapsed={collapsed}
                withIcons={withIcons}
                activeTooltip={activeTooltip}
                setActiveTooltip={setActiveTooltip}
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
              className={clsx(
                styles['list-item'],
                collapsed && styles['list-item--collapsed'],
                collapsed && styles['list-item--group']
              )}
            >
              <SectionGroup
                definition={item}
                activeHref={activeHref}
                fireChange={fireChange}
                fireFollow={fireFollow}
                position={itemPosition}
                collapsed={collapsed}
                withIcons={withIcons}
                activeTooltip={activeTooltip}
                setActiveTooltip={setActiveTooltip}
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
                collapsed && styles['list-item--group']
              )}
            >
              <LinkGroup
                definition={item}
                activeHref={activeHref}
                fireChange={fireChange}
                fireFollow={fireFollow}
                position={itemPosition}
                collapsed={collapsed}
                withIcons={withIcons}
                activeTooltip={activeTooltip}
                setActiveTooltip={setActiveTooltip}
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
              className={clsx(
                styles['list-item'],
                collapsed && styles['list-item--collapsed'],
                collapsed && styles['list-item--group']
              )}
            >
              <ExpandableLinkGroup
                definition={item}
                activeHref={activeHref}
                fireChange={fireChange}
                fireFollow={fireFollow}
                variant={variant}
                position={itemPosition}
                collapsed={collapsed}
                withIcons={withIcons}
                activeTooltip={activeTooltip}
                setActiveTooltip={setActiveTooltip}
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
                [styles[`list-variant-${list.listVariant}--collapsed`]]: collapsed,
                [styles['list--with-icons']]: withIcons,
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
                [styles[`list-variant-${list.listVariant}--collapsed`]]: collapsed,
                [styles['list--with-icons']]: withIcons,
              })}
              aria-label={ariaLabel}
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
function useCollapsedTooltip<T extends HTMLElement>({
  label,
  position,
  activeTooltip,
  setActiveTooltip,
}: {
  label: React.ReactNode;
  position?: string;
  activeTooltip?: string | null;
  setActiveTooltip?: (position: string | null) => void;
}) {
  const triggerRef = useRef<T | null>(null);
  const id = position ?? '';
  const show = activeTooltip === id;

  const claim = () => setActiveTooltip?.(id);
  const release = () => {
    if (activeTooltip === id) {
      setActiveTooltip?.(null);
    }
  };

  const triggerProps = {
    onFocus: claim,
    onBlur: release,
    onMouseEnter: claim,
    onMouseLeave: release,
  };

  const tooltip = show ? (
    <Tooltip getTrack={() => triggerRef.current} content={label} position="right" onEscape={release} />
  ) : null;

  return { triggerRef, triggerProps, tooltip };
}

function Link({ definition, activeHref, fireFollow, position, collapsed, activeTooltip, setActiveTooltip }: LinkProps) {
  checkSafeUrl('SideNavigation', definition.href);
  const isActive = definition.href === activeHref;
  const i18n = useInternalI18n('link');
  const linkRef = useRef<HTMLAnchorElement>(null);
  const collapsedTooltip = useCollapsedTooltip<HTMLAnchorElement>({
    label: definition.text,
    position,
    activeTooltip,
    setActiveTooltip,
  });

  // Make icon-less collapsed links inert (they collapse to 0×0 and must
  // not be focusable or visible to assistive technology).
  const isIconLess = !definition.icon;
  useEffect(() => {
    if (linkRef.current) {
      linkRef.current.inert = !!(collapsed && isIconLess);
    }
  }, [collapsed, isIconLess]);

  // Merge linkRef with collapsedTooltip.triggerRef so both can track the <a>.
  const mergedRef = useCallback(
    (node: HTMLAnchorElement | null) => {
      (linkRef as React.MutableRefObject<HTMLAnchorElement | null>).current = node;
      if (collapsed) {
        (collapsedTooltip.triggerRef as React.MutableRefObject<HTMLAnchorElement | null>).current = node;
      }
    },
    [collapsed, collapsedTooltip.triggerRef]
  );

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

  const showInfo = !collapsed && definition.info;

  const internalLink = (
    <a
      ref={mergedRef}
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
      <span
        className={clsx(styles['link-text-wrapper'], collapsed && styles['link-text-wrapper--collapsed'])}
        aria-hidden={collapsed ? true : undefined}
      >
        <span className={clsx(styles['link-text-wrapper-content'])}>
          <span className={analyticsSelectors['link-text']}>{definition.text}</span>
          {definition.external && (
            <span aria-label={renderedExternalIconAriaLabel} role={renderedExternalIconAriaLabel ? 'img' : undefined}>
              <InternalIcon name="external" className={styles['external-icon']} />
            </span>
          )}
        </span>
      </span>
      {collapsed && collapsedTooltip.tooltip}
    </a>
  );
  return showInfo ? (
    <div className={styles['list-item--link-with-info']}>
      {internalLink}
      <span className={clsx(styles.info, testUtilStyles.info)}>{definition.info}</span>
    </div>
  ) : (
    internalLink
  );
}

interface SectionProps extends BaseItemComponentProps {
  definition: SideNavigationProps.Section;
  variant: 'section' | 'section-group' | 'link-group' | 'expandable-link-group' | 'root';
  withIcons?: boolean;
}

function Section({
  definition,
  activeHref,
  fireFollow,
  fireChange,
  variant,
  position,
  collapsed,
  withIcons,
  activeTooltip,
  setActiveTooltip,
}: SectionProps) {
  const [expanded, setExpanded] = useState<boolean>(definition.defaultExpanded ?? true);
  const isVisualRefresh = useVisualRefresh();
  const sectionRef = useRef<HTMLDivElement>(null);

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

  // Sections are transparent in the collapsed rail — only the header is made inert
  // so child links remain focusable. The header hosts the expand toggle that must
  // leave the tab order when collapsed.
  useEffect(() => {
    const el = sectionRef.current as HTMLElement | null;
    if (el) {
      el.inert = false;
      const header = el.firstElementChild as HTMLElement | null;
      if (header) {
        header.inert = !!collapsed;
      }
    }
  }, [collapsed]);

  const isInSectionGroup = variant === 'section-group';

  return (
    <InternalExpandableSection
      variant="footer"
      expanded={collapsed ? true : expanded}
      onChange={onExpandedChange}
      disableContentPaddings={true}
      __internalRootRef={sectionRef}
      className={clsx(
        styles.section,
        isInSectionGroup && styles['section--no-ident'],
        withIcons && styles['section--expand-icon-end'],
        isVisualRefresh && styles.refresh,
        collapsed && styles['section--collapsed']
      )}
      headerText={
        <span
          className={clsx(styles['section-header'], styles['label-text'], collapsed && styles['label-text--collapsed'])}
          aria-hidden={collapsed ? true : undefined}
        >
          {definition.text}
        </span>
      }
      __expandIconPosition={withIcons ? 'end' : 'start'}
    >
      <NavigationItemsList
        variant="section"
        items={definition.items}
        fireFollow={fireFollow}
        fireChange={fireChange}
        activeHref={activeHref}
        position={position}
        collapsed={collapsed}
        withIcons={withIcons}
        ariaLabel={collapsed ? definition.text : undefined}
        activeTooltip={activeTooltip}
        setActiveTooltip={setActiveTooltip}
      />
    </InternalExpandableSection>
  );
}

interface SectionGroupProps extends BaseItemComponentProps {
  definition: SideNavigationProps.SectionGroup;
  withIcons?: boolean;
}

function SectionGroup({
  definition,
  activeHref,
  fireFollow,
  fireChange,
  position,
  collapsed,
  withIcons,
  activeTooltip,
  setActiveTooltip,
}: SectionGroupProps) {
  const isOneTheme = useOneTheme();
  const sectionGroupRef = useRef<HTMLDivElement>(null);

  // Section-groups are transparent — children are always promoted in the collapsed rail.
  useEffect(() => {
    if (sectionGroupRef.current) {
      sectionGroupRef.current.inert = false;
    }
  }, [collapsed]);

  return (
    <div ref={sectionGroupRef} className={styles['section-group']}>
      <InternalBox
        className={clsx(styles['section-group-title'], collapsed && styles['section-group-title--collapsed'])}
        variant="h3"
        fontSize={isOneTheme ? 'heading-s' : undefined}
      >
        <span
          className={clsx(styles['label-text'], collapsed && styles['label-text--collapsed'])}
          aria-hidden={collapsed ? true : undefined}
        >
          {definition.title}
        </span>
      </InternalBox>
      <NavigationItemsList
        variant="section-group"
        items={definition.items}
        fireFollow={fireFollow}
        fireChange={fireChange}
        activeHref={activeHref}
        position={position}
        collapsed={collapsed}
        withIcons={withIcons}
        ariaLabel={collapsed ? definition.title : undefined}
        activeTooltip={activeTooltip}
        setActiveTooltip={setActiveTooltip}
      />
    </div>
  );
}

interface LinkGroupProps extends BaseItemComponentProps {
  definition: SideNavigationProps.LinkGroup;
  withIcons?: boolean;
}

function LinkGroup({
  definition,
  activeHref,
  fireFollow,
  fireChange,
  position,
  collapsed,
  withIcons,
  activeTooltip,
  setActiveTooltip,
}: LinkGroupProps) {
  checkSafeUrl('SideNavigation', definition.href);
  const childrenRef = useRef<HTMLDivElement>(null);
  const isOneTheme = useOneTheme();

  // Set inert on the children container when collapsed so they leave
  // the tab order and assistive technology.
  useEffect(() => {
    if (childrenRef.current) {
      childrenRef.current.inert = !!collapsed;
    }
  }, [collapsed]);

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
        activeTooltip={activeTooltip}
        setActiveTooltip={setActiveTooltip}
      />
      <Transition<HTMLDivElement> in={!collapsed} disabled={!isOneTheme}>
        {(transitionState, transitionEventsRef, motionDisabled) => {
          const childrenSettled = !collapsed && (motionDisabled || transitionState === 'entered');

          return (
            <div
              ref={transitionEventsRef}
              className={clsx(styles['link-group-children'], collapsed && styles['link-group-children--collapsed'])}
            >
              <div
                ref={childrenRef}
                className={clsx(
                  styles['link-group-children-inner'],
                  !collapsed && styles['link-group-children-inner--expanded'],
                  childrenSettled && styles['link-group-children-inner--settled']
                )}
              >
                <NavigationItemsList
                  variant="link-group"
                  items={definition.items}
                  fireFollow={fireFollow}
                  fireChange={fireChange}
                  activeHref={activeHref}
                  position={position}
                  collapsed={collapsed}
                  withIcons={withIcons}
                  ariaLabel={collapsed ? definition.text : undefined}
                  activeTooltip={activeTooltip}
                  setActiveTooltip={setActiveTooltip}
                />
              </div>
            </div>
          );
        }}
      </Transition>
    </>
  );
}

interface ExpandableLinkGroupProps extends BaseItemComponentProps {
  definition: SideNavigationProps.ExpandableLinkGroup;
  variant: 'section' | 'section-group' | 'link-group' | 'expandable-link-group' | 'root';
  withIcons?: boolean;
}

function ExpandableLinkGroup({
  definition,
  fireFollow,
  fireChange,
  activeHref,
  variant,
  position,
  collapsed,
  withIcons,
  activeTooltip,
  setActiveTooltip,
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
        variant === 'section-group' && styles['expandable-link-group--no-ident'],
        withIcons && styles['expandable-link-group--expand-icon-end'],
        definition.href === activeHref && styles['expandable-link-group--active'],
        collapsed && styles['expandable-link-group--collapsed']
      )}
      variant="navigation"
      expanded={collapsed ? false : (userExpanded ?? expanded)}
      onChange={onExpandedChange}
      disableContentPaddings={true}
      __disableHeaderPaddings={true}
      __expandIconPosition={withIcons ? 'end' : 'start'}
      __hideExpandIcon={!!collapsed}
      headerText={
        <Link
          definition={{ type: 'link', href: definition.href, text: definition.text, icon: definition.icon }}
          fireFollow={onHeaderFollow}
          fireChange={fireChange}
          activeHref={activeHref}
          position={position}
          collapsed={collapsed}
          activeTooltip={activeTooltip}
          setActiveTooltip={setActiveTooltip}
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
        collapsed={collapsed}
        withIcons={withIcons}
        activeTooltip={activeTooltip}
        setActiveTooltip={setActiveTooltip}
      />
    </InternalExpandableSection>
  );
}
