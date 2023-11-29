// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React from 'react';
import { useDynamicOverlap } from '../internal/hooks/use-dynamic-overlap';
import styles from './styles.css.js';

interface WizardFormHeaderProps {
  children: React.ReactNode;
  isMobile: boolean;
  isVisualRefresh: boolean;
}

export default function WizardFormHeader({ children, isVisualRefresh }: WizardFormHeaderProps) {
  const overlapElement = useDynamicOverlap();

  /**
   * Mutation observer for Cloudscape User Settings
   * Category: Theme
   * Property: High Contrast Header
   */
  const [userSettingsThemeHighContrastHeader, setUserSettingsThemeHighContrastHeader] = React.useState('enabled');

  function callback(mutationList: any) {
    for (const mutation of mutationList) {
      if (mutation.type === 'attributes') {
        setUserSettingsThemeHighContrastHeader(mutation.target.dataset.userSettingsThemeHighContrastHeader);
      }
    }
  }

  const observer = new MutationObserver(callback);
  observer.observe(document.body, { attributeFilter: ['data-user-settings-theme-high-contrast-header'] });

  return (
    <div
      className={clsx(
        styles['form-header'],
        isVisualRefresh && styles['form-header-refresh'],
        isVisualRefresh && userSettingsThemeHighContrastHeader === 'enabled' && 'awsui-context-content-header'
      )}
      ref={overlapElement}
    >
      <div className={clsx(styles['form-header-content'])}>{children}</div>
    </div>
  );
}
