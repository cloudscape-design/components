// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useState, useEffect, useMemo } from 'react';
import clsx from 'clsx';
import { ExpandableSectionProps } from '../expandable-section/interfaces';
import InternalExpandableSection from '../expandable-section/internal';
import InternalIcon from '../icon/internal';
import InternalBox from '../box/internal';
import { SideNavigationProps } from './interfaces';
import styles from './styles.css.js';
import { NonCancelableCustomEvent, isPlainLeftClick } from '../internal/events';
import useFocusVisible from '../internal/hooks/focus-visible';
import { hasActiveLink } from './util';
import { checkSafeUrl } from '../internal/utils/check-safe-url';

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
}

export interface HeaderProps extends BaseItemComponentProps {
  definition: SideNavigationProps.Header;
}

export function Header({ definition, activeHref, fireFollow }: HeaderProps) {
  checkSafeUrl('SideNavigation', definition.href);
  const focusVisible = useFocusVisible();

  const onClick = useCallback(
    (event: React.MouseEvent) => {
      if (isPlainLeftClick(event)) {
        fireFollow(definition, event);
      }
    },
    [fireFollow, definition]
  );

  return (
    <>
      <h2 className={styles.header}>
        <a
          {...focusVisible}
          href={definition.href}
          className={clsx(styles['header-link'], { [styles['header-link--has-logo']]: !!definition.logo })}
          aria-current={definition.href === activeHref ? 'page' : undefined}
          onClick={onClick}
        >
          {definition.logo && (
            <img
              className={clsx(styles['header-logo'], {
                [styles['header-logo--stretched']]: !definition.text,
              })}
              {...definition.logo}
            />
          )}
          <span className={styles['header-link-text']}>{definition.text}</span>
        </a>
      </h2>
      <Divider variant="header" />
    </>
  );
}

export interface ItemListProps extends BaseItemComponentProps {
  items: ReadonlyArray<SideNavigationProps.Item>;
  variant: 'section' | 'section-group' | 'link-group' | 'expandable-link-group' | 'root';
}

export function ItemList({ variant, items, activeHref, fireChange, fireFollow }: ItemListProps) {
  return (
    <ul className={clsx(styles.list, styles[`list-variant-${variant}`])}>
      {items.map((item, i) => (
        <li key={i} className={styles['list-item']}>
          {item.type === 'link' && (
            <Link definition={item} activeHref={activeHref} fireChange={fireChange} fireFollow={fireFollow} />
          )}
          {item.type === 'section' && (
            <Section
              definition={item}
              activeHref={activeHref}
              fireChange={fireChange}
              fireFollow={fireFollow}
              variant={variant}
            />
          )}
          {item.type === 'section-group' && (
            <SectionGroup definition={item} activeHref={activeHref} fireChange={fireChange} fireFollow={fireFollow} />
          )}
          {item.type === 'link-group' && (
            <LinkGroup definition={item} activeHref={activeHref} fireChange={fireChange} fireFollow={fireFollow} />
          )}
          {item.type === 'expandable-link-group' && (
            <ExpandableLinkGroup
              definition={item}
              activeHref={activeHref}
              fireChange={fireChange}
              fireFollow={fireFollow}
              variant={variant}
            />
          )}
          {((i === 0 && item.type === 'divider') || (items[i + 1] && items[i + 1].type === 'divider')) && (
            <Divider variant="default" />
          )}
        </li>
      ))}
    </ul>
  );
}

interface DividerProps {
  variant: 'default' | 'header';
}

function Divider({ variant = 'default' }: DividerProps) {
  return <hr className={clsx(styles.divider, styles[`divider-${variant}`])} />;
}

interface LinkProps extends BaseItemComponentProps {
  definition: SideNavigationProps.Link;
  expanded?: boolean;
}

function Link({ definition, expanded, activeHref, fireFollow }: LinkProps) {
  checkSafeUrl('SideNavigation', definition.href);
  const isActive = definition.href === activeHref;
  const focusVisible = useFocusVisible();

  const onClick = useCallback(
    (event: React.MouseEvent) => {
      // Prevent the click event from toggling outer expandable sections.
      event.stopPropagation();

      if (isPlainLeftClick(event)) {
        fireFollow(definition, event);
      }
    },
    [fireFollow, definition]
  );

  return (
    <>
      {/* https://github.com/yannickcr/eslint-plugin-react/issues/2962 */}
      {/* eslint-disable-next-line react/jsx-no-target-blank */}
      <a
        {...focusVisible}
        href={definition.href}
        className={clsx(styles.link, { [styles['link-active']]: isActive })}
        target={definition.external ? '_blank' : undefined}
        rel={definition.external ? 'noopener noreferrer' : undefined}
        aria-expanded={expanded}
        aria-current={definition.href === activeHref ? 'page' : undefined}
        onClick={onClick}
      >
        {definition.text}
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

function Section({ definition, activeHref, fireFollow, fireChange, variant }: SectionProps) {
  const [expanded, setExpanded] = useState<boolean>(definition.defaultExpanded ?? true);

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
      className={clsx(styles.section, variant === 'section-group' && styles['section--no-ident'])}
      headerText={definition.text}
    >
      <ItemList
        variant="section"
        items={definition.items}
        fireFollow={fireFollow}
        fireChange={fireChange}
        activeHref={activeHref}
      />
    </InternalExpandableSection>
  );
}

interface SectionGroupProps extends BaseItemComponentProps {
  definition: SideNavigationProps.SectionGroup;
}

function SectionGroup({ definition, activeHref, fireFollow, fireChange }: SectionGroupProps) {
  return (
    <>
      <InternalBox tagOverride="h3" variant="h4">
        {definition.text}
      </InternalBox>
      <ItemList
        variant="section-group"
        items={definition.items}
        fireFollow={fireFollow}
        fireChange={fireChange}
        activeHref={activeHref}
      />
    </>
  );
}

interface LinkGroupProps extends BaseItemComponentProps {
  definition: SideNavigationProps.LinkGroup;
}

function LinkGroup({ definition, activeHref, fireFollow, fireChange }: LinkGroupProps) {
  checkSafeUrl('SideNavigation', definition.href);

  return (
    <>
      <Link
        definition={{ type: 'link', href: definition.href, text: definition.text }}
        fireFollow={(_, event) => fireFollow(definition, event)}
        fireChange={fireChange}
        activeHref={activeHref}
      />
      <ItemList
        variant="link-group"
        items={definition.items}
        fireFollow={fireFollow}
        fireChange={fireChange}
        activeHref={activeHref}
      />
    </>
  );
}

interface ExpandableLinkGroupProps extends BaseItemComponentProps {
  definition: SideNavigationProps.ExpandableLinkGroup;
  variant: 'section' | 'section-group' | 'link-group' | 'expandable-link-group' | 'root';
}

function ExpandableLinkGroup({ definition, fireFollow, fireChange, activeHref, variant }: ExpandableLinkGroupProps) {
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
        />
      }
    >
      <ItemList
        variant="expandable-link-group"
        items={definition.items}
        fireFollow={fireFollow}
        fireChange={fireChange}
        activeHref={activeHref}
      />
    </InternalExpandableSection>
  );
}
