// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { SpaceBetween } from '~components';
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
      <>
        <SpaceBetween size="xxs" direction="horizontal">
          <Icon name={'face-sad' as IconProps['name']} size="normal" />
          <Icon name={'face-sad-filled' as IconProps['name']} size="normal" />
          <Icon name={'face-average' as IconProps['name']} size="normal" />
          <Icon name={'face-average-filled' as IconProps['name']} size="normal" />
          <Icon name={'face-happy' as IconProps['name']} size="normal" />
          <Icon name={'face-happy-filled' as IconProps['name']} size="normal" />
          <Icon name={'backward-10-seconds' as IconProps['name']} size="normal" />
          <Icon name={'forward-10-seconds' as IconProps['name']} size="normal" />
          <Icon name={'map' as IconProps['name']} size="normal" />
          <Icon name={'transcript' as IconProps['name']} size="normal" />
          <Icon name={'mini-player' as IconProps['name']} size="normal" />
          <Icon name={'play' as IconProps['name']} size="normal" />
          <Icon name={'pause' as IconProps['name']} size="normal" />
          <Icon name={'full-screen' as IconProps['name']} size="normal" />
          <Icon name={'exit-full-screen' as IconProps['name']} size="normal" />
          <Icon name={'cloud-editor' as IconProps['name']} size="normal" />
          <Icon name={'closed-caption' as IconProps['name']} size="normal" />
          <Icon name={'closed-caption-unavailable' as IconProps['name']} size="normal" />
          <Icon name={'grid-view' as IconProps['name']} size="normal" />
          <Icon name={'globe' as IconProps['name']} size="normal" />
          <Icon name={'location-pin' as IconProps['name']} size="normal" />
          <Icon name={'cloud-shell' as IconProps['name']} size="normal" />
          <Icon name={'list-view' as IconProps['name']} size="normal" />
          <Icon name={'help' as IconProps['name']} size="normal" />
        </SpaceBetween>
      </>
      <>
        {sizes.map(size => (
          <div key={size} className={styles.wrapper}>
            {Object.keys(icons).map(icon => (
              <Icon key={icon} name={icon as IconProps['name']} variant={variant} size={size} />
            ))}
          </div>
        ))}
      </>
    </ScreenshotArea>
  );
}
