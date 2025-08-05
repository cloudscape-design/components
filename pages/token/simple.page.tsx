// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { range } from 'lodash';

import Box from '~components/box';
import Icon from '~components/icon';
import Input from '~components/input';
import TokenList from '~components/internal/components/token-list';
import Popover from '~components/popover';
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
        <Token variant="inline" ariaLabel="Inline token">
          Inline token
        </Token>
        <Token variant="inline" ariaLabel="Inline token">
          D Inline token
        </Token>
        <Token variant="inline" ariaLabel="Inline token">
          A Inline token
        </Token>
        <Token variant="inline" ariaLabel="Inline token">
          tiny
        </Token>
        <Token variant="inline" ariaLabel="Inline token">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
          consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
          est laborum.
        </Token>
        <Token variant="inline" ariaLabel="Inline readonly token" readOnly={true}>
          Inline readonly token
        </Token>
        <Token variant="inline" ariaLabel="Inline disabled token" disabled={true}>
          Inline disabled token
        </Token>

        <Token variant="inline" ariaLabel="Inline dismissable token" onDismiss={() => {}}>
          Inline dismissable token
        </Token>
        <Token variant="inline" ariaLabel="Inline readonly token" readOnly={true} onDismiss={() => {}}>
          Inline dismissable readonly token
        </Token>
        <Token variant="inline" ariaLabel="Inline disabled token" disabled={true} onDismiss={() => {}}>
          Inline dismissable disabled token
        </Token>

        <Token variant="inline" ariaLabel="Inline dismissable token" onDismiss={() => {}}>
          <Box margin={{ right: 'xxs' }}>
            <Icon name="edit" />
          </Box>
          <Popover triggerType="text-inline" position="top" content={<Input value="test" />}>
            Inline dismissable token
          </Popover>
        </Token>
        <Token variant="inline" ariaLabel="Inline readonly token" readOnly={true} onDismiss={() => {}}>
          <Box margin={{ right: 'xxs' }}>
            <Icon name="edit" />
          </Box>
          Inline dismissable readonly token
        </Token>
        <Token variant="inline" ariaLabel="Inline disabled token" disabled={true} onDismiss={() => {}}>
          <Box margin={{ right: 'xxs' }}>
            <Icon name="edit" />
          </Box>
          Inline dismissable disabled token
        </Token>
      </SpaceBetween>

      <h2>Normal</h2>
      <SpaceBetween size="l" direction="vertical">
        <Token ariaLabel="Standalone token">Standalone token</Token>

        <Token ariaLabel="Standalone token">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
          consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
          est laborum.
        </Token>

        <Token ariaLabel="Standalone readonly token" readOnly={true}>
          Standalone readonly token
        </Token>

        <Token ariaLabel="Standalone disabled token" disabled={true}>
          Standalone disabled token
        </Token>

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
