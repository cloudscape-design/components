// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { range } from 'lodash';

import { FormField } from '~components';
import Box from '~components/box';
import Button from '~components/button';
import Icon from '~components/icon';
import Input from '~components/input';
import TokenList from '~components/internal/components/token-list';
import SpaceBetween from '~components/space-between';
import Token from '~components/token';
import { TokenGroupProps } from '~components/token-group';

import styles from './styles.scss';

const i18nStrings: TokenGroupProps.I18nStrings = {
  limitShowMore: 'Show more chosen options',
  limitShowFewer: 'Show fewer chosen options',
};

export default function GenericTokenGroupPage() {
  const [files, setFiles] = useState(range(0, 4));
  const [variableValue, setVariableValue] = useState('');

  const onDismiss = (itemIndex: number) => {
    const newItems = [...files];
    newItems.splice(itemIndex, 1);
    setFiles(newItems);
  };

  return (
    <Box padding="xl">
      <h1>Generic token</h1>
      <h2>Inline</h2>
      <SpaceBetween size="l" direction="vertical">
        <Token
          variant="inline"
          label="Inline token"
          ariaLabel="Inline token"
          popoverProps={{ content: <Input value="test" onChange={() => {}} /> }}
        />
        <div style={{ maxWidth: '100%', display: 'inline-block' }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo{' '}
          <Token
            variant="inline"
            label={variableValue.length > 0 ? variableValue : '<some-variable-name>'}
            ariaLabel="Variable token"
            popoverProps={{
              dismissButton: false,
              size: 'large',
              content: (
                <SpaceBetween size="m">
                  <FormField label={'<some-variable-name>'}>
                    <div style={{ width: '300px' }}>
                      <Input
                        placeholder="Enter value for variable"
                        value={variableValue}
                        onChange={({ detail }) => setVariableValue(detail.value)}
                      />
                    </div>
                  </FormField>
                  <Box float="right">
                    <Button onClick={() => setVariableValue('')}>Clear</Button>
                  </Box>
                </SpaceBetween>
              ),
            }}
          />{' '}
          consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
          est laborum.
        </div>
        <Token
          variant="inline"
          ariaLabel="Inline token"
          label={`Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
          consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
          est laborum.`}
        />
        <Token variant="inline" ariaLabel="Inline readonly token" label="Inline readonly token" readOnly={true} />
        <Token variant="inline" ariaLabel="Inline disabled token" label="Inline disabled token" disabled={true} />

        <Token
          variant="inline"
          ariaLabel="Inline dismissable token"
          label="Inline dismissable token"
          onDismiss={() => {}}
        />
        <Token
          variant="inline"
          ariaLabel="Inline readonly token"
          label="Inline dismissable readonly token"
          readOnly={true}
          onDismiss={() => {}}
        />
        <Token
          variant="inline"
          ariaLabel="Inline disabled token"
          label="Inline dismissable disabled token"
          disabled={true}
          onDismiss={() => {}}
        />

        <Token
          variant="inline"
          ariaLabel="Inline dismissable token"
          label="Inline dismissable token"
          iconName="edit"
          onDismiss={() => {}}
          popoverProps={{ content: <Input value="test" onChange={() => {}} /> }}
        />
        <Token
          variant="inline"
          ariaLabel="Inline readonly token"
          label="Inline dismissable readonly token"
          iconName="edit"
          readOnly={true}
          onDismiss={() => {}}
        />

        <Token
          variant="inline"
          ariaLabel="Inline disabled token"
          label="Inline dismissable disabled token"
          iconName="edit"
          disabled={true}
          onDismiss={() => {}}
        />
      </SpaceBetween>

      <h2>Normal</h2>
      <SpaceBetween size="l" direction="vertical">
        <Token
          ariaLabel="Standalone token"
          label="Standalone token"
          popoverProps={{ content: <Input value="test" onChange={() => {}} /> }}
        />
        <Token
          ariaLabel="Standalone token with icon"
          label="Standalone token with icon"
          iconName="bug"
          onDismiss={() => {}}
          popoverProps={{ content: <Input value="test" onChange={() => {}} /> }}
        />
        <Token ariaLabel="dismissable token" label="Dismissable token" labelTag="test" onDismiss={() => {}} />

        <Token
          ariaLabel="Standalone token"
          label={`Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
          consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
          est laborum.`}
        />

        <Token ariaLabel="Standalone readonly token" label="Standalone readonly token" readOnly={true} />

        <Token ariaLabel="Standalone disabled token" label="Standalone disabled token" disabled={true} />

        <TokenList
          alignment="vertical"
          items={files}
          i18nStrings={i18nStrings}
          limit={5}
          renderItem={(file, fileIndex) => (
            <Token
              ariaLabel={`agreement-${file + 1}.pdf`}
              disabled={file === 0}
              dismissLabel={`Remove file ${fileIndex + 1}`}
              onDismiss={() => onDismiss(fileIndex)}
            >
              <FileOption file={file} />
            </Token>
          )}
        />
      </SpaceBetween>
    </Box>
  );
}

function FileOption({ file }: { file: number }) {
  const fileName = `agreement-${file + 1}.pdf`;
  return (
    <div className={styles['file-option']}>
      <Icon variant="success" name="status-positive" />

      <div className={styles['file-option-metadata']}>
        <SpaceBetween direction="vertical" size="xxxs">
          {
            <div className={styles['file-option-name']}>
              <div className={styles['file-option-name-label']} title={fileName}>
                {fileName}
              </div>
            </div>
          }
          <Box fontSize="body-s" color="text-body-secondary">
            application/pdf
          </Box>
          <Box fontSize="body-s" color="text-body-secondary">
            313.03 KB
          </Box>
          <Box fontSize="body-s" color="text-body-secondary">
            2022-01-01T12:02:02
          </Box>
        </SpaceBetween>
      </div>
    </div>
  );
}
