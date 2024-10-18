// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef } from 'react';
import clsx from 'clsx';

import { warnOnce } from '@cloudscape-design/component-toolkit/internal';
import { getAnalyticsMetadataAttribute } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

import InternalBox from '../box/internal';
import { ButtonProps } from '../button/interfaces';
import { InternalButton, InternalButtonProps } from '../button/internal';
import { useFunnel } from '../internal/analytics/hooks/use-funnel.js';
import { getBaseProps } from '../internal/base-component';
import Dropdown from '../internal/components/dropdown';
import OptionsList from '../internal/components/options-list';
import useForwardFocus from '../internal/hooks/forward-focus';
import { useMobile } from '../internal/hooks/use-mobile';
import { useUniqueId } from '../internal/hooks/use-unique-id';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode/index.js';
import { isDevelopment } from '../internal/is-development';
import { checkSafeUrl } from '../internal/utils/check-safe-url';
import { GeneratedAnalyticsMetadataButtonDropdownExpand } from './analytics-metadata/interfaces.js';
import { ButtonDropdownProps, InternalButtonDropdownProps } from './interfaces';
import ItemsList from './items-list';
import { useButtonDropdown } from './utils/use-button-dropdown';
import { isLinkItem } from './utils/utils.js';

import analyticsSelectors from './analytics-metadata/styles.css.js';
import styles from './styles.css.js';

const InternalButtonDropdown = React.forwardRef(
  (
    {
      items,
      variant = 'normal',
      loading = false,
      loadingText,
      disabled = false,
      disabledReason,
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
      mainAction,
      showMainActionOnly,
      __internalRootRef,
      analyticsMetadataTransformer,
      linkStyle,
      ...props
    }: InternalButtonDropdownProps,
    ref: React.Ref<ButtonDropdownProps.Ref>
  ) => {
    const isInRestrictedView = useMobile();
    const dropdownId = useUniqueId('dropdown');
    for (const item of items) {
      if (isLinkItem(item)) {
        checkSafeUrl('ButtonDropdown', item.href);
      }
    }
    if (mainAction) {
      checkSafeUrl('ButtonDropdown', mainAction.href);
    }

    if (isDevelopment) {
      if (mainAction && variant !== 'primary' && variant !== 'normal') {
        warnOnce('ButtonDropdown', 'Main action is only supported for "primary" and "normal" component variant.');
      }
    }
    const isMainAction = mainAction && (variant === 'primary' || variant === 'normal');
    const isVisualRefresh = useVisualRefresh();

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
      items,
      onItemClick,
      onItemFollow,
      // Scroll is unnecessary when moving focus back to the dropdown trigger.
      onReturnFocus: () => triggerRef.current?.focus({ preventScroll: true }),
      expandToViewport,
      hasExpandableGroups: expandableGroups,
      isInRestrictedView,
    });

    const handleMouseEvent = () => {
      setIsUsingMouse(true);
    };

    const baseProps = getBaseProps(props);

    const mainActionRef = useRef<HTMLElement>(null);
    const triggerRef = useRef<HTMLElement>(null);

    useForwardFocus(ref, isMainAction ? mainActionRef : triggerRef);

    const clickHandler = () => {
      if (!loading && !disabled) {
        // Prevent moving highlight on mobiles to avoid disabled state reason popup if defined.
        toggleDropdown({ moveHighlightOnOpen: !isInRestrictedView });
      }
    };

    const canBeOpened = !loading && !disabled;

    const triggerVariant = variant === 'navigation' ? undefined : variant === 'inline-icon' ? 'inline-icon' : variant;
    const iconProps: Partial<ButtonProps & { __iconClass?: string }> =
      variant === 'icon' || variant === 'inline-icon'
        ? {
            iconName: 'ellipsis',
          }
        : {
            iconName: 'caret-down-filled',
            iconAlign: 'right',
            __iconClass: canBeOpened && isOpen ? styles['rotate-up'] : styles['rotate-down'],
          };

    const baseTriggerProps: InternalButtonProps = {
      className: clsx(
        styles['trigger-button'],
        styles['test-utils-button-trigger'],
        analyticsSelectors['trigger-label']
      ),
      ...iconProps,
      variant: triggerVariant,
      loading,
      loadingText,
      disabled,
      disabledReason,
      onClick: (event: Event) => {
        event.preventDefault();
        clickHandler();
      },
      ariaLabel,
      ariaExpanded: canBeOpened && isOpen,
      formAction: 'none',
      __nativeAttributes: {
        'aria-haspopup': true,
      },
    };

    const triggerId = useUniqueId('awsui-button-dropdown__trigger');

    const triggerHasBadge = () => {
      const flatItems = items.flatMap(item => {
        if ('items' in item) {
          return item.items;
        }
        return item;
      });

      return (
        variant === 'icon' &&
        !!flatItems?.find(item => {
          if ('badge' in item) {
            return item.badge;
          }
        })
      );
    };

    let trigger: React.ReactNode = null;

    const analyticsMetadata: GeneratedAnalyticsMetadataButtonDropdownExpand | Record<string, never> = disabled
      ? {}
      : {
          action: 'expand',
          detail: {
            expanded: `${!isOpen}`,
            label: `.${analyticsSelectors['trigger-label']}`,
          },
        };

    if (customTriggerBuilder) {
      trigger = (
        <div className={styles['dropdown-trigger']} {...getAnalyticsMetadataAttribute(analyticsMetadata)}>
          {customTriggerBuilder({
            testUtilsClass: styles['test-utils-button-trigger'],
            ariaExpanded: canBeOpened && isOpen,
            onClick: clickHandler,
            triggerRef,
            ariaLabel,
            disabled,
            disabledReason,
            isOpen,
          })}
        </div>
      );
    } else if (isMainAction) {
      const { text, iconName, iconAlt, iconSvg, iconUrl, external, externalIconAriaLabel, ...mainActionProps } =
        mainAction;
      const mainActionIconProps = external
        ? ({ iconName: 'external', iconAlign: 'right' } as const)
        : ({ iconName, iconAlt, iconSvg, iconUrl } as const);
      const mainActionAriaLabel = externalIconAriaLabel
        ? `${mainAction.ariaLabel ?? mainAction.text} ${mainAction.externalIconAriaLabel}`
        : mainAction.ariaLabel;
      const hasNoText = !text;
      const mainActionButton = (
        <InternalButton
          ref={mainActionRef}
          {...mainActionProps}
          {...mainActionIconProps}
          className={clsx(
            styles['trigger-button'],
            hasNoText && styles['has-no-text'],
            isVisualRefresh && styles['visual-refresh']
          )}
          variant={variant}
          ariaLabel={mainActionAriaLabel}
          formAction="none"
        >
          {text}
        </InternalButton>
      );
      trigger = (
        <div role="group" aria-label={ariaLabel} className={styles['split-trigger-wrapper']}>
          <div
            className={clsx(
              styles['trigger-item'],
              styles['split-trigger'],
              styles[`variant-${variant}`],
              mainActionProps.disabled && styles.disabled,
              mainActionProps.loading && styles.loading
            )}
            // Close dropdown upon main action click unless event is cancelled.
            onClick={closeDropdown}
            // Prevent keyboard events from propagation to the button dropdown handler.
            onKeyDown={e => e.stopPropagation()}
            onKeyUp={e => e.stopPropagation()}
            {...getAnalyticsMetadataAttribute({
              action: 'click',
              detail: {
                label: `.${analyticsSelectors['main-action-label']}`,
              },
            })}
          >
            {mainActionButton}
          </div>
          {!showMainActionOnly && (
            <div
              className={clsx(
                styles['trigger-item'],
                styles['dropdown-trigger'],
                isVisualRefresh && styles['visual-refresh'],
                styles[`variant-${variant}`],
                baseTriggerProps.disabled && styles.disabled,
                baseTriggerProps.loading && styles.loading
              )}
              {...getAnalyticsMetadataAttribute(analyticsMetadata)}
            >
              <InternalButton ref={triggerRef} {...baseTriggerProps} __emitPerformanceMarks={false}>
                {children}
              </InternalButton>
            </div>
          )}
        </div>
      );
    } else {
      trigger = (
        <div className={styles['dropdown-trigger']} {...getAnalyticsMetadataAttribute(analyticsMetadata)}>
          <InternalButton ref={triggerRef} id={triggerId} {...baseTriggerProps} badge={triggerHasBadge()}>
            {children}
          </InternalButton>
        </div>
      );
    }

    const hasHeader = title || description;
    const headerId = useUniqueId('awsui-button-dropdown__header');

    const shouldLabelWithTrigger = !ariaLabel && !mainAction && variant !== 'icon' && variant !== 'inline-icon';

    const { loadingButtonCount } = useFunnel();
    useEffect(() => {
      if (loading) {
        loadingButtonCount.current++;
        return () => {
          // eslint-disable-next-line react-hooks/exhaustive-deps
          loadingButtonCount.current--;
        };
      }
    }, [loading, loadingButtonCount]);

    return (
      <div
        {...baseProps}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        onMouseDown={handleMouseEvent}
        onMouseMove={handleMouseEvent}
        className={clsx(styles['button-dropdown'], styles[`variant-${variant}`], baseProps.className)}
        aria-owns={expandToViewport && isOpen ? dropdownId : undefined}
        ref={__internalRootRef}
      >
        <Dropdown
          open={canBeOpened && isOpen}
          stretchWidth={false}
          stretchTriggerHeight={variant === 'navigation'}
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
            decreaseBlockMargin={true}
            ariaLabel={ariaLabel}
            ariaLabelledby={hasHeader ? headerId : shouldLabelWithTrigger ? triggerId : undefined}
            statusType="finished"
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
              lastInDropdown={true}
              highlightItem={highlightItem}
              expandToViewport={expandToViewport}
              variant={variant}
              analyticsMetadataTransformer={analyticsMetadataTransformer}
              linkStyle={linkStyle}
            />
          </OptionsList>
        </Dropdown>
      </div>
    );
  }
);

export default InternalButtonDropdown;
