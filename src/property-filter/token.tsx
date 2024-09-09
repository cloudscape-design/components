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
  InternalTokenGroup,
  JoinOperation,
  LoadItemsDetail,
} from './interfaces';
import { TokenEditor } from './token-editor';
import { tokenGroupToTokens } from './utils';

import styles from './styles.css.js';

interface TokenProps {
  query: InternalQuery;
  tokenIndex: number;
  onUpdateToken: (updatedToken: InternalToken | InternalTokenGroup, releasedTokens: InternalToken[]) => void;
  onUpdateOperation: (updatedOperation: JoinOperation) => void;
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

  const hasGroups = query.tokens.some(tokenOrGroup => 'operation' in tokenOrGroup);
  const first = tokenIndex === 0;

  const tokenOrGroup = query.tokens[tokenIndex];
  const tokens = tokenGroupToTokens<InternalToken>([tokenOrGroup]).map(t => ({ ...t, standaloneIndex: undefined }));
  const operation = query.operation;
  const groupOperation = 'operation' in tokenOrGroup ? tokenOrGroup.operation : operation === 'and' ? 'or' : 'and';

  const [tempTokens, setTempTokens] = useState<InternalToken[]>(tokens);
  const capturedTokenIndices = tempTokens.map(token => token.standaloneIndex).filter(index => index !== undefined);
  const tokensToCapture: InternalToken[] = [];
  for (let index = 0; index < query.tokens.length; index++) {
    const token = query.tokens[index];
    if ('operator' in token && token !== tokenOrGroup && !capturedTokenIndices.includes(index)) {
      tokensToCapture.push(token);
    }
  }
  const [tempReleasedTokens, setTempReleasedTokens] = useState<InternalToken[]>([]);
  tokensToCapture.push(...tempReleasedTokens);

  return (
    <FilteringToken
      ref={tokenRef}
      tokens={tokens.map(token => {
        const formattedToken = i18nStrings.formatToken(token);
        return {
          content: (
            <span className={styles['token-trigger']}>
              <TokenTrigger token={formattedToken} allProperties={token.property === null} />
            </span>
          ),
          ariaLabel: formattedToken.formattedText,
          dismissAriaLabel: i18nStrings.removeTokenButtonAriaLabel(token),
        };
      })}
      showOperation={!first && !hideOperations}
      operation={operation}
      andText={i18nStrings.operationAndText ?? ''}
      orText={i18nStrings.operationOrText ?? ''}
      operationAriaLabel={i18nStrings.tokenOperatorAriaLabel ?? ''}
      onChangeOperation={onUpdateOperation}
      onDismissToken={(removeIndex: number) => {
        if (tokens.length === 1) {
          onRemoveToken();
        } else {
          const newTokens = tokens.filter((_, index) => index !== removeIndex);
          const updatedToken = newTokens.length === 1 ? newTokens[0] : { operation: groupOperation, tokens: newTokens };
          onUpdateToken(updatedToken, []);
        }
      }}
      disabled={disabled}
      editorContent={
        <TokenEditor
          supportsGroups={enableTokenGroups}
          filteringProperties={filteringProperties}
          filteringOptions={filteringOptions}
          tempGroup={tempTokens}
          onChangeTempGroup={setTempTokens}
          tokensToCapture={tokensToCapture}
          onTokenCapture={capturedToken => setTempReleasedTokens(prev => prev.filter(token => token !== capturedToken))}
          onTokenRelease={releasedToken => {
            if (releasedToken.standaloneIndex === undefined) {
              setTempReleasedTokens(prev => [...prev, releasedToken]);
            }
          }}
          asyncProps={asyncProps}
          onLoadItems={onLoadItems}
          i18nStrings={i18nStrings}
          asyncProperties={asyncProperties}
          customGroupsText={customGroupsText}
          freeTextFiltering={freeTextFiltering}
          onDismiss={() => {
            tokenRef.current?.closeEditor();
          }}
          onSubmit={() => {
            const updatedToken =
              tempTokens.length === 1 ? tempTokens[0] : { operation: groupOperation, tokens: tempTokens };
            onUpdateToken(updatedToken, tempReleasedTokens);
            tokenRef.current?.closeEditor();
          }}
        />
      }
      editorHeader={i18nStrings.editTokenHeader ?? ''}
      editorDismissAriaLabel={i18nStrings.dismissAriaLabel}
      editorExpandToViewport={!!expandToViewport}
      onEditorOpen={() => {
        setTempTokens(tokens);
        setTempReleasedTokens([]);
      }}
      groupOperation={groupOperation}
      onChangeGroupOperation={operation => onUpdateToken({ operation, tokens }, [])}
      groupAriaLabel={i18nStrings.groupAriaLabel({ operation: groupOperation, tokens })}
      groupEditAriaLabel={i18nStrings.groupEditAriaLabel({ operation: groupOperation, tokens })}
      hasGroups={hasGroups}
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
