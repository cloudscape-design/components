// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '~components/box';
import Header from '~components/header';
import Icon, { IconProps } from '~components/icon';
import icons from '~components/icon/generated/icons';

import styles from './icons-list.scss';

const sizes = ['x-small', 'small', 'normal', 'medium', 'big', 'large'] as const;

const triggerAttrs = { 'data-awsui-motion-trigger': 'hover', 'data-awsui-motion-target': 'true' } as const;

export default function IconMotionPage() {
  return (
    <Box padding="l">
      <Header variant="h1">Icon hover motion</Header>
      {sizes.map(size => (
        <div key={size} className={styles.wrapper}>
          {Object.keys(icons).map(icon => (
            <span key={icon} title={icon} {...triggerAttrs}>
              <Icon name={icon as IconProps['name']} size={size} />
            </span>
          ))}
        </div>
      ))}
    </Box>
  );
}
