// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import clsx from 'clsx';

import { Focusable } from '../../app-layout/utils/use-focus-control';
import InternalButton from '../../button/internal';
import { SplitPanelProps } from '../interfaces';

import panelTestUtilStyles from '../test-classes/styles.css.js';
import styles from './styles.css.js';
import testUtilStyles from './test-classes/styles.css.js';

interface SplitPanelHeaderProps extends Pick<SplitPanelProps, 'closeBehavior'> {
  text: string;
  position: 'side' | 'bottom';
  isOpen?: boolean;
  onToggle: () => void;
  setPreferencesOpen: (open: boolean) => void;
  panelHeaderId: string;
  hidePreferencesButton: boolean;
  i18nStrings: Pick<SplitPanelProps.I18nStrings, 'preferencesTitle' | 'closeButtonAriaLabel' | 'openButtonAriaLabel'>;
  isRefresh: boolean;
  isToolbar?: boolean;
  appLayoutMaxWidth?: React.CSSProperties;
  refs: {
    preferences: React.RefObject<Focusable>;
    toggle: React.RefObject<Focusable>;
  };
}

export default function SplitPanelHeader({
  text,
  position,
  isOpen,
  onToggle,
  setPreferencesOpen,
  closeBehavior,
  panelHeaderId,
  hidePreferencesButton,
  i18nStrings,
  isRefresh,
  isToolbar,
  appLayoutMaxWidth,
  refs,
}: SplitPanelHeaderProps) {
  return (
    <div className={clsx(styles.header, isToolbar && styles['with-toolbar'])} style={appLayoutMaxWidth}>
      <h2 className={clsx(styles['header-text'], testUtilStyles['header-text'])} id={panelHeaderId}>
        {text}
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
            className={panelTestUtilStyles['open-button']}
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
