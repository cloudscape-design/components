// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import InternalSelect from '../../../select/internal';
import InternalIcon from '../../../icon/internal';

import styles from './styles.css.js';

export namespace FilteringTokenProps {
  export type Operation = 'and' | 'or';
}

export interface FilteringTokenProps {
  ariaLabel?: string;
  showOperation: boolean;
  operation: FilteringTokenProps.Operation;
  andText: string;
  orText: string;
  dismissAriaLabel?: string;
  operatorAriaLabel?: string;
  disabled?: boolean;

  children: React.ReactNode;

  onChange: (op: FilteringTokenProps.Operation) => void;
  onDismiss: () => void;
}

export default function FilteringToken({
  ariaLabel,
  showOperation,
  operation,
  andText,
  orText,
  dismissAriaLabel,
  operatorAriaLabel,
  disabled,
  children,
  onChange,
  onDismiss,
}: FilteringTokenProps) {
  return (
    <div className={styles.root} role="group" aria-label={ariaLabel}>
      {showOperation && (
        <InternalSelect
          __inFilteringToken={true}
          className={styles.select}
          options={[
            { value: 'and', label: andText },
            { value: 'or', label: orText },
          ]}
          selectedOption={{ value: operation, label: operation === 'and' ? andText : orText }}
          onChange={e => onChange(e.detail.selectedOption.value as FilteringTokenProps.Operation)}
          disabled={disabled}
          ariaLabel={operatorAriaLabel}
        />
      )}
      <div
        className={clsx(styles.token, showOperation && styles['show-operation'], disabled && styles['token-disabled'])}
        aria-disabled={disabled}
      >
        <div className={styles['token-content']}>{children}</div>
        <button
          type="button"
          className={styles['dismiss-button']}
          aria-label={dismissAriaLabel}
          onClick={onDismiss}
          disabled={disabled}
        >
          <InternalIcon name="close" />
        </button>
      </div>
    </div>
  );
}
