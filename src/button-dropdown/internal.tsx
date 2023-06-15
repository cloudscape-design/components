// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';
import clsx from 'clsx';
import styles from './styles.css.js';
import { ButtonDropdownProps, InternalButtonDropdownProps } from './interfaces';
import { getBaseProps } from '../internal/base-component';
import { useUniqueId } from '../internal/hooks/use-unique-id';
import Dropdown from '../internal/components/dropdown';
import ItemsList from './items-list';
import { useButtonDropdown } from './utils/use-button-dropdown';
import OptionsList from '../internal/components/options-list';
import { InternalButton } from '../button/internal';
import { ButtonProps } from '../button/interfaces';
import { useMobile } from '../internal/hooks/use-mobile';
import useForwardFocus from '../internal/hooks/forward-focus';
import InternalBox from '../box/internal';
import { checkSafeUrl } from '../internal/utils/check-safe-url';
import { fireCancelableEvent } from '../internal/events/index.js';

const InternalButtonDropdown = React.forwardRef(
  (
    {
      items,
      variant = 'normal',
      loading = false,
      loadingText,
      disabled = false,
      expandableGroups = false,
      children,
      onItemClick,
      onItemFollow,
      customTriggerBuilder,
      expandToViewport,
      ariaLabel,
      title,
      description,
      preferCenter,
      stretchTriggerHeight,
      __internalRootRef,
      ...props
    }: InternalButtonDropdownProps,
    ref: React.Ref<ButtonDropdownProps.Ref>
  ) => {
    const isInRestrictedView = useMobile();
    const dropdownId = useUniqueId('dropdown');
    for (const item of items) {
      checkSafeUrl('ButtonDropdown', item.href);
    }

    const dropdownItems = items; // variant === 'split-primary' ? items.slice(1) : items;

    const {
      isOpen,
      targetItem,
      isHighlighted,
      isKeyboardHighlight,
      isExpanded,
      highlightItem,
      onKeyDown,
      onKeyUp,
      onItemActivate,
      onGroupToggle,
      toggleDropdown,
      closeDropdown,
      setIsUsingMouse,
    } = useButtonDropdown({
      items: dropdownItems,
      onItemClick,
      onItemFollow,
      onReturnFocus: () => triggerRef.current?.focus(),
      expandToViewport,
      hasExpandableGroups: expandableGroups,
      isInRestrictedView,
    });

    const handleMouseEvent = () => {
      setIsUsingMouse(true);
    };

    const baseProps = getBaseProps(props);

    const triggerRef = useRef<HTMLElement>(null);

    useForwardFocus(ref, triggerRef);

    const clickHandler = () => {
      if (!loading && !disabled) {
        // Prevent moving highlight on mobiles to avoid disabled state reason popup if defined.
        toggleDropdown({ moveHighlightOnOpen: !isInRestrictedView });
      }
    };

    const canBeOpened = !loading && !disabled;

    let triggerVariant = variant === 'navigation' ? undefined : variant;
    triggerVariant = triggerVariant === 'split-primary' ? 'primary' : triggerVariant;

    const iconProps: Partial<ButtonProps & { __iconClass?: string }> =
      variant === 'icon'
        ? {
            iconName: 'ellipsis',
          }
        : {
            iconName: 'caret-down-filled',
            iconAlign: 'right',
            __iconClass: canBeOpened && isOpen ? styles['rotate-up'] : styles['rotate-down'],
          };

    let trigger: React.ReactNode = null;
    if (customTriggerBuilder) {
      trigger = customTriggerBuilder(clickHandler, triggerRef, disabled, isOpen, ariaLabel);
    } else if (variant === 'split-primary' && items.length > 0) {
      const item = items[0];
      const { iconName, iconAlt, iconSvg, iconUrl } = item;
      const splitButtonIconProps = { iconName, iconAlt, iconSvg, iconUrl };

      trigger = (
        <div role="group" aria-label={ariaLabel} className={styles['split-trigger']}>
          <InternalButton
            {...splitButtonIconProps}
            ref={triggerRef}
            variant="primary"
            loading={loading}
            loadingText={loadingText}
            disabled={disabled || item.disabled}
            formAction="none"
            className={styles.trigger}
            onClick={event => {
              fireCancelableEvent(
                onItemClick,
                {
                  id: item.id || 'undefined',
                  href: item.href,
                  external: item.external,
                  // target: getItemTarget(item),
                },
                event
              );
              closeDropdown();
            }}
            onFollow={event => {
              fireCancelableEvent(
                onItemFollow,
                {
                  id: item.id || 'undefined',
                  href: item.href,
                  external: item.external,
                  // target: getItemTarget(item),
                },
                event
              );
              closeDropdown();
            }}
          >
            {item.text}
          </InternalButton>
          <InternalButton
            {...iconProps}
            variant="primary"
            disabled={loading || disabled}
            onClick={(event: Event) => {
              event.preventDefault();
              clickHandler();
            }}
            ariaLabel={ariaLabel}
            aria-haspopup={true}
            ariaExpanded={canBeOpened && isOpen}
            formAction="none"
            className={styles.trigger}
          />
        </div>
      );
    } else {
      trigger = (
        <InternalButton
          ref={triggerRef}
          {...iconProps}
          variant={triggerVariant}
          loading={loading}
          loadingText={loadingText}
          disabled={disabled}
          onClick={(event: Event) => {
            event.preventDefault();
            clickHandler();
          }}
          ariaLabel={ariaLabel}
          aria-haspopup={true}
          ariaExpanded={canBeOpened && isOpen}
          formAction="none"
        >
          {children}
        </InternalButton>
      );
    }

    const hasHeader = title || description;
    const headerId = useUniqueId('awsui-button-dropdown__header');

    const stylesVariant = variant === 'split-primary' ? 'primary' : variant;
    return (
      <div
        {...baseProps}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        onMouseDown={handleMouseEvent}
        onMouseMove={handleMouseEvent}
        className={clsx(styles['button-dropdown'], styles[`variant-${stylesVariant}`], baseProps.className)}
        aria-owns={expandToViewport && isOpen ? dropdownId : undefined}
        ref={__internalRootRef}
      >
        <Dropdown
          open={canBeOpened && isOpen}
          stretchWidth={false}
          stretchTriggerHeight={variant === 'navigation' || stretchTriggerHeight}
          expandToViewport={expandToViewport}
          preferCenter={preferCenter}
          onDropdownClose={() => toggleDropdown()}
          trigger={trigger}
          dropdownId={dropdownId}
        >
          {hasHeader && (
            <div className={styles.header} id={headerId}>
              {title && (
                <div className={styles.title}>
                  <InternalBox
                    fontSize="heading-s"
                    fontWeight="bold"
                    color="inherit"
                    tagOverride="h2"
                    margin={{ vertical: 'n', horizontal: 'n' }}
                  >
                    {title}
                  </InternalBox>
                </div>
              )}
              {description && (
                <InternalBox fontSize="body-s">
                  <span className={styles.description}>{description}</span>
                </InternalBox>
              )}
            </div>
          )}
          <OptionsList
            open={canBeOpened && isOpen}
            position="static"
            role="menu"
            decreaseTopMargin={true}
            ariaLabelledby={hasHeader ? headerId : undefined}
            statusType="finished"
          >
            <ItemsList
              items={dropdownItems}
              onItemActivate={onItemActivate}
              onGroupToggle={onGroupToggle}
              hasExpandableGroups={expandableGroups}
              targetItem={targetItem}
              isHighlighted={isHighlighted}
              isKeyboardHighlight={isKeyboardHighlight}
              isExpanded={isExpanded}
              highlightItem={highlightItem}
              expandToViewport={expandToViewport}
              variant={stylesVariant}
            />
          </OptionsList>
        </Dropdown>
      </div>
    );
  }
);

export default InternalButtonDropdown;
