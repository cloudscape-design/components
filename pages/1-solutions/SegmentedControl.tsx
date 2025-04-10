// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { SegmentedControl as CloudscapeSegmentedControl, SegmentedControlProps } from '~components';
import Theme from '~components/theming/component';

import { palette } from './foundation/colors';

export default function SegmentedControl(props: SegmentedControlProps) {
  const { onChange, label, options, selectedId } = props;

  return (
    <Theme borderColor={palette.outlineDefault} borderWidth="1px" paddingInline="0px" gapInline="0px" height="28px">
      <CloudscapeSegmentedControl
        selectedId={selectedId}
        onChange={onChange}
        label={label}
        options={options}
        theme={{ segment: { backgroundColor: segmentBackgroundColors, color: segmentColors, paddingBlock: 'initial' } }}
      />
    </Theme>
  );
}

const segmentBackgroundColors = {
  default: palette.surface1,
  active: 'linear-gradient(88.66deg, rgba(0, 108, 224, 0.35) -86.88%, rgba(24, 255, 182, 0.35) 98.85%), #000000',
  hover: palette.surface2,
};

const segmentColors = { default: '#E1E3E3', active: '#CDE7EC', hover: '#CDE7EC' };
