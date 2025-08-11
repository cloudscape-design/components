// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { useAppLayoutToolbarDesignEnabled } from '../app-layout/utils/feature-flags.js';
import { useInternalI18n } from '../i18n/context.js';
import { getBaseProps } from '../internal/base-component/index.js';
import { LinkDefaultVariantContext } from '../internal/context/link-default-variant-context.js';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component/index.js';
import { createWidgetizedComponent } from '../internal/widgets/index.js';
import InternalLiveRegion from '../live-region/internal.js';
import InternalStatusIndicator from '../status-indicator/internal.js';
import { HelpPanelProps } from './interfaces.js';

import styles from './styles.css.js';

type HelpPanelInternalProps = HelpPanelProps & InternalBaseComponentProps;

export function HelpPanelImplementation({
  header,
  footer,
  children,
  loading,
  loadingText,
  __internalRootRef,
  ...restProps
}: HelpPanelInternalProps) {
  const baseProps = getBaseProps(restProps);
  const isToolbar = useAppLayoutToolbarDesignEnabled();
  const i18n = useInternalI18n('help-panel');
  const containerProps = {
    ...baseProps,
    className: clsx(
      baseProps.className,
      styles['help-panel'],
      isToolbar && styles['with-toolbar'],
      loading && styles.loading
    ),
  };
  return loading ? (
    <div {...containerProps} ref={__internalRootRef}>
      <InternalStatusIndicator type="loading">
        <InternalLiveRegion tagName="span">{i18n('loadingText', loadingText)}</InternalLiveRegion>
      </InternalStatusIndicator>
    </div>
  ) : (
    <div {...containerProps} ref={__internalRootRef}>
      {header && <div className={clsx(styles.header)}>{header}</div>}
      <LinkDefaultVariantContext.Provider value={{ defaultVariant: 'primary' }}>
        <div className={styles.content}>{children}</div>
      </LinkDefaultVariantContext.Provider>
      {footer && (
        <div className={styles.footer}>
          <hr role="presentation" />
          {footer}
        </div>
      )}
    </div>
  );
}

export const createWidgetizedHelpPanel = createWidgetizedComponent(HelpPanelImplementation);
