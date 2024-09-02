// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useRef, useState } from 'react';

import { DropdownStatusProps } from '../internal/components/dropdown-status/interfaces';
import { NonCancelableEventHandler } from '../internal/events';
import FilteringToken, { FilteringTokenRef } from './filtering-token';
import { I18nStringsInternal } from './i18n-utils';
import {
  FormattedToken,
  GroupText,
  InternalFilteringOption,
  InternalFilteringProperty,
  InternalFreeTextFiltering,
  InternalQuery,
  InternalToken,
  JoinOperation,
  LoadItemsDetail,
} from './interfaces';
import { TokenEditor } from './token-editor';

import styles from './styles.css.js';

interface TokenProps {
  query: InternalQuery;
  tokenIndex: number;
  onUpdateToken: (newToken: InternalToken) => void;
  onUpdateOperation: (newOperation: JoinOperation) => void;
  onRemoveToken: () => void;
  asyncProperties?: boolean;
  asyncProps: DropdownStatusProps;
  customGroupsText: readonly GroupText[];
  disabled?: boolean;
  freeTextFiltering: InternalFreeTextFiltering;
  expandToViewport?: boolean;
  filteringProperties: readonly InternalFilteringProperty[];
  filteringOptions: readonly InternalFilteringOption[];
  hideOperations?: boolean;
  i18nStrings: I18nStringsInternal;
  onLoadItems?: NonCancelableEventHandler<LoadItemsDetail>;
  enableTokenGroups: boolean;
}

const emptyHandler = () => {};

export const TokenButton = ({
  query,
  onUpdateToken,
  onUpdateOperation,
  onRemoveToken,
  tokenIndex,
  filteringProperties,
  filteringOptions,
  asyncProps,
  onLoadItems,
  i18nStrings,
  asyncProperties,
  hideOperations,
  customGroupsText,
  disabled,
  freeTextFiltering,
  expandToViewport,
  enableTokenGroups,
}: TokenProps) => {
  const tokenRef = useRef<FilteringTokenRef>(null);
  const token = query.tokens[tokenIndex];
  const first = tokenIndex === 0;
  const formattedToken = i18nStrings.formatToken(token);
  const [temporaryToken, setTemporaryToken] = useState<InternalToken>(token);
  return (
    <FilteringToken
      ref={tokenRef}
      tokens={[
        {
          content: (
            <span className={styles['token-trigger']}>
              <TokenTrigger token={formattedToken} allProperties={token.property === null} />
            </span>
          ),
          ariaLabel: formattedToken.formattedText,
          dismissAriaLabel: i18nStrings?.removeTokenButtonAriaLabel?.(token) ?? '',
        },
      ]}
      showOperation={!first && !hideOperations}
      operation={query.operation}
      andText={i18nStrings.operationAndText ?? ''}
      orText={i18nStrings.operationOrText ?? ''}
      operationAriaLabel={i18nStrings.tokenOperatorAriaLabel ?? ''}
      onChangeOperation={onUpdateOperation}
      onDismissToken={onRemoveToken}
      disabled={disabled}
      editorContent={
        <TokenEditor
          supportsGroups={enableTokenGroups}
          filteringProperties={filteringProperties}
          filteringOptions={filteringOptions}
          tempGroup={[temporaryToken]}
          onChangeTempGroup={newGroup => setTemporaryToken(newGroup[0])}
          // This property will be needed when supportsGroups={true}
          standaloneTokens={[]}
          // This property will be needed when supportsGroups={true}
          onChangeStandalone={emptyHandler}
          asyncProps={asyncProps}
          onLoadItems={onLoadItems}
          i18nStrings={i18nStrings}
          asyncProperties={asyncProperties}
          customGroupsText={customGroupsText}
          freeTextFiltering={freeTextFiltering}
          onDismiss={() => tokenRef.current?.closeEditor()}
          onSubmit={() => {
            onUpdateToken(temporaryToken);
            tokenRef.current?.closeEditor();
          }}
        />
      }
      editorHeader={i18nStrings.editTokenHeader ?? ''}
      editorDismissAriaLabel={i18nStrings.dismissAriaLabel ?? ''}
      editorExpandToViewport={!!expandToViewport}
      onEditorOpen={() => setTemporaryToken(token)}
      // The properties below are only relevant for grouped tokens that are not supported
      // by the property filter component yet.
      groupOperation={query.operation}
      groupAriaLabel={i18nStrings.formatToken(token).formattedText}
      groupEditAriaLabel={i18nStrings.groupEditAriaLabel({ operation: query.operation, tokens: [token] })}
      onChangeGroupOperation={() => {}}
      hasGroups={false}
      popoverSize={enableTokenGroups ? 'content' : 'large'}
    />
  );
};

const TokenTrigger = ({
  token: { propertyLabel, operator, value },
  allProperties,
}: {
  token: FormattedToken;
  allProperties: boolean;
}) => {
  if (propertyLabel) {
    propertyLabel += ' ';
  }
  const freeTextContainsToken = operator === ':' && allProperties;
  const operatorText = freeTextContainsToken ? '' : operator + ' ';
  return (
    <>
      {allProperties ? '' : propertyLabel}
      <span className={styles['token-operator']}>{operatorText}</span>
      {value}
    </>
  );
};
