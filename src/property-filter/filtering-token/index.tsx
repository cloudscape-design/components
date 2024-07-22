// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import clsx from 'clsx';

import InternalIcon from '../../icon/internal';
import InternalSelect from '../../select/internal';

import testUtilStyles from '../test-classes/styles.css.js';
import styles from './styles.css.js';

export namespace FilteringTokenProps {
  export type Operation = 'and' | 'or';
}

export interface FilteringTokenProps {
  tokens: TokenItem[];
  operation: FilteringTokenProps.Operation;
  groupOperation: FilteringTokenProps.Operation;
  showOperation: boolean;
  andText: string;
  orText: string;
  groupAriaLabel: string;
  operationAriaLabel: string;
  disabled?: boolean;
  onChangeOperation: (operation: FilteringTokenProps.Operation) => void;
  onChangeGroupOperation: (operation: FilteringTokenProps.Operation) => void;
  onDismissToken: (tokenIndex: number) => void;
}

interface TokenItem {
  content: React.ReactNode;
  ariaLabel: string;
  dismissAriaLabel: string;
}

export default function FilteringToken({
  tokens,
  showOperation,
  operation,
  groupOperation,
  andText,
  orText,
  groupAriaLabel,
  operationAriaLabel,
  disabled,
  onChangeOperation,
  onChangeGroupOperation,
  onDismissToken,
}: FilteringTokenProps) {
  return (
    <TokenGroup
      ariaLabel={tokens.length === 1 ? tokens[0].ariaLabel : groupAriaLabel}
      operation={
        showOperation && (
          <OperationSelector
            operation={operation}
            onChange={onChangeOperation}
            ariaLabel={operationAriaLabel}
            andText={andText}
            orText={orText}
            parent={true}
            disabled={disabled}
          />
        )
      }
      dismissButton={
        tokens.length === 1 && (
          <TokenDismissButton
            ariaLabel={tokens[0].dismissAriaLabel}
            onDismiss={() => onDismissToken(0)}
            parent={true}
            disabled={disabled}
          />
        )
      }
      parent={true}
      grouped={tokens.length > 1}
      disabled={disabled}
    >
      {tokens.length === 1 ? (
        tokens[0].content
      ) : (
        <ul className={styles.list}>
          {tokens.map((token, index) => (
            <li key={index}>
              <TokenGroup
                ariaLabel={token.ariaLabel}
                operation={
                  index !== 0 && (
                    <OperationSelector
                      operation={groupOperation}
                      onChange={onChangeGroupOperation}
                      ariaLabel={operationAriaLabel}
                      andText={andText}
                      orText={orText}
                      parent={false}
                      disabled={disabled}
                    />
                  )
                }
                dismissButton={
                  <TokenDismissButton
                    ariaLabel={token.dismissAriaLabel}
                    onDismiss={() => onDismissToken(index)}
                    parent={false}
                    disabled={disabled}
                  />
                }
                parent={false}
                grouped={false}
                disabled={disabled}
              >
                {token.content}
              </TokenGroup>
            </li>
          ))}
        </ul>
      )}
    </TokenGroup>
  );
}

function TokenGroup({
  ariaLabel,
  children,
  operation,
  dismissButton,
  parent,
  grouped,
  disabled,
}: {
  ariaLabel?: string;
  children: React.ReactNode;
  operation: React.ReactNode;
  dismissButton: React.ReactNode;
  parent: boolean;
  grouped: boolean;
  disabled?: boolean;
}) {
  return (
    <div
      className={clsx(
        parent
          ? clsx(styles.root, testUtilStyles['filtering-token'])
          : clsx(styles['inner-root'], testUtilStyles['filtering-token-inner'])
      )}
      role="group"
      aria-label={ariaLabel}
    >
      {operation}

      <div
        className={clsx(
          styles.token,
          !!operation && styles['show-operation'],
          grouped && styles.grouped,
          disabled && styles['token-disabled']
        )}
        aria-disabled={disabled}
      >
        <div
          className={clsx(
            parent
              ? clsx(styles['token-content'], testUtilStyles['filtering-token-content'])
              : clsx(styles['inner-token-content'], testUtilStyles['filtering-token-inner-content'])
          )}
        >
          {children}
        </div>

        {dismissButton}
      </div>
    </div>
  );
}

function OperationSelector({
  operation,
  onChange,
  ariaLabel,
  andText,
  orText,
  parent,
  disabled,
}: {
  operation: FilteringTokenProps.Operation;
  onChange: (operation: FilteringTokenProps.Operation) => void;
  andText: string;
  orText: string;
  ariaLabel: string;
  parent: boolean;
  disabled?: boolean;
}) {
  return (
    <InternalSelect
      __inFilteringToken={true}
      className={clsx(
        parent
          ? clsx(styles.select, testUtilStyles['filtering-token-select'])
          : clsx(styles['inner-select'], testUtilStyles['filtering-token-inner-select'])
      )}
      options={[
        { value: 'and', label: andText },
        { value: 'or', label: orText },
      ]}
      selectedOption={{ value: operation, label: operation === 'and' ? andText : orText }}
      onChange={e => onChange(e.detail.selectedOption.value as FilteringTokenProps.Operation)}
      disabled={disabled}
      ariaLabel={ariaLabel}
    />
  );
}

function TokenDismissButton({
  ariaLabel,
  onDismiss,
  parent,
  disabled,
}: {
  ariaLabel: string;
  onDismiss: () => void;
  parent: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      className={clsx(
        parent
          ? clsx(styles['dismiss-button'], testUtilStyles['filtering-token-dismiss-button'])
          : clsx(styles['inner-dismiss-button'], testUtilStyles['filtering-token-inner-dismiss-button'])
      )}
      aria-label={ariaLabel}
      onClick={onDismiss}
      disabled={disabled}
    >
      <InternalIcon name="close" />
    </button>
  );
}
