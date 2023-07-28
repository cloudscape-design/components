// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable react/jsx-key */
import React, { useState } from 'react';
import clsx from 'clsx';
import Box from '~components/box';
import Input from '~components/input';
import FormField from '~components/form-field';
import ScreenshotArea from '../utils/screenshot-area';
import styles from './styles.scss';
import { Showcase } from './responsiveness.page';

export default function PageHeadersDemo() {
  const [value, setValue] = useState('75');
  return (
    <ScreenshotArea>
      <Box padding="l">
        <FormField label="Maximum number of characters" stretch={false}>
          <div style={{ maxWidth: 150 }}>
            <Input
              value={value}
              type="number"
              onChange={e => {
                setValue(e.detail.value);
                document.documentElement.style.setProperty('--header-max-width', `${e.detail.value}ch`);
              }}
            />
          </div>
        </FormField>
        <div className={clsx(styles.playground)}>
          <Showcase approach="current" />
        </div>
      </Box>
    </ScreenshotArea>
  );
}
