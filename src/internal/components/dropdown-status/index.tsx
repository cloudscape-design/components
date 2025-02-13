// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import InternalLink from '../../../link/internal';
import InternalStatusIndicator from '../../../status-indicator/internal';
import { fireNonCancelableEvent, NonCancelableEventHandler } from '../../events';
import { usePrevious } from '../../hooks/use-previous';
import { DropdownStatusProps } from './interfaces';

import styles from './styles.css.js';

export { DropdownStatusProps };

export interface DropdownStatusPropsExtended extends Omit<DropdownStatusProps, 'recoveryText' | 'errorIconAriaLabel'> {
  isEmpty?: boolean;
  isNoMatch?: boolean;
  isFiltered?: boolean;
  noMatch?: React.ReactNode;
  filteringResultsText?: string;
  /**
   * Called when the user clicks the recovery button placed at the
   * bottom of the dropdown list in the error state. Use this to
   * retry a failed request or provide another option for the user
   * to recover from the error.
   */
  onRecoveryClick?: NonCancelableEventHandler;
  /**
   * Determines if retry button should be rendered
   * in case recoveryText was automatically provided by i18n.
   */
  hasRecoveryCallback?: boolean;

  getErrorIconAriaLabel: () => string | undefined;
  getRecoveryText: () => string | undefined;
}

function DropdownStatus({ children }: { children: React.ReactNode }) {
  return <div className={styles.root}>{children}</div>;
}

type UseDropdownStatus = (statusProps: DropdownStatusPropsExtended) => DropdownStatusResult;

export interface DropdownStatusResult {
  isSticky: boolean;
  content: React.ReactNode | null;
  hasRecoveryButton: boolean;
}

export const useDropdownStatus: UseDropdownStatus = ({
  statusType,
  empty,
  loadingText,
  finishedText,
  filteringResultsText,
  errorText,
  getRecoveryText,
  isEmpty,
  isNoMatch,
  isFiltered,
  noMatch,
  onRecoveryClick,
  hasRecoveryCallback = false,
  getErrorIconAriaLabel,
}): DropdownStatusResult => {
  const previousStatusType = usePrevious(statusType);
  const statusResult: DropdownStatusResult = { isSticky: true, content: null, hasRecoveryButton: false };

  if (statusType === 'loading') {
    statusResult.content = <InternalStatusIndicator type={'loading'}>{loadingText}</InternalStatusIndicator>;
  } else if (statusType === 'error') {
    const recoveryText = getRecoveryText();
    statusResult.hasRecoveryButton = !!recoveryText && hasRecoveryCallback;
    statusResult.content = (
      <span>
        <InternalStatusIndicator
          type="error"
          __display="inline"
          __animate={previousStatusType !== 'error'}
          iconAriaLabel={getErrorIconAriaLabel()}
        >
          {errorText}
        </InternalStatusIndicator>{' '}
        {statusResult.hasRecoveryButton && (
          <InternalLink
            onFollow={() => fireNonCancelableEvent(onRecoveryClick)}
            variant="recovery"
            className={styles.recovery}
          >
            {recoveryText}
          </InternalLink>
        )}
      </span>
    );
  } else if (isEmpty && empty) {
    statusResult.content = empty;
  } else if (isNoMatch && noMatch) {
    statusResult.content = noMatch;
  } else if (isFiltered && filteringResultsText) {
    statusResult.content = filteringResultsText;
  } else if (statusType === 'finished' && finishedText) {
    statusResult.content = finishedText;
    statusResult.isSticky = false;
  }

  return statusResult;
};

export default DropdownStatus;
