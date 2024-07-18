// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Icon, { IconProps } from '~components/icon';
import icons from '~components/icon/generated/icons';

import ScreenshotArea from '../utils/screenshot-area';

import styles from './icons-list.scss';

const sizes = ['small', 'normal', 'big', 'large'] as const;

export default function IconsList({ variant }: { variant: IconProps['variant'] }) {
  const className = variant === 'inverted' ? styles.invertedIconsScenario : undefined;
  return (
    <ScreenshotArea key={variant} className={className}>
      <h1 className={styles.header}>{variant}</h1>
      {sizes.map(size => (
        <div key={size}>
          {Object.keys(icons).map(icon => (
            <Icon key={icon} name={icon as IconProps['name']} variant={variant} size={size} />
          ))}
        </div>
      ))}
    </ScreenshotArea>
  );
}
