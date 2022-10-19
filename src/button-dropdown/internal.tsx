// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef } from 'react';
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
import { useMergeRefs } from '../internal/hooks/use-merge-refs/index.js';

const InternalButtonDropdown = React.forwardRef(
  (
    {
      items,
      variant = 'normal',
      loading = false,
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

    const {
      isOpen,
      onOpen,
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
      setIsUsingMouse,
    } = useButtonDropdown({
      items,
      onItemClick,
      onItemFollow,
      onReturnFocus: () => dropdownRef.current?.focus(),
      expandToViewport,
      hasExpandableGroups: expandableGroups,
      isInRestrictedView,
    });

    const handleMouseEvent = () => {
      setIsUsingMouse(true);
    };

    const baseProps = getBaseProps(props);

    const dropdownRef = useRef<HTMLElement>(null);

    const rootRef = useRef<HTMLDivElement>(null);
    const mergedRootRef = useMergeRefs(rootRef, __internalRootRef);

    useForwardFocus(ref, dropdownRef);

    const clickHandler = () => {
      if (!loading && !disabled) {
        toggleDropdown();
        if (dropdownRef.current) {
          dropdownRef.current.focus();
        }
      }
    };

    const canBeOpened = !loading && !disabled;

    useEffect(() => {
      if (isOpen) {
        // The timeout is added to not interfere with the next effect which causes
        // the focus not being transitioned if the user opens one button-dropdown after another.
        // setTimeout(onOpen, 0);
        onOpen();
      }
    }, [isOpen, onOpen]);

    const triggerVariant = variant === 'navigation' ? undefined : variant;
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

    const trigger = customTriggerBuilder ? (
      customTriggerBuilder(clickHandler, dropdownRef, disabled, isOpen, ariaLabel)
    ) : (
      <InternalButton
        ref={dropdownRef}
        {...iconProps}
        variant={triggerVariant}
        loading={loading}
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

    const hasHeader = title || description;
    const headerId = useUniqueId('awsui-button-dropdown__header');

    return (
      <div
        {...baseProps}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        onMouseDown={handleMouseEvent}
        onMouseMove={handleMouseEvent}
        className={clsx(styles['button-dropdown'], styles[`variant-${variant}`], baseProps.className)}
        aria-owns={expandToViewport && isOpen ? dropdownId : undefined}
        ref={mergedRootRef}
      >
        <Dropdown
          open={canBeOpened && isOpen}
          stretchWidth={false}
          stretchTriggerHeight={variant === 'navigation'}
          expandToViewport={expandToViewport}
          preferCenter={preferCenter}
          onDropdownClose={() => {
            toggleDropdown();
          }}
          trigger={trigger}
          dropdownId={dropdownId}
        >
          {hasHeader && (
            <div className={styles.header} id={headerId}>
              {title && (
                <InternalBox fontSize="heading-s" fontWeight="bold">
                  <span className={styles.title}>{title}</span>
                </InternalBox>
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
          >
            <ItemsList
              items={items}
              onItemActivate={onItemActivate}
              onGroupToggle={onGroupToggle}
              hasExpandableGroups={expandableGroups}
              targetItem={targetItem}
              isHighlighted={isHighlighted}
              isKeyboardHighlight={isKeyboardHighlight}
              isExpanded={isExpanded}
              highlightItem={highlightItem}
              expandToViewport={expandToViewport}
              variant={variant}
            />
          </OptionsList>
        </Dropdown>
      </div>
    );
  }
);

export default InternalButtonDropdown;
