// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { Button, ButtonDropdown, Container, SpaceBetween } from '~components';

import { SimplePage } from '../app/templates';

import styles from './style-css.scss';

export default function CustomButtonTypes() {
  return (
    <SimplePage title="Button styling with CSS" screenshotArea={{}}>
      <SpaceBetween size="m">
        <SpaceBetween direction="horizontal" size="m">
          <Button iconName="gen-ai">Normal button</Button>
          <Button iconName="gen-ai" className={styles['my-normal-button']}>
            Styled normal button
          </Button>
          <ButtonDropdown
            mainAction={{ text: 'Styled button dropdown', iconName: 'gen-ai' }}
            items={[{ id: 'x', text: 'X' }]}
            className={styles['with-normal-button']}
          />
        </SpaceBetween>

        <Container header="Buttons inside this container are styled" className={styles['with-normal-button']}>
          <SpaceBetween size="m">
            <Button iconName="gen-ai">Normal button</Button>

            <Container
              header="Buttons inside this container are reset to default style"
              className={styles['reset-normal-button']}
            >
              <Button iconName="gen-ai">Normal button</Button>
            </Container>
          </SpaceBetween>
        </Container>
      </SpaceBetween>
    </SimplePage>
  );
}
