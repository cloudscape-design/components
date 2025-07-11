// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { MutableRefObject, useContext } from 'react';
import clsx from 'clsx';

import { useUniqueId } from '@cloudscape-design/component-toolkit/internal';
import { getAnalyticsLabelAttribute } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

import { StickyHeaderContext } from '../container/use-sticky-header';
import { DATA_ATTR_FUNNEL_KEY, FUNNEL_KEY_SUBSTEP_NAME } from '../internal/analytics/selectors';
import { getBaseProps } from '../internal/base-component';
import { CollectionLabelContext } from '../internal/context/collection-label-context';
import { useContainerHeader } from '../internal/context/container-header';
import { InfoLinkLabelContext } from '../internal/context/info-link-label-context';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { useMobile } from '../internal/hooks/use-mobile';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import { SomeRequired } from '../internal/types';
import { useTableIntegration } from './analytics/use-table-integration';
import { HeaderProps } from './interfaces';

import analyticsSelectors from './analytics-metadata/styles.css.js';
import styles from './styles.css.js';

interface InternalHeaderProps extends SomeRequired<HeaderProps, 'variant'>, InternalBaseComponentProps {
  __disableActionsWrapping?: boolean;
  __headingTagRef?: MutableRefObject<HTMLHeadingElement | null>;
  __headingTagTabIndex?: number;
}

export default function InternalHeader({
  variant,
  headingTagOverride,
  children,
  actions,
  counter,
  description,
  info,
  __internalRootRef = null,
  __disableActionsWrapping,
  __headingTagRef,
  __headingTagTabIndex,
  ...restProps
}: InternalHeaderProps) {
  const isMobile = useMobile();
  const HeadingTag = headingTagOverride ?? (variant === 'awsui-h1-sticky' ? 'h1' : variant);
  const { isStuck } = useContext(StickyHeaderContext);
  const baseProps = getBaseProps(restProps);
  const isRefresh = useVisualRefresh();
  const assignHeaderId = useContext(CollectionLabelContext).assignId;
  const isInContainer = useContainerHeader();
  const headingId = useUniqueId('heading');

  useTableIntegration(counter);

  if (assignHeaderId !== undefined) {
    assignHeaderId(headingId);
  }
  // If is mobile there is no need to have the dynamic variant because it's scrolled out of view
  const dynamicVariant = !isMobile && isStuck ? 'h2' : 'h1';
  const variantOverride = variant === 'awsui-h1-sticky' ? (isRefresh ? dynamicVariant : 'h2') : variant;

  return (
    <div
      {...baseProps}
      className={clsx(
        styles.root,
        baseProps.className,
        styles[`root-variant-${variantOverride}`],
        isRefresh && styles.refresh,
        !actions && [styles[`root-no-actions`]],
        description && [styles[`root-has-description`]]
      )}
      ref={__internalRootRef}
    >
      <div
        className={clsx(
          styles.main,
          styles[`main-variant-${variantOverride}`],
          isRefresh && styles.refresh,
          __disableActionsWrapping && [styles['no-wrap']]
        )}
      >
        <div className={clsx(styles.title, styles[`title-variant-${variantOverride}`], isRefresh && styles.refresh)}>
          <HeadingTag
            className={clsx(styles.heading, styles[`heading-variant-${variantOverride}`])}
            ref={__headingTagRef}
            tabIndex={__headingTagTabIndex}
            {...getAnalyticsLabelAttribute(`.${analyticsSelectors['heading-text']}`)}
          >
            <span
              {...(isInContainer ? { [DATA_ATTR_FUNNEL_KEY]: FUNNEL_KEY_SUBSTEP_NAME } : {})}
              className={clsx(
                styles['heading-text'],
                analyticsSelectors['heading-text'],
                styles[`heading-text-variant-${variantOverride}`]
              )}
              id={headingId}
            >
              {children}
            </span>
            {counter !== undefined && <span className={styles.counter}> {counter}</span>}
          </HeadingTag>
          {info && (
            <InfoLinkLabelContext.Provider value={headingId}>
              {/* Exists to create a space between heading text and info so that a double-click selection on the last word of the heading doesn't also include info */}
              <span className={styles['virtual-space']}> &nbsp;</span>
              <span className={styles.info}>{info}</span>
            </InfoLinkLabelContext.Provider>
          )}
        </div>
        {actions && (
          <div
            className={clsx(
              styles.actions,
              styles[`actions-variant-${variantOverride}`],
              isRefresh && styles.refresh,
              !__disableActionsWrapping && [styles['actions-centered']]
            )}
          >
            {actions}
          </div>
        )}
      </div>
      <Description variantOverride={variantOverride}>{description}</Description>
    </div>
  );
}

export function Description({ children, variantOverride }: { children: React.ReactNode; variantOverride: string }) {
  const isRefresh = useVisualRefresh();
  return (
    (children && (
      <p
        className={clsx(
          styles.description,
          styles[`description-variant-${variantOverride}`],
          isRefresh && styles.refresh
        )}
      >
        {children}
      </p>
    )) ||
    null
  );
}
