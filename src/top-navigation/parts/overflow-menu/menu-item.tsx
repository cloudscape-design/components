// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { forwardRef, useState } from 'react';
import clsx from 'clsx';

import { fireCancelableEvent, isPlainLeftClick } from '../../../internal/events';
import { useUniqueId } from '../../../internal/hooks/use-unique-id';

import { LinkProps } from '../../../link/interfaces';
import { ButtonDropdownProps } from '../../../button-dropdown/interfaces';
import InternalIcon from '../../../icon/internal';

import { useNavigate } from './router';
import { TopNavigationProps } from '../../interfaces';
import styles from '../../styles.css.js';
import { isLinkItem } from '../../../button-dropdown/utils/utils';

interface ListItemProps {
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  context?: 'dropdown-menu';
  children?: React.ReactNode;
  testId?: string;
}

const ListItem = ({ children, startIcon, endIcon }: ListItemProps) => {
  return (
    <>
      {startIcon && <span className={styles['overflow-menu-list-item-icon']}>{startIcon}</span>}
      <span className={styles['overflow-menu-list-item-text']}>{children}</span>
      {endIcon && endIcon}
    </>
  );
};

interface LinkItemProps extends ButtonItemProps, Pick<LinkProps, 'href' | 'external' | 'target' | 'rel'> {}

const LinkItem = forwardRef(
  (
    { children, external, href, target, rel, startIcon, endIcon, onClick, context, testId }: LinkItemProps,
    ref: React.Ref<HTMLAnchorElement & HTMLButtonElement>
  ) => {
    const anchorTarget = target ?? (external ? '_blank' : undefined);
    const anchorRel = rel ?? (anchorTarget === '_blank' ? 'noopener noreferrer' : undefined);
    const role = !href ? 'button' : undefined;

    return (
      <a
        ref={ref}
        onClick={onClick}
        className={clsx(
          styles['overflow-menu-control'],
          styles['overflow-menu-control-link'],
          context && styles[`overflow-menu-control-${context}`]
        )}
        role={role}
        tabIndex={0}
        href={href}
        target={anchorTarget}
        rel={anchorRel}
        {...(testId ? { 'data-testid': testId } : {})}
      >
        <ListItem startIcon={startIcon} endIcon={endIcon}>
          {children}
        </ListItem>
      </a>
    );
  }
);

interface ButtonItemProps extends ListItemProps {
  onClick?: (event: React.MouseEvent) => void;
}

const ButtonItem = forwardRef(
  (
    { children, startIcon, endIcon, onClick, testId }: ButtonItemProps & { testId?: string },
    ref: React.Ref<HTMLButtonElement>
  ) => {
    return (
      <button
        ref={ref}
        className={styles['overflow-menu-control']}
        onClick={onClick}
        {...(typeof testId === 'string' ? { 'data-testid': testId } : {})}
      >
        <ListItem startIcon={startIcon} endIcon={endIcon}>
          {children}
        </ListItem>
      </button>
    );
  }
);

const NavigationItem = forwardRef(
  (
    {
      startIcon,
      children,
      index,
      testId,
      ...definition
    }: ButtonItemProps & TopNavigationProps.MenuDropdownUtility & { index: number; testId?: string },
    ref: React.Ref<HTMLButtonElement>
  ) => {
    const navigate = useNavigate();
    return (
      <ButtonItem
        ref={ref}
        startIcon={startIcon}
        endIcon={<InternalIcon name="angle-right" />}
        testId={testId}
        onClick={() =>
          navigate('dropdown-menu', {
            definition,
            headerText: definition.text || definition.title,
            headerSecondaryText: definition.description,
            utilityIndex: index,
          })
        }
      >
        {children}
      </ButtonItem>
    );
  }
);

const ExpandableItem: React.FC<
  ButtonItemProps &
    ButtonDropdownProps.ItemGroup & { onItemClick: (event: React.MouseEvent, item: ButtonDropdownProps.Item) => void }
> = ({ children, onItemClick, ...definition }) => {
  const [expanded, setExpanded] = useState(false);
  const headerId = useUniqueId('overflow-menu-item');

  return (
    <>
      <button
        className={clsx(styles['overflow-menu-control'], styles['overflow-menu-control-expandable-menu-trigger'])}
        onClick={() => setExpanded(value => !value)}
        aria-expanded={expanded}
      >
        <ListItem
          endIcon={
            <span className={clsx(styles.icon, expanded && styles.expanded)}>
              <InternalIcon name="caret-up-filled" />
            </span>
          }
        >
          <span id={headerId}>{children}</span>
        </ListItem>
      </button>
      {expanded && (
        <ul
          className={clsx(styles['overflow-menu-list'], styles['overflow-menu-list-submenu'])}
          aria-labelledby={headerId}
        >
          {definition.items.map((item, index) => {
            const isGroup = typeof (item as ButtonDropdownProps.ItemGroup).items !== 'undefined';

            return (
              <li
                key={index}
                className={clsx(styles[`overflow-menu-list-item`], styles[`overflow-menu-list-item-dropdown-menu`])}
              >
                {dropdownComponentFactory(item, isGroup, onItemClick)}
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
};

function utilityComponentFactory(
  utility: TopNavigationProps.Utility & { onClose?: () => void },
  index: number,
  ref?: React.Ref<HTMLAnchorElement & HTMLButtonElement>
) {
  const label = utility.text || utility.title;
  const hasIcon = !!utility.iconName || !!utility.iconUrl || !!utility.iconAlt || !!utility.iconSvg;
  const startIcon = hasIcon && (
    <InternalIcon name={utility.iconName} url={utility.iconUrl} alt={utility.iconAlt} svg={utility.iconSvg} />
  );

  switch (utility.type) {
    case 'button': {
      const handleClick = (event: React.MouseEvent) => {
        if (Boolean(utility.href) && isPlainLeftClick(event)) {
          fireCancelableEvent(utility.onFollow, { href: utility.href, target: utility.target }, event);
        }

        fireCancelableEvent(utility.onClick, {}, event);
        utility.onClose?.();
      };

      const content = (
        <>
          {label}
          {utility.external && (
            <>
              {' '}
              <span aria-label={utility.externalIconAriaLabel} role={utility.externalIconAriaLabel ? 'img' : undefined}>
                <InternalIcon name="external" size="normal" />
              </span>
            </>
          )}
        </>
      );

      if (!utility.href) {
        return (
          <ButtonItem ref={ref} startIcon={startIcon} onClick={handleClick} testId={`__${index}`}>
            {content}
          </ButtonItem>
        );
      }

      return (
        <LinkItem
          ref={ref}
          startIcon={startIcon}
          href={utility.href}
          external={utility.external}
          target={utility.target}
          rel={utility.rel}
          testId={`__${index}`}
          onClick={handleClick}
        >
          {content}
        </LinkItem>
      );
    }
    case 'menu-dropdown': {
      return (
        <NavigationItem
          ref={ref}
          startIcon={startIcon}
          index={index}
          {...(utility as TopNavigationProps.MenuDropdownUtility)}
          testId={`__${index}`}
        >
          {label}
        </NavigationItem>
      );
    }
  }
}

function dropdownComponentFactory(
  item: ButtonDropdownProps.ItemOrGroup,
  expandable: boolean,
  onItemClick: (event: React.MouseEvent, item: ButtonDropdownProps.Item) => void
) {
  const label = item.text;
  const hasIcon = !!item.iconName || !!item.iconUrl || !!item.iconAlt || !!item.iconSvg;
  const isLink = isLinkItem(item);
  const startIcon = hasIcon && (
    <InternalIcon name={item.iconName} url={item.iconUrl} alt={item.iconAlt} svg={item.iconSvg} />
  );

  if (expandable) {
    return (
      <ExpandableItem {...(item as ButtonDropdownProps.ItemGroup)} onItemClick={onItemClick}>
        {label}
      </ExpandableItem>
    );
  }

  return (
    <LinkItem
      startIcon={startIcon}
      href={isLink ? item.href : undefined}
      external={isLink ? item.external : undefined}
      context="dropdown-menu"
      testId={item.id}
      onClick={event => onItemClick(event, item as ButtonDropdownProps.Item)}
    >
      {label}
      {isLink && item.external && (
        <>
          {' '}
          <span aria-label={item.externalIconAriaLabel} role={item.externalIconAriaLabel ? 'img' : undefined}>
            <InternalIcon name="external" size="normal" />
          </span>
        </>
      )}
    </LinkItem>
  );
}

type UtilityMenuItemProps = TopNavigationProps.Utility & { index: number; onClose?: () => void };

export const UtilityMenuItem = forwardRef(
  ({ index, ...props }: UtilityMenuItemProps, ref: React.Ref<HTMLAnchorElement & HTMLButtonElement>) => {
    return (
      <li className={clsx(styles[`overflow-menu-list-item`], styles[`overflow-menu-list-item-utility`])}>
        {utilityComponentFactory(props, index, ref)}
      </li>
    );
  }
);

type SubmenuItemProps = ButtonDropdownProps.ItemOrGroup & {
  onClick: (event: React.MouseEvent, item: ButtonDropdownProps.Item) => void;
};

export const SubmenuItem = (props: SubmenuItemProps) => {
  const expandable = typeof (props as ButtonDropdownProps.ItemGroup).items !== 'undefined';

  return (
    <li
      className={clsx(
        styles[`overflow-menu-list-item`],
        styles[`overflow-menu-list-item-submenu`],
        expandable && styles[`overflow-menu-list-item-expandable`]
      )}
    >
      {dropdownComponentFactory(props, expandable, props.onClick)}
    </li>
  );
};
