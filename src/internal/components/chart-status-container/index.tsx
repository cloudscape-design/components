// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useMemo } from 'react';

import { BaseComponentProps } from '../../base-component';
import { fireNonCancelableEvent, NonCancelableEventHandler } from '../../events';
import InternalStatusIndicator from '../../../status-indicator/internal';
import InternalLink from '../../../link/internal';

import styles from './styles.css.js';
import { useInternalI18n } from '../../../i18n/context';

interface ChartStatusContainerProps extends BaseComponentProps {
  statusType: 'loading' | 'finished' | 'error';

  empty?: React.ReactNode;
  noMatch?: React.ReactNode;

  loadingText?: string;
  errorText?: string;
  recoveryText?: string;

  onRecoveryClick?: NonCancelableEventHandler;

  // From `getChartStatus`
  isEmpty?: boolean;
  isNoMatch?: boolean;
  showChart?: boolean;
}

export function getChartStatus<T, U>({
  externalData,
  visibleData,
  statusType,
}: {
  externalData: ReadonlyArray<T>;
  visibleData: ReadonlyArray<U>;
  statusType: 'loading' | 'finished' | 'error';
}) {
  const isEmpty = !visibleData || visibleData.length === 0;
  const isNoMatch = isEmpty && visibleData.length !== externalData.length;
  const showChart = statusType === 'finished' && !isEmpty;
  return { isEmpty, isNoMatch, showChart };
}

export default function ChartStatusContainer({
  statusType,
  errorText,
  loadingText,
  recoveryText,
  noMatch,
  empty,
  onRecoveryClick,
  isNoMatch,
  isEmpty,
  showChart,
}: ChartStatusContainerProps) {
  const i18n = useInternalI18n('[charts]');

  const statusContainer = useMemo(() => {
    const handleRecoveryClick = (event: CustomEvent) => {
      event.preventDefault();
      fireNonCancelableEvent(onRecoveryClick);
    };
    if (statusType === 'error') {
      const renderedRecoveryText = i18n('recoveryText', recoveryText);
      return (
        <span>
          <InternalStatusIndicator type="error">{i18n('errorText', errorText)}</InternalStatusIndicator>{' '}
          {!!renderedRecoveryText && !!onRecoveryClick && (
            <InternalLink onFollow={handleRecoveryClick} variant="recovery">
              {renderedRecoveryText}
            </InternalLink>
          )}
        </span>
      );
    }

    if (statusType === 'loading') {
      return <InternalStatusIndicator type="loading">{i18n('loadingText', loadingText)}</InternalStatusIndicator>;
    }

    if (isNoMatch) {
      return <div className={styles.empty}>{noMatch}</div>;
    }

    if (isEmpty) {
      return <div className={styles.empty}>{empty}</div>;
    }
  }, [i18n, statusType, onRecoveryClick, isEmpty, isNoMatch, recoveryText, loadingText, errorText, empty, noMatch]);

  return (
    <div className={styles.root} aria-live="polite" aria-atomic="true">
      {!showChart && statusContainer}
    </div>
  );
}
