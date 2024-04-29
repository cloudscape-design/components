// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React, { useContext } from 'react';
import { getBaseProps } from '../internal/base-component';
import { StickyHeaderContext } from '../container/use-sticky-header';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import { HeaderProps } from './interfaces';
import styles from './styles.css.js';
import { SomeRequired } from '../internal/types';
import { useMobile } from '../internal/hooks/use-mobile';
import { InfoLinkLabelContext } from '../internal/context/info-link-label-context';
import { CollectionLabelContext } from '../internal/context/collection-label-context';
import { useUniqueId } from '../internal/hooks/use-unique-id';
import { DATA_ATTR_FUNNEL_KEY, FUNNEL_KEY_SUBSTEP_NAME } from '../internal/analytics/selectors';
import { useContainerHeader } from '../internal/context/container-header';
import { getGlobalFlag } from '../internal/utils/global-flags';

interface InternalHeaderProps extends SomeRequired<HeaderProps, 'variant'>, InternalBaseComponentProps {
  __disableActionsWrapping?: boolean;
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
  if (assignHeaderId !== undefined) {
    assignHeaderId(headingId);
  }
  // If is mobile there is no need to have the dynamic variant because it's scrolled out of view
  const dynamicVariant = !isMobile && isStuck ? 'h2' : 'h1';
  const variantOverride = variant === 'awsui-h1-sticky' ? (isRefresh ? dynamicVariant : 'h2') : variant;
  const hasToolbarHeader = getGlobalFlag('appLayoutWidget');

  return (
    <div
      {...baseProps}
      className={clsx(
        styles.root,
        baseProps.className,
        styles[`root-variant-${variantOverride}`],
        isRefresh && styles.refresh,
        hasToolbarHeader && styles['root-with-toolbar'],
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
          <HeadingTag className={clsx(styles.heading, styles[`heading-variant-${variantOverride}`])}>
            <span
              {...(isInContainer ? { [DATA_ATTR_FUNNEL_KEY]: FUNNEL_KEY_SUBSTEP_NAME } : {})}
              className={clsx(styles['heading-text'], styles[`heading-text-variant-${variantOverride}`])}
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
