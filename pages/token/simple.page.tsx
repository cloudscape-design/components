// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { range } from 'lodash';

import { FormField, Popover } from '~components';
import Box from '~components/box';
import Button from '~components/button';
import Icon from '~components/icon';
import Input from '~components/input';
import TokenList from '~components/internal/components/token-list';
import SpaceBetween from '~components/space-between';
import Token from '~components/token';

import styles from './styles.scss';

const i18nStrings = {
  limitShowMore: 'Show more chosen options',
  limitShowFewer: 'Show fewer chosen options',
};

export default function GenericTokenPage() {
  const [files, setFiles] = useState(range(0, 4));
  const [variableValue, setVariableValue] = useState('');

  const onDismiss = (itemIndex: number) => {
    const newItems = [...files];
    newItems.splice(itemIndex, 1);
    setFiles(newItems);
  };

  return (
    <Box padding="xl">
      <h1>Standalone token</h1>
      <h2>Inline</h2>
      <SpaceBetween size="l" direction="vertical">
        <Token data-testid="basic-inline-token" variant="inline" label="Inline token" />
        <Token variant="inline" label="Inline token with longer text" />
        <Token
          variant="inline"
          label={
            <Popover
              triggerType="text-inline"
              position="top"
              header="test"
              content={<Input placeholder="Enter value" value="" onChange={() => {}} />}
            >
              Inline token with icon and popover
            </Popover>
          }
          icon={<Icon name="bug" size="small" />}
        />
        <Token
          variant="inline"
          label={
            <div style={{ minWidth: 'max-content' }}>
              <SpaceBetween direction="horizontal" size="xxs" alignItems="center">
                <Popover
                  triggerType="text-inline"
                  position="top"
                  header="test"
                  content={<Input placeholder="Enter value" value="" onChange={() => {}} />}
                >
                  Inline token with icon, popover and custom action
                </Popover>
                <Button iconName="edit" variant="inline-icon" ariaLabel="edit" />
              </SpaceBetween>
            </div>
          }
          icon={<Icon name="bug" size="small" />}
        />
        <Token
          data-testid="inline-token-with-icon-dismissable"
          variant="inline"
          dismissLabel="Dismiss token"
          label={
            <Popover
              triggerType="text-inline"
              position="top"
              header="test"
              content={<Input placeholder="Enter value" value="" onChange={() => {}} />}
            >
              Inline token dismissable with icon and popover
            </Popover>
          }
          icon={<Icon data-testid="edit-icon-small" name="edit" size="small" />}
          onDismiss={() => {}}
        />
        <div style={{ maxWidth: '100%', display: 'inline' }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo{' '}
          <Token
            variant="inline"
            label={
              <Popover
                triggerType="text-inline"
                dismissButton={false}
                size="large"
                content={
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
                }
              >
                {variableValue.length > 0 ? variableValue : '<some-variable-name>'}
              </Popover>
            }
          />{' '}
          consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
          est laborum.
        </div>
        <Token
          data-testid="inline-token-long-text"
          variant="inline"
          label={`Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud 
            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla 
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`}
        />
        <Token variant="inline" label="Inline readonly token" readOnly={true} />
        <Token variant="inline" label="Inline disabled token" disabled={true} />

        <Token
          data-testid="inline-token-dismissable"
          variant="inline"
          dismissLabel="Dismiss token"
          label="Inline dismissable token"
          onDismiss={() => {}}
        />
        <Token
          variant="inline"
          dismissLabel="Dismiss token"
          label="Inline dismissable readonly token"
          readOnly={true}
          onDismiss={() => {}}
        />
        <Token
          variant="inline"
          dismissLabel="Dismiss token"
          label="Inline dismissable disabled token"
          disabled={true}
          onDismiss={() => {}}
        />

        <Token
          variant="inline"
          dismissLabel="Dismiss token"
          label="Inline dismissable readonly token"
          icon={<Icon name="edit" size="small" />}
          readOnly={true}
          onDismiss={() => {}}
        />

        <Token
          variant="inline"
          dismissLabel="Dismiss token"
          label="Inline dismissable disabled token with icon"
          icon={<Icon name="edit" size="small" />}
          disabled={true}
          onDismiss={() => {}}
        />
      </SpaceBetween>

      <h2>Normal</h2>
      <SpaceBetween size="l" direction="vertical">
        <Token label="Standalone token" />
        <Token
          label={
            <Popover
              triggerType="text-inline"
              position="top"
              header="test"
              content={<Input placeholder="Enter value" value="" onChange={() => {}} />}
            >
              Standalone token with popover
            </Popover>
          }
          onDismiss={() => {}}
          dismissLabel="dismiss"
        />
        <Token
          dismissLabel="Dismiss token"
          label={
            <Popover
              triggerType="text-inline"
              position="top"
              header="test"
              content={<Input placeholder="Enter value" value="" onChange={() => {}} />}
            >
              Standalone token with icon and popover
            </Popover>
          }
          icon={<Icon name="bug" />}
          onDismiss={() => {}}
        />
        <Token
          data-testid="normal-token-dismissable"
          dismissLabel="Dismiss token"
          label="Dismissable token"
          labelTag="test"
          onDismiss={() => {}}
        />

        <Token
          label={`Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
          consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
          est laborum.`}
        />
        <Token
          data-testid="normal-token-with-icon-dismissable"
          dismissLabel="Dismiss token"
          label="Dismissable token"
          description="some description"
          labelTag="test"
          icon={<Icon data-testid="bug-icon-big" name="bug" size="big" />}
          onDismiss={() => {}}
        />

        <Token label="Standalone readonly token" readOnly={true} />

        <Token label="Standalone disabled token" disabled={true} />

        <TokenList
          alignment="vertical"
          items={files}
          i18nStrings={i18nStrings}
          limit={5}
          renderItem={(file, fileIndex) => (
            <Token
              label={<FileOption file={file} />}
              disabled={file === 0}
              dismissLabel={`Remove file ${fileIndex + 1}`}
              onDismiss={() => onDismiss(fileIndex)}
            />
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
