// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import clsx from 'clsx';

import { useDensityMode } from '@cloudscape-design/component-toolkit/internal';

import InternalIcon from '../../icon/internal';
import InternalPopover, { InternalPopoverProps, InternalPopoverRef } from '../../popover/internal';
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
  groupEditAriaLabel: string;
  disabled?: boolean;
  onChangeOperation: (operation: FilteringTokenProps.Operation) => void;
  onChangeGroupOperation: (operation: FilteringTokenProps.Operation) => void;
  onDismissToken: (tokenIndex: number) => void;
  editorContent: React.ReactNode;
  editorHeader: string;
  editorDismissAriaLabel: string;
  editorExpandToViewport: boolean;
  onEditorOpen?: () => void;
  hasGroups: boolean;
}

export interface FilteringTokenRef {
  closeEditor(): void;
}

interface TokenItem {
  content: React.ReactNode;
  ariaLabel: string;
  dismissAriaLabel: string;
}

const FilteringToken = forwardRef(
  (
    {
      tokens,
      showOperation,
      operation,
      groupOperation,
      andText,
      orText,
      groupAriaLabel,
      operationAriaLabel,
      groupEditAriaLabel,
      disabled = false,
      onChangeOperation,
      onChangeGroupOperation,
      onDismissToken,
      editorContent,
      editorHeader,
      editorDismissAriaLabel,
      editorExpandToViewport,
      onEditorOpen,
      hasGroups,
    }: FilteringTokenProps,
    ref: React.Ref<FilteringTokenRef>
  ) => {
    const popoverRef = useRef<InternalPopoverRef>(null);
    const popoverProps: InternalPopoverProps = {
      content: editorContent,
      triggerType: 'text',
      header: editorHeader,
      size: 'large',
      position: 'right',
      dismissAriaLabel: editorDismissAriaLabel,
      renderWithPortal: editorExpandToViewport,
      __onOpen: onEditorOpen,
    };
    useImperativeHandle(ref, () => ({ closeEditor: () => popoverRef.current?.dismissPopover() }));

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
        tokenAction={
          tokens.length === 1 ? (
            <TokenDismissButton
              ariaLabel={tokens[0].dismissAriaLabel}
              onClick={() => onDismissToken(0)}
              parent={true}
              disabled={disabled}
            />
          ) : (
            <InternalPopover ref={popoverRef} {...popoverProps} triggerType="filtering-token">
              <TokenEditButton ariaLabel={groupEditAriaLabel} disabled={disabled} />
            </InternalPopover>
          )
        }
        parent={true}
        grouped={tokens.length > 1}
        disabled={disabled}
        hasGroups={hasGroups}
      >
        {tokens.length === 1 ? (
          <InternalPopover ref={popoverRef} {...popoverProps}>
            {tokens[0].content}
          </InternalPopover>
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
                  tokenAction={
                    <TokenDismissButton
                      ariaLabel={token.dismissAriaLabel}
                      onClick={() => onDismissToken(index)}
                      parent={false}
                      disabled={disabled}
                    />
                  }
                  parent={false}
                  grouped={false}
                  disabled={disabled}
                  hasGroups={false}
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
);

export default FilteringToken;

function TokenGroup({
  ariaLabel,
  children,
  operation,
  tokenAction,
  parent,
  grouped,
  disabled,
  hasGroups,
}: {
  ariaLabel?: string;
  children: React.ReactNode;
  operation: React.ReactNode;
  tokenAction: React.ReactNode;
  parent: boolean;
  grouped: boolean;
  disabled: boolean;
  hasGroups: boolean;
}) {
  const groupRef = useRef<HTMLDivElement>(null);
  const isCompactMode = useDensityMode(groupRef) === 'compact';
  return (
    <div
      ref={groupRef}
      className={clsx(
        parent
          ? clsx(styles.root, testUtilStyles['filtering-token'])
          : clsx(styles['inner-root'], testUtilStyles['filtering-token-inner']),
        hasGroups && styles['has-groups'],
        isCompactMode && styles['compact-mode']
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
              : clsx(styles['inner-token-content'], testUtilStyles['filtering-token-inner-content']),
            grouped && styles['token-content-grouped']
          )}
        >
          {children}
        </div>

        {tokenAction}
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
  onClick,
  parent,
  disabled,
}: {
  ariaLabel: string;
  onClick: () => void;
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
      onClick={onClick}
      disabled={disabled}
    >
      <InternalIcon name="close" />
    </button>
  );
}

function TokenEditButton({ ariaLabel, disabled }: { ariaLabel: string; disabled?: boolean }) {
  return (
    <button
      type="button"
      className={clsx(styles['edit-button'], testUtilStyles['filtering-token-edit-button'])}
      aria-label={ariaLabel}
      disabled={disabled}
    >
      <InternalIcon name="edit" />
    </button>
  );
}
