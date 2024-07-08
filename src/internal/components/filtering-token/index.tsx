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
  tokens: TokenItem[];
  ariaLabel?: string;
  operation: FilteringTokenProps.Operation;
  groupOperation: FilteringTokenProps.Operation;
  showOperation: boolean;
  andText: string;
  orText: string;
  dismissAriaLabel?: string;
  operatorAriaLabel?: string;
  editTokenAriaLabel?: string;
  disabled?: boolean;
  onChangeOperation: (operation: FilteringTokenProps.Operation) => void;
  onChangeGroupOperation: (operation: FilteringTokenProps.Operation) => void;
  onDismissToken: (tokenIndex: number) => void;
}

interface TokenItem {
  content: React.ReactNode;
}

// TODO: decompose common pieces
// TODO: use semantic role for nested tokens too
// TODO: add filtering token permutations
export default function FilteringToken({
  tokens,
  ariaLabel,
  showOperation,
  operation,
  groupOperation,
  andText,
  orText,
  dismissAriaLabel,
  operatorAriaLabel,
  disabled,
  onChangeOperation,
  onChangeGroupOperation,
  onDismissToken,
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
          onChange={e => onChangeOperation(e.detail.selectedOption.value as FilteringTokenProps.Operation)}
          disabled={disabled}
          ariaLabel={operatorAriaLabel}
        />
      )}
      <div
        className={clsx(
          styles.token,
          showOperation && styles['show-operation'],
          disabled && styles['token-disabled'],
          tokens.length > 1 && styles.grouped
        )}
        aria-disabled={disabled}
      >
        <div className={styles['token-content']}>
          {tokens.length === 1
            ? tokens[0].content
            : tokens.map((token, index) => (
                <div key={index} className={styles['token-content-root']}>
                  {index !== 0 && (
                    <InternalSelect
                      __inFilteringToken={true}
                      className={styles.select}
                      options={[
                        { value: 'and', label: andText },
                        { value: 'or', label: orText },
                      ]}
                      selectedOption={{ value: groupOperation, label: groupOperation === 'and' ? andText : orText }}
                      onChange={e =>
                        onChangeGroupOperation(e.detail.selectedOption.value as FilteringTokenProps.Operation)
                      }
                      disabled={disabled}
                      ariaLabel={operatorAriaLabel}
                    />
                  )}
                  <div
                    className={clsx(
                      styles['grouped-token'],
                      index !== 0 && styles['show-operation'],
                      disabled && styles['token-disabled']
                      // index === 0 && styles.first
                    )}
                    aria-disabled={disabled}
                  >
                    <div className={styles['token-content']}>{token.content}</div>
                    <button
                      type="button"
                      className={styles['dismiss-button']}
                      aria-label={dismissAriaLabel}
                      onClick={() => onDismissToken(index)}
                      disabled={disabled}
                    >
                      <InternalIcon name="close" />
                    </button>
                  </div>
                </div>
              ))}
        </div>
        {tokens.length === 1 && (
          <button
            type="button"
            className={styles['dismiss-button']}
            aria-label={dismissAriaLabel}
            onClick={() => onDismissToken(0)}
            disabled={disabled}
          >
            <InternalIcon name="close" />
          </button>
        )}
      </div>
    </div>
  );
}
