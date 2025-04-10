// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ButtonGroup, ButtonGroupProps } from '~components';
import Theme from '~components/theming/component';

import { palette } from '../foundation/colors';
import { addPlus, beaker, clipBoard, dinnertime } from '../foundation/icons';

import styles from './styles.scss';

type SideNavigationProps = Omit<ButtonGroupProps, 'variant' | 'items'> & {
  selectedId?: string;
};
export default function SideNavigationBar(props: SideNavigationProps) {
  return (
    <Theme
      gapBlock="20px"
      gapInline="20px"
      fill={iconColors}
      color={iconColors}
      paddingBlock="8px"
      paddingInline="10px"
      backgroundColor={backgroundColors}
      borderColor={borderColors}
    >
      <div className={styles['hodgkins-side-nav']}>
        <ButtonGroup
          onItemClick={props.onItemClick}
          ariaLabel="Navigation options"
          orientation="vertical" // API addition #1: Added this prop to the ButtonGroup API to enable vertical direction
          variant="icon"
          items={[
            {
              type: 'icon-toggle-button',
              id: 'add',
              iconSvg: addPlus,
              text: 'Add',
              pressed: props.selectedId === 'add',
            },
            {
              type: 'icon-toggle-button',
              id: 'logs',
              iconSvg: clipBoard,
              text: 'Logs',
              pressed: props.selectedId === 'logs',
            },
            {
              type: 'icon-toggle-button',
              id: 'test',
              iconSvg: beaker,
              text: 'Test',
              pressed: props.selectedId === 'test',
            },
            {
              type: 'icon-toggle-button',
              id: 'dinner',
              iconSvg: dinnertime,
              text: `What's for dinner?`,
              pressed: props.selectedId === 'dinner',
            },
          ]}
        />
      </div>
    </Theme>
  );
}

const backgroundColors = {
  default: '#1D2021',
  active: palette.surface4,
  hover: palette.surface4,
};
const borderColors = {
  default: '#1D2021',
  active: palette.surface4,
  hover: palette.surface4,
};
const iconColors = { default: '#BFC8CA', active: '#E1E3E3', hover: '#E1E3E3' };
