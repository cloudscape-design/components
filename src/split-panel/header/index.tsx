// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import clsx from 'clsx';

import { Focusable } from '../../app-layout/utils/use-focus-control';
import InternalButton from '../../button/internal';
import { SplitPanelProps } from '../interfaces';

import styles from './styles.css.js';
import testUtilStyles from './test-classes/styles.css.js';

interface SplitPanelHeaderProps extends Pick<SplitPanelProps, 'closeBehavior'> {
  isToolbar?: boolean;
  appLayoutMaxWidth?: React.CSSProperties;
  headerText: string;
  panelHeaderId: string;
  hidePreferencesButton: boolean;
  isOpen?: boolean;
  setPreferencesOpen: (open: boolean) => void;
  i18nStrings: Pick<SplitPanelProps.I18nStrings, 'preferencesTitle' | 'closeButtonAriaLabel' | 'openButtonAriaLabel'>;
  refs: {
    preferences: React.RefObject<Focusable>;
    toggle: React.RefObject<Focusable>;
  };
  isRefresh: boolean;
  position: 'side' | 'bottom';
  onToggle: () => void;
}

export default function SplitPanelHeader({
  isToolbar,
  appLayoutMaxWidth,
  headerText,
  panelHeaderId,
  hidePreferencesButton,
  isOpen,
  setPreferencesOpen,
  i18nStrings,
  refs,
  isRefresh,
  closeBehavior,
  position,
  onToggle,
}: SplitPanelHeaderProps) {
  return (
    <div className={clsx(styles.header, isToolbar && styles['with-toolbar'])} style={appLayoutMaxWidth}>
      <h2 className={clsx(styles['header-text'], testUtilStyles['header-text'])} id={panelHeaderId}>
        {headerText}
      </h2>
      <div className={styles['header-buttons']}>
        {!hidePreferencesButton && isOpen && (
          <>
            <InternalButton
              className={testUtilStyles['preferences-button']}
              iconName="settings"
              variant="icon"
              onClick={() => setPreferencesOpen(true)}
              formAction="none"
              ariaLabel={i18nStrings.preferencesTitle}
              ref={refs.preferences}
            />
            <span className={styles.divider} />
          </>
        )}

        {isOpen ? (
          <InternalButton
            className={testUtilStyles['close-button']}
            iconName={
              isRefresh && closeBehavior === 'collapse' ? (position === 'side' ? 'angle-right' : 'angle-down') : 'close'
            }
            variant="icon"
            onClick={onToggle}
            formAction="none"
            ariaLabel={i18nStrings.closeButtonAriaLabel}
            ariaExpanded={isOpen}
          />
        ) : position === 'side' || closeBehavior === 'hide' ? null : (
          <InternalButton
            className={testUtilStyles['open-button']}
            iconName="angle-up"
            variant="icon"
            formAction="none"
            ariaLabel={i18nStrings.openButtonAriaLabel}
            ref={refs.toggle}
            ariaExpanded={isOpen}
          />
        )}
      </div>
    </div>
  );
}
