// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';
import { ButtonProps } from '../button/interfaces';
import InternalButton from '../button/internal';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import { SplitPanelContentProps } from './interfaces';
import styles from './styles.css.js';
import { useSplitPanelContext } from '../internal/context/split-panel-context';

interface SplitPanelContentSideProps extends SplitPanelContentProps {
  openButtonAriaLabel?: string;
  toggleRef: React.RefObject<ButtonProps.Ref>;
}

export function SplitPanelContentSide({
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
      className={clsx(baseProps.className, styles.drawer, styles.root, styles['position-side'], {
        [styles['drawer-closed']]: !isOpen,
      })}
      style={{
        width: isOpen && isRefresh ? cappedSize : undefined,
        maxWidth: isRefresh ? '100%' : undefined,
      }}
      ref={splitPanelRef}
    >
      <div
        className={clsx(styles['drawer-content-side'], {
          [styles.refresh]: isRefresh,
        })}
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
            className={clsx(styles['open-button'], styles['open-button-side'])}
            iconName="angle-left"
            variant="icon"
            formAction="none"
            ariaLabel={openButtonAriaLabel}
            ariaExpanded={isOpen}
            ref={isRefresh ? null : toggleRef}
          />
        )}
        <div className={styles['content-side']} aria-hidden={!isOpen}>
          <div className={clsx(styles['pane-header-wrapper-side'])}>{header}</div>
          <hr className={styles['header-divider']} />
          <div className={clsx(styles['pane-content-wrapper-side'])}>{children}</div>
        </div>
      </div>
    </div>
  );
}
