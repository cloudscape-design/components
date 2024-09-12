// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Icon, { IconProps } from '~components/icon';
import icons from '~components/icon/generated/icons';

import ScreenshotArea from '../utils/screenshot-area';

import styles from './icons-list.scss';

const sizes = ['small', 'normal', 'medium', 'big', 'large'] as const;

export default function IconsList({ variant }: { variant: IconProps['variant'] }) {
  const className = variant === 'inverted' ? styles.invertedIconsScenario : undefined;
  return (
    <ScreenshotArea key={variant} className={className}>
      <h1 className={styles.header}>{variant}</h1>
      {sizes.map(size => (
        <>
          <h2 style={{ marginBlockEnd: 8 }}>Icon {size}</h2>
          <div
            key={size}
            style={{ paddingBlockEnd: 8, paddingBlockStart: 2, display: 'flex', flexWrap: 'wrap', gap: 4 }}
          >
            {Object.keys(icons).map(icon => (
              <Icon key={icon} name={icon as IconProps['name']} variant={variant} size={size} />
            ))}
          </div>
        </>
      ))}
    </ScreenshotArea>
  );
}
