// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';
import styles from './styles.css.js';
import LiveRegion from '../internal/components/live-region/index';
import { TabButton } from './tab-button';
import { InternalButton } from '../button/internal';
import { CodeEditorProps } from './interfaces';
import { useInternalI18n } from '../i18n/context.js';
import { getStatusButtonId, PaneStatus } from './util';

interface StatusBarProps {
  languageLabel: string;
  cursorPosition?: string;
  paneStatus: PaneStatus;
  isTabFocused: boolean;
  paneId?: string;
  i18nStrings?: CodeEditorProps.I18nStrings;
  errorCount: number;
  warningCount: number;
  isRefresh: boolean;

  errorsTabRef?: React.RefObject<HTMLButtonElement>;
  warningsTabRef?: React.RefObject<HTMLButtonElement>;

  onErrorPaneToggle: () => void;
  onWarningPaneToggle: () => void;
  onTabFocus?: React.FocusEventHandler<HTMLButtonElement>;
  onTabBlur?: React.FocusEventHandler<HTMLButtonElement>;
  onPreferencesOpen: () => void;
  onHeightChange?: (height: number | null) => void;
}

export function StatusBar({
  languageLabel,
  cursorPosition,
  paneStatus,
  onErrorPaneToggle,
  onWarningPaneToggle,
  onTabFocus,
  onTabBlur,
  errorsTabRef,
  warningsTabRef,
  isTabFocused,
  paneId,
  onPreferencesOpen,
  i18nStrings,
  errorCount,
  warningCount,
  isRefresh,
}: StatusBarProps) {
  const i18n = useInternalI18n('code-editor');
  const errorText = `${i18n('i18nStrings.errorsTab', i18nStrings?.errorsTab)}: ${errorCount}`;
  const warningText = `${i18n('i18nStrings.warningsTab', i18nStrings?.warningsTab)}: ${warningCount}`;
  const errorButtonId = getStatusButtonId({ paneId, paneStatus: 'error' });
  const warningButtonId = getStatusButtonId({ paneId, paneStatus: 'warning' });

  return (
    <div
      className={clsx(styles['status-bar'], {
        [styles['status-bar-with-hidden-pane']]: paneStatus === 'hidden',
      })}
    >
      <div className={clsx(styles['status-bar__left'])}>
        <span className={styles['status-bar__language-mode']}>{languageLabel}</span>
        <span className={styles['status-bar__cursor-position']}>{cursorPosition}</span>

        <div className={styles['tab-list']} role="tablist">
          <TabButton
            id={errorButtonId}
            count={errorCount}
            text={errorText}
            className={styles['tab-button--errors']}
            iconName="status-negative"
            disabled={errorCount === 0}
            active={paneStatus === 'error'}
            onClick={onErrorPaneToggle}
            onFocus={onTabFocus}
            onBlur={onTabBlur}
            ref={errorsTabRef}
            ariaLabel={errorText}
            paneId={paneId}
            isRefresh={isRefresh}
          />

          <span className={styles['tab-button--divider']}></span>

          <TabButton
            id={warningButtonId}
            count={warningCount}
            text={warningText}
            className={styles['tab-button--warnings']}
            iconName="status-warning"
            disabled={warningCount === 0}
            active={paneStatus === 'warning'}
            onClick={onWarningPaneToggle}
            onFocus={onTabFocus}
            onBlur={onTabBlur}
            ref={warningsTabRef}
            tabIndex={paneStatus === 'error' && isTabFocused ? -1 : undefined}
            ariaHidden={paneStatus === 'error' && isTabFocused ? true : undefined}
            ariaLabel={warningText}
            paneId={paneId}
            isRefresh={isRefresh}
          />
        </div>
        <LiveRegion assertive={true}>
          <span>{errorText} </span>
          <span>{warningText}</span>
        </LiveRegion>
      </div>

      <div className={styles['status-bar__right']}>
        <div className={styles['status-bar__cog-button']}>
          <InternalButton
            formAction="none"
            variant="icon"
            iconName="settings"
            iconAlt="Settings"
            ariaLabel={i18n('i18nStrings.preferencesButtonAriaLabel', i18nStrings?.preferencesButtonAriaLabel)}
            onClick={onPreferencesOpen}
            __nativeAttributes={{
              tabIndex: paneStatus !== 'hidden' && isTabFocused ? -1 : undefined,
              'aria-hidden': paneStatus !== 'hidden' && isTabFocused ? true : undefined,
            }}
          />
        </div>
      </div>
    </div>
  );
}
