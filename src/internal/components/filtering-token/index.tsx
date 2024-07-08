// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';
import InternalIcon from '../../../icon/internal';
import styles from './styles.css.js';
import InternalSelect from '../../../select/internal';

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

// TODO: use semantic role for nested tokens too
// TODO: update component tests
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
    <TokenGroup
      ariaLabel={ariaLabel}
      operation={
        showOperation && (
          <OperationSelector
            operation={operation}
            onChange={onChangeOperation}
            ariaLabel={operatorAriaLabel ?? ''}
            andText={andText}
            orText={orText}
            disabled={disabled}
          />
        )
      }
      dismissButton={
        tokens.length === 1 && (
          <TokenDismissButton
            ariaLabel={dismissAriaLabel ?? ''}
            onDismiss={() => onDismissToken(0)}
            disabled={disabled}
          />
        )
      }
      grouped={tokens.length > 1}
      disabled={disabled}
      className={styles.root}
    >
      {tokens.length === 1
        ? tokens[0].content
        : tokens.map((token, index) => (
            <TokenGroup
              key={index}
              ariaLabel={''}
              operation={
                index !== 0 && (
                  <OperationSelector
                    operation={groupOperation}
                    onChange={onChangeGroupOperation}
                    ariaLabel={operatorAriaLabel ?? ''}
                    andText={andText}
                    orText={orText}
                    disabled={disabled}
                  />
                )
              }
              dismissButton={
                <TokenDismissButton
                  ariaLabel={dismissAriaLabel ?? ''}
                  onDismiss={() => onDismissToken(index)}
                  disabled={disabled}
                />
              }
              grouped={false}
              disabled={disabled}
            >
              {token.content}
            </TokenGroup>
          ))}
    </TokenGroup>
  );
}

function TokenGroup({
  ariaLabel,
  children,
  operation,
  dismissButton,
  grouped,
  disabled,
  className,
}: {
  ariaLabel?: string;
  children: React.ReactNode;
  operation: React.ReactNode;
  dismissButton: React.ReactNode;
  grouped: boolean;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <div className={clsx(styles['root-styles'], className)} role="group" aria-label={ariaLabel}>
      {operation}

      <div
        className={clsx(
          styles.token,
          !!operation && styles['show-operation'],
          disabled && styles['token-disabled'],
          grouped && styles.grouped
        )}
        aria-disabled={disabled}
      >
        <div className={styles['token-content']}>{children}</div>

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
  disabled,
}: {
  operation: FilteringTokenProps.Operation;
  onChange: (operation: FilteringTokenProps.Operation) => void;
  andText: string;
  orText: string;
  ariaLabel: string;
  disabled?: boolean;
}) {
  return (
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
      ariaLabel={ariaLabel}
    />
  );
}

function TokenDismissButton({
  ariaLabel,
  onDismiss,
  disabled,
}: {
  ariaLabel: string;
  onDismiss: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      className={styles['dismiss-button']}
      aria-label={ariaLabel}
      onClick={onDismiss}
      disabled={disabled}
    >
      <InternalIcon name="close" />
    </button>
  );
}
