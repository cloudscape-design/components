// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { KeyboardEvent, useCallback, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import clsx from 'clsx';

import { getBaseProps } from '../internal/base-component';
import { fireNonCancelableEvent } from '../internal/events';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { useControllable } from '../internal/hooks/use-controllable';
import { useUniqueId } from '../internal/hooks/use-unique-id';
import { KeyCode } from '../internal/keycode';
import { ExpandableSectionContainer } from './expandable-section-container';
import { ExpandableSectionHeader } from './expandable-section-header';
import { ExpandableSectionProps, InternalVariant } from './interfaces';
import { variantSupportsDescription } from './utils';

import analyticsSelectors from './analytics-metadata/styles.css.js';
import styles from './styles.css.js';

export type InternalExpandableSectionProps = Omit<ExpandableSectionProps, 'variant'> &
  InternalBaseComponentProps & {
    variant?: InternalVariant;
    __injectAnalyticsComponentMetadata?: boolean;
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
  ...props
}: InternalExpandableSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
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
    (expanded: boolean) => {
      setExpanded(expanded);
      fireNonCancelableEvent(onChange, { expanded });
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
      // Prevent the page from scrolling when toggling the component with the space bar.
      event.preventDefault();
    }
  }, []);

  const triggerProps = {
    ariaControls: controlId,
    ariaLabel: headerAriaLabel,
    ariaLabelledBy: headerAriaLabel ? undefined : triggerControlId,
    onKeyUp,
    onKeyDown,
    onClick,
  };

  // Map stacked variant to container to avoid code duplication
  const baseVariant: InternalVariant = variant === 'stacked' ? 'container' : variant;

  return (
    <ExpandableSectionContainer
      {...baseProps}
      expanded={expanded}
      className={clsx(baseProps.className, styles.root, analyticsSelectors.root)}
      variant={variant}
      disableContentPaddings={disableContentPaddings}
      __injectAnalyticsComponentMetadata={__injectAnalyticsComponentMetadata}
      header={
        <ExpandableSectionHeader
          id={triggerControlId}
          descriptionId={descriptionId}
          className={clsx(styles.header, styles[`header-${baseVariant}`])}
          variant={baseVariant}
          expanded={!!expanded}
          header={header}
          headerText={headerText}
          headerDescription={headerDescription}
          headerCounter={headerCounter}
          headerInfo={headerInfo}
          headerActions={headerActions}
          headingTagOverride={headingTagOverride}
          {...triggerProps}
        />
      }
      __internalRootRef={__internalRootRef}
    >
      <CSSTransition in={expanded} timeout={30} classNames={{ enter: styles['content-enter'] }} nodeRef={ref}>
        <div
          id={controlId}
          ref={ref}
          className={clsx(styles.content, styles[`content-${baseVariant}`], expanded && styles['content-expanded'])}
          role="group"
          aria-label={triggerProps.ariaLabel}
          aria-labelledby={triggerProps.ariaLabelledBy}
          aria-describedby={variantSupportsDescription(baseVariant) && headerDescription ? descriptionId : undefined}
        >
          {children}
        </div>
      </CSSTransition>
    </ExpandableSectionContainer>
  );
}
