// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { KeyboardEvent, useCallback, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

import { useUniqueId } from '@cloudscape-design/component-toolkit/internal';

import { getBaseProps } from '../internal/base-component';
import { screenReaderTextClass } from '../internal/components/chart-series-details/series-details-text';
import { fireNonCancelableEvent } from '../internal/events';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { useControllable } from '../internal/hooks/use-controllable';
import { KeyCode } from '../internal/keycode';
import { ExpandableSectionContainer } from './expandable-section-container';
import { ExpandableSectionHeader } from './expandable-section-header';
import { ExpandableSectionProps } from './interfaces';
import { InternalVariant } from './internal-interfaces';
import { variantSupportsDescription } from './utils';

import analyticsSelectors from './analytics-metadata/styles.css.js';
import styles from './styles.css.js';

export type InternalExpandableSectionProps = Omit<ExpandableSectionProps, 'variant'> &
  InternalBaseComponentProps & {
    variant?: InternalVariant;
    __injectAnalyticsComponentMetadata?: boolean;
    /**
     * Controls placement of the expand/collapse icon relative to the header content.
     * Defaults to 'start'. When set to 'end', the icon is rendered after the header
     * content and pushed to the inline-end of a full-width header.
     */
    __expandIconPosition?: 'start' | 'end';
    /**
     * Removes default padding from the header wrapper and content wrapper.
     * Used by side-navigation to zero out expandable-section's own padding so the
     * parent can control spacing directly.
     */
    __disableHeaderPaddings?: boolean;
    /**
     * When true, the expand/collapse icon button is hidden from assistive technology
     * and removed from the tab order. Used by side-navigation when the nav is collapsed
     * and the caret is visually clipped but still present in the DOM.
     */
    __hideExpandIcon?: boolean;
  };

export default function InternalExpandableSection({
  expanded: controlledExpanded,
  defaultExpanded,
  onChange,
  variant = 'default',
  children,
  header,
  headerText,
  headerCounter,
  headerDescription,
  headerInfo,
  headerActions,
  headingTagOverride,
  disableContentPaddings,
  headerAriaLabel,
  __internalRootRef,
  __injectAnalyticsComponentMetadata,
  __expandIconPosition = 'start',
  __disableHeaderPaddings = false,
  __hideExpandIcon = false,
  ...props
}: InternalExpandableSectionProps) {
  const contentInnerRef = useRef<HTMLDivElement>(null);
  // Start settled when the section is initially expanded — no transition will
  // fire, so the transitionEnd handler would never switch overflow to visible.
  // This prevents permanent clipping of negative-margin backgrounds (e.g. nav
  // active/hover states) in initially-expanded sections and reduced-motion mode.
  const [contentSettled, setContentSettled] = useState(() => !!(controlledExpanded ?? defaultExpanded));
  const controlId = useUniqueId();
  const triggerControlId = `${controlId}-trigger`;
  const descriptionId = `${controlId}-description`;

  const baseProps = getBaseProps(props);
  const [expanded, setExpanded] = useControllable(controlledExpanded, onChange, defaultExpanded, {
    componentName: 'ExpandableSection',
    controlledProp: 'expanded',
    changeHandler: 'onChange',
  });

  const onExpandChange = useCallback(
    (newExpanded: boolean) => {
      setExpanded(newExpanded);
      fireNonCancelableEvent(onChange, { expanded: newExpanded });
    },
    [onChange, setExpanded]
  );

  const onClick = useCallback(() => {
    onExpandChange(!expanded);
  }, [onExpandChange, expanded]);

  const onKeyUp = useCallback(
    (event: KeyboardEvent<Element>) => {
      const interactionKeys = [KeyCode.enter, KeyCode.space];

      if (interactionKeys.indexOf(event.keyCode) !== -1) {
        onExpandChange(!expanded);
      }
    },
    [onExpandChange, expanded]
  );

  const onKeyDown = useCallback((event: KeyboardEvent<Element>) => {
    if (event.keyCode === KeyCode.space) {
      event.preventDefault();
    }
  }, []);

  // Set inert on collapsed content to block pointer/focus events and hide from
  // assistive technology. Direct DOM manipulation needed until React supports
  // the inert attribute natively. https://github.com/facebook/react/issues/17157
  useEffect(() => {
    if (contentInnerRef.current) {
      contentInnerRef.current.inert = !expanded;
    }
  }, [expanded]);

  // When collapsing, immediately reset settled so overflow:hidden is re-applied
  // before the grid transition starts (prevents content spill during close).
  useEffect(() => {
    if (!expanded) {
      setContentSettled(false);
    }
  }, [expanded]);

  // After the expand transition finishes, mark content as settled so
  // overflow can switch to visible (prevents clipping of active-state backgrounds
  // and focus rings that extend beyond the content box).
  const handleContentTransitionEnd = useCallback(
    (event: React.TransitionEvent<HTMLDivElement>) => {
      if (event.propertyName === 'grid-template-rows' && expanded) {
        setContentSettled(true);
      }
    },
    [expanded]
  );

  const triggerProps = {
    ariaControls: controlId,
    ariaLabel: headerAriaLabel,
    ariaLabelledBy: headerAriaLabel ? undefined : triggerControlId,
    onKeyUp,
    onKeyDown,
    onClick,
  };

  const baseVariant: InternalVariant = variant === 'stacked' ? 'container' : variant;

  return (
    <ExpandableSectionContainer
      {...props}
      expanded={expanded}
      className={clsx(baseProps.className, styles.root, analyticsSelectors.root)}
      variant={variant}
      __injectAnalyticsComponentMetadata={__injectAnalyticsComponentMetadata}
      header={
        <ExpandableSectionHeader
          id={triggerControlId}
          descriptionId={descriptionId}
          className={clsx(
            styles.header,
            styles[`header-${baseVariant}`],
            screenReaderTextClass,
            __disableHeaderPaddings && styles['disable-header-paddings']
          )}
          variant={baseVariant}
          expanded={!!expanded}
          header={header}
          headerText={headerText}
          headerDescription={headerDescription}
          headerCounter={headerCounter}
          headerInfo={headerInfo}
          headerActions={headerActions}
          headingTagOverride={headingTagOverride}
          expandIconPosition={__expandIconPosition}
          hideExpandIcon={__hideExpandIcon}
          {...triggerProps}
        />
      }
      __internalRootRef={__internalRootRef}
    >
      <div
        id={controlId}
        className={clsx(
          styles.content,
          styles[`content-${baseVariant}`],
          expanded && styles['content-expanded'],
          disableContentPaddings && styles['disable-content-paddings']
        )}
        role="group"
        aria-label={triggerProps.ariaLabel}
        aria-labelledby={triggerProps.ariaLabelledBy}
        aria-describedby={variantSupportsDescription(baseVariant) && headerDescription ? descriptionId : undefined}
        onTransitionEnd={handleContentTransitionEnd}
      >
        <div
          ref={contentInnerRef}
          className={clsx(
            styles['content-inner'],
            expanded && styles['content-inner-expanded'],
            contentSettled && styles['content-inner-settled']
          )}
        >
          <div
            className={clsx(
              styles['content-inner-body'],
              styles[`content-inner-body-${baseVariant}`],
              disableContentPaddings && styles['disable-content-paddings']
            )}
          >
            {children}
          </div>
        </div>
      </div>
    </ExpandableSectionContainer>
  );
}
