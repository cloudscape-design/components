// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { isAppLayoutToolbarEnabled } from '../app-layout/utils/feature-flags';
import { ButtonProps } from '../button/interfaces';
import InternalButton from '../button/internal';
import { useSplitPanelContext } from '../internal/context/split-panel-context';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import { SplitPanelContentProps } from './interfaces';

import sharedStyles from '../app-layout/resize/styles.css.js';
import styles from './styles.css.js';
import testUtilStyles from './test-classes/styles.css.js';

interface SplitPanelContentSideProps extends SplitPanelContentProps {
  openButtonAriaLabel?: string;
  toggleRef: React.RefObject<ButtonProps.Ref>;
}

export function SplitPanelContentSide({
  style,
  baseProps,
  splitPanelRef,
  toggleRef,
  header,
  children,
  resizeHandle,
  isOpen,
  cappedSize,
  openButtonAriaLabel,
  panelHeaderId,
  onToggle,
}: SplitPanelContentSideProps) {
  const { topOffset, bottomOffset } = useSplitPanelContext();
  const isRefresh = useVisualRefresh();
  return (
    <div
      {...baseProps}
      className={clsx(
        baseProps.className,
        styles.drawer,
        styles['position-side'],
        testUtilStyles.root,
        sharedStyles['with-motion'],
        {
          [testUtilStyles['open-position-side']]: isOpen,
          [styles['drawer-closed']]: !isOpen,
          [styles['with-toolbar']]: isAppLayoutToolbarEnabled(),
          [styles.refresh]: isRefresh,
        }
      )}
      style={{
        width: isOpen ? cappedSize : '0px',
        maxWidth: isRefresh ? '100%' : undefined,
        ...style,
      }}
      ref={splitPanelRef}
    >
      <div
        className={styles['drawer-content-side']}
        style={{
          top: topOffset,
          bottom: bottomOffset,
        }}
        onClick={() => !isOpen && onToggle()}
        aria-labelledby={panelHeaderId}
        role="region"
      >
        {isOpen ? (
          <div className={styles['slider-wrapper-side']}>{resizeHandle}</div>
        ) : (
          <InternalButton
            className={clsx(testUtilStyles['open-button'], styles['open-button-side'])}
            iconName="angle-left"
            variant="icon"
            formAction="none"
            ariaLabel={openButtonAriaLabel}
            ariaExpanded={isOpen}
            ref={isRefresh ? null : toggleRef}
          />
        )}
        <div
          className={clsx(styles['content-side'], isAppLayoutToolbarEnabled() && styles['with-toolbar'])}
          aria-hidden={!isOpen}
          style={{ width: isAppLayoutToolbarEnabled() ? cappedSize : '0px' }} // to prevent text wrapping upon entering
        >
          <div className={styles['pane-header-wrapper-side']}>{header}</div>
          <div className={styles['pane-content-wrapper-side']}>{children}</div>
        </div>
      </div>
    </div>
  );
}
