// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';
import SpaceBetween from '../space-between/internal';
import styles from './styles.css.js';
import { AppLayoutProps } from './interfaces';

interface ToggleButtonsProps {
  anyPanelOpen: boolean;
  children: React.ReactNode;
  ariaLabels: AppLayoutProps.Labels | undefined;
  isHidden: boolean;
  opaqueBackground: boolean;
}

export function ToggleButtons({ children, ariaLabels, anyPanelOpen, isHidden, opaqueBackground }: ToggleButtonsProps) {
  return (
    <div
      className={clsx(
        styles['button-toggles-container'],
        anyPanelOpen && styles['button-toggles-container-open'],
        isHidden && styles['button-toggles-container-is-hidden'],
        opaqueBackground && styles['opaque-background']
      )}
    >
      <aside
        aria-label={ariaLabels?.tools}
        className={clsx(styles['visual-refresh-toggle'], styles[`visual-refresh-toggle-type-tools`])}
      >
        <SpaceBetween size="xs">{children}</SpaceBetween>
      </aside>
    </div>
  );
}
