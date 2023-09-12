// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { useState } from 'react';
import FormField from '~components/form-field';
import Input from '~components/input';
import SpaceBetween from '~components/space-between';
import TokenGroup, { TokenGroupProps } from '~components/token-group';

import styles from './rule-builder.scss';

const MultiAutosuggest = () => {
  const [tokens, setTokens] = useState<TokenGroupProps.Item[]>([]);
  const [textValue, setTextValue] = useState('');

  return (
    <SpaceBetween size="m" direction="horizontal" alignItems="end">
      <FormField label="New condition value">
        <Input
          value={textValue}
          placeholder="Condition value"
          onChange={({ detail }) => setTextValue(detail.value)}
          onKeyUp={event => {
            if (textValue && event.detail.key === 'Enter') {
              if (!tokens.find(({ label }) => label === textValue)) {
                setTokens([...tokens, { label: textValue, dismissLabel: `Dismiss ${textValue}` }]);
              }
              setTextValue('');
            }
          }}
        />
      </FormField>
      <div className={styles['multisuggest-tokens']}>
        <TokenGroup
          items={tokens}
          onDismiss={({ detail: { itemIndex } }) => {
            const newItems = [...tokens];
            newItems.splice(itemIndex, 1);
            setTokens(newItems);
          }}
        />
      </div>
    </SpaceBetween>
  );
};

export { MultiAutosuggest };
